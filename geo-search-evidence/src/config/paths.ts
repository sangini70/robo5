import path from "node:path";

export const ROOT_DIR = process.cwd();
export const SRC_DIR = path.resolve(ROOT_DIR, "src");
export const DIST_DIR = path.resolve(ROOT_DIR, "dist");
export const DOCS_DIR = path.resolve(ROOT_DIR, "docs");
export const EVIDENCE_DIR = path.resolve(ROOT_DIR, "evidence");
export const OUTPUT_DIR = path.resolve(ROOT_DIR, "output");
export const TESTS_DIR = path.resolve(ROOT_DIR, "tests");
export const SCRIPTS_DIR = path.resolve(ROOT_DIR, "scripts");

export const PACKAGE_JSON_PATH = path.resolve(ROOT_DIR, "package.json");
export const TSCONFIG_JSON_PATH = path.resolve(ROOT_DIR, "tsconfig.json");
export const CHANGELOG_PATH = path.resolve(ROOT_DIR, "CHANGELOG.md");
