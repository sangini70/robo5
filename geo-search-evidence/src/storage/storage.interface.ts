import type { StoredEvidence, StoredFileKind, StorageSaveResult } from "./storage.types";

export interface Storage {
  save(evidence: StoredEvidence): Promise<StorageSaveResult>;
  read(keyword: string, kind: StoredFileKind): Promise<unknown | null>;
  exists(keyword: string, kind: StoredFileKind): Promise<boolean>;
}
