import path from "node:path";
import type { StoredEvidence, StoredFileKind, StoragePaths } from "./storage.types";
import { EVIDENCE_DIR } from "../config/paths";

const STORAGE_FILE_NAMES: Record<StoredFileKind, string> = {
  metadata: "metadata.json",
  search_volume: "search_volume.json",
  related_keywords: "related_keywords.json",
  autocomplete: "autocomplete.json",
};

function getStoredFileKind(evidence: StoredEvidence): Exclude<StoredFileKind, "metadata"> {
  if ("searchVolume" in evidence) {
    return "search_volume";
  }

  if ("relatedKeywords" in evidence) {
    return "related_keywords";
  }

  return "autocomplete";
}

export function buildStoragePaths(keyword: string, kind: StoredFileKind = "search_volume"): StoragePaths {
  const keywordDir = path.join(EVIDENCE_DIR, keyword);

  return {
    keywordDir,
    metadataPath: path.join(keywordDir, STORAGE_FILE_NAMES.metadata),
    evidencePath: path.join(keywordDir, STORAGE_FILE_NAMES[kind]),
  };
}

export function buildEvidenceStoragePaths(evidence: StoredEvidence): StoragePaths {
  const fileKind = getStoredFileKind(evidence);
  return buildStoragePaths(evidence.keyword, fileKind);
}

export function getStorageFilePath(keyword: string, kind: StoredFileKind): string {
  return buildStoragePaths(keyword, kind).evidencePath;
}

export function getStoredEvidenceKind(evidence: StoredEvidence): Exclude<StoredFileKind, "metadata"> {
  return getStoredFileKind(evidence);
}
