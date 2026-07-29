# PROJECT_STRUCTURE.md

# GEO Search Evidence Collector

Version: 1.0

---

# 목적

이 문서는 프로젝트의 실제 디렉터리 구조를 정의한다.

SYSTEM_ARCHITECTURE.md가 시스템의 역할과 계층을 정의한다면,

PROJECT_STRUCTURE.md는 이를 실제 프로젝트 구조로 구현하는 기준이다.

모든 개발자는 본 문서를 기준으로 디렉터리와 파일을 생성한다.

---

# 설계 원칙

- SYSTEM_ARCHITECTURE.md를 따른다.
- Layer와 Folder는 1:1 대응을 원칙으로 한다.
- 하나의 디렉터리는 하나의 책임만 가진다.
- 새로운 디렉터리는 반드시 Architecture 변경 후 추가한다.
- 구현보다 구조를 우선한다.

---

# Project Structure

```text
root/

│
├── docs/
│
├── src/
│   │
│   ├── input/
│   │
│   ├── collectors/
│   │
│   ├── validators/
│   │
│   ├── storage/
│   │
│   ├── exporters/
│   │
│   ├── shared/
│   │
│   ├── types/
│   │
│   ├── config/
│   │
│   └── index.ts
│
├── evidence/
│
├── output/
│
├── tests/
│
├── scripts/
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# Directory Responsibilities

## docs/

프로젝트 문서 관리

설계 문서

개발 문서

운영 문서

---

## src/

애플리케이션 소스코드

---

## src/input/

사용자로부터 입력을 받는 계층

예)

Hub Keyword

Project Option

CLI Input

---

## src/collectors/

Search Evidence 수집

예)

Search Volume

Autocomplete

Related Keyword

People Also Search

Popular Topic

SERP URL

Metadata

Collector만 존재한다.

AI는 존재하지 않는다.

---

## src/validators/

수집 결과 검증

필수 필드 확인

JSON 검증

중복 제거

오류 검출

---

## src/storage/

Evidence 저장

JSON 저장

파일 생성

디렉터리 생성

---

## src/exporters/

NotebookLM Export

Markdown Export

JSON Export

---

## src/shared/

공통 유틸리티

Logger

File Helper

Date Helper

Common Utility

---

## src/types/

TypeScript Type

Interface

Enum

---

## src/config/

환경설정

Constant

Environment

Configuration

---

## evidence/

Collector가 생성한 원본 Evidence

Source of Truth

AI가 수정하지 않는다.

---

## output/

Export 결과

NotebookLM

Markdown

Package

---

## tests/

단위 테스트

통합 테스트

---

## scripts/

개발용 스크립트

초기화

빌드

유틸리티

---

# 추가 규칙

새로운 Folder는 임의로 생성하지 않는다.

Folder 추가는

SYSTEM_ARCHITECTURE.md

↓

PROJECT_STRUCTURE.md

↓

구현

순서로 진행한다.

---

# Folder Naming Rule

모든 Folder는

kebab-case

를 사용한다.

예)

collectors

shared

output

tests

---

# Source of Truth

프로젝트 구조는

PROJECT_STRUCTURE.md

가 유일한 기준이다.

실제 프로젝트 구조는 항상 본 문서와 일치해야 한다.

문서와 프로젝트 구조가 다르면

문서를 먼저 수정하거나

사용자에게 변경을 제안한다.