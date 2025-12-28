import { type Tool, Toolkit } from "@effect/ai";
import { Effect } from "effect";
import {
	ListDomainTemplates,
	ListDomainTemplatesHandler,
} from "./tools/list-domain-templates";

export const PromptOptimizerToolkit = Toolkit.make(ListDomainTemplates);

export const PromptOptimizerToolHandlers = PromptOptimizerToolkit.toLayer(
	Effect.succeed({
		list_domain_templates: ListDomainTemplatesHandler,
	}),
);

export type ToolHandler<T extends Tool.Any> = (
	params: Tool.Parameters<T>,
) => Effect.Effect<Tool.Success<T>, Tool.Failure<T>, Tool.Requirements<T>>;
