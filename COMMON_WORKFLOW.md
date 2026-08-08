# COMMON_WORKFLOW.md

# 목적

이 문서는 프로젝트의 공통 작업 절차를 정의한다.

개별 작업지시문에서 프로젝트 문서 목록, 분석 절차, 수정 원칙,
검증 절차, 금지 사항을 반복해서 작성하지 않도록 하는 것이 목적이다.

모든 작업은 먼저 다음 두 문서를 적용한다.

1. AI_WORK_RULES.md
2. COMMON_WORKFLOW.md

AI_WORK_RULES.md는 프로젝트의 최상위 행동 규칙을 정의한다.

COMMON_WORKFLOW.md는

- 작업 유형 판단
- 관련 Canonical Document 선택
- 원인 및 영향 범위 분석
- 수정
- 검증
- 보고

의 공통 실행 절차를 정의한다.

모든 프로젝트 문서를 매 작업마다 읽지 않는다.

현재 작업과 관련된 Canonical Document만 선택하여 확인한다.

---

# 1. 작업 시작

먼저 사용자의 현재 요청을 분석한다.

다음을 확인한다.

- 현재 목표
- 현재 동작
- 기대 동작
- 문제 또는 변경 대상
- 원인 후보
- 영향 범위
- 작업 유형

작업 유형 예시

- 버그
- 기능
- UI
- UX
- 디자인
- 구조
- 데이터
- 관리자
- Publish
- SEO
- GEO
- Knowledge
- 운영
- 분석
- 코드 리뷰

원인이 확인되기 전에는 수정하지 않는다.

추측을 근거로 여러 원인을 동시에 수정하지 않는다.

---

# 2. Canonical Document Routing

모든 프로젝트 문서를 매 작업마다 읽지 않는다.

현재 작업의 성격과 영향 범위를 먼저 확인하고
관련된 Canonical Document만 선택하여 적용한다.

선택한 Canonical Document의 규칙은
이번 작업 전체에 적용한다.

필요 없는 문서는 읽지 않는다.

---

## 2-1. 프로젝트 전체 방향

프로젝트의 목적, 방향, 정체성 또는 전체 구조 확인이 필요한 경우

- README.md
- ROBO_CONTEXT.md

를 확인한다.

---

## 2-2. Source of Truth / 데이터 흐름

다음과 관련된 작업

- 데이터 저장
- 데이터 수정
- Firestore
- JSON
- Registry
- Generated Data
- Source
- 데이터 동기화
- 데이터 생성 경로

인 경우

- SOURCE_OF_TRUTH.md

를 반드시 확인한다.

Source of Truth가 불명확한 경우
구현을 시작하지 않는다.

동일한 역할의 Source를 새로 만들지 않는다.

기존 Source를 우선 사용한다.

Generated Data를 직접 Source처럼 수정하지 않는다.

---

## 2-3. 시스템 Architecture

다음과 관련된 작업

- 시스템 구조
- 데이터 흐름 구조
- Layer 구조
- Static Architecture
- AI Native Architecture
- 시스템 간 연결
- Architecture 변경

인 경우

- GEO_SYSTEM_ARCHITECTURE.md
- GEO_TECHNICAL_CONSTITUTION.md

를 확인한다.

기존 Architecture와 충돌하는 변경을 임의로 구현하지 않는다.

Architecture 변경이 필요한 경우
먼저 변경 필요성을 보고한다.

---

## 2-4. Knowledge / Content Architecture

다음과 관련된 작업

- Category
- Topic
- Tag
- Intent
- Knowledge Node
- Entity
- Pillar / Cluster
- Learning Path
- Related Content
- Knowledge Graph
- 콘텐츠 구조

인 경우

- COMMON_ROBO_CONTENT_ARCHITECTURE.md
- COMMON_ROBO_CONTENT_MAP.md

를 확인한다.

Presentation Layer와 Knowledge Layer를 혼합하지 않는다.

---

## 2-5. 기능 / 버그 / 리팩토링

다음 작업

- 새 기능 추가
- 기존 기능 수정
- 버그 수정
- 리팩토링
- 구조 변경
- 동작 변경

인 경우

- TECHNICAL_FEATURE_DECISION_GUIDE.md

를 확인한다.

기능의 목적과 영향 범위를 먼저 판단한다.

