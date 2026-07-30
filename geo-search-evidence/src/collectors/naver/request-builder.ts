import { env } from "../../config";
import type { CollectorInput } from "../collector.types";
import type { NaverSearchVolumeRequest } from "./types";

export function buildNaverSearchVolumeRequest(input: CollectorInput): NaverSearchVolumeRequest {
  return {
    kind: "search_volume",
    keyword: input.keyword,
    apiKey: env.naverApiKey,
    secretKey: env.naverSecretKey,
    customerId: env.naverCustomerId,
    method: "GET",
    path: "/keywordstool",
    query: {
      hintKeywords: input.keyword,
      showDetail: "1",
    },
  };
}
