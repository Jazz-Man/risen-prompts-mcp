import { Tool } from "@effect/ai";
import { Schema } from "effect";

export enum PromptTemplateEnum {
	CODE_GENERATION = "code_generation",
	ANALYSIS = "analysis",
	CREATIVE_WRITING = "creative_writing",
	DATA_EXTRACTION = "data_extraction",
	TUTORING = "tutoring",
}

const PromptTemplate = Schema.Enums(PromptTemplateEnum);

export const GetPromptTemplate = Tool.make("get_prompt_template", {
	description: "Get a prompt template for a specific use case",
	parameters: {
		use_case: PromptTemplate.annotations({
			description: "The use case for the prompt template",
		}),
	},
	success: Schema.Struct({
		strategy: PromptTemplate,
	}),
});

const jsonSchema = Tool.getJsonSchema(GetPromptTemplate);

console.log(jsonSchema);
