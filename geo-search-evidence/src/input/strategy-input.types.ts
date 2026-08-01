export interface StrategyInput {
  issue?: string;
  keywords: string[];
  seedKeywords?: Record<string, string>;
  notes?: string;
}

export interface StrategyInputParseResult {
  input: StrategyInput;
  sourcePath: string;
}
