import type { AutocompleteEvidence } from "../collectors/naver/autocomplete.types";
import type { RelatedKeywordEvidence } from "../collectors/naver/related.types";
import type { SearchVolumeEvidence } from "../collectors/naver/types";
import type { StorageMetadata } from "../storage";

export interface PlannerInputKeywordEntry {
  keyword: string;
  metadata: StorageMetadata;
  searchVolume: SearchVolumeEvidence | null;
  relatedKeywords: RelatedKeywordEvidence | null;
  autocomplete: AutocompleteEvidence | null;
}

export interface PlannerInputDocument {
  generatedAt: string;
  keywords: PlannerInputKeywordEntry[];
}

export interface PlannerInputExportResult {
  path: string;
  generatedAt: string;
  document: PlannerInputDocument;
}
