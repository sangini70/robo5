# AI_WORK_RULES.md

## 목적

이 문서는 robo5 프로젝트에서
모든 AI 작업의 공통 행동 규칙을 정의한다.

대상:

- Codex
- ChatGPT
- Gemini Studio
- Claude Code
- 기타 LLM 기반 도구

이 문서는:

“무엇을 만들 것인가”

가 아니라

“어떻게 작업할 것인가”

를 정의한다.

프로젝트 철학과 방향성은
ROBO_CONTEXT.md를 따른다.

---

# 1. 작업 시작 규칙

모든 작업 시작 전 반드시 아래 파일을 먼저 읽는다.

- ROBO_CONTEXT.md
- EXAMPLES.md
- ENCODING_RULES.md
- docs/MY_GSTACK_APPLIED.md

필요 시 추가로 참조:

- browser-operations
- frontend-operations
- BLOG_UX_DESIGN
- production-verification

---

# 2. 최우선 원칙

기능 추가보다 기존 탐험 흐름, reading rhythm, UX pacing 보호를 우선한다.

항상 아래 순서를 우선한다.

1. 기존 사용자 흐름 보호
2. 기존 UX 리듬 보호
3. 기존 탐험 구조 보호
4. 기존 SEO 구조 보호
5. 최소 수정
6. 코드 품질
7. 기능 추가

기능 추가보다:

- 흐름 유지
- 읽기 경험 유지
- 탐험 구조 유지

를 우선한다.

---

# 3. 절대 금지

## 금지 항목

- 추측 기반 수정
- 대형 리팩토링
- 구조 갈아엎기
- 불필요한 abstraction
- 과도한 상태관리 추가
- 사용자가 요청하지 않은 기능 추가
- localhost만 보고 완료 판단
- 코드 수정 중 UI 문구 정리
- 콘텐츠 수정 중 로직 리팩토링
- 의미 없는 animation 추가
- SaaS형 UI 변환
- 과도한 floating UI 추가

---

# 4. 최소 수정 원칙

항상:

- 최소 범위 수정
- 최소 영향 수정
- 기존 흐름 유지
- 기존 UX 유지

를 우선한다.

버그 수정 시:

- 해당 문제만 수정
- 관련 없는 코드 건드리지 않음
- 스타일 변경 금지
- formatting 변경 최소화
- quote style 변경 금지

---

# 5. incremental evolution 원칙

robo5는:

- phased evolution
- small validated steps
- observable evidence
- production-first
- browser verification

방식으로 진화한다.

기능 폭주보다:

- 흐름 개선
- 연결 개선
- UX pacing 개선
- 탐험 강화

를 우선한다.

---

# 6. Production 우선 원칙

항상 production 기준으로 판단한다.

금지:

- localhost만 보고 완료 판단
- 실제 브라우저 검증 없는 완료 선언
- 모바일 UX 미확인 상태 종료

반드시 확인:

- 실제 브라우저 흐름
- 모바일 스크롤 리듬
- reading flow
- flow 연결
- related content 연결
- hydration 오류 여부
- console 오류 여부

중요:

브라우저에서 실제 느껴지는 경험이
최종 진실이다.

---

# 7. 검증 규칙

작업 후 반드시 확인:

- npm run build
- git diff --check
- git diff
- git status --short

UI 수정 시 추가 확인:

- 실제 브라우저 확인
- 모바일 확인
- scroll rhythm 확인
- flow 연결 확인

SEO 수정 시 추가 확인:

- metadata 확인
- canonical 확인
- sitemap 확인
- robots 확인
- JSON-LD 확인

---

# 8. ENCODING 보호 규칙

한글 UI 및 콘텐츠 문자열은
ENCODING_RULES.md 기준을 반드시 따른다.

금지:

- 깨진 문자열 저장
- 의미 추측 복구
- UI 문구 임의 수정
- 로직 수정 중 한글 정리

---

# 9. EXAMPLES 기준 준수

EXAMPLES.md의 핵심 원칙을 따른다.

특히:

- Think Before Coding
- Simplicity First
- Surgical Changes
- Goal-Driven Execution

원칙을 유지한다.

과설계보다:

- 단순성
- 검증 가능성
- 최소 수정

을 우선한다.

---

# 10. 완료 기준

작업 완료는:

- build 성공
- diff 검증 완료
- production 흐름 확인
- console 오류 없음
- UX 흐름 유지 확인

상태를 의미한다.

“코드 수정 완료”
만으로 작업 종료 판단하지 않는다.