# COMMON_WORKFLOW.md

# 목적

이 문서는 프로젝트의 공통 작업 절차를 정의한다.

개별 작업지시문은 프로젝트 문서를 반복하지 않는다.

모든 작업은 다음 두 문서를 먼저 적용한다.

1. AI_WORK_RULES.md
2. COMMON_WORKFLOW.md

AI_WORK_RULES.md가 최상위 규칙이며,
COMMON_WORKFLOW.md는 실제 작업 절차를 정의한다.

---

# 1. 작업 시작

먼저 현재 요청을 분석한다.

다음을 확인한다.

- 현재 목표
- 현재 동작
- 기대 동작
- 원인 후보
- 영향 범위

원인이 확인되기 전에는 수정하지 않는다.

---

# 2. 프로젝트 문서 확인

모든 문서를 읽지 않는다.

현재 작업과 관련된 문서만 확인한다.

예시

- 프로젝트 구조 → SYSTEM_ARCHITECTURE.md
- 데이터 구조 → DATA_STRUCTURE.md
- 구현 순서 → IMPLEMENTATION_ROADMAP.md
- 코드 스타일 → CODING_CONVENTION.md
- 프로젝트 개요 → README.md

필요 없는 문서는 읽지 않는다.

---

# 3. 수정 원칙

항상 다음 원칙을 따른다.

- 한 번에 한 원인만 수정
- 최소 범위만 수정
- 관련 없는 리팩토링 금지
- fallback/mock 추가 금지
- 기존 구조 유지
- 기존 Source 우선 수정

추측으로 여러 파일을 동시에 수정하지 않는다.

---

# 4. 분석 전용 작업

사용자가

- 분석
- 원인 조사
- 코드 리뷰
- 구조 검토

만 요청한 경우

다음을 수행하지 않는다.

- 코드 수정
- Build
- Test

분석 결과만 보고한다.

---

# 5. 수정 후 검증

코드를 수정한 경우

프로젝트에 정의된 명령을 기준으로 검증한다.

필수

- Build

Test가 정의되어 있으면

- Test

이후 반드시 확인한다.

- git diff --check
- git diff
- git status --short

Build 또는 Test 실패를 숨기지 않는다.

---

# 6. Git 규칙

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

---

# 표준 작업지시문

앞으로 작업지시문은 아래 형식을 사용한다.

먼저 프로젝트 루트의 다음 문서를 읽고 적용한다.

1. AI_WORK_RULES.md
2. COMMON_WORKFLOW.md

AI_WORK_RULES.md를 최우선으로 적용한다.

COMMON_WORKFLOW.md의 작업 절차를 따른다.

이후 아래 작업을 수행한다.

...