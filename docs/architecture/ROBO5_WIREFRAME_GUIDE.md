# ROBO5_WIREFRAME_GUIDE.md

Version: 1.0  
Status: Official Wireframe Source of Truth  
Scope: Information Hierarchy, Section Sequence, Required Context, State Replacement, Design Handoff

---

# 0. 문서의 지위와 범위

## 목적

이 문서는 Robo5의 공식 Wireframe Source of Truth이다.

승인된 화면 책임을 수행하기 위해 각 화면에 어떤 정보를 어떤 위계와 순서로 배치해야 하는지 정의한다.

이 문서는 다음 질문에만 답한다.

> 승인된 화면 책임을 수행하려면 사용자가 어떤 정보를 어떤 순서로 만나야 하는가?

Wireframe은 화면의 외형이 아니라 정보의 우선순위, 논리적 순서, 필수 노출 관계와 상태별 대체 원칙을 정의한다.

## 적용 범위

이 문서는 다음 결정을 소유한다.

1. 화면별 1차·2차·3차 이하 정보 위계
2. 화면별 최종 정보 섹션 순서
3. 각 섹션의 정보적 책임
4. 필수 영역과 선택 영역
5. 첫 정보 구간에서 반드시 이해해야 하는 내용
6. 주요 다음 행동과 보조 다음 행동의 정보적 위치
7. 직접 진입 시 보충해야 하는 문맥
8. 예외 상태와 빈 상태의 정보 대체 원칙
9. 광고가 허용되는 정보 경계와 금지되는 정보 구간
10. SEO·GEO를 위해 삭제·은폐·분리하면 안 되는 정보
11. Visual Design 단계로 전달할 정보 구조

## 적용 화면

- Homepage
- Category
- Hub
- Article Detail
- Search
- Financial Glossary
- Learning Guide
- Language Entry

## 소유하지 않는 결정

이 문서는 다음을 정의하지 않는다.

- 새로운 프로젝트 철학
- Knowledge·Category·Hub·Topic·Node·Article의 원천 정의
- 새로운 정보 객체 또는 관계
- Information Architecture
- User Flow
- Screen Responsibility
- 브랜드·UX·시각 디자인 원칙
- 색상
- 폰트
- 여백
- 크기
- 좌표
- 컴포넌트 스타일
- 레이아웃 디자인
- CSS
- 코드
- API
- 데이터 구조
- 구현 방법
- 반응형 구현

상위 Source of Truth에 없는 객체·관계·상태는 이 문서에서 만들지 않는다.

---

# 1. Source of Truth 권한 경계

| 문서 | 고유 책임 | Wireframe과의 관계 |
|---|---|---|
| `ROBO5_MASTER_DESIGN_CONSTITUTION.md` | 브랜드·UX·디자인 원칙 | 정보 강조 목적과 Visual Design 인계 제약 |
| `ROBO5_INFORMATION_ARCHITECTURE.md` | 정보 객체·관계·Navigation·Discovery | 배치할 정보와 관계의 승인 근거 |
| `ROBO5_USER_FLOW.md` | 목적별 진입·상태 변화·분기·복귀·종료 | 정보가 필요한 시점과 다음 행동의 근거 |
| `ROBO5_SCREEN_ARCHITECTURE.md` | 상태와 이동을 담당하는 화면 책임 | 화면별 정보 책임의 경계 |
| `ROBO5_WIREFRAME_GUIDE.md` | 정보 위계·섹션 순서·상태별 대체 정보 | 승인된 화면 책임의 정보 구조화 |
| Visual Design | 시각적 표현 | 승인된 정보 구조의 표현 |
| Implementation | 기술 실행 | 승인된 구조와 표현의 구현 |

## 충돌 처리

Wireframe 검토 중 상위 문서와의 충돌 또는 누락을 발견하면 다음 순서로 처리한다.

```text
문제 정보 확인
→ 담당 Screen Responsibility 확인
→ 근거 User Flow 확인
→ 승인된 IA 관계 확인
→ Master Design Constitution 제약 확인
→ Wireframe 책임 여부 판정
→ 상위 문서의 문제이면 해당 문서 검토로 반환
```

Wireframe 단계에서 상위 문서의 누락을 임의로 보완하지 않는다.

---

# 2. Wireframe 기본 원칙

## 2.1 정보 우선

Wireframe은 무엇이 어떻게 보이는지가 아니라 무엇이 먼저 이해되어야 하는지를 결정한다.

## 2.2 목적 선행

사용자는 추천·광고·보조 정보보다 먼저 현재 화면의 목적과 범위를 이해해야 한다.

## 2.3 문맥 선행

사용자는 다음 행동을 선택하기 전에 현재 위치와 현재 Knowledge의 관계를 이해해야 한다.

## 2.4 주경로와 보조 경로 분리

순차 학습, 선택 확장, 빠른 용어 확인, 상위 문맥 복귀와 종료를 하나의 추천 영역으로 혼합하지 않는다.

## 2.5 직접 진입 정상화

Homepage를 거치지 않은 진입을 예외로 취급하지 않는다. 각 화면은 현재 목적을 먼저 충족하면서 필요한 상위 문맥을 함께 제공한다.

## 2.6 실제 관계만 표시

존재하지 않는 Previous·Next, Related Knowledge, 번역본, Glossary 상세, Path 또는 상위 문맥을 빈 공간 보충용으로 만들지 않는다.

## 2.7 선택 가능한 종료

사용자는 현재 목적을 달성한 뒤 추가 이동 없이 종료할 수 있어야 한다. 다음 행동은 강제 연속 소비가 아니다.

## 2.8 광고 비의존성

광고가 없어도 모든 화면의 정보 구조와 학습 흐름이 완전해야 한다.

---

# 3. 공통 정보 위계

| 위계 | 정보 역할 | 배치 원칙 |
|---|---|---|
| 1차 정보 | 화면 정체성, 현재 목적, 중심 질문 | 첫 정보 구간에서 이해 가능해야 한다 |
| 2차 정보 | 현재 범위, 위치, 직접 답변, 핵심 판단 | 1차 정보 직후에 둔다 |
| 3차 정보 | 주요 탐색·학습 대상 | 목적과 문맥을 이해한 뒤 둔다 |
| 4차 정보 | 순차 이동·관련 확장·보조 탐색 | 핵심 과업 뒤에 분리해 둔다 |
| 5차 정보 | 최신 정보·부가 정보·신뢰 보강 정보 | 주된 과업을 방해하지 않는 후순위에 둔다 |
| 복구 정보 | 빈·예외 상태의 사실과 대안 | 실패 사실과 함께 즉시 제공한다 |

## 공통 위계 규칙

- 화면 정체성을 보조 정보보다 먼저 둔다.
- 현재 위치를 다음 행동보다 먼저 둔다.
- 직접 답변을 추천과 광고보다 먼저 둔다.
- 주경로를 선택 확장보다 먼저 둔다.
- Previous·Next를 Related Knowledge보다 먼저 둔다.
- 짧은 용어 확인을 상세 학습보다 먼저 둔다.
- 검색 표현과 결과 문맥을 결과 수보다 먼저 이해시킨다.
- 존재하지 않는 정보 영역은 제거하고 유효한 복구 정보로 대체한다.

---

# 4. 공통 진입 및 문맥 원칙

## 직접 진입 시 필수 문맥

직접 진입 가능한 화면은 해당되는 범위에서 다음 정보를 제공한다.

