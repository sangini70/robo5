import { readFile } from "node:fs/promises";
import type { StrategyInput } from "./strategy-input.types";

type SectionName = "issue" | "keywords" | "notes" | null;

function isSectionHeading(line: string): SectionName {
  const trimmed = line.trim();

  if (/^##\s+Issue$/i.test(trimmed)) {
    return "issue";
  }

  if (/^##\s+Keywords$/i.test(trimmed)) {
    return "keywords";
  }

  if (/^##\s+Notes$/i.test(trimmed)) {
    return "notes";
  }

  return null;
}

function collapseText(lines: string[]): string | undefined {
  const text = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .trim();

  return text.length > 0 ? text : undefined;
}

function parseKeywordLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("-")) {
    return null;
  }

  const value = trimmed.slice(1).trim();
  return value.length > 0 ? value : null;
}

export function parseStrategyInputMarkdown(content: string): StrategyInput {
  const sections: Record<Exclude<SectionName, null>, string[]> = {
    issue: [],
    keywords: [],
    notes: [],
  };

  let currentSection: SectionName = null;

  for (const line of content.split(/\r?\n/)) {
    const heading = isSectionHeading(line);
    if (heading !== null) {
      currentSection = heading;
      continue;
    }

    if (currentSection === null) {
      continue;
    }

    sections[currentSection].push(line);
  }

  const seenKeywords = new Set<string>();
  const keywords: string[] = [];

  for (const line of sections.keywords) {
    const keyword = parseKeywordLine(line);
    if (keyword === null) {
      continue;
    }

    const normalized = keyword.trim();
    if (normalized.length === 0 || seenKeywords.has(normalized)) {
      continue;
    }

    seenKeywords.add(normalized);
    keywords.push(normalized);
  }

  if (keywords.length === 0) {
    throw new Error("Strategy input markdown contains no keywords.");
  }

  return {
    issue: collapseText(sections.issue),
    keywords,
    notes: collapseText(sections.notes),
  };
}

export async function readStrategyInputMarkdown(filePath: string): Promise<StrategyInput> {
  let content: string;

  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Strategy input markdown not found: ${filePath}`);
    }

    throw error;
  }

  if (content.trim().length === 0) {
    throw new Error(`Strategy input markdown is empty: ${filePath}`);
  }

  return parseStrategyInputMarkdown(content);
}
