import type { AutocompleteEvidence } from "../collectors/naver/autocomplete.types";
import type { RelatedKeywordEvidence } from "../collectors/naver/related.types";
import type { SearchVolumeEvidence } from "../collectors/naver/types";
import type { PlannerInputDocument, PlannerInputKeywordEntry } from "../exporters";

export type PlannerPromptInput = PlannerInputDocument;

export interface PlannerPromptGenerationResult {
  inputPath: string;
  outputPath: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isMetadata(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.keyword) &&
    isString(value.createdAt) &&
    isString(value.updatedAt) &&
    isString(value.collectorVersion) &&
    isString(value.validationVersion)
  );
}

function isSearchVolumeEvidence(value: unknown): value is SearchVolumeEvidence {
  if (!isRecord(value) || !isRecord(value.searchVolume)) {
    return false;
  }

  return (
    isString(value.keyword) &&
    isString(value.source) &&
    isString(value.collectedAt) &&
    isString(value.searchVolume.keyword) &&
    isNumber(value.searchVolume.monthlyPc) &&
    isNumber(value.searchVolume.monthlyMobile) &&
    isString(value.searchVolume.source)
  );
}

function isRelatedKeywordEvidence(value: unknown): value is RelatedKeywordEvidence {
  if (!isRecord(value) || !Array.isArray(value.relatedKeywords)) {
    return false;
  }

  return (
    isString(value.keyword) &&
    isString(value.source) &&
    isString(value.collectedAt) &&
    value.relatedKeywords.every((item) => {
      return (
        isRecord(item) &&
        isString(item.keyword) &&
        isNumber(item.monthlyPc) &&
        isNumber(item.monthlyMobile) &&
        isString(item.source)
      );
    })
  );
}

function isAutocompleteEvidence(value: unknown): value is AutocompleteEvidence {
  if (!isRecord(value) || !Array.isArray(value.suggestions)) {
    return false;
  }

  return (
    isString(value.keyword) &&
    isString(value.source) &&
    isString(value.collectedAt) &&
    value.suggestions.every(isString)
  );
}

export function isPlannerInputKeywordEntry(value: unknown): value is PlannerInputKeywordEntry {
  if (!isRecord(value) || !isMetadata(value.metadata)) {
    return false;
  }

  return (
    isString(value.keyword) &&
    (value.searchVolume === null || isSearchVolumeEvidence(value.searchVolume)) &&
    (value.relatedKeywords === null || isRelatedKeywordEvidence(value.relatedKeywords)) &&
    (value.autocomplete === null || isAutocompleteEvidence(value.autocomplete))
  );
}

export function isPlannerPromptInput(value: unknown): value is PlannerPromptInput {
  return (
    isRecord(value) &&
    isString(value.generatedAt) &&
    Array.isArray(value.keywords) &&
    value.keywords.every(isPlannerInputKeywordEntry)
  );
}

export function parsePlannerPromptInput(value: unknown): PlannerPromptInput {
  if (!isPlannerPromptInput(value)) {
    throw new Error("Invalid planner input document: expected { generatedAt, keywords[] }");
  }

  return value;
}
