import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE } from "../config/constants";
import { AutocompleteCollector, FetchNaverHttpClient, RelatedKeywordCollector, SearchVolumeCollector } from "../collectors";
import type { AutocompleteEvidence } from "../collectors/naver/autocomplete.types";
import type { RelatedKeywordEvidence } from "../collectors/naver/related.types";
import type { SearchVolumeEvidence } from "../collectors/naver/types";
import { JsonStorage } from "../storage";
import { AutocompleteValidator, RelatedValidator, SearchVolumeValidator } from "../validation";
import type { KeywordContext } from "./keyword-context";

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

  async collect(context: KeywordContext): Promise<CollectorServiceResult> {
    const searchVolume = await this.collectSearchVolume(context);
    const relatedKeywords = await this.collectRelatedKeywords(context);
    const autocomplete = await this.collectAutocomplete(context);

    return {
      searchVolume,
      relatedKeywords,
      autocomplete,
    };
  }

  private async collectSearchVolume(context: KeywordContext): Promise<SearchVolumeEvidence> {
    const result = await this.searchVolumeCollector.collect({
      keyword: context.originalKeyword,
      language: DEFAULT_LANGUAGE,
      country: DEFAULT_COUNTRY,
      options: context.seedKeyword === undefined ? undefined : { seedKeyword: context.seedKeyword },
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

  private async collectRelatedKeywords(context: KeywordContext): Promise<RelatedKeywordEvidence> {
    const result = await this.relatedKeywordCollector.collect({
      keyword: context.effectiveKeyword,
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

  private async collectAutocomplete(context: KeywordContext): Promise<AutocompleteEvidence> {
    const result = await this.autocompleteCollector.collect({
      keyword: context.effectiveKeyword,
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
