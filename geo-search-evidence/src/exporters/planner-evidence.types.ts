export interface PlannerEvidenceSummary {
  requestedKeywordCount: number;
  successfulKeywordCount: number;
  failedKeywordCount: number;
}

export interface PlannerEvidenceRequestedKeyword {
  keyword: string;
}

export interface PlannerEvidenceSuccessfulKeyword {
  keyword: string;
  metadata?: unknown;
  searchVolume?: unknown;
  relatedKeywords?: unknown;
  autocomplete?: unknown;
}

export interface PlannerEvidenceFailedKeyword {
  keyword: string;
  reason: string;
}

export interface PlannerEvidenceDocument {
  issue?: string;
  notes?: string;
  summary: PlannerEvidenceSummary;
  requestedKeywords: PlannerEvidenceRequestedKeyword[];
  successfulEvidence: PlannerEvidenceSuccessfulKeyword[];
  failedKeywords: PlannerEvidenceFailedKeyword[];
  generatedAt: string;
}

export interface PlannerEvidenceExportResult {
  path: string;
  generatedAt: string;
  document: PlannerEvidenceDocument;
}
