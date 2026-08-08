# AI_WORK_RULES.md

## 목적

이 문서는 robo5 프로젝트에서
모든 AI 작업의 최상위 행동 규칙을 정의한다.

대상:

- Codex
- ChatGPT
- Gemini Studio
- Claude Code
- 기타 LLM 기반 도구

이 문서는

"무엇을 만들 것인가"

가 아니라

"어떤 원칙으로 작업할 것인가"

를 정의한다.

실제 작업 절차와
작업별 Canonical Document 선택은

COMMON_WORKFLOW.md

를 따른다.

프로젝트 철학과 방향성은
관련 Canonical Document를 따른다.

---

# 1. 작업 시작 규칙

모든 작업은 먼저 다음 두 문서를 적용한다.

1. AI_WORK_RULES.md
2. COMMON_WORKFLOW.md

AI_WORK_RULES.md는
프로젝트의 최상위 행동 규칙이다.

COMMON_WORKFLOW.md는

- 작업 유형 판단
- 관련 Canonical Document 선택
- 분석
- 수정
- 검증
- 보고

의 실행 절차를 정의한다.

모든 프로젝트 문서를
매 작업마다 읽지 않는다.

현재 작업과 관련된 문서는
COMMON_WORKFLOW.md의

Canonical Document Routing

규칙에 따라 선택하여 확인한다.

관련 Canonical Document가 존재하면
해당 문서의 확정된 설계를 유지한다.

---

# 2. 최우선 원칙

항상 아래 순서를 우선한다.

1. Source of Truth 보호
2. 기존 Architecture 보호
3. Knowledge 보호
4. Knowledge Graph 보호
5. Learning Path 보호
6. Discovery 구조 보호
7. Design Constitution 보호
8. Screen Architecture 보호
9. 기존 사용자 흐름 보호
10. 기존 UX 리듬 보호
11. 기존 SEO / GEO 구조 보호
12. 최소 수정
13. 코드 품질
14. 기능 추가

기능 추가보다

- Source 보호
- Architecture 보호
- Knowledge 보호
- 사용자 흐름 보호
- 읽기 경험 보호
- 탐험 구조 보호

를 우선한다.

---

# 3. 절대 금지

다음을 금지한다.

- 추측 기반 수정
- fallback/mock 추가
- Source of Truth 중복 생성
- Generated Data 직접 수정
- Knowledge Layer와 Presentation Layer 혼합
- 승인된 Architecture 무시
- 승인된 Design Constitution 무시
- 승인된 Screen Architecture 무시
- 대형 리팩토링
- 구조 갈아엎기
- 불필요한 abstraction
- 과도한 상태관리 추가
- 사용자가 요청하지 않은 기능 추가
- 코드 수정 중 관련 없는 UI 문구 정리
- 콘텐츠 수정 중 관련 없는 로직 리팩토링
- 의미 없는 animation 추가
- SaaS형 UI로 임의 변경
- 과도한 floating UI 추가
- 기존 Source를 우회하는 새로운 Source 생성
- 기존 변경사항 임의 삭제
- 검증 실패 은폐

원인이 확인되기 전에는
추측으로 수정하지 않는다.

---

# 4. Source of Truth First

모든 데이터와 정책은
하나의 Source만 가진다.

작업 전 반드시

- 기존 Source가 무엇인지
- Generated Data인지
- 새로운 Source를 만들고 있지는 않은지

확인한다.

기존 Source를 우선 수정한다.

Source of Truth가 불명확하면
구현을 시작하지 않는다.

기본 흐름:

Source

↓

Generate

↓

Presentation

순서를 유지한다.

Generated Data를 직접 원본처럼 관리하지 않는다.

---

# 5. 최소 수정 원칙

항상 다음을 우선한다.

- 최소 범위 수정
- 최소 영향 수정
- 한 번에 한 원인
- 가능한 한 최소 파일
- 기존 구조 유지
- 기존 Source 유지
- 기존 Knowledge 유지
- 기존 사용자 흐름 유지
- 기존 UX 유지

버그 수정 시:

- 해당 문제만 수정
- 관련 없는 코드 수정 금지
- 스타일 변경 금지
- formatting 변경 최소화
- quote style 변경 금지

한 파일로 해결 가능한 문제를
불필요하게 여러 파일로 확장하지 않는다.

실제 원인이 여러 파일에 걸쳐 있는 것이 확인된 경우에만
필요한 최소 파일을 수정한다.

---

# 6. Architecture First

기존 Architecture를 먼저 확인한다.

현재 작업에 전용 Architecture 문서가 존재하면
해당 문서를 우선 적용한다.

예:

관리자 검색

↓

ADMIN_SEARCH_ARCHITECTURE.md

화면 구조

↓

SCREEN_ARCHITECTURE.md

Architecture와 충돌하는 구현을
코드에서 먼저 강행하지 않는다.

Architecture 변경이 필요한 경우

- 변경 이유
- 영향 범위
- 변경 후 구조

를 먼저 보고한다.

사용자 승인 없이
확정된 Architecture를 임의로 변경하지 않는다.

---

# 7. Knowledge First

모든 구현은 다음 원칙을 보호한다.

Knowledge First

Knowledge Graph First

Learning Path First

Discovery First

Static First

Education First

GEO First

AI Native Architecture

Presentation Layer와 Knowledge Layer를 혼합하지 않는다.

페이지 하나의 편의를 위해
Knowledge 구조 전체를 훼손하지 않는다.

Node 중심으로 사고한다.

기능 추가보다
Knowledge와 관계 구조 보호를 우선한다.

---

# 8. Design / UX 보호 원칙

UI 또는 UX 작업에서는
관련 Design Constitution과
Screen Architecture를 먼저 확인한다.