- 현재 정보공간 또는 언어
- 현재 화면의 목적
- 현재 Category·Hub·Topic·Path 문맥
- 현재 질문 또는 검색 표현
- 현재 Knowledge와 상위 구조의 관계
- 진입 전에 알고 있어야 하는 승인된 선수 관계
- 현재 목적을 달성한 뒤 가능한 주요 행동

## 문맥 보존 대상

화면 책임이 전환될 때 다음 문맥을 가능한 범위에서 유지한다.

- 사용자의 현재 목적
- 현재 질문 또는 검색 표현
- 진입한 Category·Hub·Path
- 현재 Knowledge
- Related 이동의 관계 이유
- Glossary를 연 원래 Article
- 언어 이동 전 현재 Knowledge와 Path

문맥을 확인할 수 없으면 추측하지 않고 가장 가까운 유효 문맥을 제공한다.

---

# 5. 공통 다음 행동 원칙

## 주요 다음 행동

주요 다음 행동은 현재 화면 책임을 직접 완수하거나 승인된 주경로로 인계한다.

## 보조 다음 행동

보조 다음 행동은 현재 목적 달성 후의 선택 확장, 빠른 확인, 상위 복귀 또는 재탐색을 담당한다.

## 행동 배치 순서

```text
현재 목적과 문맥
→ 핵심 정보 또는 직접 답변
→ 주요 다음 행동
→ 보조 다음 행동
→ 종료 또는 상위 복귀
```

화면별 정보 특성에 따라 주요 행동이 핵심 정보 앞의 시작점 선택으로 나타날 수 있으나, 화면 목적과 범위보다 앞설 수 없다.

---

# 6. 공통 예외·빈 상태 체계

각 예외·빈 상태는 다음 항목을 충족해야 한다.

| 항목 | 정의 |
|---|---|
| 상태 사실 | 무엇이 존재하지 않거나 사용할 수 없는지 명확히 알린다 |
| 유지 문맥 | 사용자의 원래 목적·검색 표현·현재 위치 중 유효한 것을 보존한다 |
| 제거 영역 | 정상 상태에서만 성립하는 영역을 표시하지 않는다 |
| 대체 영역 | 제거된 정상 영역 대신 유효한 정보와 복구 경로를 제공한다 |
| 주요 복구 행동 | 가장 가까운 유효 문맥으로 연결한다 |
| 보조 복구 행동 | 검색·상위 분야·인접 Knowledge 등 승인된 대안을 제공한다 |
| 금지 | 존재하지 않는 관계나 콘텐츠를 암시하지 않는다 |

## 공통 대상 상태

- 검색 결과 없음
- 존재하지 않는 정보
- 상위 문맥 없음
- Previous 없음
- Next 없음
- Related Knowledge 없음
- Learning Path 단절
- Glossary 상세 없음
- 대응 번역본 없음
- 오래되거나 변경된 Knowledge
- 예상과 다른 정보 도달
- 필요한 화면 문맥 확인 불가

---

# 7. 공통 광고 원칙

## 금지 구간

- 화면 정체성과 핵심 목적 사이
- 제목과 직접 답변 사이
- 첫 문단 내부
- 검색 표현과 첫 결과 사이
- 용어와 짧은 정의 사이
- Learning Path 단계 사이
- Previous와 Next 사이
- 원래 문맥과 Glossary 복귀 행동 사이
- 언어 이동 판단 과정
- 오류 사실과 주요 복구 행동 사이
- 하나의 의미 단위 내부

## 허용 가능한 구간

- 하나의 완결된 정보 단위가 끝난 뒤
- 주된 사용자 판단이 끝난 뒤
- 본문의 독립된 의미 단위 사이
- 핵심 과업에서 보조 정보로 전환되는 경계
- 화면의 핵심 과업이 종료된 뒤

## 보호 원칙

- 광고는 콘텐츠·추천·버튼과 구분되어야 한다.
- 광고는 학습 경로와 복구 경로를 끊지 않아야 한다.
- 연속된 광고 구간을 만들지 않는다.
- 광고는 필수 영역으로 정의하지 않는다.

---

# 8. 공통 SEO·GEO 보호 원칙

Wireframe은 기술 구현을 정의하지 않는다. 다만 다음 정보가 삭제되거나 의미상 분리되지 않도록 보호한다.

- 화면별 하나의 명확한 중심 제목
- 중심 질문과 직접 답변
- 올바른 제목 정보 위계
- 현재 Category·Hub·Topic 문맥
- Breadcrumb의 위치 문맥
- Learning Path와 현재 단계
- Previous·Next
- Related Knowledge와 관계 이유
- 관련 Glossary Term
- 언어별 정보공간
- 승인된 대응 Knowledge 관계
- 게시일·수정일 등 필요한 신뢰 정보
- 링크 목적을 설명하는 텍스트
- 검색 표현과 결과의 관계
- 빈 상태의 사실과 복구 정보

메타데이터, 구조화 데이터, 시맨틱 마크업과 기술적 SEO·GEO 구현은 이 문서의 범위가 아니다.

---

# 9. Homepage Wireframe

## 목적

구체적인 주제를 정하지 않은 사용자가 Robo5의 정체성, 정보 범위, 대표 분야와 유효한 학습 시작점을 판단하게 한다.

## 담당 Screen Responsibility

- 주책임: `SR-01 전체 정보공간 진입 책임`
- 보조책임: `SR-07 목적별 학습 시작 책임`
- 언어 인계: `SR-08 언어 정보공간 진입 책임`
- 복구 인계: `SR-09 실패·빈 상태 복구 책임`

## 정보 위계

1. 플랫폼 정체성과 정보 범위
2. 대표 학습 시작점
3. 핵심 Category
4. 추천 Learning Path
5. 주요 Knowledge
6. 최근 업데이트
7. 금융용어·Search·Learning Guide 진입
8. 사이트 신뢰 정보

## 화면 섹션 최종 순서

1. 플랫폼 정체성
2. 대표 학습 시작점
3. 핵심 Category
4. 추천 Learning Path
5. 주요 Knowledge
6. 최근 업데이트
7. 금융용어 빠른 확인
8. Search·Learning Guide 진입
9. 사이트 신뢰 영역

## 필수 영역

- 플랫폼 정체성과 교육 목적
- 다루는 금융·경제 정보 범위
- 최소 하나의 유효한 대표 학습 시작점
- 핵심 Category
- 승인된 대표 Learning Path
- Search 또는 Knowledge 재진입 경로
- 신뢰·교육 목적 정보

## 선택 영역

- 최근 업데이트
- 추천 Knowledge
- 많이 읽는 Knowledge
- 금융용어 빠른 확인
- 승인된 Supporting Domain 진입

선택 영역은 핵심 시작점보다 앞설 수 없다.

## 첫 정보 구간에서 사용자가 이해해야 하는 내용

- Robo5가 금융상품 판매 서비스가 아니라 금융·경제 지식 플랫폼이라는 사실
- 사이트가 어떤 분야를 다루는가
- 지금 무엇부터 시작할 수 있는가

## 주요 다음 행동

- 대표 Category 선택
- 대표 Hub 또는 Learning Path 시작
- 목적에 맞는 Learning Guide 진입

## 보조 다음 행동

- Search
- Financial Glossary
- 최근 또는 추천 Knowledge 확인
- 대상 언어 정보공간 진입

## 직접 진입 시 필요한 문맥

