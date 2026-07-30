import type { NaverSearchVolumeRequest } from "./types";
import type { NaverRelatedKeywordRequest } from "./related.types";

export interface NaverHttpClient {
  request(request: NaverSearchVolumeRequest | NaverRelatedKeywordRequest): Promise<unknown>;
}
