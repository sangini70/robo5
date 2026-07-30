import type { Collector } from "../collector.interface";
import type { CollectorError, CollectorInput, CollectorResult } from "../collector.types";
import type { NaverHttpClient } from "./http-client.interface";
import { buildNaverAutocompleteRequest } from "./autocomplete-request-builder";
import { parseNaverAutocompleteResponse } from "./autocomplete-response-parser";
import type { AutocompleteEvidence } from "./autocomplete.types";

function toCollectorError(error: unknown): CollectorError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "NAVER autocomplete collection failed.",
    details: error,
  };
}

export class AutocompleteCollector implements Collector<AutocompleteEvidence> {
  readonly kind = "autocomplete" as const;

  readonly source = "NAVER" as const;

  constructor(private readonly httpClient: NaverHttpClient) {}

  async collect(input: CollectorInput): Promise<CollectorResult<AutocompleteEvidence>> {
    const collectedAt = new Date().toISOString();

    try {
      const request = buildNaverAutocompleteRequest(input);
      const response = await this.httpClient.request(request);
      const data = parseNaverAutocompleteResponse(response, input, collectedAt);

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