Homepage 자체가 전체 정보공간의 시작점이므로 별도 상위 문맥을 요구하지 않는다. 다만 현재 언어, 사이트 정체성, 핵심 범위와 대표 시작점을 즉시 제공한다.

## 예외 상태

- 대표 시작점 일부가 유효하지 않음: 해당 항목을 제거하고 승인된 다른 시작점만 표시한다.
- 특정 Category 또는 Path가 변경됨: 현재 유효한 Category·Hub·Path로 대체한다.
- 현재 언어의 정보 범위가 다른 언어보다 제한됨: 현재 언어에서 실제 제공되는 범위만 설명한다.

## 빈 상태

- 최근 업데이트 없음: 최근 업데이트 영역을 제거한다.
- 추천 Knowledge 없음: 해당 선택 영역을 제거한다.
- Financial Glossary 항목 없음: 용어 미리보기를 제거하고 Glossary 진입이 유효할 때만 진입 경로를 유지한다.
- 유효한 대표 Path 없음: 존재하지 않는 Path를 만들지 않고 Category·Hub·Search 중심으로 복구한다.

## 광고 허용·금지 원칙

- 금지: 플랫폼 정체성, 대표 학습 시작점, 핵심 Category 사이.
- 금지: 추천 Learning Path 내부.
- 허용: 핵심 탐색 구조를 이해한 뒤 독립된 Knowledge 구간 사이.
- 허용: 핵심 과업 종료 후 보조 정보 경계.

## SEO·GEO 보호 요소

- 플랫폼의 명확한 중심 제목
- 금융·경제 지식 플랫폼이라는 설명
- 핵심 Category와 대표 Hub의 의미 있는 연결
- 대표 Learning Path
- 언어별 정보공간의 구분
- 사이트 신뢰와 교육 목적

## Visual Design 단계로 전달할 사항

- 플랫폼 정체성과 대표 시작점을 최상위로 표현한다.
- Category·Path·Knowledge의 역할 차이를 시각적으로 구분한다.
- 최근·인기·추천 정보는 보조 위계로 표현한다.
- 광고는 핵심 탐색 구조와 혼동되지 않게 한다.
- 실제 배치, 표현 형태와 화면 폭별 재배치는 Visual Design이 결정한다.

---

# 10. Category Wireframe

## 목적

특정 분야의 범위와 목적을 설명하고 사용자가 적절한 Hub·Topic·Knowledge를 선택하게 한다.

## 담당 Screen Responsibility

- 주책임: `SR-02 분야 탐색 책임`
- Hub 인계: `SR-03 주제 학습 책임`
- Knowledge 인계: `SR-04 개별 Knowledge 확인 책임`
- 복구 인계: `SR-09`

## 정보 위계

1. 현재 Category 정체성과 범위
2. 이 분야에서 배우는 내용
3. 대표 학습 시작점
4. 핵심 Hub
5. 주요 Topic
6. 대표 Knowledge
7. 최근 또는 변경된 Knowledge
8. 승인된 관련 Category

## 화면 섹션 최종 순서

1. Breadcrumb
2. Category 제목과 범위
3. 이 분야에서 배우는 내용
4. 추천 시작 Hub
5. 핵심 Hub
6. 주요 Topic
7. 대표 Knowledge
8. 최근 또는 변경된 Knowledge
9. 승인된 관련 Category
10. 전체 정보공간 복귀

## 필수 영역

- Breadcrumb 또는 동등한 상위 위치 문맥
- Category 이름과 범위
- Category에서 배우는 내용
- 최소 하나의 유효한 Hub·Topic·Knowledge 진입점
- Hub와 Topic의 역할이 구분된 탐색 정보

## 선택 영역

- 추천 시작 Hub
- 대표 Knowledge
- 최근 또는 변경된 Knowledge
- 승인된 관련 Category

## 첫 정보 구간에서 사용자가 이해해야 하는 내용

- 현재 어떤 분야에 들어왔는가
- 이 Category에서 무엇을 탐색할 수 있는가
- Category와 Hub의 역할이 어떻게 다른가
- 어떤 Hub 또는 Knowledge에서 시작할 수 있는가

## 주요 다음 행동

- 목적에 맞는 Hub 선택
- 구체적인 Knowledge 선택

## 보조 다음 행동

- Topic을 통한 범위 축소
- 관련 Category 이동
- Search
- 전체 정보공간 복귀

## 직접 진입 시 필요한 문맥

- 현재 Category의 상위 Domain
- Category의 범위와 제외 범위
- Category에 속한 승인된 Hub·Topic
- 대표 시작점

## 예외 상태

- 추천 시작 Hub 없음: 추천 영역을 제거하고 승인된 Hub·Topic 목록으로 시작한다.
- 관련 Category 없음: 관련 Category 영역을 제거한다.
- 일부 Hub가 변경됨: 현재 유효한 Hub만 표시한다.
- Category 범위와 일치하지 않는 Knowledge 발견: 배치하지 않고 원천 관계 검토로 반환한다.

## 빈 상태

- Hub 없음: Topic 또는 유효한 Knowledge와 Search 복구 경로를 제공한다.
- Topic 없음: Topic 영역을 제거하고 Hub·Knowledge를 유지한다.
- Knowledge 없음: 존재하지 않는 Knowledge를 채우지 않고 유효한 Hub 또는 상위 정보공간으로 안내한다.
- 유효한 하위 문맥 없음: 상태 사실과 Search·전체 정보공간 복귀를 제공한다.

## 광고 허용·금지 원칙

- 금지: Category 설명과 추천 시작 Hub 사이.
- 금지: 하나의 Hub·Topic 그룹 내부.
- 허용: 하나의 탐색 단위가 끝나고 다음 독립 단위가 시작되는 경계.
- 허용: 주된 분야 탐색이 끝난 뒤 보조 정보 전환 지점.

## SEO·GEO 보호 요소

- Category 중심 제목과 범위 설명
- 상위 Domain 문맥
- 핵심 Hub·Topic 관계
- 대표 Knowledge로 향하는 설명적 연결
- 변경된 Knowledge의 필요한 현재성 정보
- Breadcrumb 문맥

## Visual Design 단계로 전달할 사항

- Category 범위와 시작점을 최상위로 표현한다.
- Hub·Topic·Knowledge를 같은 유형처럼 보이게 하지 않는다.
- 추천 시작점과 전체 탐색 대상을 구분한다.
- 관련 Category는 보조 위계로 표현한다.

---

# 11. Hub Wireframe

## 목적

하나의 주제에서 무엇을 배우는지 설명하고 전체 Learning Path와 추천 시작점 또는 현재 단계를 판단하게 한다.

## 담당 Screen Responsibility

- 주책임: `SR-03 주제 학습 책임`
- Knowledge 인계: `SR-04`
- 복구 인계: `SR-09`

## 정보 위계

1. Hub 주제와 학습 범위
2. 핵심 질문과 학습 결과
3. 추천 시작점
4. 전체 Learning Path
5. 현재 또는 선택한 Node 문맥
6. 선수·후속 관계
7. 선택 확장 Knowledge
8. 세부 Knowledge
9. 상위 Category

## 화면 섹션 최종 순서

1. Breadcrumb
2. Hub 제목과 학습 범위
3. 핵심 질문과 학습 결과
4. 추천 시작점
5. 전체 Learning Path
6. 현재 단계 또는 주요 Node
7. 선수·후속 Knowledge
8. 선택 확장 Knowledge
9. 세부 Knowledge
10. 상위 Category 복귀

