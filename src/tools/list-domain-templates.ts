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
	success: Schema.Array(Schema.String),
});

export const ListDomainTemplatesHandler: ToolHandler<
	typeof ListDomainTemplates
> = ({ domain }) =>
	Effect.succeed(
		domain
			? [`${domain}-template1`, `${domain}-template2`, `${domain}-template3`]
			: ["template1", "template2", "template3"],
	);
