import {
  APP_NAME,
  DEFAULT_COLLECTOR_VERSION,
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  SUPPORTED_EXPORT_FORMATS,
} from "./config";
import type { CollectorInput } from "./collectors";
import { AutocompleteCollector, FetchNaverHttpClient } from "./collectors";
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
  keyword: "보험",
  language: DEFAULT_LANGUAGE,
  country: DEFAULT_COUNTRY,
};

const naverHttpClient = new FetchNaverHttpClient();
const autocompleteCollector = new AutocompleteCollector(naverHttpClient);

async function main(): Promise<void> {
  void foundationCheck;
  void sampleEvidence;
  void naverHttpClient;

  const result = await autocompleteCollector.collect(collectorInput);
  if (result.status === "success") {
    const evidence = result.data;
    console.log(evidence);
    return;
  }

  console.error(result.error);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
