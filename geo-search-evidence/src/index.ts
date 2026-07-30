import { APP_NAME, DEFAULT_COUNTRY, DEFAULT_LANGUAGE, SUPPORTED_EXPORT_FORMATS } from "./config/constants";
import { PlannerInputExporter } from "./exporters";
import { collectorService } from "./shared";
import { generatePlannerPrompt } from "./prompts";
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
  collectorVersion: "0.1.0",
  source: "NAVER",
};

const sampleEvidence: SearchEvidence = {
  metadata: sampleMetadata,
  searchVolume: null,
  relatedKeywords: [],
  autocomplete: [],
};

async function main(): Promise<void> {
  void foundationCheck;
  void sampleEvidence;

  const result = await collectorService.collect("보험");
  console.log(result);

  await new PlannerInputExporter().export();
  await generatePlannerPrompt();
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
