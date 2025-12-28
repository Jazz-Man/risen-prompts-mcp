import { Tool } from "@effect/ai";
import { Effect, Schema } from "effect";
import type { ToolHandler } from "../toolkit";

export const ListDomainTemplates = Tool.make("list_domain_templates", {
	description: "List all available domain-specific templates",
	parameters: {
		domain: Schema.optional(Schema.String).annotations({
			description: "Optional: filter by domain",
		}),
	},
	success: Schema.Array(
		Schema.Struct({
			name: Schema.String,
			domain: Schema.String,
			template: Schema.String,
			variables: Schema.Array(Schema.String),
			example: Schema.String,
			best_practices: Schema.optional(Schema.Array(Schema.String)),
			examples: Schema.optional(Schema.Array(Schema.String)),
		}),
	),
});

export const ListDomainTemplatesHandler: ToolHandler<
	typeof ListDomainTemplates
> = ({ domain }) =>
	Effect.succeed(
		domain
			? [
					{
						name: `${domain}-template1`,
						domain,
						template: `${domain}-template1`,
						variables: [],
						example: `${domain}-template1`,
						best_practices: [],
						examples: [],
					},
				]
			: [
					{
						name: "template1",
						domain: "general",
						template: "template1",
						variables: [],
						example: "template1",
						best_practices: [],
						examples: [],
					},
				],
	);
