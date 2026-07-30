import type { Collector } from "../collector.interface";
import type { CollectorError, CollectorInput, CollectorResult } from "../collector.types";
import { buildNaverSearchVolumeRequest } from "./request-builder";
import { parseNaverSearchVolumeResponse } from "./response-parser";
import type { NaverHttpClient } from "./http-client.interface";
import type { SearchVolumeEvidence } from "./types";

function toCollectorError(error: unknown): CollectorError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "NAVER search volume collection failed.",
    details: error,
  };
}

export class SearchVolumeCollector implements Collector<SearchVolumeEvidence> {
  readonly kind = "search_volume" as const;

  readonly source = "NAVER" as const;

  constructor(private readonly httpClient: NaverHttpClient) {}

  async collect(input: CollectorInput): Promise<CollectorResult<SearchVolumeEvidence>> {
    const collectedAt = new Date().toISOString();

    try {
      const request = buildNaverSearchVolumeRequest(input);
      const response = await this.httpClient.request(request);
      const data = parseNaverSearchVolumeResponse(response, input, collectedAt);

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
