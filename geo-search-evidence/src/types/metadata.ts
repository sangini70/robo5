import type { CollectionSource } from "./source";

export interface EvidenceMetadata {
  keyword: string;
  language: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  collectedAt: string;
  collectorVersion: string;
  source: CollectionSource;
}
