# AI_WORK_RULES.md

# GEO Search Evidence Collector

Version 1.0

---

# Purpose

이 프로젝트의 목적은 Search Evidence를 수집하는 것이다.

Collector는 검색 결과를 분석하는 AI가 아니다.

Collector는 검색 현장의 Evidence를 수집하고 정리하여
NotebookLM과 GEO Planner가 사용할 수 있도록 전달한다.

모든 작업은 이 목적을 최우선으로 한다.

---

# Core Principle

> Collect evidence.
>
> Do not interpret.

AI는 Evidence를 분석하거나 추론하지 않는다.

---

# Primary Responsibility

Collector의 책임은 다음과 같다.

- Search Evidence 수집
- Search Evidence 저장
- Search Evidence Export

그 외의 역할은 수행하지 않는다.

---

# Collector MUST

항상 다음을 우선한다.

- Raw Data
- Original Source
- Reproducibility
- Source Traceability

---

# Collector MUST NOT

다음을 수행해서는 안 된다.

- 검색 의도 분석
- 질문 생성
- 지식 설계
- Hub 설계
- Node 설계
- SEO 전략 작성
- 콘텐츠 작성
- AI 추론

Collector는 Planner 역할을 대신하지 않는다.

---

# Development Principles

## 1. Evidence First

모든 기능은 Search Evidence 수집을 우선한다.

새로운 기능을 추가할 때

항상

"Evidence 수집에 필요한가?"

를 먼저 판단한다.

---

## 2. AI Optional

Collector는 AI 없이 동작해야 한다.

AI는 필수가 아니다.

AI가 없어도 Collector는 정상 동작해야 한다.

---

## 3. Source Independent

Collector는 특정 검색엔진에 종속되지 않는다.

지원 가능한 Source 예시

- NAVER
- Google
- Bing
- Reddit
- YouTube

모든 Source는 동일한 Evidence 구조로 변환한다.

---

## 4. Raw Before Processed

원본 데이터를 먼저 저장한다.

가공 데이터는 원본을 대체하지 않는다.

---

## 5. Reproducibility

동일한 입력은

동일한 구조의 Evidence를 생성해야 한다.

---

## 6. Minimal Cost

항상

최소 비용

최대 효율

을 우선한다.

유료 AI 호출보다

코드로 해결 가능한 방법을 우선한다.

---

# Coding Rules

새 기능은 반드시

다음 순서로 구현한다.

Input

↓

Collection

↓

Validation

↓

Storage

↓

Export

절대로

Collection 과정에서

AI 추론을 수행하지 않는다.

---

# Data Policy

Evidence는 삭제하지 않는다.

Evidence는 수정하지 않는다.

Evidence는 원본 그대로 저장한다.

추가 데이터는 새로운 파일로 저장한다.

---

# Architecture Boundary

Collector는

Search Layer

까지만 담당한다.

NotebookLM은

Knowledge Preparation

을 담당한다.

Planner는

Knowledge Architecture

를 담당한다.

Writer는

Content Creation

을 담당한다.

각 시스템은 자신의 역할만 수행한다.

---

# Decision Rule

새로운 기능을 구현하기 전에

반드시 다음 질문을 한다.

이 기능은

Search Evidence를 더 정확하게 수집하기 위한 기능인가?

YES

→ 구현 가능

NO

→ 구현하지 않는다.

---

# Final Principle

Collector는

Search Engine을 대신하지 않는다.

Collector는

AI를 대신하지 않는다.

Collector는

Planner를 대신하지 않는다.

Collector는

Evidence를 가장 정확하게 전달하는 도구이다.

One Responsibility Per Module

하나의 모듈은 하나의 책임만 가진다.

검색량 수집 모듈은 검색량만 담당한다.

자동완성 수집 모듈은 자동완성만 담당한다.

URL 수집 모듈은 URL만 담당한다.

Evidence Export는 Export만 담당한다.
