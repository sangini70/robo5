Version: 1.0
Status: Official Source of Truth
Last Updated: 2026-07-23
Owner: Robo5 Project

# ROBO5 START HERE

> Official Project Bootstrap & Entry Point

---

# 목적

이 문서는 Robo5 프로젝트의 **공식 진입 문서**이다.

모든 AI(Codex, ChatGPT, Claude, Gemini 등)와 개발자,
디자이너는 반드시 이 문서를 가장 먼저 읽는다.

이 문서는

- 현재 작업을 판단하고
- 필요한 문서를 선택하며
- 작업 순서를 결정하는

프로젝트 Bootloader 역할을 한다.

---

적용 대상

- AI (Codex, ChatGPT, Claude, Gemini 등)
- 개발자
- 디자이너
- 프로젝트 참여자


# 프로젝트 철학

Robo5는

**Source of Truth 기반 프로젝트**이다.

모든 구현은

Rule

↓

System

↓

Architecture

↓

Code

순서로 진행한다.

코드는 항상 마지막에 수정한다.

---

# AI 행동 원칙 (Behavior)

AI는 아래 순서를 생략하지 않는다.

① 현재 작업을 정의한다.

↓

② 필요한 문서를 선택한다.

↓

③ 기존 코드를 분석한다.

↓

④ 수정 범위를 결정한다.

↓

⑤ 구현한다.

↓

⑥ Build 한다.

↓

⑦ QA 한다.

↓

⑧ Git 상태를 확인한다.

↓

⑨ 결과를 보고한다.

---

# 작업 유형 판단 (Decision Flow)

가장 먼저

현재 작업을 하나 선택한다.

□ UI / 디자인

□ 기능 개발

□ 버그 수정

□ 리팩토링

□ 성능 개선

□ 테스트

□ 배포

□ 운영

작업 유형에 따라 읽는 문서가 달라진다.

---

# 프로젝트 문서 구조

```
docs/

architecture/
UI / UX / Design Source of Truth

rules/
Project Rules

system/
System Architecture

development/
Development Guide (예정)

deployment/
Deployment Guide (예정)

runbooks/
Runbooks (예정)
```

---

# 문서 우선순위

항상

Rules

↓

System

↓

Architecture

↓

Development

↓

Deployment

↓

Runbooks

순서를 따른다.

---

# 작업별 문서

## UI / 디자인

읽는 순서

Rules

↓

System

↓

Architecture

필수 문서

rules/

- AI_WORK_RULES.md
- GEO_TECHNICAL_CONSTITUTION.md
- AI_OPERATIONS.md
- ENCODING_RULES.md

system/

- GEO_SYSTEM_ARCHITECTURE.md
- COMMON_ROBO_CONTENT_ARCHITECTURE.md
- COMMON_ROBO_CONTENT_MAP.md
- TECHNICAL_FEATURE_DECISION_GUIDE.md
- TECHNICAL_GEO_BACKLOG.md
- TECHNICAL_SEO_BACKLOG.md
- ROBO_CONTEXT.md
- MY_GSTACK_APPLIED.md

architecture/

- ROBO5_MASTER_DESIGN_CONSTITUTION.md
- ROBO5_INFORMATION_ARCHITECTURE.md
- ROBO5_USER_FLOW.md
- ROBO5_SCREEN_ARCHITECTURE.md
- ROBO5_WIREFRAME_GUIDE.md
- ROBO5_VISUAL_DESIGN_SYSTEM.md
- ROBO5_UI_SCREEN_SPECIFICATION.md
- ROBO5_COMPONENT_GUIDE.md

---

## 기능 개발

읽는 순서

Rules

↓

System

↓

Development

(작성 예정)

---

## 버그 수정

읽는 순서

Rules

↓

System

↓

Runbooks

↓

기존 코드

↓

수정

(작성 예정)

---

## 배포

읽는 순서

Rules

↓

Deployment

(작성 예정)

---

# Source of Truth

아래 항목은
AI가 임의로 변경하지 않는다.

- Information Architecture
- User Flow
- Screen Architecture
- Wireframe
- Visual Design System
- UI Screen Specification
- Component Guide

변경이 필요하면
먼저 보고한다.

---

# 구현 원칙

항상

Rule

↓

System

↓

Architecture

↓

Existing Code

↓

Implementation

↓

Verification

↓

Deployment

순서를 따른다.

---

# 작업 시작 체크리스트

반드시 확인한다.

□ 현재 작업 목적

□ 현재 Git Branch

□ Git Status

□ Build 가능 여부

□ 기존 코드 구조

□ Source of Truth 존재 여부

□ 수정 범위

□ 충돌 여부

확인 전에는
코드를 수정하지 않는다.

---

# 구현 완료 체크리스트

□ Build 성공

□ Type Check 성공

□ Lint 성공

□ Responsive 확인

□ Accessibility 확인

□ 기존 기능 영향 확인

□ 변경 파일 확인

□ Git Status 확인

□ QA 완료

□ 결과 보고 완료

---

# 충돌 해결 원칙

문서 간 충돌이 발생하면

Rules

>

System

>

Architecture

>

Existing Code

순서로 우선한다.

판단이 어려우면
추측하지 말고 보고한다.

---

# 금지 사항

AI는 다음 행동을 하지 않는다.

- 추측 구현
- 임의 설계 변경
- Source of Truth 수정
- 새 구조 생성
- 기존 구조 무시
- Build 없이 종료
- QA 없이 종료
- Git 상태 확인 없이 종료

---

# START_HERE 변경 원칙

다음 경우에만 수정한다.

- 새로운 문서 체계가 추가될 때
- 프로젝트 운영 절차가 변경될 때
- Source of Truth의 최상위 구조가 변경될 때

기능 추가나 UI 변경만으로는 수정하지 않는다.


# 최종 목표

모든 AI는

START_HERE.md 하나만 읽으면

프로젝트 구조를 이해하고

필요한 문서를 선택하며

올바른 절차로

안전하게 작업을 시작할 수 있어야 한다.

---

END

