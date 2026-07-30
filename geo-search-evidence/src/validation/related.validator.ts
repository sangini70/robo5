import type { RelatedKeywordEvidence, RelatedKeywordItem } from "../collectors/naver/related.types";
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

function normalizeRelatedKeywords(items: readonly RelatedKeywordItem[]): RelatedKeywordItem[] {
  const seen = new Set<string>();
  const normalized: RelatedKeywordItem[] = [];

  for (const item of items) {
    const keyword = item.keyword.trim();
    if (keyword.length === 0 || seen.has(keyword)) {
      continue;
    }

    seen.add(keyword);
    normalized.push({
      ...item,
      keyword,
    });
  }

  return normalized;
}

export class RelatedValidator implements Validator<RelatedKeywordEvidence> {
  validate(input: RelatedKeywordEvidence): ValidationResult<RelatedKeywordEvidence> {
    const errors: string[] = [];
    const keyword = input.keyword.trim();

    if (keyword.length === 0) {
      errors.push("keyword is required.");
    }

    const relatedKeywords = normalizeRelatedKeywords(input.relatedKeywords);

    return errors.length > 0
      ? createFailure(errors)
      : createSuccess({
          ...input,
          keyword,
          relatedKeywords,
        });
  }
}
