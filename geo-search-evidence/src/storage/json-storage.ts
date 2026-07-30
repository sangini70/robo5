import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { Storage } from "./storage.interface";
import type {
  StoredEvidence,
  StoredFileKind,
  StorageError,
  StorageMetadata,
  StorageSaveResult,
} from "./storage.types";
import {
  buildEvidenceStoragePaths,
  getStorageFilePath,
  getStoredEvidenceKind,
} from "./path-builder";
import { APP_VERSION } from "../config/constants";

function toStorageError(error: unknown, message: string): StorageError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message,
    details: error,
  };
}

async function readJsonFile(path: string): Promise<unknown | null> {
  try {
    const text = await readFile(path, "utf8");
    if (text.trim().length === 0) {
      return null;
    }

    return JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function writeJsonFile(path: string, data: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function buildMetadata(keyword: string, existingMetadata: unknown, savedAt: string): StorageMetadata {
  const previousMetadata = existingMetadata as Partial<StorageMetadata> | null;
  const createdAt = typeof previousMetadata?.createdAt === "string" && previousMetadata.createdAt.length > 0
    ? previousMetadata.createdAt
    : savedAt;

  return {
    keyword,
    createdAt,
    updatedAt: savedAt,
    collectorVersion: APP_VERSION,
    validationVersion: APP_VERSION,
  };
}

export class JsonStorage implements Storage {
  async save(evidence: StoredEvidence): Promise<StorageSaveResult> {
    const savedAt = new Date().toISOString();
    const paths = buildEvidenceStoragePaths(evidence);

    try {
      await mkdir(paths.keywordDir, { recursive: true });

      const existingMetadata = await readJsonFile(paths.metadataPath);
      const metadata = buildMetadata(evidence.keyword, existingMetadata, savedAt);

      await writeJsonFile(paths.evidencePath, evidence);
      await writeJsonFile(paths.metadataPath, metadata);

      return {
        success: true,
        path: paths.evidencePath,
        savedAt,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        path: paths.evidencePath,
        savedAt,
        error: toStorageError(error, "Failed to save evidence."),
      };
    }
  }

  async read(keyword: string, kind: StoredFileKind): Promise<unknown | null> {
    const path = getStorageFilePath(keyword, kind);
    return readJsonFile(path);
  }

  async exists(keyword: string, kind: StoredFileKind): Promise<boolean> {
    const path = getStorageFilePath(keyword, kind);
    const result = await readJsonFile(path);
    return result !== null;
  }

  getEvidenceKind(evidence: StoredEvidence): Exclude<StoredFileKind, "metadata"> {
    return getStoredEvidenceKind(evidence);
  }
}
