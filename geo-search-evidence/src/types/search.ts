import type { CollectionSource } from "./source";

export interface SearchVolume {
  keyword: string;
  monthlyPc: number;
  monthlyMobile: number;
  source: CollectionSource;
}

export interface RelatedKeyword {
  keyword: string;
  pc: number;
  mobile: number;
  source: CollectionSource;
}

export type AutocompleteResult = string;
