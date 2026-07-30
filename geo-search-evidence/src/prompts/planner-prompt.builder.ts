import type { PlannerInputKeywordEntry } from "../exporters";
import type { PromptBuilder } from "./prompt-builder.interface";
import type { PlannerPromptInput } from "./planner-prompt.types";

function toJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function formatKeyValueList(lines: Array<[string, string]>): string {
  return lines.map(([key, value]) => `- ${key}: ${value}`).join("\n");
}

function formatEvidenceBlock(title: string, value: unknown): string {
  return [`#### ${title}`, "", "```json", toJson(value), "```"].join("\n");
}

function getCollectedAt(entry: PlannerInputKeywordEntry): string {
  return entry.searchVolume?.collectedAt ?? entry.relatedKeywords?.collectedAt ?? entry.autocomplete?.collectedAt ?? entry.metadata.createdAt;
}

function getSource(entry: PlannerInputKeywordEntry): string {
  return entry.searchVolume?.source ?? entry.relatedKeywords?.source ?? entry.autocomplete?.source ?? "NAVER";
}

function buildKeywordSection(entry: PlannerInputKeywordEntry, index: number): string {
  const lines = [
    `### ${index + 1}. Keyword: ${entry.keyword}`,
    "",
    "#### Input Keyword",
    formatKeyValueList([
      ["keyword", entry.keyword],
      ["collectedAt", getCollectedAt(entry)],
      ["source", getSource(entry)],
      ["collectorVersion", entry.metadata.collectorVersion],
      ["validationVersion", entry.metadata.validationVersion],
    ]),
    "",
    formatEvidenceBlock("Metadata", entry.metadata),
    "",
    formatEvidenceBlock("Search Volume Evidence", entry.searchVolume),
    "",
    formatEvidenceBlock("Related Keyword Evidence", entry.relatedKeywords),
    "",
    formatEvidenceBlock("Autocomplete Evidence", entry.autocomplete),
  ];

  return lines.join("\n");
}

export class PlannerPromptBuilder implements PromptBuilder {
  build(input: PlannerPromptInput): string {
    const keywordSections = input.keywords.map((entry, index) => buildKeywordSection(entry, index)).join("\n\n");

    return [
      "# GEO Planner Input",
      "",
      "## 1. Issue",
      "",
      input.issue?.trim().length ? input.issue.trim() : "(not provided)",
      "",
      "## 2. Role",
      "",
      "GEO Planner does not turn search data directly into a content outline.",
      "Search volume, related keywords, and autocomplete are evidence for discovering user questions and demand.",
      "Question First",
      "Knowledge Always",
      "apply these principles.",
      "Do not treat news or search terms themselves as knowledge.",
      "",
      "## 3. Collected Evidence",
      "",
      keywordSections,
      "",
      "## 4. Planner Task",
      "",
      "- Discover the user's core question",
      "- Classify search intent",
      "- Judge the core topic",
      "- Design candidate knowledge nodes",
      "- Separate question-shaped nodes from entity-shaped nodes",
      "- Merge duplicate or near-duplicate questions",
      "- Propose a learning flow",
      "- Propose knowledge network relationships",
      "- Distinguish evidence that needs additional research next",
      "",
      "## 5. Planner Rules",
      "",
      "- Do not create nodes only because search volume is high.",
      "- Do not copy search terms into title lists verbatim.",
      "- Select only knowledge that can solve a question.",
      "- Keep facts seen in the evidence separate from Planner interpretation.",
      "- Do not assert facts that are not yet confirmed.",
      "- Do not write the final article for the Writer.",
      "- Do not replace the Research stage.",
      "- Output only the Planner design result.",
      "- Keep Collected Evidence, Planner Task, and Planner Rules separate.",
      "- Do not delete or summarize the raw Related Keywords and Autocomplete evidence.",
      "- Preserve raw evidence in a separate reference structure when needed.",
      "- Search Evidence is a planning signal, not an automatic node selection rule.",
    ].join("\n");
  }
}
