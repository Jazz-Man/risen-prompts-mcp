import { Tool } from "@effect/ai";
import { Schema } from "effect";

export const GetDomainTemplate = Tool.make("get_domain_template", {
	description: "Get a production-ready template for a specific domain",
	parameters: {
		template_name: Schema.String.annotations({
			description:
				"Name of the template (e.g., api_design, root_cause_analysis)",
		}),
	},
	success: Schema.String,
});
