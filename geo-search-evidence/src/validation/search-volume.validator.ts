import type { SearchVolumeEvidence } from "../collectors/naver/types";
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

export class SearchVolumeValidator implements Validator<SearchVolumeEvidence> {
  validate(input: SearchVolumeEvidence): ValidationResult<SearchVolumeEvidence> {
    const errors: string[] = [];
    const keyword = input.keyword.trim();
    const searchVolumeKeyword = input.searchVolume.keyword.trim();

    if (keyword.length === 0) {
      errors.push("keyword is required.");
    }

    if (searchVolumeKeyword.length === 0) {
      errors.push("searchVolume.keyword is required.");
    }

    if (!Number.isFinite(input.searchVolume.monthlyPc) || input.searchVolume.monthlyPc < 0) {
      errors.push("searchVolume.monthlyPc must be greater than or equal to 0.");
    }

    if (!Number.isFinite(input.searchVolume.monthlyMobile) || input.searchVolume.monthlyMobile < 0) {
      errors.push("searchVolume.monthlyMobile must be greater than or equal to 0.");
    }

    if (errors.length > 0) {
      return createFailure(errors);
    }

    return createSuccess({
      ...input,
      keyword,
      searchVolume: {
        ...input.searchVolume,
        keyword: searchVolumeKeyword,
      },
    });
  }
}
