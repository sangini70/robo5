import { env } from "../../config";
import type { CollectorInput } from "../collector.types";
import type { NaverRelatedKeywordRequest } from "./related.types";

export function buildNaverRelatedKeywordRequest(input: CollectorInput): NaverRelatedKeywordRequest {
  const hintKeywords = input.keyword.replace(/\s+/g, "");

  return {
    kind: "related_keywords",
    keyword: input.keyword,
    apiKey: env.naverApiKey,
    secretKey: env.naverSecretKey,
    customerId: env.naverCustomerId,
    method: "GET",
    path: "/keywordstool",
    query: {
      hintKeywords,
      showDetail: "1",
    },
  };
}
