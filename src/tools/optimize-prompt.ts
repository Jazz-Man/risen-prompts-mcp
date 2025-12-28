import { Tool } from "@effect/ai";
import { Schema } from "effect";

export enum OptimizationStrategyEnum {
	CLARITY = "clarity",
	SPECIFICITY = "specificity",
	CHAIN_OF_THOUGHT = "chain_of_thought",
	FEW_SHOT = "few_shot",
	STRUCTURED_OUTPUT = "structured_output",
	ROLE_BASED = "role_based",
	CONSTRAINTS = "constraints", // New strategy
	TONE_ADJUSTMENT = "tone_adjustment", // New strategy
}

// Effect schema definition using Schema.enums()
const OptimizationStrategy = Schema.Enums(OptimizationStrategyEnum);

export const OptimizePrompt = Tool.make("optimize_prompt", {
	description: "Optimize a prompt using a specific strategy",
	parameters: {
		prompt: Schema.String.annotations({
			description: "The prompt to optimize",
		}),
		strategy: OptimizationStrategy.annotations({
			description: "Optimization strategy to use",
		}),
	},
	success: Schema.String,
});
