import type { CollectorInput } from "../collector.types";
import type {
  NaverRelatedKeywordRawResponse,
  NaverRelatedKeywordRecord,
  RelatedKeywordEvidence,
  RelatedKeywordItem,
} from "./related.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: number | string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getRecords(response: unknown): readonly NaverRelatedKeywordRecord[] {
  if (!isRecord(response)) {
    return [];
  }

  const keywordList = response.keywordList;
  if (Array.isArray(keywordList)) {
    return keywordList as readonly NaverRelatedKeywordRecord[];
  }

  const items = response.items;
  if (Array.isArray(items)) {
    return items as readonly NaverRelatedKeywordRecord[];
  }

  return [];
}

export function parseNaverRelatedKeywordResponse(
  response: unknown,
  input: CollectorInput,
  collectedAt: string,
): RelatedKeywordEvidence {
  const records = getRecords(response);

  const relatedKeywords: RelatedKeywordItem[] = records.map((record) => ({
    keyword: record.relKeyword,
    monthlyPc: toNumber(record.monthlyPcQcCnt),
    monthlyMobile: toNumber(record.monthlyMobileQcCnt),
    source: "NAVER",
  }));

  if (relatedKeywords.length === 0) {
    throw new Error("NAVER related keyword response is empty.");
  }

  return {
    keyword: input.keyword,
    relatedKeywords,
    source: "NAVER",
    collectedAt,
  };
}
