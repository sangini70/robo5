import type { CollectionKind } from "./collector.types";
import type { CollectorInput, CollectorResult } from "./collector.types";
import type { CollectionSource } from "../types";

export interface Collector<TData> {
  kind: CollectionKind;
  source: CollectionSource;
  collect(input: CollectorInput): Promise<CollectorResult<TData>>;
}
