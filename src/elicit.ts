import { McpServer, Tool, Toolkit } from "@effect/ai";
import { McpServerClient } from "@effect/ai/McpSchema";
import { BunRuntime, BunSink, BunStream } from "@effect/platform-bun";
import { Effect, Layer, Logger, Schema } from "effect";
import type { ToolHandler } from "./toolkit";

// Define the schema for the delivery address
const DeliveryAddress = Schema.Struct({
	city: Schema.String,
	street: Schema.String,
	houseNumber: Schema.String,
});

// Define the tool that will elicit delivery address information
// Add McpServerClient as a dependency so the handler can use it
export const GetDeliveryAddress = Tool.make("get_delivery_address", {
	description: "Collect delivery address information from the user",
	parameters: {},
	success: DeliveryAddress,
}).addDependency(McpServerClient);

// Define the handler for the tool that uses elicit to get address information
export const GetDeliveryAddressHandler: ToolHandler<
	typeof GetDeliveryAddress
> = (_params) =>
	Effect.gen(function* () {
		// Use elicit to request address information from the user
		const address = yield* McpServer.elicit({
			message:
				"Please provide the delivery address details (city, street, and house number)",
			schema: DeliveryAddress,
		}).pipe(
			// Handle the ElicitationDeclined error by converting it to a defect
			// since our tool doesn't declare a failure schema
			Effect.catchTag("ElicitationDeclined", (error) =>
				Effect.die(
					new Error(
						`User declined to provide address information: ${error.message}`,
					),
				),
			),
		);

		return address;
	});

// Create the toolkit
export const DeliveryAddressToolkit = Toolkit.make(GetDeliveryAddress);

// Create the handlers layer
export const DeliveryAddressToolHandlers = DeliveryAddressToolkit.toLayer(
	Effect.succeed({
		get_delivery_address: GetDeliveryAddressHandler,
	}),
);

// Merge all the resources and prompts into a single server layer
const ServerLayer = Layer.mergeAll(
	McpServer.toolkit(DeliveryAddressToolkit),
).pipe(
	Layer.provide(DeliveryAddressToolHandlers),
	// Provide the MCP server implementation
	Layer.provide(
		McpServer.layerStdio({
			name: "Delivery Address Elicitation Server",
			version: "1.0.0",
			stdin: BunStream.stdin,
			stdout: BunSink.stdout,
		}),
	),
	// add a stderr logger
	Layer.provide(Logger.add(Logger.prettyLogger({ stderr: true }))),
);

Layer.launch(ServerLayer).pipe(BunRuntime.runMain);
