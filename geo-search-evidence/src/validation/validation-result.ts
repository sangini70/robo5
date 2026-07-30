export interface ValidationResult<TData> {
  valid: boolean;
  errors: string[];
  data: TData | null;
}