## 필수 영역

- Breadcrumb 또는 상위 Category 문맥
- Hub 제목과 학습 범위
- 핵심 질문
- 승인된 Learning Path 또는 유효한 시작 Knowledge
- Path의 시작점
- 개별 Knowledge 진입 경로

## 선택 영역

- 현재 단계
- 선수 Knowledge
- 선택 확장 Knowledge
- 세부 Knowledge

## 첫 정보 구간에서 사용자가 이해해야 하는 내용

- 이 Hub에서 무엇을 배우는가
- 학습 범위가 어디까지인가
- 처음 또는 현재 어디에서 시작해야 하는가

## 주요 다음 행동

- 추천 시작 Node 진입
- 현재 목적에 맞는 Path 단계 선택

## 보조 다음 행동

- 선수 Knowledge 확인
- 선택 확장 Knowledge 확인
- 세부 Knowledge 탐색
- 상위 Category 복귀

## 직접 진입 시 필요한 문맥

- 상위 Category
- Hub의 학습 범위
- Path 목적과 전체 순서
- 시작 Node
- 현재 단계가 확인되는 경우 현재 위치

## 예외 상태

- 중간 Node 목적을 가진 직접 진입: 전체 Path를 보여주되 현재 목적에 맞는 단계가 먼저 식별되게 한다.
- 여러 Path가 연결됨: 승인된 Path의 목적 차이를 설명하고 하나로 합치지 않는다.
- 선수 Knowledge가 필요한 경우: 승인된 선수 관계와 원래 단계 복귀 문맥을 함께 제공한다.
- Path 문맥 확인 불가: 확인 가능한 Hub 범위와 Knowledge만 제공하고 추측된 순서를 만들지 않는다.

## 빈 상태

- Path 없음: 유효한 시작 Knowledge와 세부 Knowledge만 제공하고 Path를 임의 생성하지 않는다.
- 시작 Node 없음: 상태 사실과 유효한 Knowledge 또는 Search 경로를 제공한다.
- Path 단절: 존재하는 단계까지만 표시하고 상위 Hub 문맥과 Search로 복구한다.
- 선택 확장 없음: 해당 영역을 제거한다.

## 광고 허용·금지 원칙

- 금지: Hub 설명과 Learning Path 사이.
- 금지: Learning Path 단계 사이.
- 금지: 현재 단계와 선수·후속 관계 사이.
- 허용: 전체 Path 이해가 끝난 뒤 보조 Knowledge 구간 전후.

## SEO·GEO 보호 요소

- Hub 중심 제목과 범위
- 핵심 질문과 학습 결과
- 상위 Category
- Learning Path 전체 순서
- 시작·현재 Node
- 선수·후속 관계
- 선택 확장 관계의 이유

## Visual Design 단계로 전달할 사항

- Hub 범위와 Path가 화면의 중심임을 표현한다.
- 필수 순서와 선택 확장을 명확히 구분한다.
- 시작·중간·끝 상태를 정보 의미에 맞게 구분한다.
- Path가 목록형 Article 모음처럼 축소되어 보이지 않게 한다.

---

# 12. Article Detail Wireframe

## 목적

하나의 중심 질문에 직접 답하고 현재 Knowledge의 위치와 순차·관련 관계를 판단하게 한다.

## 담당 Screen Responsibility

- 주책임: `SR-04 개별 Knowledge 확인 책임`
- 용어 인계: `SR-06 용어 확인 책임`
- 언어 인계: `SR-08`
- 복구 인계: `SR-09`

## 정보 위계

1. 현재 위치와 중심 질문
2. 직접 답변 또는 핵심 요약
3. 신뢰 판단 정보
4. 본문 Knowledge
5. 핵심 정리
6. 현재 Learning Path 문맥
7. Previous·Next
8. Related Knowledge
9. 관련 Glossary Term
10. 상위 Hub·Category

## 화면 섹션 최종 순서

1. Breadcrumb
2. 제목과 중심 질문
3. 핵심 답변
4. 신뢰 정보
5. 본문
6. 핵심 정리
7. Learning Path와 현재 위치
8. Previous / Next
9. Related Knowledge
10. Glossary
11. 상위 Hub·Category

## 필수 영역

- Breadcrumb 또는 동등한 위치 문맥
- 하나의 명확한 제목과 중심 질문
- 직접 답변 또는 핵심 요약
- 본문
- 필요한 신뢰 정보
- 상위 Category·Hub 문맥
- 존재하는 경우 Learning Path와 순차 관계

## 선택 영역

- 핵심 정리
- Related Knowledge
- Glossary
- 선수 Knowledge
- 게시·수정 외의 추가 신뢰 정보

## 첫 정보 구간에서 사용자가 이해해야 하는 내용

- 지금 어떤 질문을 다루는가
- 질문의 핵심 답은 무엇인가
- 이 Knowledge가 어느 Category·Hub·Path에 속하는가

## 주요 다음 행동

- 현재 답을 확인한 뒤 종료
- 승인된 Next Knowledge로 순차 이동
- 필요한 선수 또는 Previous Knowledge 확인

## 보조 다음 행동

- Related Knowledge 확장
- Glossary 빠른 확인
- 상위 Hub·Category 복귀
- 대응 언어 Knowledge 이동

## 직접 진입 시 필요한 문맥

- 현재 질문
- 직접 답변
- 상위 Category·Hub
- 확인 가능한 Learning Path와 현재 단계
- 외부 진입 여부와 관계없이 다음 행동의 의미

## 예외 상태

- Previous 없음: 현재가 Path 시작임을 알리고 Next 또는 Hub를 제공한다.
- Next 없음: 현재가 Path 끝임을 알리고 종료·Hub 복귀·Related 확장을 분리해 제공한다.
- 여러 Path에 속함: 확인 가능한 진입 Path를 유지하고 다른 Path를 현재 Path처럼 합치지 않는다.
- 상위 문맥 없음: Search 또는 유효한 Category 문맥으로 복구한다.
- 오래되거나 변경된 Knowledge: 현재성 사실과 유효한 최신 Knowledge 또는 문맥을 제공한다.
- 예상과 다른 정보 도달: 현재 질문과 원래 목적을 비교할 수 있게 하고 상위 문맥 또는 Search를 제공한다.

## 빈 상태

- Related Knowledge 없음: 영역을 제거하고 현재 Flow 종료 또는 Hub 복귀를 제공한다.
- Glossary 없음: 영역을 제거한다.
- Learning Path 없음: Path와 Previous·Next를 표시하지 않고 상위 Hub·Category만 제공한다.
- 본문을 사용할 수 없음: 존재하지 않는 답을 만들지 않고 상태 사실과 유효한 상위·인접 문맥을 제공한다.

## 광고 허용·금지 원칙

- 금지: Breadcrumb·제목·핵심 답변 사이.
- 금지: 첫 문단 내부.
- 금지: Learning Path 내부.
- 금지: Previous와 Next 사이.
- 금지: Glossary 확인과 원래 문맥 복귀 사이.
- 허용: 본문의 완결된 의미 단위 사이.
- 허용: 본문 종료 후 보조 정보로 전환되는 경계.

## SEO·GEO 보호 요소

- 하나의 중심 제목
- 중심 질문과 직접 답변
- 논리적인 본문 제목 위계
- Breadcrumb
- Category·Hub·Topic 문맥
- 게시일·수정일 등 필요한 신뢰 정보
- Learning Path와 현재 단계
- Previous·Next
- Related Knowledge와 관계 이유
- 관련 Glossary Term
- 대응 언어 Knowledge 관계