보호 대상:

- 브랜드 철학
- UX 철학
- 디자인 토큰
- 공통 컴포넌트 규칙
- Visual Rhythm
- Screen hierarchy
- 사용자 탐색 흐름
- Approved Design

금지:

- 승인된 디자인 임의 변경
- 화면 전체 재설계
- SaaS Dashboard화
- 불필요한 CTA 추가
- 의미 없는 Animation
- 과도한 Floating UI
- 정보 과밀
- 기존 Reading Flow 파괴

UI 변경은
기존 흐름 안에서 최소 범위로 수행한다.

---

# 9. Incremental Evolution 원칙

robo5는

- phased evolution
- small validated steps
- observable evidence
- production-first
- incremental improvement

방식으로 발전한다.

한 번에 많은 문제를 해결하려 하지 않는다.

기능 폭주보다

- 구조 안정성
- Knowledge 성장
- 연결 개선
- Discovery 강화
- UX pacing 개선

을 우선한다.

---

# 10. Production First

최종 판단 기준은
실제 Production 사용자 경험이다.

localhost 결과만으로
최종 완료를 판단하지 않는다.

다만 AI/Codex의 기본 작업 범위와
Production 검증 수행 여부는

COMMON_WORKFLOW.md

를 따른다.

브라우저 또는 Production 확인을
사용자가 수행하도록 정해진 작업에서는
AI가 대신 수행하지 않는다.

코드 검증 완료와
Production 검증 완료를 구분해서 보고한다.

---

# 11. 검증 원칙

코드를 수정한 경우
COMMON_WORKFLOW.md의 검증 절차를 따른다.

기본 검증:

- 프로젝트에 정의된 Build
- Test가 정의되어 있으면 Test
- git diff --check
- git diff
- git status --short

검증 실패를 숨기지 않는다.

Build 성공만으로
전체 작업 완료를 선언하지 않는다.

---

# 12. ENCODING 보호

한글 UI 및 콘텐츠 문자열을 다루는 작업은
ENCODING_RULES.md를 따른다.

금지:

- 깨진 문자열 저장
- 의미 추측 복구
- UI 문구 임의 수정
- 로직 수정 중 한글 정리
- 인코딩 확인 없는 대량 문자열 치환

한글과 UTF-8을 보호한다.

---

# 13. 작업 유형별 문서 선택

AI_WORK_RULES.md 자체에서
모든 관련 문서 목록을 강제로 읽지 않는다.

어떤 문서를 읽어야 하는지는
COMMON_WORKFLOW.md의

Canonical Document Routing

규칙을 따른다.

예:

- Source / Firestore / JSON → SOURCE_OF_TRUTH.md
- 시스템 구조 → GEO_SYSTEM_ARCHITECTURE.md
- Knowledge → COMMON_ROBO_CONTENT_ARCHITECTURE.md
- 기능 / 버그 → TECHNICAL_FEATURE_DECISION_GUIDE.md
- 디자인 → ROBO5_MASTER_DESIGN_CONSTITUTION.md
- 화면 구조 → SCREEN_ARCHITECTURE.md
- 관리자 검색 → ADMIN_SEARCH_ARCHITECTURE.md
- SEO → TECHNICAL_SEO_BACKLOG.md
- GEO → TECHNICAL_GEO_BACKLOG.md
- Encoding → ENCODING_RULES.md

필요 없는 문서를
단순히 존재한다는 이유로 읽지 않는다.

---

# 14. 분석과 구현 분리

분석 전용 요청과
코드 수정 요청을 구분한다.

사용자가 분석만 요청한 경우

- 코드 수정
- Build
- Test
- Generated Data 생성

을 수행하지 않는다.

분석 결과만 보고한다.

구체적인 실행 절차는
COMMON_WORKFLOW.md를 따른다.

---

# 15. Git 보호

기본 작업 범위는

분석

↓

수정

↓

검증

↓

보고

까지이다.

기본적으로 다음을 수행하지 않는다.

- git commit
- git push
- force push
- history rewrite

사용자의 기존 변경사항을
임의로 삭제하거나 되돌리지 않는다.

사용자가 명시적으로 요청한 경우에만
commit 또는 push를 수행한다.

---

# 16. 완료 기준

작업 완료는 단순히

"코드를 수정했다"

는 뜻이 아니다.

최소한 다음 상태를 의미한다.

- 실제 원인 확인
- 영향 범위 확인
- Source of Truth 유지
- 관련 Architecture 유지
- 관련 Knowledge 구조 유지
- 기존 사용자 흐름 보호
- 최소 수정
- Build 검증 완료
- Test가 있다면 Test 완료
- diff 검증 완료
- 미해결 문제 명시

Production 또는 Browser 확인이
사용자 작업으로 남아 있는 경우

"코드 작업 완료"

와

"Production 최종 확인 완료"

를 구분해서 보고한다.

---

# 17. 역할 분리

AI_WORK_RULES.md

↓

어떤 원칙으로 행동할 것인가

COMMON_WORKFLOW.md

↓

어떤 순서로 작업할 것인가

Canonical Documents

↓

현재 기능이나 구조가
어떤 설계를 따라야 하는가

개별 작업지시문

↓

이번에 무엇을 해야 하는가

이 역할을 혼합하지 않는다.

---

# 최종 원칙

robo5의 AI 작업은 다음 구조를 따른다.

AI_WORK_RULES.md

↓

COMMON_WORKFLOW.md

↓

관련 Canonical Document

↓

현재 코드와 실제 데이터 확인

↓

원인 분석

↓

최소 수정

↓

검증

↓

보고

항상

Source of Truth First

Architecture First

Knowledge First

Minimal Change

원칙을 유지한다.