기존 Source, Knowledge, Architecture, UX, SEO, GEO를
해치지 않는 범위에서 최소 수정한다.

---

## 2-6. 구현 순서 / Phase

다음과 관련된 작업

- 현재 구현 우선순위
- 다음 Phase
- Backlog 실행 시점
- 구현 순서
- 범위 확장 여부

인 경우

- IMPLEMENTATION_ROADMAP.md
- PROJECT_EXECUTION_ROADMAP.md

를 확인한다.

완료되지 않은 Phase를 임의로 건너뛰지 않는다.

---

## 2-7. Technical SEO

다음과 관련된 작업

- metadata
- canonical
- sitemap
- robots
- JSON-LD
- Breadcrumb
- hreflang
- llms.txt
- 검색엔진 크롤링
- 검색 인덱싱

인 경우

- TECHNICAL_SEO_BACKLOG.md

를 확인한다.

관련 없는 SEO 구조를 함께 수정하지 않는다.

---

## 2-8. GEO

다음과 관련된 작업

- Knowledge Node
- Learning Path
- Entity
- Topic Cluster
- Knowledge Graph
- Related Graph
- AI Citation
- AI Discovery
- Knowledge Metadata

인 경우

- TECHNICAL_GEO_BACKLOG.md
- GEO_TECHNICAL_CONSTITUTION.md

를 확인한다.

Technical SEO와 GEO를 혼합해서 수정하지 않는다.

---

## 2-9. 디자인 / 브랜드 / UX

다음과 관련된 작업

- 디자인
- UI
- UX
- 레이아웃
- Typography
- Color
- Component
- Visual Rhythm
- Brand
- 공통 디자인 규칙

인 경우

- ROBO5_MASTER_DESIGN_CONSTITUTION.md

를 확인한다.

기존 브랜드 철학, UX 철학, 디자인 원칙,
디자인 토큰, 공통 컴포넌트 규칙,
Design Anti Pattern을 유지한다.

승인된 디자인을 임의로 재설계하지 않는다.

---

## 2-10. Screen Architecture

다음과 관련된 작업

- 화면 구조
- 화면 계층
- 사용자 탐색 흐름
- 페이지 간 이동
- Section 구조
- Screen 설계
- Approved Screen

인 경우

- SCREEN_ARCHITECTURE.md

를 확인한다.

승인된 Screen Architecture와 사용자 탐색 흐름을 유지한다.

화면 일부 수정 때문에 전체 Screen 구조를 재설계하지 않는다.

---

## 2-11. 문자열 / Encoding

다음과 관련된 작업

- 한글 UI
- 문자열 수정
- 파일 저장
- 문자 깨짐
- Encoding
- 대량 문자열 변경

인 경우

- ENCODING_RULES.md

를 확인한다.

UTF-8을 유지한다.

로직 수정 중 관련 없는 한글 UI 문구를 정리하지 않는다.

---

## 2-12. 운영 / Production Workflow

다음과 관련된 작업

- 운영 방식
- Production 확인
- Browser Verification
- 배포 운영
- AI 작업 운영
- my_gstack 적용

인 경우

- AI_OPERATIONS.md
- MY_GSTACK_APPLIED.md

를 확인한다.

---

## 2-13. 구현 사례 / 작업 패턴

구현 방식이나 기존 작업 사례 확인이 필요한 경우

- EXAMPLES.md

를 확인한다.

단순히 존재한다는 이유로 모든 작업에서 읽지 않는다.

---

## 2-14. 관리자 검색

다음과 관련된 작업

- 관리자 Posts 검색
- title 검색
- slug 검색
- searchIndex
- 관리자 검색 성능
- Firestore 검색 전략

인 경우

- ADMIN_SEARCH_ARCHITECTURE.md

를 반드시 확인한다.

관리자 검색은
ADMIN_SEARCH_ARCHITECTURE.md에 정의된 설계를 유지한다.

Firestore Full Scan 방식으로 임의 회귀하지 않는다.

searchIndex는 Generated Metadata이며
사람이 직접 관리하는 Source로 사용하지 않는다.

---

# 3. 전용 Architecture Document 규칙

현재 작업 대상에 대해
전용 Architecture 문서가 존재하면 반드시 확인한다.

예시

관리자 검색
→ ADMIN_SEARCH_ARCHITECTURE.md

화면 구조
→ SCREEN_ARCHITECTURE.md

