import type { AutocompleteResult, RelatedKeyword, SearchVolume } from "./search";
import type { EvidenceMetadata } from "./metadata";

export interface SearchEvidence {
  metadata: EvidenceMetadata;
  searchVolume: SearchVolume | null;
  relatedKeywords: RelatedKeyword[];
  autocomplete: AutocompleteResult[];
}
