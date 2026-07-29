# SYSTEM_ARCHITECTURE.md

# GEO Search Evidence Collector

Version 1.0

---

# System Overview

GEO Search Evidence Collector는

Search Engine으로부터 Search Evidence를 수집하여

GEO Knowledge Platform으로 전달하는 시스템이다.

Collector는

검색 데이터를 해석하지 않는다.

Collector는

검색 데이터를 구조화된 Evidence로 변환한다.

---

# Overall Architecture

```
                    USER

                      │

                      ▼

             Hub Keyword Input

                      │

                      ▼

        GEO Search Evidence Collector

                      │

     ┌────────────────────────────────────┐
     │                                    │
     │            Collection Layer        │
     │                                    │
     └────────────────────────────────────┘

                      │

                      ▼

            Validation Layer

                      │

                      ▼

             Storage Layer

                      │

                      ▼

             Export Layer

                      │

                      ▼

             Evidence Package

                      │

                      ▼

               NotebookLM

                      │

                      ▼

              GEO Planner

                      │

                      ▼

                 Writer

                      │

                      ▼

                 Website
```

---

# Layer Architecture

## 1. Input Layer

역할

사용자로부터

Hub Keyword를 입력받는다.

예시

```
환율

코인세금

나스닥

ETF
```

Input Layer는

검색을 수행하지 않는다.

---

## 2. Collection Layer

Collector의 핵심이다.

Source로부터 Evidence를 수집한다.

예시

NAVER

Google

Bing

Reddit

YouTube

Collection Layer는

각 Source의 데이터를

있는 그대로 가져온다.

분석하지 않는다.

---

## 3. Validation Layer

수집된 데이터를 검증한다.

예시

- 중복 제거

- Null 확인

- 형식 검증

- 저장 가능한 형태 변환

Validation은

의미를 분석하지 않는다.

---

## 4. Storage Layer

Raw Evidence를 저장한다.

원본은 절대 삭제하지 않는다.

모든 Evidence는

재현 가능해야 한다.

---

## 5. Export Layer

Evidence를

NotebookLM과

Planner가 사용할 수 있도록

내보낸다.

---

# Source Architecture

```
Source

├── NAVER

├── Google

├── Bing

├── Reddit

└── YouTube
```

모든 Source는

동일한 Evidence Format으로 변환한다.

---

# Evidence Structure

```
Evidence/

exchange-rate/

search_volume.json

related_keywords.json

autocomplete.md

people_also_search.md

popular_topics.md

serp_urls.md

metadata.json
```

Evidence는

Raw Data를 우선한다.

---

# Collector Boundary

Collector는

다음까지만 수행한다.

```
Search

↓

Evidence
```

Collector는

Knowledge를 생성하지 않는다.

---

# GEO Architecture

```
Search

↓

Evidence

↓

Knowledge

↓

Content
```

각 단계는

독립적인 시스템이다.

---

# Responsibility

Collector

↓

Evidence Collection

NotebookLM

↓

Knowledge Preparation

Planner

↓

Knowledge Architecture

Writer

↓

Content Creation

Website

↓

Content Delivery

---

# Processing Flow

```
Hub Keyword

↓

Source Selection

↓

Evidence Collection

↓

Validation

↓

Storage

↓

Export

↓

NotebookLM

↓

Planner
```

---

# Design Principles

## Single Responsibility

각 Layer는

하나의 책임만 가진다.

---

## Source Independent

Source가 변경되어도

Collector의 구조는 변경되지 않는다.

---

## Raw First

원본 데이터를

최우선으로 저장한다.

---

## Reproducible

동일한 입력은

동일한 구조를 생성한다.

---

## AI Independent

Collector는

AI 없이

동작 가능해야 한다.

---

# Future Extension

향후

새로운 Source는

Collection Layer에만 추가한다.

예시

```
NAVER

↓

Google

↓

Amazon

↓

TikTok

↓

X

↓

Facebook
```

다른 Layer는

수정하지 않는다.

---

# Architecture Rule

Collector는

Search Engine을 대체하지 않는다.

Collector는

AI를 대체하지 않는다.

Collector는

Planner를 대체하지 않는다.

Collector는

Search Evidence를

가장 정확하게 전달하는 시스템이다.