시스템 구조
→ GEO_SYSTEM_ARCHITECTURE.md

전용 Architecture 문서는
이미 승인된 설계의 Source of Design 역할을 한다.

전용 Architecture 문서와 충돌하는 구현을 임의로 하지 않는다.

Architecture 변경이 필요한 경우

1. 현재 Architecture와 충돌하는 이유
2. 변경 필요성
3. 영향 범위

를 먼저 보고한다.

사용자 승인 없이
Architecture보다 코드를 먼저 변경하지 않는다.

---

# 4. 작업 전 확인

코드 수정 전에 다음을 확인한다.

1. 현재 목표
2. 현재 동작
3. 기대 동작
4. 실제 원인
5. 영향 범위
6. Source of Truth
7. 기존 Architecture와 충돌 여부
8. 관련 Design Constitution과 충돌 여부
9. 관련 Screen Architecture와 충돌 여부
10. Technical SEO 영향 여부
11. GEO 영향 여부
12. 기존 사용자 흐름 영향 여부
13. 기존 데이터 영향 여부

새 기능, 기존 기능 수정, 리팩토링, 버그 수정인 경우
TECHNICAL_FEATURE_DECISION_GUIDE.md 적용 필요 여부를 확인한다.

원인이 확인되기 전에는 수정하지 않는다.

Source of Truth가 불명확하면 수정하지 않고 보고한다.

---

# 5. 공통 보호 원칙

모든 작업은 관련 Canonical Document를 기준으로
다음 항목을 보호한다.

- Source of Truth
- Knowledge
- Knowledge Graph
- Learning Path
- Static Architecture
- GEO 구조
- SEO 구조
- Design Constitution
- Screen Architecture
- 기존 사용자 흐름
- 기존 UX
- 기존 데이터
- 기존 Encoding

다음 원칙을 유지한다.

Knowledge First

Knowledge Graph First

Learning Path First

Static First

Education First

GEO First

Design Constitution First

Screen Architecture First

AI Native Architecture

Source of Truth First

Presentation Layer와 Knowledge Layer를 혼합하지 않는다.

Node 중심으로 사고한다.

페이지 중심으로 전체 구조를 재설계하지 않는다.

기능보다 기존 Source와 Architecture 보호를 우선한다.

Presentation보다 Discovery를 우선한다.

---

# 6. 수정 원칙

항상 다음 원칙을 따른다.

- 한 번에 한 원인만 수정
- 최소 범위만 수정
- 가능한 한 최소 파일만 수정
- 관련 없는 리팩토링 금지
- fallback/mock 추가 금지
- 기존 구조 유지
- 기존 Source 우선 수정
- Generated Data 직접 수정 금지
- 관련 없는 UI 문구 수정 금지
- 관련 없는 formatting 변경 금지
- 불필요한 abstraction 금지
- 불필요한 상태관리 추가 금지
- 사용자가 요청하지 않은 기능 추가 금지

추측으로 여러 파일을 동시에 수정하지 않는다.

한 파일로 해결 가능한 문제를
불필요하게 여러 파일로 확장하지 않는다.

단, 실제 원인이 여러 파일에 걸쳐 있는 것이 코드로 확인된 경우
필요한 최소 파일만 수정한다.

---

# 7. 분석 전용 작업

사용자가 다음과 같은 분석만 요청한 경우

- 분석
- 원인 조사
- 코드 리뷰
- 구조 검토
- Architecture 검토
- 영향 범위 확인

다음을 수행하지 않는다.

- 코드 수정
- Build
- Test
- sync-json
- Generated Data 생성
- commit
- push

분석 결과만 보고한다.

분석 결과 새로운 Technical SEO 또는 GEO 작업이 확인되면

- TECHNICAL_SEO_BACKLOG.md
- TECHNICAL_GEO_BACKLOG.md

반영 필요 여부를 보고한다.

사용자 승인 없이 Backlog를 임의 수정하지 않는다.

---

# 8. 수정 후 검증

코드를 수정한 경우
프로젝트에 정의된 명령을 기준으로 검증한다.

필수

- Build

프로젝트에 Test가 정의되어 있으면

- Test

를 실행한다.

이후 반드시 확인한다.

- git diff --check
- git diff
- git status --short

Build 또는 Test 실패를 숨기지 않는다.

검증 결과에서 새로운 오류가 발생하면
완료로 보고하지 않는다.

