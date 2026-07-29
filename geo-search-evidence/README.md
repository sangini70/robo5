# GEO Search Evidence Collector

## Overview

GEO Search Evidence Collector는 검색엔진의 데이터를 분석하거나 해석하는 AI가 아니다.

이 프로젝트의 목적은 **검색 현장에서 발견되는 Search Evidence(검색 증거)를 정확하게 수집하고 정리하여 GEO Knowledge Platform의 다음 단계에 전달하는 것**이다.

Collector는 판단하지 않는다.

Collector는 증거만 수집한다.

모든 해석과 지식 설계는 별도의 시스템(NotebookLM, GEO Planner)이 담당한다.

---

# Philosophy

Search Engine ≠ Knowledge

검색엔진은 사람들이 무엇을 궁금해하는지 보여주는 신호(Signal)를 제공한다.

GEO는 검색엔진을 콘텐츠 생산기가 아니라 **질문과 관심을 발견하는 Evidence Source**로 사용한다.

Collector는 이 Evidence를 최대한 있는 그대로 수집한다.

---

# Project Goal

사용자가 하나의 Hub Keyword를 입력하면,

검색엔진에서 확인 가능한 Search Evidence를 자동으로 수집하여

NotebookLM과 GEO Planner가 사용할 수 있는 형태로 저장한다.

---

# Scope

Collector는 다음만 수행한다.

- Search Volume 수집
- Related Keywords 수집
- Autocomplete 수집
- People Also Search 수집
- Popular Topics 수집
- SERP URL 수집
- Evidence Export

Collector는 다음을 수행하지 않는다.

- 글 작성
- 검색 의도 해석
- Planner 설계
- Knowledge Graph 생성
- SEO 전략 생성
- AI 추론

---

# Workflow

```
Hub Keyword

↓

Search Evidence Collector

↓

Evidence Package

↓

NotebookLM

↓

GEO Planner

↓

Writer

↓

Website
```

---

# Evidence

Collector가 생성하는 모든 데이터는 Search Evidence이다.

예시

```
Evidence/

exchange-rate/

01_search_volume.json

02_related_keywords.json

03_autocomplete.md

04_people_also_search.md

05_popular_topics.md

06_serp_urls.md
```

Collector는 Evidence를 수정하거나 해석하지 않는다.

---

# Design Principles

## 1. Evidence First

모든 데이터는 원본 Evidence를 우선한다.

---

## 2. AI Optional

Collector는 AI 없이 동작할 수 있어야 한다.

AI는 이후 단계에서 선택적으로 사용한다.

---

## 3. Source Independent

특정 검색엔진에 종속되지 않는다.

지원 가능한 Source 예시

- NAVER
- Google
- Bing
- YouTube
- Reddit

모든 Source는 동일한 Evidence 구조로 변환된다.

---

## 4. Raw Before Analysis

원본 데이터를 먼저 저장한다.

분석은 이후 단계에서 수행한다.

---

## 5. Reproducibility

동일한 입력은 동일한 Evidence 구조를 생성해야 한다.

---

# Future Roadmap

Version 0.1

- NAVER Search Volume
- Related Keywords
- Autocomplete
- People Also Search
- SERP URLs
- Evidence Export

Version 0.2

- Multi Keyword Collection
- Batch Export
- Markdown Package

Version 0.3

- NotebookLM Package Export

Version 1.0

- Google Support
- Bing Support
- Reddit Support
- YouTube Support

---

# Relationship to GEO

GEO Search Evidence Collector는 GEO 프로젝트의 첫 번째 단계이다.

```
Search

↓

Evidence

↓

Knowledge

↓

Content
```

Collector는 Search를 담당한다.

Knowledge는 Planner가 담당한다.

Content는 Writer가 담당한다.

각 시스템은 자신의 역할만 수행한다.

---

# Core Principle

> Don't interpret.
>
> Collect evidence faithfully.

Search reveals demand. Evidence reveals questions. Knowledge provides answers.