import {
  APP_NAME,
  DEFAULT_COLLECTOR_VERSION,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  SUPPORTED_EXPORT_FORMATS,
} from "./config";
import type { Collector, CollectorInput, CollectorResult } from "./collectors";
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

const collectorInput: CollectorInput = {
  keyword: "sample",
  language: DEFAULT_LANGUAGE,
  country: DEFAULT_COUNTRY,
};

const collectorResult: CollectorResult<unknown> = {
  kind: "search_volume",
  source: "NAVER",
  status: "failed",
  collectedAt: new Date(0).toISOString(),
  data: null,
  error: {
    message: "Not implemented",
  },
};

const collectorContract: Collector<unknown> = {
  kind: "search_volume",
  source: "NAVER",
  async collect(_input) {
    return collectorResult;
  },
};

void foundationCheck;
void sampleEvidence;
void collectorInput;
void collectorResult;
void collectorContract;

console.log("Project initialized.");
