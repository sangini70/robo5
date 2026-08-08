# ADMIN_SEARCH_ARCHITECTURE.md

# ADMIN_SEARCH_ARCHITECTURE

Status: Approved
Version: 1.0
Last Updated: 2026-08-08

Purpose

관리자 검색(Search)의 표준 아키텍처를 정의한다.

이 문서는

- Firestore 검색 전략
- searchIndex 생성 규칙
- Source of Truth 유지
- 관리자 검색 확장 방향

을 정의한다.

# 관리자 검색 아키텍처

## 목적

관리자에서 제목 또는 slug로 글을 빠르게 찾되, 검색할 때마다 Firestore
전체 컬렉션을 읽지 않는다.

Source of Truth는 계속 Firestore를 유지한다.

------------------------------------------------------------------------

# 핵심 원칙

-   Source of Truth: Firestore
-   searchIndex는 Generated Metadata이다.
-   사람이 searchIndex를 직접 수정하지 않는다.
-   title 또는 slug 변경 시 searchIndex를 자동 재생성한다.

------------------------------------------------------------------------

# 데이터 구조 예시

``` json
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
      "national",
      "pension",
      "premium",
      "2026"
    ]
  }
}
```

------------------------------------------------------------------------

# 저장 흐름

title 수정 ↓ slug 수정 ↓ searchIndex 자동 생성 ↓ Firestore 저장

------------------------------------------------------------------------

# 검색 흐름

관리자 검색 ↓ Firestore searchIndex 조회 ↓ 일치하는 글만 반환 ↓ Edit ↓
해당 글 수정 ↓ 저장 시 searchIndex 자동 재생성

------------------------------------------------------------------------

# 구현 단계

## Phase 1

-   searchIndex 생성
-   관리자 검색을 searchIndex 기반으로 변경
-   Firestore Full Scan 제거

## Phase 2

-   prefix 토큰 최적화
-   title / slug 토큰 품질 개선

## Phase 3

-   status, language 등 관리자 필터 확장(필요 시)

------------------------------------------------------------------------

# 장점

-   Firestore 전체 스캔 제거
-   Source of Truth 유지
-   관리자 검색 속도 향상
-   콘텐츠가 수천\~수만 건으로 증가해도 확장 가능
-   별도 검색 시스템 없이 Firestore 기반 유지

------------------------------------------------------------------------

# 원칙

Article ↓ Generated Metadata(searchIndex) ↓ Admin Search

searchIndex는 검색을 위한 파생 데이터이며, Article의 원본(Source of
Truth)은 항상 Firestore이다.
