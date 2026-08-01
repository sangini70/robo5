import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { OUTPUT_DIR, EVIDENCE_DIR } from "../config/paths";
import type {
  PlannerEvidenceDocument,
  PlannerEvidenceExportResult,
  PlannerEvidenceFailedKeyword,
  PlannerEvidenceRequestedKeyword,
  PlannerEvidenceSuccessfulKeyword,
} from "./planner-evidence.types";
import type { StorageMetadata } from "../storage";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const text = await readFile(filePath, "utf8");
    if (text.trim().length === 0) {
      return null;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function loadSuccessfulEvidence(keyword: string): Promise<PlannerEvidenceSuccessfulKeyword | null> {
  const keywordDir = path.join(EVIDENCE_DIR, keyword);
  const metadataPath = path.join(keywordDir, "metadata.json");
  const searchVolumePath = path.join(keywordDir, "search_volume.json");
  const relatedKeywordsPath = path.join(keywordDir, "related_keywords.json");
  const autocompletePath = path.join(keywordDir, "autocomplete.json");

  const [metadata, searchVolume, relatedKeywords, autocomplete] = await Promise.all([
    readJsonFile<StorageMetadata>(metadataPath),
    readJsonFile(searchVolumePath),
    readJsonFile(relatedKeywordsPath),
    readJsonFile(autocompletePath),
  ]);

  if (metadata === null) {
    return null;
  }

  return {
    keyword,
    metadata,
    searchVolume: isRecord(searchVolume) ? searchVolume : null,
    relatedKeywords: isRecord(relatedKeywords) ? relatedKeywords : null,
    autocomplete: isRecord(autocomplete) ? autocomplete : null,
  };
}

async function buildPlannerEvidenceDocument(options: {
  issue?: string;
  notes?: string;
  requestedKeywords: readonly string[];
  successfulKeywords: readonly string[];
  failedKeywords: readonly PlannerEvidenceFailedKeyword[];
}): Promise<PlannerEvidenceDocument> {
  const successfulEvidence: PlannerEvidenceSuccessfulKeyword[] = [];

  for (const keyword of options.successfulKeywords) {
    const evidence = await loadSuccessfulEvidence(keyword);
    if (evidence !== null) {
      successfulEvidence.push(evidence);
    }
  }

  return {
    issue: options.issue?.trim().length ? options.issue.trim() : undefined,
    notes: options.notes?.trim().length ? options.notes.trim() : undefined,
    summary: {
      requestedKeywordCount: options.requestedKeywords.length,
      successfulKeywordCount: options.successfulKeywords.length,
      failedKeywordCount: options.failedKeywords.length,
    },
    requestedKeywords: options.requestedKeywords.map((keyword) => ({ keyword })),
    successfulEvidence,
    failedKeywords: [...options.failedKeywords],
    generatedAt: new Date().toISOString(),
  };
}

export class PlannerEvidenceExporter {
  constructor(private readonly outputPath: string = path.join(OUTPUT_DIR, "planner-evidence.json")) {}

  async export(options: {
    issue?: string;
    notes?: string;
    requestedKeywords: readonly string[];
    successfulKeywords: readonly string[];
    failedKeywords: readonly PlannerEvidenceFailedKeyword[];
  }): Promise<PlannerEvidenceExportResult> {
    const document = await buildPlannerEvidenceDocument(options);

    await mkdir(path.dirname(this.outputPath), { recursive: true });
    await writeFile(this.outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");

    return {
      path: this.outputPath,
      generatedAt: document.generatedAt,
      document,
    };
  }
}
