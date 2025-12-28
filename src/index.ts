import { McpServer } from "@effect/ai";
import { BunRuntime, BunSink, BunStream } from "@effect/platform-bun";
import { Layer, Logger } from "effect";
import { PromptOptimizerToolHandlers, PromptOptimizerToolkit } from "./toolkit";

// Merge all the resources and prompts into a single server layer
const ServerLayer = Layer.mergeAll(
	McpServer.toolkit(PromptOptimizerToolkit),
).pipe(
	Layer.provide(PromptOptimizerToolHandlers),
	// Provide the MCP server implementation
	Layer.provide(
		McpServer.layerStdio({
			name: "Demo Server",
			version: "1.0.0",
			stdin: BunStream.stdin,
			stdout: BunSink.stdout,
		}),
	),
	// add a stderr logger
	Layer.provide(Logger.add(Logger.prettyLogger({ stderr: true }))),
);

Layer.launch(ServerLayer).pipe(BunRuntime.runMain);
