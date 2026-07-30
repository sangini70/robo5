export interface Exporter<TOutput> {
  export(): Promise<TOutput>;
}
