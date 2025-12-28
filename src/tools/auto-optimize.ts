import { Tool } from "@effect/ai";
import { Schema } from "effect";

export const AutoOptimize = Tool.make("auto_optimize", {
	description: "Automatically optimize a prompt using the best strategy",
	parameters: {
		prompt: Schema.String.annotations({
			description: "The prompt to optimize",
		}),
		context: Schema.optional(Schema.String).annotations({
			description: "Additional context about the use case",
		}),
	},
	success: Schema.String,
});
