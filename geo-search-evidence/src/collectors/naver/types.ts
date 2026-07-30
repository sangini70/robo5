import type { CollectionSource } from "../../types";
import type { CollectorKind } from "../collector.types";

export interface NaverSearchVolumeRequest {
  kind: CollectorKind;
  keyword: string;
  apiKey: string;
  secretKey: string;
  customerId: string;
  method: "GET";
  path: "/keywordstool";
  query: {
    hintKeywords: string;
    showDetail: "1";
  };
}

export interface NaverSearchVolumeRecord {
  relKeyword: string;
  monthlyPcQcCnt: number | string;
  monthlyMobileQcCnt: number | string;
}

export interface NaverSearchVolumeRawResponse {
  keywordList?: readonly NaverSearchVolumeRecord[];
  items?: readonly NaverSearchVolumeRecord[];
}

export interface SearchVolumeEvidence {
  keyword: string;
  searchVolume: {
    keyword: string;
    monthlyPc: number;
    monthlyMobile: number;
    source: CollectionSource;
  };
  source: CollectionSource;
  collectedAt: string;
}
