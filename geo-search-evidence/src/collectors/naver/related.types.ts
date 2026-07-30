import type { CollectionSource } from "../../types";
import type { CollectorKind } from "../collector.types";

export interface NaverRelatedKeywordRequest {
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

export interface NaverRelatedKeywordRecord {
  relKeyword: string;
  monthlyPcQcCnt: number | string;
  monthlyMobileQcCnt: number | string;
}

export interface NaverRelatedKeywordRawResponse {
  keywordList?: readonly NaverRelatedKeywordRecord[];
  items?: readonly NaverRelatedKeywordRecord[];
}

export interface RelatedKeywordItem {
  keyword: string;
  monthlyPc: number;
  monthlyMobile: number;
  source: CollectionSource;
}

export interface RelatedKeywordEvidence {
  keyword: string;
  relatedKeywords: RelatedKeywordItem[];
  source: CollectionSource;
  collectedAt: string;
}
