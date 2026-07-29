# 공통 작업지시문

먼저 프로젝트 루트의 아래 문서를 모두 읽고 이번 작업 전체에 적용한다.

README.md
AI_WORK_RULES.md
SYSTEM_ARCHITECTURE.md
PROJECT_STRUCTURE.md
DATA_STRUCTURE.md
TECH_STACK.md
IMPLEMENTATION_ROADMAP.md
CODING_CONVENTION.md
CHANGELOG.md
TODO.md

이번 작업은 위 문서들을 Source of Truth로 사용한다.

문서 간 내용이 충돌하는 경우에는 다음 우선순위를 따른다.

1. AI_WORK_RULES.md
2. SYSTEM_ARCHITECTURE.md
3. PROJECT_STRUCTURE.md
4. DATA_STRUCTURE.md
5. CODING_CONVENTION.md
6. IMPLEMENTATION_ROADMAP.md
7. README.md
8. TECH_STACK.md
9. CHANGELOG.md
10. TODO.md

문서에 정의되지 않은 새로운 Architecture, Layer, Folder, Data Structure, Coding Rule을 임의로 생성하지 않는다.

기존 문서를 우선 따르며, 변경이 필요하면 코드를 수정하기 전에 문서 변경을 먼저 제안한다.

---

# 개발 원칙

- Single Responsibility를 따른다.
- 작은 단위로 구현한다.
- 한 번에 하나의 기능만 구현한다.
- 기존 기능을 불필요하게 수정하지 않는다.
- 최소 변경으로 목적을 달성한다.
- 항상 Build 가능한 상태를 유지한다.
- 추측하지 않는다.
- 불확실한 사항은 명확하게 보고한다.
- 문서보다 코드를 우선하지 않는다.

---

# 작업 시작 전

문서를 모두 읽은 후 아래 내용을 먼저 보고한다.

- 현재 작업 목표
- 영향을 받는 문서
- 영향을 받는 모듈
- 구현 계획
- 예상되는 위험 요소(있는 경우)

사용자 승인 전에는 어떠한 코드도 수정하지 않는다.

---

# 구현 순서

항상 다음 순서를 따른다.

1. 현재 구조 분석
2. 영향 범위 분석
3. 구현 계획 작성
4. 사용자 승인
5. 코드 구현
6. 자체 검토
7. 오류 수정
8. Build 수행
9. Test 수행
10. 변경 사항 보고

---

# Build Rule

Build 또는 Test가 실패한 상태에서는 작업을 완료로 보고하지 않는다.

실패 원인을 분석하여 먼저 수정한 후 다시 Build와 Test를 수행한다.

Build와 Test가 모두 성공한 후에만 작업 완료를 보고한다.

---

# 작업 완료 후 반드시 보고

다음 내용을 반드시 보고한다.

- 변경한 파일 목록
- 변경 이유
- 구현 내용
- 영향받는 모듈
- Build 결과
- Test 결과
- 향후 개선 사항(있는 경우)

CHANGELOG.md와 TODO.md가 업데이트 대상인지 함께 검토하여 보고한다.

---

# 변경 최소화 원칙

요청된 기능과 관련 없는 코드, 구조, 스타일은 수정하지 않는다.

리팩터링은 별도의 작업으로 수행한다.

현재 작업 범위를 벗어나는 개선 사항은 제안만 하고 구현하지 않는다.

---

# 작업 범위 준수

요청된 작업만 수행한다.

승인되지 않은 기능 추가, 구조 변경, 리팩터링은 수행하지 않는다.

추가로 발견한 문제나 개선 사항은 구현하지 말고 별도로 제안한다.

---

# Final Principle

문서가 코드를 이끈다.

코드는 문서를 따른다.

문서와 코드가 충돌하면 코드를 기준으로 판단하지 않는다.

먼저 문서를 수정하거나 사용자에게 변경을 제안한다.