## Visual Design 단계로 전달할 사항

- 중심 질문과 핵심 답변을 가장 먼저 이해시키는 위계.
- 신뢰 정보는 핵심 답변을 방해하지 않는 보조 위계.
- 본문 읽기 흐름과 후속 탐색을 명확히 분리.
- Previous·Next와 Related를 서로 다른 의미로 표현.
- Glossary는 빠른 확인과 상세 학습을 구분.
- 상위 Hub·Category는 복귀 문맥으로 표현.

---

# 13. Search Wireframe

## 목적

사용자의 검색 표현을 유효한 Knowledge 문맥과 연결하고 빠른 확인·깊은 학습·상위 탐색 중 적절한 경로로 재진입하게 한다.

## 담당 Screen Responsibility

- 주책임: `SR-05 검색·재진입 책임`
- Glossary 인계: `SR-06`
- 복구 인계: `SR-09`

## 정보 위계

1. 현재 검색 표현과 상태
2. 결과 해석 범위
3. 가장 직접적인 Knowledge
4. 관련 Hub·Category 문맥
5. 관련 Glossary Term
6. 범위 조정
7. 재검색
8. 결과 없음 복구

## 화면 섹션 최종 순서

1. Search 목적과 현재 검색 표현
2. 검색 상태와 결과 해석 문맥
3. 가장 직접적인 Knowledge 결과
4. 관련 Hub·Category
5. 관련 Glossary Term
6. 범위 축소 또는 확장
7. 재검색
8. 대체 Discovery 또는 빈 상태 복구

## 필수 영역

- 현재 검색 표현
- 검색 결과가 해석되는 범위
- 유효한 결과 또는 명확한 결과 없음 상태
- 결과의 Knowledge 유형과 상위 문맥
- 재검색 또는 복구 행동

## 선택 영역

- 관련 Hub·Category
- 관련 Glossary Term
- 범위 축소·확장
- 관계 이유가 있는 대체 Discovery

## 첫 정보 구간에서 사용자가 이해해야 하는 내용

- 어떤 표현을 검색했는가
- 결과가 어떤 Knowledge 범위에서 해석되는가
- 가장 직접적인 결과가 무엇인가
- 결과가 없으면 무엇을 바꿀 수 있는가

## 주요 다음 행동

- 가장 직접적인 Knowledge 진입
- 넓은 검색일 경우 적절한 Category·Hub로 범위 축소
- 검색 표현 조정 또는 재검색

## 보조 다음 행동

- Glossary 빠른 확인
- 관련성이 설명된 Discovery
- 상위 정보공간 진입

## 직접 진입 시 필요한 문맥

- 현재 검색 표현
- 검색 상태
- 결과가 속한 Category·Hub·Glossary 문맥
- 빠른 확인과 깊은 학습의 차이

## 예외 상태

- 넓은 표현: Category·Hub·Glossary 문맥을 먼저 제시해 범위를 좁힌다.
- 구체적인 질문: 가장 직접적인 Knowledge를 먼저 제시한다.
- 동일 Knowledge의 중복 표현: 별도 결과처럼 반복하지 않고 하나의 Knowledge 관계로 처리한다.
- 결과 유형 일부만 존재: 존재하는 유형만 표시한다.

## 빈 상태

최종 순서는 다음과 같다.

1. 결과 없음 사실
2. 현재 검색 표현 확인
3. 검색 표현 조정
4. 승인된 인접 용어
5. 유효한 상위 Category·Hub·Glossary
6. 새로운 검색

존재하지 않는 결과를 추천처럼 표시하지 않는다.

## 광고 허용·금지 원칙

- 금지: 검색 표현과 첫 결과 사이.
- 금지: 결과 항목처럼 오인될 수 있는 위치.
- 금지: 결과 없음 사실과 주요 복구 행동 사이.
- 허용: 하나의 결과 유형 그룹이 끝난 경계.
- 허용: 주된 결과 판단 후 보조 Discovery로 전환되는 경계.

## SEO·GEO 보호 요소

- 현재 검색 표현
- 결과와 검색 표현의 의미 관계
- 결과별 Category·Hub·Glossary 문맥
- 설명적인 결과 링크
- 중복 Knowledge의 통합 의미
- 결과 없음 사실과 복구 정보

## Visual Design 단계로 전달할 사항

- 검색 표현, 결과 문맥과 결과를 서로 다른 위계로 표현한다.
- 구체적 Knowledge와 상위 Category·Hub 결과를 구분한다.
- Glossary 결과가 Article 결과처럼 보이지 않게 한다.
- 광고가 검색 결과로 오인되지 않게 한다.
- 결과 없음 상태의 복구 행동을 명확히 표현한다.

---

# 14. Financial Glossary Wireframe

## 목적

용어의 의미를 빠르게 확인하고 관련 분야·관련 용어·상세 Knowledge로 확장하게 한다.

## 담당 Screen Responsibility

- 주책임: `SR-06 용어 확인 책임`
- 상세 Knowledge 인계: `SR-04`
- 복구 인계: `SR-09`

## 정보 위계

1. 용어 확인 목적과 현재 용어
2. 짧은 정의
3. 관련 분야
4. 동의어·약어·영문명
5. 상위·하위·관련 용어
6. 상세 Knowledge
7. 원래 Article 문맥 복귀

## 화면 섹션 최종 순서

1. Glossary 목적과 용어 접근
2. 현재 용어 또는 용어군
3. 짧은 정의
4. 관련 분야
5. 승인된 명칭 관계
6. 상위·하위·관련 용어
7. 상세 Knowledge
8. 원래 문맥 복귀 또는 추가 탐색

## 필수 영역

- 현재 용어
- 짧고 직접적인 정의
- 관련 분야 문맥
- 독립 진입인지 Article 문맥 진입인지에 필요한 문맥
- 유효한 종료 또는 복귀 행동

## 선택 영역

- 동의어
- 약어
- 영문명
- 상위·하위·관련 용어
- 상세 Knowledge

## 첫 정보 구간에서 사용자가 이해해야 하는 내용

- 어떤 용어를 확인하고 있는가
- 용어의 짧은 의미가 무엇인가
- 이 용어가 어느 분야와 관련되는가

## 주요 다음 행동

- 짧은 정의 확인 후 종료
- Article 문맥에서 진입한 경우 원래 Article로 복귀
- 승인된 상세 Knowledge로 이동

## 보조 다음 행동

- 관련 용어 확인
- 관련 Category·Hub 탐색
- Search

## 직접 진입 시 필요한 문맥

### 독립 진입

- Glossary의 빠른 확인 목적
- 현재 용어
- 관련 분야
- 관련 용어와 상세 Knowledge의 차이

### Article 문맥 진입

- 원래 Article과 현재 질문
- 확인 전 위치 또는 복귀 대상
- 짧은 정의와 상세 학습의 분리

표현 방식은 Visual Design 단계가 결정한다.

## 예외 상태

- 동의어·약어 없음: 해당 영역을 제거한다.
- 관련 용어 없음: 해당 영역을 제거한다.
- 원래 문맥 유지 불가: 확인 가능한 최근 유효 문맥이나 Search를 제공한다.
- 용어 확인 중 새 학습 목적 발생: 상세 Knowledge 또는 Hub로 인계하되 원래 목적과 새 목적을 혼합하지 않는다.

## 빈 상태

