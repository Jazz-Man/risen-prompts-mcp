import { Tool } from "@effect/ai";
import { Schema } from "effect";

export const ListDomainTemplates = Tool.make("list_domain_templates", {
	description: "List all available domain-specific templates",
	parameters: {
		domain: Schema.optional(Schema.String).annotations({
			description: "Optional: filter by domain",
		}),
	},
	success: Schema.String,
});
