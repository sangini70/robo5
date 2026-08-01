import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE } from "../config/constants";
import { AutocompleteCollector, FetchNaverHttpClient, RelatedKeywordCollector, SearchVolumeCollector } from "../collectors";
import type { AutocompleteEvidence } from "../collectors/naver/autocomplete.types";
import type { RelatedKeywordEvidence } from "../collectors/naver/related.types";
import type { SearchVolumeEvidence } from "../collectors/naver/types";
import { JsonStorage } from "../storage";
import { AutocompleteValidator, RelatedValidator, SearchVolumeValidator } from "../validation";

export interface CollectorServiceResult {
  searchVolume: SearchVolumeEvidence;
  relatedKeywords: RelatedKeywordEvidence;
  autocomplete: AutocompleteEvidence;
}

function buildValidationError(stage: string, errors: readonly string[]): Error {
  return new Error(`${stage} validation failed: ${errors.join(", ")}`);
}

function buildStorageError(stage: string, errorMessage: string): Error {
  return new Error(`${stage} storage failed: ${errorMessage}`);
}

export class CollectorService {
  private readonly httpClient = new FetchNaverHttpClient();

  private readonly searchVolumeCollector = new SearchVolumeCollector(this.httpClient);
  private readonly relatedKeywordCollector = new RelatedKeywordCollector(this.httpClient);
  private readonly autocompleteCollector = new AutocompleteCollector(this.httpClient);

  private readonly searchVolumeValidator = new SearchVolumeValidator();
  private readonly relatedValidator = new RelatedValidator();
  private readonly autocompleteValidator = new AutocompleteValidator();

  private readonly storage = new JsonStorage();

  async collect(keyword: string, seedKeyword?: string): Promise<CollectorServiceResult> {
    const effectiveKeyword = seedKeyword ?? keyword;
    const searchVolume = await this.collectSearchVolume(keyword, seedKeyword);
    const relatedKeywords = await this.collectRelatedKeywords(effectiveKeyword);
    const autocomplete = await this.collectAutocomplete(effectiveKeyword);

    return {
      searchVolume,
      relatedKeywords,
      autocomplete,
    };
  }

  private async collectSearchVolume(keyword: string, seedKeyword?: string): Promise<SearchVolumeEvidence> {
    const result = await this.searchVolumeCollector.collect({
      keyword,
      language: DEFAULT_LANGUAGE,
      country: DEFAULT_COUNTRY,
      options: seedKeyword === undefined ? undefined : { seedKeyword },
    });

    if (result.status !== "success" || result.data === null) {
      throw new Error(result.error.message);
    }

    const validation = this.searchVolumeValidator.validate(result.data);
    if (!validation.valid || validation.data === null) {
      throw buildValidationError("Search Volume", validation.errors);
    }

    const saved = await this.storage.save(validation.data);
    if (!saved.success) {
      throw buildStorageError("Search Volume", saved.error?.message ?? "Unknown error");
    }

    return validation.data;
  }

  private async collectRelatedKeywords(keyword: string): Promise<RelatedKeywordEvidence> {
    const result = await this.relatedKeywordCollector.collect({
      keyword,
      language: DEFAULT_LANGUAGE,
      country: DEFAULT_COUNTRY,
    });

    if (result.status !== "success" || result.data === null) {
      throw new Error(result.error.message);
    }

    const validation = this.relatedValidator.validate(result.data);
    if (!validation.valid || validation.data === null) {
      throw buildValidationError("Related Keyword", validation.errors);
    }

    const saved = await this.storage.save(validation.data);
    if (!saved.success) {
      throw buildStorageError("Related Keyword", saved.error?.message ?? "Unknown error");
    }

    return validation.data;
  }

  private async collectAutocomplete(keyword: string): Promise<AutocompleteEvidence> {
    const result = await this.autocompleteCollector.collect({
      keyword,
      language: DEFAULT_LANGUAGE,
      country: DEFAULT_COUNTRY,
    });

    if (result.status !== "success" || result.data === null) {
      throw new Error(result.error.message);
    }

    const validation = this.autocompleteValidator.validate(result.data);
    if (!validation.valid || validation.data === null) {
      throw buildValidationError("Autocomplete", validation.errors);
    }

    const saved = await this.storage.save(validation.data);
    if (!saved.success) {
      throw buildStorageError("Autocomplete", saved.error?.message ?? "Unknown error");
    }

    return validation.data;
  }
}

export const collectorService = new CollectorService();
