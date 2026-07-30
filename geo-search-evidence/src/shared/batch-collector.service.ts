import path from "node:path";
import { PlannerInputExporter } from "../exporters";
import { generatePlannerPrompt, PLANNER_PROMPT_PATH } from "../prompts";
import { collectorService } from "./collector-service";
import type { StrategyInput } from "../input";
import { readStrategyInputMarkdown } from "../input";

export interface BatchCollectorKeywordFailure {
  keyword: string;
  error: string;
}

export interface BatchCollectorKeywordSuccess {
  keyword: string;
}

export interface BatchCollectorResult {
  issue?: string;
  inputPath: string;
  successKeywords: BatchCollectorKeywordSuccess[];
  failedKeywords: BatchCollectorKeywordFailure[];
  plannerInputPath?: string;
  plannerPromptPath?: string;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export class BatchCollectorService {
  async collectFromMarkdownFile(inputPath: string): Promise<BatchCollectorResult> {
    const strategyInput = await readStrategyInputMarkdown(inputPath);
    return this.collect(strategyInput, inputPath);
  }

  async collect(strategyInput: StrategyInput, inputPath: string = path.join("input", "strategy-input.md")): Promise<BatchCollectorResult> {
    const successKeywords: BatchCollectorKeywordSuccess[] = [];
    const failedKeywords: BatchCollectorKeywordFailure[] = [];

    for (let index = 0; index < strategyInput.keywords.length; index += 1) {
      const keyword = strategyInput.keywords[index];
      try {
        await collectorService.collect(keyword);
        successKeywords.push({ keyword });
      } catch (error) {
        failedKeywords.push({ keyword, error: toErrorMessage(error) });
      }

      if (index < strategyInput.keywords.length - 1) {
        await sleep(1200);
      }
    }

    if (successKeywords.length === 0) {
      throw new Error(
        `Batch collection failed for all keywords from ${inputPath}: ${failedKeywords
          .map((item) => `${item.keyword} (${item.error})`)
          .join(", ")}`,
      );
    }

    const allowedKeywords = successKeywords.map((item) => item.keyword);
    const plannerInputResult = await new PlannerInputExporter().export({
      issue: strategyInput.issue,
      keywords: allowedKeywords,
    });

    await generatePlannerPrompt(plannerInputResult.path, PLANNER_PROMPT_PATH);

    return {
      issue: strategyInput.issue,
      inputPath,
      successKeywords,
      failedKeywords,
      plannerInputPath: plannerInputResult.path,
      plannerPromptPath: PLANNER_PROMPT_PATH,
    };
  }
}

export const batchCollectorService = new BatchCollectorService();
