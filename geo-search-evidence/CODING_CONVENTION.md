# CODING_CONVENTION.md

# GEO Search Evidence Collector

Version 1.0

---

# Purpose

이 문서는 GEO Search Evidence Collector의 코딩 규칙을 정의한다.

모든 개발자는 동일한 규칙을 따른다.

코드는 사람이 읽기 쉬워야 하며,
AI도 쉽게 이해할 수 있어야 한다.

---

# Core Principles

## 1. Readability First

코드는 짧은 것보다 읽기 쉬운 것이 우선이다.

---

## 2. Single Responsibility

- 하나의 함수는 하나의 역할만 수행한다.
- 하나의 파일은 하나의 기능만 담당한다.
- 하나의 모듈은 하나의 책임만 가진다.

---

## 3. Explicit Over Implicit

동작을 숨기지 않는다.

명확한 이름과 구조를 사용한다.

---

## 4. Small Modules

파일은 가능한 작게 유지한다.

기능이 커지면 새로운 파일로 분리한다.

---

## 5. Low Coupling

모듈 간 의존성을 최소화한다.

---

## 6. High Cohesion

관련된 기능은 같은 모듈에 배치한다.

---

# Naming Convention

## Folder

kebab-case

예시

```
collectors/

storage/

exporters/

types/

utils/

search-volume/

related-keywords/
```

---

## File

kebab-case

예시

```
search-volume-collector.ts

autocomplete-collector.ts

storage-service.ts

export-service.ts

config-loader.ts
```

---

## Variable

camelCase

예시

```ts
searchVolume

keywordList

outputPath

collectorResult
```

---

## Function

동사 + 목적어

camelCase

예시

```ts
collectSearchVolume()

collectAutocomplete()

saveEvidence()

loadConfig()

validateKeyword()

exportMarkdown()
```

---

## Boolean

is

has

can

should

예시

```ts
isValid

hasError

canRetry

shouldExport
```

---

## Class

PascalCase

예시

```ts
class SearchVolumeCollector

class StorageService

class ExportService
```

---

## Interface

PascalCase

I Prefix 사용하지 않는다.

예시

```ts
interface SearchVolume

interface Evidence

interface Keyword
```

---

## Type

PascalCase

예시

```ts
type CollectorResult

type SourceType

type ExportFormat
```

---

## Enum

PascalCase

예시

```ts
enum Language

enum Country

enum SourceType
```

---

## Constant

UPPER_SNAKE_CASE

예시

```ts
DEFAULT_TIMEOUT

MAX_RETRY

API_VERSION

DEFAULT_LANGUAGE
```

---

# Import Order

항상 다음 순서를 따른다.

1. Node Built-in

2. External Package

3. Internal Module

4. Type Import

예시

```ts
import fs from "node:fs";

import axios from "axios";

import { saveEvidence } from "../storage/storage-service";

import type { Evidence } from "../types/evidence";
```

---

# Function Rules

하나의 함수는 하나의 기능만 수행한다.

권장 길이

30줄 이하

50줄 이상이면 분리를 검토한다.

---

# Guard Clause

깊은 중첩을 만들지 않는다.

좋은 예

```ts
if (!keyword) {
    return;
}
```

나쁜 예

```ts
if (keyword) {
    if (...) {
        if (...) {

        }
    }
}
```

---

# Magic Number

숫자를 직접 사용하지 않는다.

좋은 예

```ts
const MAX_RETRY = 3;
```

나쁜 예

```ts
retry(3);
```

---

# Async Rule

async / await 사용

Promise Chain은 지양한다.

---

# Error Handling

외부 호출은 반드시

try / catch

를 사용한다.

오류를 무시하지 않는다.

---

# Logging

오류는 반드시 기록한다.

예시

```ts
console.error()

console.warn()

console.info()
```

---

# Comment Rule

코드를 설명하지 않는다.

이유를 설명한다.

좋은 예

```ts
// NAVER API는 요청 제한이 있으므로
// 재시도 전에 일정 시간 대기한다.
```

나쁜 예

```ts
// 데이터를 저장한다.
```

---

# Collector Rule

Collector는

수집만 수행한다.

저장을 수행하지 않는다.

Export를 수행하지 않는다.

---

# Storage Rule

Storage는

저장만 수행한다.

Collector를 호출하지 않는다.

Export를 수행하지 않는다.

---

# Export Rule

Export는

출력만 수행한다.

수집하지 않는다.

저장하지 않는다.

---

# Dependency Rule

모듈 간 순환 참조(Circular Dependency)를 만들지 않는다.

의존성은 항상 한 방향으로 유지한다.

---

# Testing Rule

새로운 기능은

정상 동작을 확인한 후 Merge한다.

---

# Final Checklist

코드를 작성한 후 반드시 확인한다.

- 읽기 쉬운가?
- 하나의 책임만 가지는가?
- 테스트하기 쉬운가?
- 확장하기 쉬운가?
- 재사용 가능한가?
- 불필요한 의존성이 없는가?

모든 항목이 YES일 때만 코드를 유지한다.