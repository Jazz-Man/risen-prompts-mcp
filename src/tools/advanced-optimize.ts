import { Tool } from "@effect/ai";
import { Schema } from "effect";

export enum AdvancedOptimizeEnum {
	TREE_OF_THOUGHTS = "tree_of_thoughts",
	CONSTITUTIONAL_AI = "constitutional_ai",
	AUTOMATIC_PROMPT_ENGINEER = "automatic_prompt_engineer",
	META_PROMPTING = "meta_prompting",
	SELF_REFINE = "self_refine",
	TEXTGRAD = "textgrad",
	MEDPROMPT = "medprompt",
	PROMPT_WIZARD = "prompt_wizard",
	AUTO = "auto",
}

const AdvancedOptimizeOptions = Schema.Enums(AdvancedOptimizeEnum);

export const AdvancedOptimize = Tool.make("advanced_optimize", {
	description:
		"Apply advanced optimization strategies (ToT, Constitutional AI, APE, etc.)",
	parameters: {
		prompt: Schema.String.annotations({
			description: "The prompt to optimize",
		}),
		strategy: AdvancedOptimizeOptions.annotations({
			description: "Advanced optimization strategy to use (auto selects best)",
		}),
	},
	success: Schema.String,
});
