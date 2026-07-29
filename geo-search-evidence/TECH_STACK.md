# TECH_STACK.md

# GEO Search Evidence Collector

Version 1.0

---

# Philosophy

기술은 목적이 아니다.

기술은 Search Evidence를 가장 안정적이고 효율적으로 수집하기 위한 도구이다.

새로운 기술보다

안정성

유지보수성

확장성

낮은 운영비용을 우선한다.

---

# Technology Principles

우선순위

1. Simplicity
2. Stability
3. Low Cost
4. Maintainability
5. Extensibility

---

# Runtime

Node.js

선정 이유

- 안정성
- 풍부한 생태계
- HTTP 처리에 적합
- TypeScript 지원

---

# Language

TypeScript

선정 이유

- 타입 안정성
- 유지보수 용이
- 대규모 확장에 적합

---

# Package Manager

npm

선정 이유

- Node.js 기본 지원
- 높은 호환성

---

# Framework

초기 버전은 Framework를 사용하지 않는다.

Collector는 단순한 데이터 수집 시스템이다.

불필요한 Framework 의존성을 추가하지 않는다.

---

# HTTP Client

fetch (Node Native)

필요 시 axios를 사용할 수 있다.

기본은 Node 내장 fetch를 우선한다.

---

# Storage

JSON

Markdown

선정 이유

- 사람이 읽기 쉽다.
- NotebookLM 활용이 쉽다.
- Git 관리가 용이하다.

---

# File System

Node.js fs

Evidence는

파일 기반으로 저장한다.

---

# Configuration

.env

환경변수 관리

예시

- API KEY
- Client Secret

---

# Logging

console

초기 버전은

단순 로그를 사용한다.

필요 시 Logger를 추가한다.

---

# API

NAVER SearchAd API

Google API (Future)

Bing API (Future)

---

# Browser Automation

필요한 경우

Playwright

선정 이유

- Chromium
- Firefox
- WebKit 지원
- 자동화 안정성

초기 버전에서는 사용하지 않는다.

---

# AI

사용하지 않는다.

Collector는

AI 없이 동작한다.

NotebookLM은

별도 시스템이다.

---

# Version Control

Git

GitHub

---

# Folder Strategy

기능(Function) 중심 구조를 사용한다.

예시

collectors/

storage/

exporters/

types/

utils/

---

# Coding Style

- Single Responsibility
- Small Module
- Low Coupling
- High Cohesion

---

# Data Format

JSON

Markdown

UTF-8

---

# Error Handling

모든 외부 호출은

예외 처리를 수행한다.

실패한 Source가

전체 시스템을 중단시키지 않아야 한다.

---

# Future Stack

필요 시 추가

- Google Search API
- Reddit API
- YouTube API
- SQLite
- PostgreSQL

단,

실제 요구사항이 생기기 전까지

추가하지 않는다.

---

# Stack Selection Rule

새로운 기술을 도입하기 전에

다음 질문을 한다.

이 기술이

Search Evidence를

더 안정적으로

더 단순하게

더 저렴하게

수집하도록 만드는가?

YES

→ 도입 가능

NO

→ 도입하지 않는다.