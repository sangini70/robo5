import {
  APP_NAME,
  DEFAULT_COLLECTOR_VERSION,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  SUPPORTED_EXPORT_FORMATS,
} from "./config";
import type { EvidenceMetadata, SearchEvidence } from "./types";

const foundationCheck = {
  appName: APP_NAME,
  defaultLanguage: DEFAULT_LANGUAGE,
  defaultCountry: DEFAULT_COUNTRY,
  exportFormats: SUPPORTED_EXPORT_FORMATS,
} satisfies {
  appName: string;
  defaultLanguage: string;
  defaultCountry: string;
  exportFormats: readonly string[];
};

const sampleMetadata: EvidenceMetadata = {
  keyword: "sample",
  language: DEFAULT_LANGUAGE,
  country: DEFAULT_COUNTRY,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
  collectedAt: new Date(0).toISOString(),
  collectorVersion: DEFAULT_COLLECTOR_VERSION,
  source: "NAVER",
};

const sampleEvidence: SearchEvidence = {
  metadata: sampleMetadata,
  searchVolume: null,
  relatedKeywords: [],
  autocomplete: [],
};

void foundationCheck;
void sampleEvidence;

console.log("Project initialized.");
