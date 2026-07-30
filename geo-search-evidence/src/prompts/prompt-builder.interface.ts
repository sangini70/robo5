import type { PlannerPromptInput } from "./planner-prompt.types";

export interface PromptBuilder {
  build(input: PlannerPromptInput): string;
}