- 상세 Knowledge 없음: 짧은 정의에서 종료하거나 상위 용어 문맥·Search를 제공한다.
- 관련 분야 없음: 추측하지 않고 확인 가능한 용어 정보와 Search만 제공한다.
- 용어 없음: 상태 사실, 검색 표현 조정, 인접 용어와 Search를 제공한다.

## 광고 허용·금지 원칙

- 금지: 용어와 짧은 정의 사이.
- 금지: Article 문맥과 복귀 행동 사이.
- 금지: 하나의 용어 관계군 내부.
- 허용: 독립적인 용어군 또는 상세 학습 구간이 끝난 뒤.

## SEO·GEO 보호 요소

- 용어의 명확한 중심 제목
- 직접 정의
- 관련 분야
- 승인된 동의어·약어·영문명
- 상위·하위·관련 용어 관계
- 상세 Knowledge 관계
- Article에서 진입한 경우 원래 문맥

## Visual Design 단계로 전달할 사항

- 용어와 정의를 최우선으로 표현한다.
- 명칭 관계와 개념 관계를 구분한다.
- 빠른 확인과 상세 Knowledge 전환을 구분한다.
- 독립 진입과 Article 보조 상태의 문맥 차이를 표현한다.
- 복귀 행동이 광고나 관련 용어와 혼동되지 않게 한다.

---

# 15. Learning Guide Wireframe

## 목적

사용 목적이나 학습 수준에 맞는 승인된 시작점과 Learning Path를 찾게 한다.

## 담당 Screen Responsibility

- 주책임: `SR-07 목적별 학습 시작 책임`
- Hub 인계: `SR-03`
- Knowledge 인계: `SR-04`
- 복구 인계: `SR-09`

## 정보 위계

1. Guide의 목적
2. 학습 목적 또는 수준
3. 목적별 추천 시작점
4. 연결된 Learning Path
5. Path의 범위와 시작 Knowledge
6. 필요한 선수 Knowledge
7. Category·Hub 문맥
8. 대체 시작점

## 화면 섹션 최종 순서

1. Learning Guide의 역할
2. 학습 목적 또는 수준
3. 목적별 시작점
4. 연결된 Learning Path
5. Path 범위와 시작 Knowledge
6. 필요한 선수 Knowledge
7. 관련 Category·Hub
8. 대체 시작점

## 필수 영역

- Learning Guide의 역할
- 선택 가능한 승인된 학습 목적 또는 수준
- 목적별 시작점
- 연결된 Hub·Path·Knowledge 문맥
- 선택 후 도착하는 정보공간

## 선택 영역

- 선수 Knowledge
- 대체 시작점
- 관련 Category·Hub

## 첫 정보 구간에서 사용자가 이해해야 하는 내용

- 이 화면이 새로운 Knowledge 분류가 아니라 학습 시작점 안내라는 사실
- 어떤 기준으로 시작점을 선택하는가
- 선택 후 어느 Hub 또는 Knowledge로 이동하는가

## 주요 다음 행동

- 목적 또는 수준 선택
- 연결된 Learning Path 시작
- 추천 Hub 또는 시작 Knowledge 진입

## 보조 다음 행동

- 선수 Knowledge 확인
- 대체 시작점 선택
- 관련 Category·Hub 탐색

## 직접 진입 시 필요한 문맥

- Guide의 역할
- 현재 제공되는 목적·수준 기준
- 각 선택이 연결되는 승인된 Path·Hub·Knowledge
- 학습 완료·저장·진도 기능을 전제하지 않는 시작 안내

## 예외 상태

- 하나의 목적에 여러 Path가 연결됨: 목적과 범위의 차이를 설명하고 하나로 합치지 않는다.
- 선수 Knowledge 필요: 원래 시작점과 복귀 목적을 함께 제공한다.
- 현재 언어의 Path 범위가 제한됨: 실제 존재하는 범위만 제시한다.

## 빈 상태

- 적합한 Path 없음: 승인된 Hub·Knowledge 또는 Search를 대체 시작점으로 제공한다.
- 목적별 시작점 없음: 해당 목적을 선택 가능 상태로 표시하지 않는다.
- 선수 Knowledge 없음: 해당 영역을 제거한다.
- 모든 추천 시작점이 유효하지 않음: 상태 사실과 Category·Search 복구 경로를 제공한다.

## 광고 허용·금지 원칙

- 금지: 목적 선택과 추천 Path 사이.
- 금지: 하나의 목적별 안내 단위 내부.
- 금지: Path 단계 사이.
- 허용: 학습 시작점 판단이 끝난 뒤 독립 정보 구간.

## SEO·GEO 보호 요소

- Learning Guide의 목적
- 목적·수준별 시작 기준
- 승인된 Path·Hub·Knowledge 관계
- Path 범위와 시작 Knowledge
- 선수 관계
- 설명적인 이동 텍스트

## Visual Design 단계로 전달할 사항

- Guide가 분류 체계가 아니라 시작점 안내임을 표현한다.
- 목적·수준, 추천 시작점과 Path 범위를 구분한다.
- 필수 선수와 선택 대안을 구분한다.
- 실제로 없는 완료율·저장·진도·재개 상태를 표현하지 않는다.

---

# 16. Language Entry Wireframe

## 목적

일반적인 언어 정보공간 이동과 동일 Knowledge의 대응 언어 이동을 구분하고 이동 후 도달할 정보 범위를 예측하게 한다.

## 담당 Screen Responsibility

- 주책임: `SR-08 언어 정보공간 진입 책임`
- 대상 언어 인계: 대상 언어의 `SR-01~SR-07`
- 복구 인계: `SR-09`

## 정보 위계

1. 현재 언어 정보공간
2. 이동 가능한 대상 언어
3. 이동 유형
4. 대응 Knowledge 존재 여부
5. 유지되는 문맥
6. 유지되지 않는 문맥
7. 대상 언어의 도착 정보공간
8. 대응 Knowledge 없음 대체 경로

## 화면 섹션 최종 순서

1. 현재 언어와 현재 Knowledge 문맥
2. 이동 가능한 대상 언어
3. 일반 언어 이동 또는 대응 Knowledge 이동 구분
4. 이동 후 유지되는 정보
5. 이동 후 유지되지 않는 정보
6. 도착할 정보공간
7. 대응 Knowledge 없음 안내
8. 대상 언어의 상위 정보공간 또는 Search

## 필수 영역

- 현재 언어
- 대상 언어
- 일반 언어 이동과 대응 Knowledge 이동의 구분
- 대응 Knowledge 존재 여부
- 이동 후 도착 범위
- 대응 Knowledge가 없을 때의 유효한 대체 경로

## 선택 영역

- 유지되는 Category·Hub·Path 문맥
- 대상 언어의 상위 Category
- 대상 언어의 Search

## 첫 정보 구간에서 사용자가 이해해야 하는 내용

- 현재 어떤 언어 정보공간에 있는가
- 선택한 언어 이동이 같은 Knowledge로 이동하는지 정보공간만 바꾸는지
- 이동 후 무엇이 유지되고 무엇이 유지되지 않는가

## 주요 다음 행동

- 승인된 대응 Knowledge로 이동
- 대상 언어의 전체 또는 상위 정보공간으로 이동

## 보조 다음 행동

- 대상 언어 Search
- 현재 언어 문맥 유지
- 이동 취소 또는 현재 목적 종료

## 직접 진입 시 필요한 문맥

