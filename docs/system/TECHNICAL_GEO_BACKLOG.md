# GEO_BACKLOG.md

# GEO Backlog

## 목적

이 문서는 robo5의 GEO(Generative Engine Optimization) 구현 계획을 관리한다.

robo5는 단순한 SEO 사이트가 아니다.

Knowledge First

Learning First

Entity First

철학을 기반으로

AI와 사용자가

콘텐츠를

"페이지"

가 아니라

"지식"

으로 탐험하도록 만드는 것이 목적이다.

본 문서는

- GEO_TECHNICAL_CONSTITUTION.md
- GEO_SYSTEM_ARCHITECTURE.md

를 구현하기 위한 실제 작업 목록이다.

---

# 현재 상태

현재 robo5는

정적 JSON 구조

Category

Tag

Flow

Related Content

등을 기반으로

기초적인 Discovery 구조는 갖추고 있다.

그러나

Knowledge Graph

Learning Path

Entity Network

는 아직 초기 단계이다.

---

# 구현 완료

현재 구현된 요소

- Static JSON 구조
- Category
- Tag
- FlowType
- Related Content
- Category Helper
- CategorySlug Helper
- Sidebar Discovery
- Flow Section
- URL 기반 콘텐츠 탐색

---

# GEO Backlog

## Priority A

### G-01 Knowledge Node 정의

현재

콘텐츠가

Page 중심이다.

목표

모든 콘텐츠를

Knowledge Node

기준으로 정의한다.

Node는

페이지보다

개념을 의미한다.

---

### G-02 Knowledge Layer 분리

Presentation Layer

Knowledge Layer

를 완전히 분리한다.

UI 변경이

Knowledge를 변경하지 않아야 한다.

---

### G-03 Learning Path

현재

related article

수준이다.

목표

사용자가

순차적으로 학습 가능한

Learning Path를 제공한다.

예

ETF 기초

↓

ETF 종류

↓

ETF 위험

↓

ETF 포트폴리오

↓

ETF 세금

---

### G-04 Entity Graph

현재

텍스트 연결 중심이다.

목표

Entity 간 관계를 명확하게 정의한다.

예

달러

↓

환율

↓

미국채

↓

ETF

↓

금리

---

## Priority B

### G-05 Topic Cluster

각 Topic을

Hub 형태로 구성한다.

예

환율

↓

원인

↓

영향

↓

투자

↓

관련 ETF

↓

관련 뉴스

---

### G-06 Related Graph

현재 Related는

단순 리스트이다.

향후

관계 강도 기반으로

연결한다.

---

### G-07 Knowledge Metadata

Node마다

학습 메타데이터를 가진다.

예

difficulty

learningOrder

parent

children

prerequisite

estimatedReadingTime

---

### G-08 Exploration Engine

사용자가

다음에 읽어야 할 글을

지식 흐름으로 추천한다.

---

## Priority C

### G-09 Knowledge Graph JSON

Knowledge Layer를

JSON 기반으로 관리한다.

---

### G-10 AI Citation Layer

AI가

인용하기 쉬운

Knowledge Summary를 제공한다.

---

### G-11 Entity Alias

동일 개념을

여러 표현으로 연결한다.

예

달러

USD

미국 달러

미화

---

### G-12 Cross Topic Discovery

다른 주제와

자연스럽게 연결한다.

예

환율

↓

금리

↓

물가

↓

ETF

↓

AI

---

# 완료 기준

GEO 완료란

페이지가 많아지는 것이 아니다.

Knowledge Graph가 성장하는 것이다.

AI는

각 페이지가 아니라

Knowledge Network를 이해할 수 있어야 한다.

사용자는

검색해서 들어와도

하나의 글만 읽고 끝나지 않고

자연스럽게

지식을 탐험해야 한다.

---

# 제외 대상

다음 항목은

Technical SEO에서 관리한다.

- robots
- sitemap
- metadata
- canonical
- hreflang
- JSON-LD
- llms.txt

위 항목은

TECHNICAL_SEO_BACKLOG.md

에서 관리한다.

---

# 장기 목표

robo5는

콘텐츠 저장소가 아니다.

Knowledge Operating System이다.

콘텐츠는

Knowledge를 표현하는 하나의 Presentation Layer일 뿐이다.

궁극적으로 robo5는

- Knowledge Graph
- Learning Engine
- Discovery Engine
- AI Native Knowledge Platform

으로 진화한다.