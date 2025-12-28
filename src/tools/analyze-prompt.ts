import { Tool } from "@effect/ai";
import { Schema } from "effect";

export const AnalyzePrompt = Tool.make("analyze_prompt", {
	description:
		"Analyze a prompt for common issues and get improvement suggestions",
	parameters: {
		prompt: Schema.String.annotations({
			description: "The prompt to analyze",
		}),
	},
	success: Schema.String,
});
