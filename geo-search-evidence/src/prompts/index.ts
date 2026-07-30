import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { OUTPUT_DIR } from "../config/paths";
import { PlannerPromptBuilder } from "./planner-prompt.builder";
import { parsePlannerPromptInput } from "./planner-prompt.types";

export const PLANNER_INPUT_PATH = path.join(OUTPUT_DIR, "planner-input.json");
export const PLANNER_PROMPT_PATH = path.join(OUTPUT_DIR, "planner-prompt.md");

async function readPlannerInputDocument(filePath: string) {
  let text: string;

  try {
    text = await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Planner input file not found: ${filePath}`);
    }

    throw error;
  }

  if (text.trim().length === 0) {
    throw new Error(`Planner input file is empty: ${filePath}`);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse planner input JSON: ${filePath}`);
  }

  return parsePlannerPromptInput(raw);
}

export async function generatePlannerPrompt(
  inputPath: string = PLANNER_INPUT_PATH,
  outputPath: string = PLANNER_PROMPT_PATH,
): Promise<{ inputPath: string; outputPath: string }> {
  const input = await readPlannerInputDocument(inputPath);
  const markdown = new PlannerPromptBuilder().build(input);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${markdown}\n`, "utf8");

  return { inputPath, outputPath };
}

export { PlannerPromptBuilder } from "./planner-prompt.builder";
export type { PlannerPromptGenerationResult, PlannerPromptInput } from "./planner-prompt.types";
