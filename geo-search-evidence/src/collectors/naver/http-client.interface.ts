import type { NaverSearchVolumeRequest } from "./types";
import type { NaverRelatedKeywordRequest } from "./related.types";
import type { NaverAutocompleteRequest } from "./autocomplete.types";

export interface NaverHttpClient {
  request(
    request: NaverSearchVolumeRequest | NaverRelatedKeywordRequest | NaverAutocompleteRequest,
  ): Promise<unknown>;
}
