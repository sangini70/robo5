import type { CollectorInput } from "../collector.types";
import type { NaverAutocompleteRequest } from "./autocomplete.types";

export function buildNaverAutocompleteRequest(input: CollectorInput): NaverAutocompleteRequest {
  return {
    kind: "autocomplete",
    keyword: input.keyword,
    method: "GET",
    path: "/nx/ac",
    query: {
      q: input.keyword,
      con: "1",
      frm: "nx",
      ans: "2",
      r_format: "json",
      r_enc: "UTF-8",
      r_unicode: "0",
      t_koreng: "1",
      st: "100",
      rev: "4",
      q_enc: "UTF-8",
    },
  };
}
