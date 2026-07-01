# FEATURE_DECISION_GUIDE.md

# Feature Decision Guide

## 목적

이 문서는 robo5에서 새로운 기능을 추가하거나
기존 기능을 수정할 때 반드시 따라야 하는
의사결정 기준이다.

구현은 자유롭다.

그러나

무엇을 구현할 것인가는

본 문서의 기준을 통과해야 한다.

모든 구현은

AI_WORK_RULES.md

GEO_TECHNICAL_CONSTITUTION.md

GEO_SYSTEM_ARCHITECTURE.md

를 먼저 적용한 후

본 문서를 체크리스트로 사용한다.

---

Step X

## Source of Truth 확인

새로운 기능 또는 수정 대상의

Canonical Source(Source of Truth)를 먼저 확인한다.

□ Source of Truth가 이미 존재하는가?

□ 기존 Source를 수정하는가?

□ 새로운 Source를 만들고 있지는 않은가?

□ 동일 정책을 관리하는 Source가 둘 이상 생기지는 않는가?

□ Source of Truth가 명확하지 않다면 구현을 시작하지 않는다.


# Feature Decision Flow

새 기능 요청

↓

기능 목적 확인

↓

Knowledge Layer 영향 확인

↓

Presentation Layer 영향 확인

↓

Technical SEO 영향 확인

↓

GEO 영향 확인

↓

Static Architecture 유지 여부 확인

↓

구현

---

# Step 1

## 이 기능은 왜 존재하는가?

반드시 하나를 선택한다.

□ Knowledge 증가

□ Learning 지원

□ Discovery 강화

□ Technical SEO 개선

□ 운영 편의성

□ 성능 개선

□ 버그 수정

선택하지 못하면

기능을 추가하지 않는다.

---

# Step 2

## Knowledge Layer인가?

질문

이 기능은

지식을 표현하는가?

아니면

지식을 관리하는가?

예

Knowledge Layer

- Topic
- Entity
- Learning Path
- Category
- Flow
- Knowledge Metadata

Presentation Layer

- Card
- Button
- Layout
- Animation
- Color
- Typography

Knowledge Layer를

Presentation Layer와

혼합하지 않는다.

---

# Step 3

## Node가 존재하는가?

새로운 기능이

Node를 생성하는가?

Node를 연결하는가?

Node를 삭제하는가?

아무 것도 아니라면

UI 기능일 가능성이 높다.

---

# Step 4

## Learning Path를 강화하는가?

질문

사용자는

이 기능 때문에

다음 콘텐츠를

더 쉽게 탐험할 수 있는가?

YES

↓

계속 진행

NO

↓

재검토

---

# Step 5

## Discovery를 강화하는가?

아래 항목 중

하나 이상을 만족해야 한다.

□ Related Content

□ Topic Cluster

□ Entity

□ Flow

□ Category

□ Tag

□ Recommendation

□ Knowledge Graph

---

# Step 6

## Static First를 유지하는가?

다음을 확인한다.

□ Firestore를 공개 렌더링에 사용하지 않는다.

□ JSON 기반 구조를 유지한다.

□ 정적 렌더링을 우선한다.

□ Canonical Source를 유지한다.

Static 구조를 깨는 기능은

추가하지 않는다.

---

# Step 7

## Technical SEO 영향

확인 항목

□ canonical

□ metadata

□ robots

□ sitemap

□ JSON-LD

□ Breadcrumb

□ llms.txt

□ hreflang

영향이 있다면

TECHNICAL_SEO_BACKLOG.md를

함께 확인한다.

---

# Step 8

## GEO 영향

확인 항목

□ Knowledge Node

□ Learning Path

□ Topic Cluster

□ Entity

□ Discovery Flow

□ Knowledge Metadata

□ Related Graph

영향이 있다면

GEO_BACKLOG.md를

함께 확인한다.

---

# Step 9

## AI Native Architecture

질문

이 기능은

AI가 이해하기 쉬운가?

다음을 확인한다.

□ 의미가 명확한 데이터 구조

□ Entity 관계 유지

□ Metadata 존재

□ JSON 구조 유지

□ Knowledge 중심 설계

---

# Step 10

## 구현 여부

다음 조건을 모두 만족하면 구현한다.

□ 목적이 명확하다.

□ Knowledge를 해치지 않는다.

□ Static 구조를 유지한다.

□ SEO를 깨지 않는다.

□ GEO를 강화한다.

□ Learning을 강화한다.

□ Discovery를 강화한다.

---

# 구현 금지

다음 기능은 원칙적으로 금지한다.

- 단순 UI 장식

- 의미 없는 Animation

- 클릭 수만 늘리는 기능

- Page 중심 기능

- Firestore 공개 렌더링

- 중복 Metadata

- 중복 Sitemap

- 중복 Robots

- Knowledge와 무관한 기능

- SEO를 깨는 기능

- GEO를 약화시키는 기능

---

# 구현 우선순위

Priority 1

Knowledge

↓

Priority 2

Learning

↓

Priority 3

Discovery

↓

Priority 4

Technical SEO

↓

Priority 5

Presentation

---

# 최종 원칙

robo5는

Page를 만드는 프로젝트가 아니다.

Knowledge를 구축하는 프로젝트이다.

모든 Page는

Knowledge를 보여주는 하나의 Presentation Layer일 뿐이다.

새로운 기능은

UI가 아니라

Knowledge Graph를 성장시키는 방향으로 구현한다.