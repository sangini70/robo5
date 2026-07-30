import type { CollectionSource } from "../types";

export type CollectionKind = "search_volume" | "related_keywords" | "autocomplete";

export type CollectorStatus = "success" | "failed";

export interface CollectorOptions {
  readonly [key: string]: unknown;
}

export interface CollectorInput {
  keyword: string;
  language: string;
  country: string;
  options?: CollectorOptions;
}

export interface CollectorError {
  code?: string;
  message: string;
  details?: unknown;
}

export interface CollectorSuccessResult<TData> {
  kind: CollectionKind;
  source: CollectionSource;
  status: "success";
  collectedAt: string;
  data: TData;
  error: null;
}

export interface CollectorFailureResult {
  kind: CollectionKind;
  source: CollectionSource;
  status: "failed";
  collectedAt: string;
  data: null;
  error: CollectorError;
}

export type CollectorResult<TData> = CollectorSuccessResult<TData> | CollectorFailureResult;
