import type { ValidationResult } from "./validation-result";

export interface Validator<TInput, TOutput = TInput> {
  validate(input: TInput): ValidationResult<TOutput>;
}
