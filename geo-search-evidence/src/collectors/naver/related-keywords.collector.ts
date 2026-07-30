import type { Collector } from "../collector.interface";
import type { CollectorError, CollectorInput, CollectorResult } from "../collector.types";
import type { NaverHttpClient } from "./http-client.interface";
import { buildNaverRelatedKeywordRequest } from "./related-request-builder";
import { parseNaverRelatedKeywordResponse } from "./related-response-parser";
import type { RelatedKeywordEvidence } from "./related.types";

function toCollectorError(error: unknown): CollectorError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "NAVER related keyword collection failed.",
    details: error,
  };
}

export class RelatedKeywordCollector implements Collector<RelatedKeywordEvidence> {
  readonly kind = "related_keywords" as const;

  readonly source = "NAVER" as const;

  constructor(private readonly httpClient: NaverHttpClient) {}

  async collect(input: CollectorInput): Promise<CollectorResult<RelatedKeywordEvidence>> {
    const collectedAt = new Date().toISOString();

    try {
      const request = buildNaverRelatedKeywordRequest(input);
      const response = await this.httpClient.request(request);
      const data = parseNaverRelatedKeywordResponse(response, input, collectedAt);

      return {
        kind: this.kind,
        source: this.source,
        status: "success",
        collectedAt,
        data,
        error: null,
      };
    } catch (error) {
      return {
        kind: this.kind,
        source: this.source,
        status: "failed",
        collectedAt,
        data: null,
        error: toCollectorError(error),
      };
    }
  }
}
