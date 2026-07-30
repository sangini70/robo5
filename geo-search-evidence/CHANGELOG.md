# CHANGELOG.md

# GEO Search Evidence Collector

All notable changes to this project will be documented in this file.

This project follows a structured changelog to record architectural, functional, and technical changes throughout development.

---

# Version 0.1.0

## Status

Project Initialization

## Added

### Project Setup

- `package.json`
- `tsconfig.json`
- `.gitignore`
- `src/index.ts`

### Directory Structure

- `docs/`
- `src/input/`
- `src/collectors/`
- `src/validators/`
- `src/storage/`
- `src/exporters/`
- `src/shared/`
- `src/types/`
- `src/config/`
- `evidence/`
- `output/`
- `tests/`
- `scripts/`

### Foundation Layer

- Added shared TypeScript types for keywords, search evidence, metadata, sources, statuses, and export formats.
- Added centralized config constants, path definitions, and environment loading helpers.
- Added barrel exports for `src/types` and `src/config`.
- Updated `src/index.ts` to verify foundation imports only.

### Collector Contract

- Added minimal Collector kind, input, error, and result types.
- Added a minimal Collector interface with `kind`, `source`, and `collect()`.
- Added barrel exports for `src/collectors`.
- Updated `src/index.ts` to verify Collector contract imports only.

### NAVER Search Volume Collector

- Added NAVER Search Volume Collector module structure under `src/collectors/naver/`.
- Added a request builder for NAVER Search Volume requests without performing HTTP calls.
- Added a response parser that converts NAVER response data into `SearchVolumeEvidence`.
- Added a minimal HTTP client interface for later phase integration.

### NAVER API Integration

- Added a real Fetch-based NAVER HTTP client for `/keywordstool`.
- Added NAVER credential loading for API key, secret key, and customer ID.
- Added `.env.example` with NAVER credential placeholders.
- Connected `SearchVolumeCollector` to the real HTTP client while keeping result creation inside the collector.

### Related Keyword Collector

- Added `RelatedKeywordCollector` with request builder and response parser.
- Reused the existing NAVER HTTP client and env loading.
- Updated the main entry to execute the related keyword flow and print evidence.

### Autocomplete Collector

- Added `AutocompleteCollector` with request builder and response parser.
- Reused the shared NAVER HTTP client structure.
- Updated the main entry to execute the autocomplete flow and print evidence.

### Validation Layer

- Added a dedicated validation layer under `src/validation/`.
- Added validators for Search Volume, Related Keyword, and Autocomplete evidence.
- Added a shared validation result contract and validator interface.

### Storage Layer

- Added a JSON-based storage layer under `src/storage/`.
- Added evidence-by-keyword folder storage using the raw keyword as the folder name.
- Added storage path building, save/read/exists support, and metadata JSON output.

### Collector Service

- Added a sequential collector service that runs Search Volume, Related Keyword, and Autocomplete collection in order.
- Added validation and storage steps between each collector stage.
- Updated the main entry to invoke the collector service for the sample keyword.

### Exporter Layer

- Added a planner input exporter that reads evidence from `evidence/<keyword>/`.
- Added a single-file `planner-input.json` export under `output/`.
- Added exporter interfaces and planner input types.

### Planner Prompt Builder

- Added a Markdown prompt builder that reads `output/planner-input.json`.
- Added `output/planner-prompt.md` generation for GEO Planner.
- Kept `Collected Evidence`, `Planner Task`, and `Planner Rules` separated in the prompt output.

### Markdown Batch Input

- Added a Markdown strategy input reader for multi-keyword batch collection.
- Added a sequential batch collector service that reuses the existing collector flow.
- Added `npm run collect:md` to process `input/strategy-input.md` or a provided Markdown path.

---

## Added

### Project Documents

- README.md
- AI_WORK_RULES.md
- SYSTEM_ARCHITECTURE.md
- TECH_STACK.md
- CHANGELOG.md

---

### Project Philosophy

Established the core philosophy of the project.

- Search → Evidence → Knowledge → Content
- Evidence First
- AI Optional
- Raw Before Analysis
- Source Independent
- Reproducibility

---

### System Architecture

Defined the overall architecture.

Input Layer

↓

Collection Layer

↓

Validation Layer

↓

Storage Layer

↓

Export Layer

↓

Evidence Package

↓

NotebookLM

↓

Planner

↓

Writer

---

### Collection Strategy

Defined independent collectors.

- Search Volume Collector
- Related Keyword Collector
- Autocomplete Collector
- People Also Search Collector
- Popular Topic Collector
- SERP URL Collector
- Metadata Collector

---

### Technology Stack

Selected initial technology stack.

- Node.js
- TypeScript
- npm
- Native fetch
- JSON
- Markdown

---

## Not Added

The following features are intentionally excluded from Version 0.1.

- AI Analysis
- Planner Logic
- Writer Logic
- Knowledge Graph
- SEO Analysis
- Content Generation

---

## Design Decisions

Collector only collects evidence.

Collector never interprets search data.

Knowledge construction belongs to Planner.

Content creation belongs to Writer.

---

## Future

Next milestone

Version 0.2

- Project Structure
- Core Collectors
- Evidence Storage
- Evidence Export
- Initial NAVER Integration
