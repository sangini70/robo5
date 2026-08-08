# ADMIN_SEARCH_ARCHITECTURE

Status: Approved
Version: 1.2
Last Updated: 2026-08-08

# Purpose

관리자 검색(Admin Search)의 표준 아키텍처를 정의한다.

이 문서는 다음 사항을 정의한다.

- Firestore 검색 전략
- searchIndex 생성 규칙
- Firestore Query 구조
- Generated Metadata 정책
- Source of Truth 유지
- 관리자 검색 확장 방향

---

# 관리자 검색 아키텍처

## 목적

관리자에서 title 또는 slug로 글을 빠르게 찾되,
검색할 때마다 Firestore 전체 컬렉션을 읽지 않는다.

검색 성능을 높이면서도
기존 Source of Truth와 데이터 구조를 유지하는 것이 목적이다.

Source of Truth는 항상 Firestore이다.

---

# 핵심 원칙

- Source of Truth는 Firestore이다.
- title과 slug는 원본(Source) 데이터이다.
- searchIndex는 Generated Metadata이다.
- 사용자는 searchIndex를 직접 수정하지 않는다.
- title 또는 slug 변경 시 searchIndex를 자동 재생성한다.
- Firestore Query는 searchIndex.tokens만 사용한다.
- searchIndex는 언제든 title과 slug에서 다시 생성할 수 있다.

---

# 데이터 구조

```json
{
  "title": "2026년 국민연금 보험료 인상",
  "slug": "national-pension-premium-2026",

  "searchIndex": {
    "title": [
      "국민",
      "국민연",
      "국민연금",
      "보험",
      "보험료",
      "인상"
    ],

    "slug": [
      "nat",
      "nati",
      "nation",
      "national",

      "pen",
      "pens",
      "pension",

      "pre",
      "prem",
      "premium",

      "2026"
    ],

    "tokens": [
      "국민",
      "국민연",
      "국민연금",
      "보험",
      "보험료",
      "인상",

      "nat",
      "nati",
      "nation",
      "national",

      "pen",
      "pens",
      "pension",

      "pre",
      "prem",
      "premium",

      "2026"
    ]
  }
}
```

---

# searchIndex 역할

## title

title에서 생성된 검색 토큰이다.

디버깅 및 생성 규칙 확인에 사용한다.

---

## slug

slug에서 생성된 검색 토큰이다.

디버깅 및 생성 규칙 확인에 사용한다.

---

## tokens

Firestore Query 전용 배열이다.

관리자 검색은 항상 이 배열만 사용한다.

title과 slug에서 생성된 모든 검색 토큰을 하나로 합친다.

동일 토큰은 제거한다.

---

# Generated Metadata 원칙

다음 데이터는 모두 Generated Metadata이다.

- searchIndex.title
- searchIndex.slug
- searchIndex.tokens

이 값들은 언제든

title
↓
slug

를 기준으로 다시 생성할 수 있다.

Generated Metadata는 Source of Truth가 아니다.

사람이 직접 수정하지 않는다.

---

# 저장 흐름

```text
title 수정
↓
slug 수정
↓
buildSearchIndex()
↓
searchIndex 생성
↓
Firestore 저장
```

searchIndex는 Firestore Write 직전에
자동 생성한다.

---

# 검색 흐름

```text
관리자 검색
↓
검색어 정규화
↓
buildSearchToken()
↓
searchIndex.tokens Query
↓
일치하는 문서 반환
↓
Edit
↓
저장
↓
searchIndex 재생성
```

---

# Firestore Query

관리자 검색은 다음 Query를 사용한다.

```ts
where(
  "searchIndex.tokens",
  "array-contains",
  normalizedToken
)
```

복수 토큰 검색은

```ts
array-contains-any
```

를 사용할 수 있다.

Firestore Full Scan은 사용하지 않는다.

---

# searchIndex 생성 규칙

모든 토큰은 먼저 정규화한다.

- lowercase
- trim
- 공백 정리
- 특수문자 정리

---

## title

공백 기준으로 단어를 분리한다.

각 단어마다 Prefix Token을 생성한다.

예)

```
국민연금 보험료 인상
```

↓

```
국
국민
국민연
국민연금

보
보험
보험료

인
인상
```

---

## slug

"-" 기준으로 Segment를 분리한다.

각 Segment마다 Prefix Token을 생성한다.

예)

```
national-pension-premium-2026
```

↓

```
nat
nati
nation
national

pen
pens
pension

pre
prem
premium

2026
```

동일 토큰은 제거한다.

---

# Deterministic Rule

searchIndex 생성 규칙은 항상 동일해야 한다.

동일한

- title
- slug

는

항상 동일한 searchIndex를 생성해야 한다.

Save

Edit

Migration

모두 동일한 결과를 생성해야 한다.

---

# Single Helper Rule

searchIndex 생성 로직은 프로젝트 전체에서
하나의 Helper만 사용한다.

예)

```
buildSearchIndex()
```

다음 작업은 모두 동일 Helper를 사용한다.

- Save
- Edit
- Migration

생성 규칙을 여러 위치에 중복 구현하지 않는다.

---

# Search Token Helper

검색어 역시 동일한 규칙으로 정규화한다.

예)

```
buildSearchToken()
```

검색 시 사용하는 토큰 생성 규칙과

searchIndex 생성 규칙은 항상 동일해야 한다.

---

# Migration 원칙

기존 Firestore Posts에는 searchIndex가 존재하지 않는다.

Migration은 1회 수행한다.

Migration은

title
↓
slug
↓
buildSearchIndex()
↓
Firestore Update

순서로 수행한다.

Migration 이후에는

Save/Edit 시 자동으로 searchIndex를 유지한다.

---

# 구현 단계

## Phase 1

- buildSearchIndex() Helper 작성
- buildSearchToken() Helper 작성
- Save/Edit에 searchIndex 생성 적용

---

## Phase 2

- 기존 Posts Migration
- searchIndex Backfill

---

## Phase 3

- 관리자 검색을 searchIndex 기반으로 변경
- Firestore Full Scan 제거

---

## Phase 4

- Pagination 정리
- 필요 시 관리자 Filter 확장

---

# 장점

- Firestore Full Scan 제거
- Firestore Read 비용 감소
- Query 단순화
- Source of Truth 유지
- Generated Metadata 유지
- 검색 속도 향상
- 콘텐츠 증가에도 확장 가능
- 별도 검색 시스템 없이 Firestore만으로 운영 가능

---

# Architecture Summary

```text
Article
│
├── title
├── slug
│
▼

Generated Metadata

searchIndex
├── title
├── slug
└── tokens

        │
        ▼

Firestore Query

searchIndex.tokens

        │
        ▼

Admin Search
```

---

# Source of Truth

```text
Article
      ↓
Generated Metadata(searchIndex)
      ↓
Admin Search
```

Article(title, slug)이 유일한 Source of Truth이다.

searchIndex는 검색을 위한 Generated Metadata이며
Source로 사용하지 않는다.

---

# 최종 원칙

관리자 검색은

Source

↓

Generated Metadata

↓

Query

↓

Presentation

순서를 유지한다.

Source를 우회하는 새로운 데이터 저장소를 만들지 않는다.

searchIndex는 검색을 위한 파생 데이터이며,
언제든 Source(title, slug)에서 재생성할 수 있어야 한다.

buildSearchIndex()는 searchIndex 생성의 유일한 Canonical Helper이다.

buildSearchToken()은 관리자 검색 Query 생성의 유일한 Canonical Helper이다.

searchIndex 생성 규칙과 Query 생성 규칙은 항상 동일한 정규화 규칙을 사용한다.