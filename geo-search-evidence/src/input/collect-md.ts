import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadDotEnv(filePath: string): Promise<void> {
  let text: string;

  try {
    text = await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }

    throw error;
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key.length === 0) {
      continue;
    }

    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

function getInputPathFromArgv(argv: readonly string[]): string {
  return argv[2] ?? path.join("input", "strategy-input.md");
}

async function main(): Promise<void> {
  await loadDotEnv(path.join(process.cwd(), ".env"));

  const { batchCollectorService } = await import("../shared");
  const inputPath = getInputPathFromArgv(process.argv);
  const result = await batchCollectorService.collectFromMarkdownFile(inputPath);

  console.log(
    JSON.stringify(
      {
        inputPath: result.inputPath,
        issue: result.issue,
        successKeywords: result.successKeywords.map((item) => item.keyword),
        failedKeywords: result.failedKeywords,
        plannerInputPath: result.plannerInputPath,
        plannerPromptPath: result.plannerPromptPath,
      },
      null,
      2,
    ),
  );

  if (result.failedKeywords.length > 0) {
    process.exitCode = 1;
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
