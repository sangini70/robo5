import { LOG_LEVEL_VALUES, NODE_ENV_VALUES } from "./constants";

export type NodeEnv = (typeof NODE_ENV_VALUES)[number];
export type LogLevel = (typeof LOG_LEVEL_VALUES)[number];

export interface AppEnv {
  nodeEnv: NodeEnv;
  logLevel: LogLevel;
  naverApiKey: string;
  naverSecretKey: string;
  naverCustomerId: string;
}

function readOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function readRequiredEnv(name: string): string {
  const value = readOptionalEnv(name);
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isNodeEnv(value: string): value is NodeEnv {
  return (NODE_ENV_VALUES as readonly string[]).includes(value);
}

function isLogLevel(value: string): value is LogLevel {
  return (LOG_LEVEL_VALUES as readonly string[]).includes(value);
}

function resolveNodeEnv(value: string | undefined): NodeEnv {
  if (value === undefined) {
    return "development";
  }

  return isNodeEnv(value) ? value : "development";
}

function resolveLogLevel(value: string | undefined): LogLevel {
  if (value === undefined) {
    return "info";
  }

  return isLogLevel(value) ? value : "info";
}

export function loadEnv(): AppEnv {
  return {
    nodeEnv: resolveNodeEnv(readOptionalEnv("NODE_ENV")),
    logLevel: resolveLogLevel(readOptionalEnv("LOG_LEVEL")),
    naverApiKey: readRequiredEnv("NAVER_API_KEY"),
    naverSecretKey: readRequiredEnv("NAVER_SECRET_KEY"),
    naverCustomerId: readRequiredEnv("NAVER_CUSTOMER_ID"),
  };
}

export const env = loadEnv();

export { readOptionalEnv, readRequiredEnv };
