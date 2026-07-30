import type { AutocompleteEvidence } from "../collectors/naver/autocomplete.types";
import type { Validator } from "./validator.interface";
import type { ValidationResult } from "./validation-result";

function createFailure<TData>(errors: string[]): ValidationResult<TData> {
  return {
    valid: false,
    errors,
    data: null,
  };
}

function createSuccess<TData>(data: TData): ValidationResult<TData> {
  return {
    valid: true,
    errors: [],
    data,
  };
}

function normalizeSuggestions(suggestions: readonly string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const suggestion of suggestions) {
    const trimmedSuggestion = suggestion.trim();
    if (trimmedSuggestion.length === 0 || seen.has(trimmedSuggestion)) {
      continue;
    }

    seen.add(trimmedSuggestion);
    normalized.push(trimmedSuggestion);
  }

  return normalized;
}

export class AutocompleteValidator implements Validator<AutocompleteEvidence> {
  validate(input: AutocompleteEvidence): ValidationResult<AutocompleteEvidence> {
    const errors: string[] = [];
    const keyword = input.keyword.trim();
    const suggestions = normalizeSuggestions(input.suggestions);

    if (keyword.length === 0) {
      errors.push("keyword is required.");
    }

    if (suggestions.length === 0) {
      errors.push("suggestions are required.");
    }

    if (errors.length > 0) {
      return createFailure(errors);
    }

    return createSuccess({
      ...input,
      keyword,
      suggestions,
    });
  }
}
