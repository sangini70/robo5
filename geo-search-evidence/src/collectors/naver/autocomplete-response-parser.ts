import type { CollectorInput } from "../collector.types";
import type {
  AutocompleteEvidence,
  NaverAutocompleteRawResponse,
  NaverAutocompleteRecord,
} from "./autocomplete.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getSuggestions(response: unknown): string[] {
  if (!isRecord(response)) {
    return [];
  }

  const items = response.items;
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const firstItem = items[0];
  if (!Array.isArray(firstItem)) {
    return [];
  }

  return firstItem
    .map((item) => {
      if (!isRecord(item)) {
        return "";
      }

      const suggestion = item[0];
      return typeof suggestion === "string" ? suggestion : "";
    })
    .filter((suggestion) => suggestion.length > 0);
}

export function parseNaverAutocompleteResponse(
  response: unknown,
  input: CollectorInput,
  collectedAt: string,
): AutocompleteEvidence {
  const suggestions = getSuggestions(response);

  if (suggestions.length === 0) {
    throw new Error("NAVER autocomplete response is empty.");
  }

  return {
    keyword: input.keyword,
    suggestions,
    source: "NAVER",
    collectedAt,
  };
}
