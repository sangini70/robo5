import type { ExportFormat } from "../types";

export const APP_NAME = "GEO Search Evidence Collector";
export const APP_VERSION = "0.1.0";

export const DEFAULT_LANGUAGE = "ko";
export const DEFAULT_COUNTRY = "KR";
export const DEFAULT_COLLECTOR_VERSION = APP_VERSION;

export const ENV_NAMES = {
  NODE_ENV: "NODE_ENV",
  LOG_LEVEL: "LOG_LEVEL",
  NAVER_API_KEY: "NAVER_API_KEY",
  NAVER_SECRET_KEY: "NAVER_SECRET_KEY",
  NAVER_CUSTOMER_ID: "NAVER_CUSTOMER_ID",
} as const;

export const SUPPORTED_EXPORT_FORMATS = ["json", "markdown", "notebooklm"] as const satisfies readonly ExportFormat[];

export const DEFAULT_EXPORT_FORMAT: ExportFormat = "json";

export const NODE_ENV_VALUES = ["development", "test", "production"] as const;
export const LOG_LEVEL_VALUES = ["silent", "error", "warn", "info", "debug"] as const;