- 현재 언어 정보공간의 범위
- 현재 Knowledge·Category·Hub·Path
- 대상 언어 정보공간의 실제 범위
- 승인된 대응 Knowledge 유무

Language Entry가 반드시 독립 페이지를 의미하지는 않는다. 어떤 화면 상태로 표현할지는 Visual Design 단계가 결정한다.

## 예외 상태

- 대응 Knowledge 없음: 동일 Knowledge로 이동한다고 암시하지 않는다.
- 이동 후 현재 Path 유지 불가: 유지되지 않는 문맥을 알리고 대상 언어의 상위 정보공간으로 인계한다.
- 대상 언어의 Category 구성이 다름: 현재 언어의 분류를 그대로 복제하지 않고 실제 대상 정보공간을 설명한다.
- 현재 문맥 확인 불가: 대상 언어의 전체 정보공간 또는 Search로 복구한다.

## 빈 상태

- 대상 언어 콘텐츠 없음: 이동 가능 대상으로 표시하지 않는다.
- 대응 번역본 없음: 대상 언어의 Homepage·Category·Search 중 유효한 경로를 제공한다.
- 대상 언어 상위 문맥 없음: 대상 언어 Search 또는 전체 정보공간을 제공한다.

## 광고 허용·금지 원칙

- 언어 이동 판단 과정 전체에서 광고를 금지한다.
- 대응 Knowledge 없음 안내와 복구 행동 사이에 광고를 두지 않는다.

## SEO·GEO 보호 요소

- 현재 언어 정보공간
- 대상 언어 정보공간
- 일반 언어 이동과 대응 Knowledge 이동의 의미 구분
- 승인된 대응 Knowledge 관계
- 대응 Knowledge 없음 상태
- 이동 후 유지되는 상위 문맥

## Visual Design 단계로 전달할 사항

- 일반 언어 이동과 대응 Knowledge 이동을 혼동하지 않게 표현한다.
- 이동 후 유지·비유지 문맥을 명확히 표현한다.
- 독립 화면 여부와 표현 형식은 Visual Design이 결정한다.
- 대응 콘텐츠가 없는 유사 콘텐츠를 번역본처럼 표현하지 않는다.

---

# 17. 화면 간 문맥 보존 규칙

| 전환 | 반드시 보존할 문맥 | 분리해야 할 정보 |
|---|---|---|
| Homepage → Category | 선택한 분야 목적 | 최신·추천 정보 |
| Category → Hub | Category와 선택한 주제 | 다른 Category의 탐색 문맥 |
| Hub → Article | Hub·Path·선택 단계 | 선택 확장 Knowledge |
| Article → Previous·Next | 현재 Path와 이동 전 단계 | Related Knowledge |
| Article → Related | 원래 Knowledge와 관계 이유 | 순차 학습 관계 |
| Article → Glossary | 원래 Article·질문·복귀 위치 | 상세 Knowledge 목적 |
| Search → Knowledge | 검색 표현과 결과 선택 이유 | 일반 Discovery |
| Glossary → Detail | 확인한 용어와 상세 이동 이유 | 원래 Article 복귀 목적 |
| Language Entry → 대응 Knowledge | 현재 Knowledge와 유지 가능한 Path | 일반 언어 정보공간 이동 |
| 실패 상태 → 복구 | 원래 목적과 확인 가능한 유효 문맥 | 존재하지 않는 관계 |

---

# 18. Wireframe 추적 매트릭스

| 화면 | Screen Responsibility | 주요 User Flow | 필수 IA 문맥 | 1차 정보 | 주요 다음 행동 | 핵심 예외·빈 상태 |
|---|---|---|---|---|---|---|
| Homepage | SR-01, SR-07, SR-08 | UF-01, ML-01 | Domain·Category·대표 Path | 플랫폼 범위와 시작점 | Category·Hub·Guide | 대표 시작점 부족 |
| Category | SR-02 | UF-01, UF-02, SD-02 | Category·Hub·Topic | 분야 범위 | Hub·Knowledge | Hub·Topic 부족 |
| Hub | SR-03 | UF-03, UF-05, LP-01, LP-06, LP-07 | Hub·Path·Node | 학습 범위와 시작점 | 시작·현재 Node | Path 단절 |
| Article Detail | SR-04, SR-06, SR-08 | UF-04~UF-09, LP-02~LP-07 | Node·상위 문맥·관계 | 질문과 직접 답변 | 종료·순차 이동 | 관계 부재 |
| Search | SR-05 | SD-01~SD-06 | Search·Knowledge 문맥 | 검색 표현과 결과 관계 | Knowledge·Hub·Glossary | 결과 없음 |
| Financial Glossary | SR-06 | GL-01~GL-03, SD-04 | Term·상세 관계 | 용어와 짧은 정의 | 복귀·상세 학습 | 상세 없음 |
| Learning Guide | SR-07 | UF-01~UF-03 | Guide·Path 관계 | 목적별 시작 기준 | Hub·Node 시작 | 적합한 Path 없음 |
| Language Entry | SR-08 | ML-01~ML-03 | 언어 정보공간·대응 관계 | 이동 유형과 도착 범위 | 대응 Knowledge·상위 공간 | 대응 번역본 없음 |

모든 화면의 비정상 상태는 필요한 경우 `SR-09`에 인계한다.

---

# 19. Wireframe 검증 기준

| 검증 영역 | 검증 질문 |
|---|---|
| Purpose | 첫 정보 구간에서 화면 목적을 이해할 수 있는가? |
| Responsibility | 해당 화면의 승인된 Screen Responsibility만 수행하는가? |
| Hierarchy | 1차 정보가 보조 정보보다 먼저 배치되는가? |
| Sequence | 현재 목적과 문맥을 확인한 뒤 다음 행동이 제시되는가? |
| Direct Entry | 상위 화면을 거치지 않아도 현재 위치와 목적을 이해하는가? |
| Flow | 주요·보조 다음 행동이 승인된 User Flow와 일치하는가? |
| IA | 배치된 정보와 관계가 승인된 IA에 존재하는가? |
| Separation | Previous·Next와 Related Knowledge가 분리되는가? |
| Glossary | 짧은 확인과 상세 학습이 구분되는가? |
| Language | 일반 언어 이동과 대응 Knowledge 이동이 구분되는가? |
| Empty State | 빈 상태가 막다른 길로 끝나지 않는가? |
| Recovery | 존재하는 유효 문맥으로만 복구하는가? |
| Advertisement | 광고가 핵심 판단·학습·복구 경로를 끊지 않는가? |
| SEO·GEO | 중심 질문·직접 답변·상위 문맥·관계가 보호되는가? |
| Boundary | 색상·스타일·레이아웃·구현을 선점하지 않는가? |
| Feasibility | 실제로 없는 완료·저장·진도·개인화 상태를 가정하지 않는가? |

---

# 20. Wireframe Anti-Patterns

다음을 금지한다.

