import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { OUTPUT_DIR, EVIDENCE_DIR } from "../config/paths";
import type { Exporter } from "./exporter.interface";
import type {
  PlannerInputDocument,
  PlannerInputExportResult,
  PlannerInputKeywordEntry,
} from "./planner-input.types";
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

function isKeywordDirectory(name: string): boolean {
  return name.trim().length > 0;
}

async function loadKeywordEntry(keywordDir: string): Promise<PlannerInputKeywordEntry | null> {
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

  const keyword = path.basename(keywordDir);

  return {
    keyword,
    metadata: {
      ...metadata,
      keyword,
    },
    searchVolume: isRecord(searchVolume)
      ? (searchVolume as unknown as PlannerInputKeywordEntry["searchVolume"])
      : null,
    relatedKeywords: isRecord(relatedKeywords)
      ? (relatedKeywords as unknown as PlannerInputKeywordEntry["relatedKeywords"])
      : null,
    autocomplete: isRecord(autocomplete)
      ? (autocomplete as unknown as PlannerInputKeywordEntry["autocomplete"])
      : null,
  };
}

export function buildPlannerInputDocument(keywords: PlannerInputKeywordEntry[], issue?: string): PlannerInputDocument {
  const document: PlannerInputDocument = {
    generatedAt: new Date().toISOString(),
    keywords,
  };

  if (issue !== undefined && issue.trim().length > 0) {
    document.issue = issue.trim();
  }

  return document;
}

export class PlannerInputExporter implements Exporter<PlannerInputExportResult> {
  constructor(private readonly outputPath: string = path.join(OUTPUT_DIR, "planner-input.json")) {}

  async export(options: { issue?: string; keywords?: readonly string[] } = {}): Promise<PlannerInputExportResult> {
    const entries = await this.loadEntries(options.keywords);
    const document = buildPlannerInputDocument(entries, options.issue);

    await mkdir(path.dirname(this.outputPath), { recursive: true });
    await writeFile(this.outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");

    return {
      path: this.outputPath,
      generatedAt: document.generatedAt,
      document,
    };
  }

  private async loadEntries(allowedKeywords?: readonly string[]): Promise<PlannerInputKeywordEntry[]> {
    if (allowedKeywords !== undefined) {
      const entries: PlannerInputKeywordEntry[] = [];

      for (const keyword of allowedKeywords) {
        const entry = await loadKeywordEntry(path.join(EVIDENCE_DIR, keyword));
        if (entry !== null) {
          entries.push(entry);
        }
      }

      return entries;
    }

    const directories = await readdir(EVIDENCE_DIR, { withFileTypes: true });
    const entries: PlannerInputKeywordEntry[] = [];

    for (const directory of directories) {
      if (!directory.isDirectory() || !isKeywordDirectory(directory.name)) {
        continue;
      }

      const entry = await loadKeywordEntry(path.join(EVIDENCE_DIR, directory.name));
      if (entry !== null) {
        entries.push(entry);
      }
    }

    entries.sort((left, right) => left.keyword.localeCompare(right.keyword, "ko"));
    return entries;
  }
}
