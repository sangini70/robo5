import type { CollectorInput } from "../collector.types";
import type { SearchVolume } from "../../types";
import type { NaverSearchVolumeRecord, SearchVolumeEvidence } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: number | string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getRecords(response: unknown): readonly NaverSearchVolumeRecord[] {
  if (!isRecord(response)) {
    return [];
  }

  const keywordList = response.keywordList;
  if (Array.isArray(keywordList)) {
    return keywordList as readonly NaverSearchVolumeRecord[];
  }

  const items = response.items;
  if (Array.isArray(items)) {
    return items as readonly NaverSearchVolumeRecord[];
  }

  return [];
}

export function parseNaverSearchVolumeResponse(
  response: unknown,
  input: CollectorInput,
  collectedAt: string,
): SearchVolumeEvidence {
  const records = getRecords(response);
  const matchedItem = records.find((item) => item.relKeyword === input.keyword) ?? records[0];

  if (matchedItem === undefined) {
    throw new Error("NAVER search volume response is empty.");
  }

  const searchVolume: SearchVolume = {
    keyword: input.keyword,
    monthlyPc: toNumber(matchedItem.monthlyPcQcCnt),
    monthlyMobile: toNumber(matchedItem.monthlyMobileQcCnt),
    source: "NAVER",
  };

  return {
    keyword: input.keyword,
    searchVolume,
    source: "NAVER",
    collectedAt,
  };
}
