# TECHNICAL_SEO_BACKLOG.md

# Technical SEO Backlog

## 목적

이 문서는 robo5의 Technical SEO 개선 항목을 관리한다.

목적은 검색엔진과 AI 크롤러가 사이트를 안정적으로 크롤링하고,
정확하게 인덱싱하며,
구조화된 정보를 이해할 수 있도록 하는 것이다.

본 문서는

- GEO_TECHNICAL_CONSTITUTION.md
- GEO_SYSTEM_ARCHITECTURE.md

철학을 유지한 상태에서

Technical SEO 영역만 관리한다.

Knowledge Layer 설계는
GEO_BACKLOG.md에서 관리한다.

---

# 현재 상태

## 구현 완료

현재 구현되어 있는 항목

- Static JSON 기반 공개 렌더링
- Firestore와 공개 사이트 분리
- generateMetadata 적용
- canonical 적용
- Open Graph metadata
- Twitter metadata (일부)
- BlogPosting JSON-LD
- Organization JSON-LD
- WebSite JSON-LD
- URL 구조(category/tag/slug)
- H1/H2/H3 heading 구조
- 이미지 alt
- 정적 sitemap 생성
- robots route 구현

---

# 개선 Backlog

## Priority A (가장 먼저)

### A-01 robots Source 통합

현재

- app/robots.ts
- public/robots.txt

가 동시에 존재한다.

목표

robots 정책의 Canonical Source를 하나로 통일한다.

---

### A-02 sitemap Source 통합

현재

- app/sitemap.ts
- public/sitemap.xml

동시 존재 가능성이 있다.

목표

sitemap 생성 경로를 하나로 통합한다.

---

### A-03 llms.txt 추가

목적

AI 크롤러에게

- 사이트 목적
- 구조
- 콘텐츠 정책

을 명확히 전달한다.

---

### A-04 Search Result noindex

검색 결과 페이지는

검색 결과 자체를
검색엔진에 인덱싱하지 않도록 검토한다.

---

## Priority B

### B-01 BreadcrumbList Schema

추가 대상

- Article
- Category
- Tag

페이지

---

### B-02 일반 페이지 Metadata 보강

대상

- About
- Contact
- Privacy
- Calculator
- English Home

점검 항목

- canonical
- OG
- Twitter
- description

---

### B-03 hreflang

다국어 운영 시

언어 관계를 명확하게 정의한다.

---

## Priority C

### C-01 Article Schema 검토

현재 BlogPosting 중심이다.

Article 추가 필요성을 검토한다.

---

### C-02 Twitter Metadata 보강

일반 페이지에 대한 Twitter Card를 보강한다.

---

### C-03 Legacy 산출물 정리

중복 생성되는

- robots
- sitemap

산출물을 정리한다.

---

# 완료 기준

Technical SEO 완료란

- 검색엔진이 사이트를 안정적으로 크롤링한다.
- Canonical이 일관된다.
- Metadata가 모든 페이지에 존재한다.
- Structured Data가 정상 생성된다.
- AI 크롤러 접근 정책이 명확하다.

---

# 제외 대상

다음 항목은 본 문서에서 관리하지 않는다.

- Knowledge Node
- Learning Path
- Topic Cluster
- Entity
- Related Graph

위 항목은

GEO_BACKLOG.md

에서 관리한다.