- 화면을 그림 또는 ASCII 레이아웃으로 작성한다.
- 상단·하단·좌측·우측 위치를 고정 좌표처럼 정의한다.
- Header·Footer를 모든 화면의 핵심 책임으로 오인한다.
- Homepage를 최신 글 목록으로 구성한다.
- Category와 Hub를 같은 정보 구조로 구성한다.
- Hub를 Article 목록으로만 구성한다.
- Article에서 직접 답변보다 광고나 추천을 먼저 배치한다.
- Previous·Next와 Related Knowledge를 하나의 추천 영역으로 결합한다.
- Search를 문맥 없는 제목 목록으로 구성한다.
- Financial Glossary를 Tag 또는 Category 복제본으로 구성한다.
- Learning Guide를 새로운 Knowledge 분류로 사용한다.
- 대응 콘텐츠가 없는 유사 콘텐츠를 번역본으로 배치한다.
- 빈 영역을 관련성이 낮은 Knowledge로 채운다.
- 실제로 없는 학습 완료·진도·저장·재개·개인화 상태를 배치한다.
- 광고를 콘텐츠·버튼·추천 Knowledge와 혼합한다.
- 컴포넌트명을 정보 구조의 필수 조건으로 사용한다.
- 화면 폭별 구현 구조를 Wireframe에서 결정한다.
- 새로운 IA 관계나 User Flow를 Wireframe에서 생성한다.
- 상위 Source of Truth의 정의를 이 문서에서 다시 정의한다.

---

# 21. Visual Design Handoff

## 전달 항목

각 화면에서 Visual Design 단계로 다음을 전달한다.

- 정보의 1차·2차·3차 이하 위계
- 섹션의 최종 논리적 순서
- 필수 영역과 선택 영역
- 첫 정보 구간의 필수 메시지
- 주요 다음 행동과 보조 다음 행동
- 직접 진입에 필요한 문맥
- 정상·경계·빈·복구 상태
- 광고 허용·금지 정보 구간
- 삭제하거나 숨기면 안 되는 SEO·GEO 정보
- 함께 표시할 수 있으나 의미를 혼합하면 안 되는 정보
- 동일 화면이 수용할 수 있는 상태 변형

## Visual Design이 결정할 항목

- 실제 레이아웃
- 정보의 시각적 강조 방식
- 컴포넌트 형태
- 색상·서체·여백
- 화면 폭별 재배치
- 긴 정보의 축약·확장 표현
- 보조 상태의 표현 방식
- Language Entry의 독립 화면 여부와 표현 방식
- Glossary 보조 상태의 표현 방식

Visual Design은 섹션의 의미와 위계를 바꾸지 않는다. 변경이 필요하면 Wireframe 검토로 반환한다.

---

# 22. 변경 관리

## 변경 절차

```text
정보 배치 문제 발견
→ 해당 화면과 Screen Responsibility 확인
→ User Flow 상태 확인
→ IA 관계 확인
→ Wireframe 책임 여부 판정
→ 정보 위계 또는 순서 변경안 작성
→ 상위 문서 충돌 검토
→ 사용자 승인
→ Wireframe 반영
→ Visual Design 영향 전달
```

## 변경안 필수 항목

- 문제 화면
- 영향받는 정보 영역
- 현재 정보 위계
- 변경할 정보 위계
- 근거 Screen Responsibility
- 근거 User Flow
- 근거 IA 관계
- 예외·빈 상태 영향
- 광고 원칙 영향
- SEO·GEO 보호 영향
- Visual Design 영향

---

# 23. 최종 불변 원칙

```text
Information Architecture는
어떤 정보와 관계가 존재하는지 정의한다.

User Flow는
사용자가 어떤 상태를 거쳐 목적을 달성하는지 정의한다.

Screen Architecture는
각 상태와 이동을 어떤 화면 책임이 담당하는지 정의한다.

Wireframe은
그 화면 책임을 수행하기 위해
어떤 정보를 어떤 순서와 위계로 배치하는지 정의한다.

Visual Design은
승인된 정보 구조를 시각적으로 표현한다.

Implementation은
승인된 구조와 표현을 기술적으로 실행한다.
```

Wireframe은 새로운 철학·정보 객체·사용자 흐름·화면 책임을 만들지 않는다.

---

# 24. 자체 검토 기록

## 상위 Source of Truth와의 정합성

- [x] Master Design Constitution의 교육·이해·신뢰·학습 탐색 원칙과 일치한다.
- [x] Information Architecture에 승인된 정보 객체와 관계만 사용했다.
- [x] User Flow에 승인된 진입·분기·복귀·종료만 정보 구조로 변환했다.
- [x] Screen Architecture의 `SR-01~SR-09` 책임 경계를 유지했다.
- [x] Source of Truth의 단일성 및 Knowledge 보호 원칙과 충돌하지 않는다.

## 역할 충돌 여부

- [x] Information Architecture를 다시 작성하지 않았다.
- [x] User Flow를 다시 작성하지 않았다.
- [x] Screen Architecture를 다시 작성하지 않았다.
- [x] Master Design Constitution을 다시 작성하지 않았다.
- [x] Visual Design과 Implementation 결정을 선점하지 않았다.

## 정보 위계의 일관성

- [x] 모든 화면에서 정체성·목적·문맥이 추천·광고보다 먼저 온다.
- [x] 직접 답변 또는 핵심 판단이 후속 탐색보다 먼저 온다.
- [x] 주경로와 선택 확장을 분리했다.
- [x] 빈 상태에서 정상 영역을 유효한 복구 정보로 대체했다.

## 화면별 Wireframe 순서의 일관성

- [x] 8개 화면 모두 최종 섹션 순서를 번호로 정의했다.
- [x] 화면 목적 → 핵심 정보 → 주요 행동 → 보조 행동의 논리 순서를 유지했다.
- [x] `Previous·Next`와 `Related Knowledge`를 분리했다.
- [x] `Glossary 빠른 확인`과 `상세 Knowledge`를 분리했다.
- [x] `일반 언어 이동`과 `대응 Knowledge 이동`을 분리했다.

## Screen Responsibility와의 추적 가능성

- [x] 각 화면에 담당 `SR`을 명시했다.
- [x] 추적 매트릭스에서 화면·SR·User Flow·IA 문맥을 연결했다.
- [x] 비정상 상태의 `SR-09` 인계 조건을 명시했다.

## Visual Design으로의 인계 가능성

- [x] 정보 위계, 최종 순서, 필수·선택 영역을 전달했다.
- [x] 첫 정보 구간, 직접 진입, 예외·빈 상태를 전달했다.
- [x] 광고 금지·허용 구간과 SEO·GEO 보호 요소를 전달했다.
- [x] Visual Design이 결정할 표현 영역을 분리했다.

---

# 사실 확인 리스트

- [x] Homepage를 포함했다.
- [x] Category를 포함했다.
- [x] Hub를 포함했다.
- [x] Article Detail을 포함했다.
- [x] Search를 포함했다.
- [x] Financial Glossary를 포함했다.
- [x] Learning Guide를 포함했다.
- [x] Language Entry를 포함했다.
- [x] 각 화면의 목적과 담당 Screen Responsibility를 정의했다.
- [x] 각 화면의 정보 위계와 최종 섹션 순서를 정의했다.
- [x] 각 화면의 필수·선택 영역을 정의했다.
- [x] 각 화면의 첫 정보 구간과 주요·보조 다음 행동을 정의했다.
- [x] 각 화면의 직접 진입 문맥을 정의했다.
- [x] 각 화면의 예외·빈 상태를 정의했다.
- [x] 각 화면의 광고 허용·금지 원칙을 정의했다.
- [x] 각 화면의 SEO·GEO 보호 요소를 정의했다.
- [x] 각 화면의 Visual Design 전달 사항을 정의했다.
- [x] 색상·폰트·여백·컴포넌트 스타일을 작성하지 않았다.
- [x] 레이아웃 디자인·CSS·코드·API·구현 방법·반응형 구현을 작성하지 않았다.

