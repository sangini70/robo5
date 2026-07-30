import type { CollectionSource } from "../../types";
import type { CollectorKind } from "../collector.types";

export interface NaverAutocompleteRequest {
  kind: CollectorKind;
  keyword: string;
  method: "GET";
  path: "/nx/ac";
  query: {
    q: string;
    con: "1";
    frm: "nx";
    ans: "2";
    r_format: "json";
    r_enc: "UTF-8";
    r_unicode: "0";
    t_koreng: "1";
    st: "100";
    rev: "4";
    q_enc: "UTF-8";
  };
}

export interface NaverAutocompleteRecord {
  readonly [key: string]: unknown;
}

export interface NaverAutocompleteRawResponse {
  items?: readonly (readonly NaverAutocompleteRecord[])[];
}

export interface AutocompleteEvidence {
  keyword: string;
  suggestions: string[];
  source: CollectionSource;
  collectedAt: string;
}