---

# 9. 추가 검증

작업 유형에 따라 필요한 검증을 추가한다.

## 데이터 작업

- Source of Truth 유지 여부
- Generated Data 직접 수정 여부
- 기존 데이터 손상 여부

## UI / UX 작업

- 기존 사용자 흐름 유지 여부
- Design Constitution 충돌 여부
- Screen Architecture 충돌 여부

## SEO 작업

- metadata
- canonical
- sitemap
- robots
- JSON-LD

영향 여부

## GEO 작업

- Knowledge Node
- Learning Path
- Entity
- Related Graph
- Knowledge Metadata

영향 여부

## Encoding 관련 작업

- 한글 깨짐 여부
- UTF-8 유지 여부
- git diff 내 비정상 문자 여부

---

# 10. Browser / Production 검증 규칙

기본 Codex 작업 범위는

분석

↓

수정

↓

Build / Test

↓

Diff 검증

↓

보고

까지이다.

다음 작업은 기본적으로 수행하지 않는다.

- Playwright 실행
- 브라우저 자동 검증
- production 사이트 접속
- Console 확인
- 사용자 대신 UI 확인
- 사용자 대신 최종 배포 확인

위 작업은 사용자가 직접 수행한다.

단,
개별 작업지시문에서 명시적으로 허용한 경우에는
해당 지시를 따른다.

---

# 11. Git 규칙

기본 작업 범위는

분석

↓

수정

↓

검증

↓

보고

까지이다.

다음 작업은 수행하지 않는다.

- git commit
- git push
- force push
- history rewrite

사용자의 기존 변경사항을 임의로 삭제하지 않는다.

사용자의 기존 변경사항이 현재 작업과 충돌하는 경우
임의로 되돌리지 말고 보고한다.

개별 작업지시문에서 사용자가 명시적으로
commit 또는 push를 요청한 경우에만 해당 작업을 수행한다.

---

# 12. 작업 보고

작업 완료 후 다음 순서로 보고한다.

1. 원인
2. 영향 범위
3. 확인한 관련 Canonical Document
4. Source of Truth
5. 수정 파일
6. 수정 내용
7. Build 결과
8. Test 결과
   - Test가 없는 경우 없음을 명시
9. git diff --check 결과
10. git diff 요약
11. git status --short
12. 사용자가 직접 확인해야 할 사항

분석 전용 작업의 경우

1. 확인한 구조
2. 원인
3. 영향 범위
4. 관련 Canonical Document
5. Source of Truth
6. 권장 다음 작업

만 보고한다.

---

# 13. Architecture 변경

현재 작업이 기존 Architecture,
데이터 흐름,
Source of Truth,
Screen Architecture,
Design Constitution을 변경해야 하는 경우

구현을 먼저 변경하지 않는다.

먼저 다음을 보고한다.

1. 기존 구조
2. 변경이 필요한 이유
3. 변경 후 구조
4. 영향 범위
5. 관련 Canonical Document
6. Migration 필요 여부

사용자 승인 후 Architecture 문서를 먼저 수정하거나
Architecture 변경과 구현 변경의 순서를 확정한다.

승인된 Architecture와 실제 구현이
서로 다른 상태로 장기간 유지되지 않도록 한다.

---

# 14. 예외 규칙

개별 작업지시문에 명시된 예외 조건이 있는 경우
해당 작업에 한하여 개별 지시를 우선 적용한다.

단,

- 시스템 상위 규칙
- 안전 규칙
- 명시적인 Source of Truth 보호 규칙

을 위반하는 예외는 적용하지 않는다.

---

# 표준 작업지시문

앞으로 개별 작업지시문은 아래 형식을 기본으로 사용한다.

먼저 프로젝트 루트의 다음 문서를 읽고 적용한다.

1. AI_WORK_RULES.md
2. COMMON_WORKFLOW.md

AI_WORK_RULES.md를 최우선으로 적용한다.

COMMON_WORKFLOW.md의 작업 절차와
Canonical Document Routing 규칙을 따른다.

이후 아래 작업을 수행한다.

# 작업 유형

버그 / 기능 / UI / UX / 구조 / 데이터 / SEO / GEO / 운영 / 분석 중 선택

# 작업 내용

...

# 기대 동작

...

# 작업 범위

...

# 추가 조건

필요한 경우에만 작성한다.