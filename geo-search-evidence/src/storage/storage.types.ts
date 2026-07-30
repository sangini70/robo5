import type { AutocompleteEvidence } from "../collectors/naver/autocomplete.types";
import type { RelatedKeywordEvidence } from "../collectors/naver/related.types";
import type { SearchVolumeEvidence } from "../collectors/naver/types";

export type StoredEvidence = SearchVolumeEvidence | RelatedKeywordEvidence | AutocompleteEvidence;

export type StoredFileKind = "metadata" | "search_volume" | "related_keywords" | "autocomplete";

export interface StorageMetadata {
  keyword: string;
  createdAt: string;
  updatedAt: string;
  collectorVersion: string;
  validationVersion: string;
}

export interface StorageError {
  message: string;
  details?: unknown;
}

export interface StorageSaveResult {
  success: boolean;
  path: string;
  savedAt: string;
  error: StorageError | null;
}

export interface StoragePaths {
  keywordDir: string;
  metadataPath: string;
  evidencePath: string;
}
