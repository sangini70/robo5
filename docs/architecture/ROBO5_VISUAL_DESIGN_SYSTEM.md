# ROBO5_VISUAL_DESIGN_SYSTEM.md

Version: 1.0  
Status: Official Visual Design Source of Truth  
Scope: Public Website Visual Language, Responsive Expression, Accessibility, Visual Handoff  
Authority: Approved Visual Design System  

---

# 0. 문서의 지위와 범위

## 목적

이 문서는 Robo5의 공식 Visual Design Source of Truth이다.

승인된 정보 구조를 가장 이해하기 쉬운 시각 언어로 표현하는 공통 규칙을 정의한다.

이 문서는 다음 질문에만 답한다.

> 승인된 Wireframe의 정보 중요도, 관계, 상태와 다음 행동을 어떤 시각 언어로 일관되게 표현하는가?

## 적용 대상

- Homepage
- Category
- Hub
- Article Detail
- Search
- Financial Glossary
- Learning Guide
- Language Entry
- Empty·Error·Loading State
- Advertisement
- 위 화면에 반복되는 공통 시각 표현

## 소유하는 결정

1. 정보 위계의 시각적 강도
2. Typography의 역할과 범위
3. 의미 기반 Color 역할
4. Spacing·Grid·Card 공통 규칙
5. Navigation·CTA·상태의 시각적 구분
6. 접근성·반응형·Motion의 시각 기준
7. Icon·Illustration·Image 사용 기준
8. Design Token의 의미와 관리 원칙
9. Component 단계로 전달할 공통 시각 규격
10. 화면별 Visual Handoff

## 소유하지 않는 결정

- 프로젝트 철학의 신설 또는 변경
- Knowledge·Category·Hub·Topic·Node·Article의 정의
- Information Architecture
- User Flow
- Screen Responsibility
- Wireframe의 정보 위계·섹션 순서
- 새로운 기능·상태·관계·화면
- 구현 코드, CSS, HTML, React, Next.js, Tailwind
- API, 데이터 구조, 기술 구현 방식
- 광고 코드·네트워크·슬롯

상위 Source of Truth에 없는 객체·관계·상태를 시각적 편의를 위해 만들지 않는다.

---

# 1. Source of Truth 권한과 우선순위

| 문서 | 고유 책임 | Visual Design의 의무 |
|---|---|---|
| `ROBO5_MASTER_DESIGN_CONSTITUTION.md` | 브랜드·UX·디자인 헌법 | 정체성·신뢰·읽기 경험을 변경하지 않는다 |
| `ROBO5_INFORMATION_ARCHITECTURE.md` | 정보 객체·관계·Navigation·Discovery | 승인된 객체와 관계만 구분해 표현한다 |
| `ROBO5_USER_FLOW.md` | 진입·분기·복귀·종료 | 승인된 행동과 상태만 강조한다 |
| `ROBO5_SCREEN_ARCHITECTURE.md` | 화면 책임 | 화면의 책임 범위를 시각적으로 확장하지 않는다 |
| `ROBO5_WIREFRAME_GUIDE.md` | 정보 위계·순서·상태별 대체 | 위계와 논리 순서를 보존한다 |
| `ROBO5_VISUAL_DESIGN_SYSTEM.md` | 시각 언어 | 승인 구조를 일관되게 표현한다 |
| Component Guide | 반복 표현의 명세 | 본 문서의 규칙을 구체 명세로 변환한다 |
| Implementation | 기술 실행 | 승인된 구조·표현을 구현한다 |

## 충돌 처리

```text
시각적 문제 확인
→ Wireframe 정보 위계·순서 확인
→ Screen Responsibility 확인
→ User Flow 확인
→ IA 관계 확인
→ Master Design Constitution 확인
→ Visual Design 책임 여부 판정
→ 상위 책임이면 해당 Source of Truth로 반환
```

Visual Design은 상위 문서의 누락을 임의로 보완하지 않는다.

---

# 2. 디자인 철학

## 최상위 명제

> 좋은 출판사의 경제 교양서를 온라인으로 읽는 느낌.

Robo5는 금융·경제 지식 플랫폼이다. 증권 거래 화면, 수익률 홍보 화면, 속보 Portal, AI SaaS Dashboard처럼 보이지 않는다.

## 시각 목표

- 이해가 장식보다 먼저 보인다.
- 현재 질문과 직접 답변이 추천·광고보다 먼저 보인다.
- 사용자는 현재 위치와 다음 학습 방향을 쉽게 구분한다.
- 장문은 차분하고 안정적으로 읽힌다.
- 정보 객체의 차이는 색상 장식이 아니라 위계·구조·라벨로 드러난다.
- 화면은 이미지나 광고가 없어도 완성된다.
- 금융의 긴박감보다 교육적 신뢰를 전달한다.

## 시각 성격

| 지향 | 배제 |
|---|---|
| 차분한 편집성 | 속보·거래 긴박감 |
| 따뜻한 중립성 | 차갑고 과도한 기술 이미지 |
| 구조적 명료성 | Dashboard 밀도 |
| 절제된 전문성 | 상품 판매 과장 |
| 긴 호흡의 가독성 | 클릭 유도형 압축 |
| 연결된 학습성 | 무작위 추천 |

---

# 3. Visual Design과 Component 단계의 책임

## Visual Design 단계

Visual Design은 다음을 정의한다.

- 어떤 정보가 얼마나 강하게 보여야 하는가
- 정보 관계가 어떤 시각 문법으로 구분되는가
- 공통 Typography·Color·Spacing·Grid의 승인 기준
- 상태와 행동의 공통 표현 원칙
- 화면 폭이 달라도 보존할 의미 순서
- 접근성 승인 조건
- Component Guide가 따라야 할 시각적 제약

## Component 단계

Component 단계는 다음을 구체 명세한다.

- 승인된 시각 표현 유형의 구성 요소와 변형
- 크기·밀도·상태 조합
- 긴 콘텐츠·이미지 없음·다국어·모바일 상태
- 반복 사용 시 일관성
- Design Token 연결

## 경계

Visual Design은 Component의 실제 구현 방식·코드·DOM·API·데이터 요구를 정의하지 않는다. Component 단계도 새로운 정보 객체, 행동, 상태 또는 Wireframe 순서를 만들지 않는다.

---

# 4. 시각적 정보 위계

## 위계 체계

| 등급 | 의미 | 대표 정보 | 시각 원칙 |
|---|---|---|---|
| V1 | 화면의 중심 목적 | 플랫폼 정체성, H1, 현재 용어, 검색 표현 | 가장 높은 Typography 강도와 충분한 독립 여백 |
| V2 | 즉시 이해 정보 | 직접 답변, 학습 범위, 짧은 정의 | V1 직후 명확한 대비와 읽기 폭 |
| V3 | 주된 내용 | 본문, Path, 주요 Knowledge 결과 | 안정적인 반복 리듬과 구조 구분 |
| V4 | 주요 다음 행동 | 시작점, Previous·Next, 직접 결과 진입 | 내용보다 강하지 않은 명확한 행동성 |
| V5 | 선택 확장 | Related Knowledge, 관련 용어, 세부 탐색 | V4와 다른 구조·낮은 행동 우선순위 |
| V6 | 보조 정보 | 메타정보, 상위 복귀, 최근 업데이트 | 낮은 강도이되 읽을 수 있는 대비 유지 |
| VS | 상태 정보 | Empty, Error, Loading, Unavailable | 상태 사실과 복구 행동을 함께 표현 |
| VA | 광고 | 상업 영역 | 콘텐츠 위계 밖에서 명확히 식별 |

## 공통 표현 규칙

- 크기만으로 위계를 만들지 않는다. 굵기·여백·위치·구분·라벨을 함께 사용한다.
- 한 화면에서 V1은 하나의 중심으로 인식되어야 한다.
- V2는 V1의 의미를 해석하거나 직접 답하며, 추천보다 먼저 보인다.
- V3는 장문과 구조를 안정적으로 유지한다.
- V4와 V5는 순차 이동과 선택 확장을 혼합하지 않는다.
- V6를 작은 회색 글씨로 숨기지 않는다.
- VS는 정상 콘텐츠를 가장하지 않는다.
- VA는 V1~V6 또는 CTA의 외형을 모방하지 않는다.
- 색상만으로 위계·상태·선택을 전달하지 않는다.

## Wireframe 연결

Wireframe의 1차 정보는 V1, 2차 정보는 V2, 3차 정보는 V3를 기본으로 한다. 4차 정보는 관계에 따라 V4 또는 V5, 5차 정보는 V6로 표현한다. 이 연결은 기계적인 스타일 매핑이 아니라 정보 역할의 보존 기준이며, 화면별 최종 순서는 변경하지 않는다.

---

# 5. Typography System

## 기본 방향

- 한국어 장문 가독성을 최우선으로 한다.
- 한국어와 영어가 동일한 위계 체계를 공유한다.
- 본문은 Sans Serif를 기본으로 한다.
- Serif는 제한적인 편집 강조에만 허용한다.
- 서체 종류를 늘려 위계를 해결하지 않는다.

## 역할별 승인 기준

| 역할 | Desktop 기준 | Mobile 기준 | 연결 위계와 사용 원칙 |
|---|---:|---:|---|
| Display | 48–56px | 36–42px | Homepage의 제한된 V1 정체성 표현 |
| H1 | 40–48px | 30–36px | 페이지당 하나의 V1 중심 주제 |
| H2 | 28–34px | 24–28px | V3의 큰 논리 단위 |
| H3 | 22–26px | 20–23px | V3의 세부 설명 단위 |
| H4 | 18–21px | 18–20px | V3의 하위 구조 |
| Lead | 19–21px | 17–19px | V2 직접 답변·짧은 요약 |
| Body | 17–18px | 최소 16px | V3 장문 본문 |
| Secondary | 14–16px | 14–15px | V6 보조 정보 |
| Label | 최소 14px | 최소 14px | 유형·Category·상태 구분 |
| Action | 최소 15px | 최소 15px | V4·V5 CTA와 Navigation |

## 본문 규칙

- 줄 높이는 `1.75~1.9` 범위로 한다.
- Article 본문 읽기 폭은 약 `720~780px`로 한다.
- 지나치게 긴 한 줄을 금지한다.
- 문단·목록·소제목 간 관계가 Spacing으로 드러나야 한다.
- 작은 회색 텍스트로 많은 정보를 숨기지 않는다.
- 영문 대문자는 약어와 짧은 라벨에 한정한다.
- 긴 한국어·영어 제목의 자연스러운 줄바꿈을 보장한다.
- 제목이 길다는 이유로 생략 부호를 우선 적용하지 않는다.
- 직접 답변의 글자 크기·굵기는 H1과 경쟁하지 않되 본문보다 명확해야 한다.
- 금융용어의 정의는 용어명과 하나의 의미 단위로 읽히게 한다.

---

# 6. Color System

## 의미 중심 색상 역할

| Semantic 역할 | 방향 | 사용 영역 |
|---|---|---|
| Primary | 깊은 네이비·잉크 블루 | 브랜드, 핵심 제목, 주요 링크, Primary CTA |
| Secondary | 차분한 블루그레이 | 보조 문맥, Category, 약한 강조 |
| Background | 따뜻한 오프화이트 | 기본 페이지 배경 |
| Surface | 배경과 구분되는 밝은 중성색 | 제한적인 Card·State 영역 |
| Text Primary | 부드러운 차콜 | 본문과 핵심 텍스트 |
| Text Secondary | 중간 명도의 중성색 | 보조 정보 |
| Border | 옅은 웜그레이·블루그레이 | 구조 구분 |
| Accent | 민트·청록·절제된 골드 중 하나 | 제한된 현재 상태와 편집 강조 |
| Error | 기능적 오류색 | 오류 상태 |
| Warning | 기능적 경고색 | 주의·오래된 정보 |
| Success | 기능적 성공색 | 실제 성공 상태가 있을 때만 사용 |
| Focus | 고대비 포커스색 | 키보드 탐색 |

## 접근성 및 사용 제한

- 일반 텍스트 대비는 최소 `4.5:1`, 큰 텍스트는 최소 `3:1`을 충족한다.
- 비텍스트 UI와 상태 경계는 인접 색상 대비 최소 `3:1`을 충족한다.
- Accent는 한 화면에서 제한적으로 사용한다.
- 빨강·파랑을 주가 상승·하락 장식으로 남용하지 않는다.
- 상태색을 Category 구분색으로 전용하지 않는다.
- 색상만으로 현재 단계·오류·선택 상태를 전달하지 않는다.
- 파랑·보라 Gradient, Neon, Color Glow를 금지한다.
- Disabled 상태도 존재 여부와 라벨을 읽을 수 있어야 한다.

---

# 7. Spacing System

## 기본 Scale

`4px`를 최소 단위로 하고 `8px` 중심의 반복 체계를 사용한다.

| 단계 | 권장값 | 주요 용도 |
|---|---:|---|
| S1 | 4px | 밀접한 텍스트·아이콘 관계 |
| S2 | 8px | 라벨과 값, 작은 내부 간격 |
| S3 | 12px | 밀접한 요소군 |
| S4 | 16px | 기본 내부 여백 |
| S5 | 24px | Component 내부 구획 |
| S6 | 32px | 관련 콘텐츠 그룹 |
| S7 | 48px | 하위 Section 구분 |
| S8 | 64px | 주요 Section 구분 |
| S9 | 80px | 큰 화면의 편집적 전환 |
| S10 | 96px | 제한적인 최상위 구간 |

## 관계 규칙

```text
같은 의미의 요소 간격
<
같은 Component 내부 구획
<
서로 다른 논리 Section 간격
```

- 여백은 빈 공간 장식이 아니라 Wireframe 관계 표시다.
- Card 내부 간격보다 Card 간·Section 간 간격이 커야 한다.
- V1·V2 사이의 연결은 유지하되 다른 V3 Section과는 충분히 분리한다.
- 모바일에서도 논리적 구간의 호흡을 제거하지 않는다.
- 화면을 짧게 만들기 위해 정보 관계를 압축하지 않는다.

---

# 8. Grid System

| 기준 | 설계 방향 |
|---|---|
| 전체 대응 폭 | 최대 1920px |
| 공통 콘텐츠 폭 | 약 1280~1360px |
| 일부 Wide Section | 최대 1440px |
| Article 본문 | 약 720~780px |
| Desktop | 12열 기준의 유연한 편집 Grid |
| Tablet | 8열 기준 |
| Mobile | 4열 기준 |
| 최소 대응 폭 | 360px |
| 대표 모바일 검증 폭 | 390px |

## Grid 원칙

- 1440px 전체를 콘텐츠로 채우지 않는다.
- Article 본문 폭을 보조 콘텐츠 때문에 지나치게 줄이지 않는다.
- Desktop Sidebar는 제한된 보조 책임만 수행한다.
- Grid 변경으로 Wireframe의 논리적 순서를 바꾸지 않는다.
- 시각적 비대칭은 허용하지만 의미 위계는 명확해야 한다.
- 화면 폭이 줄어들면 장식을 먼저 줄이고 핵심 문맥을 유지한다.
- Sidebar가 이동할 때 논리 순서는 V1→V2→V3→V4→V5→V6를 보존한다.

---

# 9. Card System

## 카드 사용 조건

카드는 다음 중 하나가 있을 때만 사용한다.

- 독립적으로 선택 가능한 정보 단위
- 경계가 필요한 상태 또는 안내
- 다른 주변 정보와 구분되어야 하는 행동 단위
- 대표성과 일반 목록의 명확한 위계 차이

## 카드 유형

| 유형 | 연결되는 Wireframe 정보 |
|---|---|
| Featured | 대표 Knowledge 한 건 또는 승인된 시작점 |
| Knowledge | 독립적인 Knowledge 진입 |
| Hub Summary | 주제 범위와 추천 시작점 |
| Learning Step | 승인된 학습 단계 |
| State | Empty·Error·Unavailable 정보 |
| Information | 중요한 정의·주의·요약 |
| Advertisement | 광고 전용 시각 체계 |

## 공통 규칙

- 카드의 제목·설명·라벨·행동 순서는 해당 정보 위계를 따른다.
- Card 전체의 클릭 가능 여부는 시각적으로 명확해야 한다.
- 긴 제목과 이미지 없음 상태에서도 위계가 유지되어야 한다.
- 같은 유형은 같은 경계·내부 리듬·상태 문법을 사용한다.

## 금지

- 모든 요소를 Card로 감싸지 않는다.
- 같은 둥근 Card를 무한 반복하지 않는다.
- Article 목록은 구분선 기반 표현을 우선한다.
- Card 전체에 강한 그림자를 사용하지 않는다.
- Card가 Category·Hub·Article의 차이를 없애면 안 된다.
- Advertisement Card를 Knowledge Card와 비슷하게 만들지 않는다.

---

# 10. Navigation 표현 규칙

| Navigation 종류 | 표현 원칙 |
|---|---|
| Global | 절제되고 안정적인 전역 진입 표현 |
| Local | 현재 Category·Hub 범위가 명확한 표현 |
| Contextual | 현재 Knowledge와 연결 이유가 드러나는 표현 |
| Sequential | 방향·순서·대상 제목을 함께 표현 |
| Positional | 현재 위치를 나타내되 진행률처럼 보이지 않게 표현 |
| Recovery | 오류·빈 상태에서 가장 가까운 유효 문맥 강조 |

## 공통 규칙

- 모든 이동을 버튼으로 만들지 않는다.
- 현재 상태와 이동 가능한 항목을 구분한다.
- 아이콘만으로 Navigation 의미를 전달하지 않는다.
- Sticky Navigation은 콘텐츠를 가리지 않는다.
- 활성 상태는 색상 외 굵기·표식·라벨 중 하나 이상을 함께 사용한다.
- 모바일 메뉴에서도 정보 객체의 명칭과 역할을 유지한다.
- Global, Local, Contextual Navigation이 한 덩어리로 보이지 않게 한다.

---

# 11. CTA 표현 규칙

CTA는 행동 우선순위만 표현하며 새로운 행동을 만들지 않는다.

| 등급 | 용도 |
|---|---|
| Primary | 현재 화면의 가장 중요한 승인된 행동 |
| Secondary | 유효하지만 필수적이지 않은 후속 행동 |
| Text Link | 문맥 탐색·상위 복귀·선택 확장 |
| Recovery CTA | Empty·Error 상태의 가장 가까운 복구 행동 |

## 원칙

- 한 정보 구간에서 Primary CTA는 하나를 기본으로 한다.
- Hero CTA는 최대 2개다.
- 현재 질문에 대한 답보다 CTA를 강하게 표시하지 않는다.
- Article의 “다음 글”을 강제 소비처럼 표현하지 않는다.
- 종료 가능성을 방해하는 Sticky CTA를 사용하지 않는다.
- 최소 터치 영역은 `44×44px`이다.
- Focus 상태는 고대비 외곽선 또는 동등한 명확성을 갖는다.
- 광고와 CTA의 색상·형태·라벨을 명확히 분리한다.
- 과도한 pill 형태를 금지한다.

---

# 12. Breadcrumb 표현 규칙

- 현재 위치를 설명하는 V6 Positional Navigation으로 표현한다.
- Category·Hub·Article 관계의 실제 의미와 일치해야 한다.
- 학습 진도 또는 완료 상태처럼 보이지 않게 한다.
- H1보다 시각적 우선순위를 낮춘다.
- 현재 항목과 이동 가능한 상위 항목을 구분한다.
- 지나치게 길 경우 의미 단위를 보존하여 축약한다.
- 마지막 항목을 단순 중복 링크로 만들지 않는다.
- 직접 진입 사용자도 현재 문맥을 이해할 수 있어야 한다.

---

# 13. Learning Path 표현 규칙

## 표시 요소

- Path 목적
- 전체 범위
- 단계 번호
- 단계 제목
- 현재 단계
- 선수 Knowledge
- 다음 단계
- 선택 확장과의 차이

## 상태 표현

| 상태 | 표현 |
|---|---|
| 시작 단계 | Path의 시작점임을 명시 |
| 현재 단계 | 색상·굵기·표식·라벨을 함께 사용 |
| 이전 단계 | 순차적 위치만 표시 |
| 다음 단계 | 이동 대상 제목과 방향 표시 |
| 사용할 수 없는 단계 | 존재 여부를 실제 정보에 따라 표현 |
| 선택 확장 | Path 본선과 다른 시각 체계 사용 |

## 금지

- 실제 데이터가 없는 완료 체크
- 완료율·퍼센트·진도 Bar
- 게임형 Level UI
- 잠금 해제 표현
- Related Knowledge를 Path 단계로 포함
- 일부 단계가 없는데 전체 단계가 있는 것처럼 표현

---

# 14. Previous / Next 표현 규칙

- 하나의 V4 순차 학습 단위로 인식되게 한다.
- Previous와 Next를 같은 Container 안에서 관계가 보이게 표현할 수 있다.
- 방향 Label과 Knowledge 제목을 함께 표시한다.
- 단순 화살표만 사용하지 않는다.
- Next를 Previous보다 약간 명확하게 표현할 수 있으나 과도한 CTA로 만들지 않는다.
- 하나가 없으면 빈칸이나 비활성 가짜 항목을 만들지 않는다.
- 광고를 두 항목 사이에 배치하지 않는다.
- Related Knowledge와 시각적 영역을 분리한다.

---

# 15. Related Knowledge 표현 규칙

- 순차 학습이 아닌 V5 선택 확장으로 표현한다.
- 관계 이유 또는 관계 유형을 이해할 수 있게 한다.
- 제한된 수의 관련 Knowledge를 제공한다.
- 제목을 가장 중요한 정보로 한다.
- Category·짧은 설명 등은 V6 보조 정보로 표현한다.
- 같은 Knowledge를 중복 노출하지 않는다.
- Previous·Next보다 낮은 행동 우선순위를 유지한다.
- 단순 인기 글 영역처럼 표현하지 않는다.

---

# 16. Search 표현 규칙

## 결과 정보 위계

1. 검색 표현
2. 결과 해석 범위
3. 가장 직접적인 Knowledge
4. 관련 Hub·Category
5. Glossary Term
6. 범위 조정·재검색
7. 결과 없음 복구

## 결과 단위

- 제목을 최우선으로 한다.
- 결과 유형을 Label과 구조로 명확히 표시한다.
- 짧은 설명과 상위 문맥을 제공한다.
- 검색 표현과 연결되는 이유를 파악할 수 있게 한다.
- Knowledge·Hub·Glossary를 동일한 결과처럼 표현하지 않는다.
- 광고를 검색 결과처럼 보이게 하지 않는다.
- 결과 수보다 검색 문맥을 우선한다.
- 결과 없음 상태에서도 검색 표현을 유지한다.

---

# 17. Glossary 표현 규칙

## 빠른 확인 위계

1. 용어
2. 짧은 정의
3. 관련 분야
4. 동의어·약어·영문명
5. 상위·하위·관련 용어
6. 상세 Knowledge
7. 원래 Article 복귀

## 표현 원칙

- 용어와 정의를 하나의 강한 V1·V2 의미 단위로 묶는다.
- 동의어·약어와 관련 개념을 서로 다르게 표현한다.
- 짧은 확인과 상세 학습 전환을 구분한다.
- Article에서 진입한 경우 원래 문맥 복귀를 명확히 표시한다.
- 독립 진입과 Article 보조 상태가 같은 모양이어도 문맥 차이가 보여야 한다.
- 상세 Knowledge가 없으면 비활성 링크나 가짜 경로를 만들지 않는다.

---

# 18. Empty State

Empty State는 빈 공간을 채우는 장식이 아니라 유효한 VS 복구 상태다.

## 표시 순서

1. 존재하지 않는 정보
2. 유지되는 사용자 목적과 문맥
3. 제거된 정상 영역
4. 가장 가까운 복구 행동
5. 보조 복구 행동

## 원칙

- “아무것도 없습니다”로 종료하지 않는다.
- 존재하지 않는 콘텐츠를 암시하지 않는다.
- 상태 사실보다 추천 콘텐츠를 먼저 표시하지 않는다.
- 복구 행동은 실제 존재하는 관계만 사용한다.
- Illustration이 상태 설명보다 강하게 보이지 않게 한다.
- 빈 상태를 인기 글 목록으로 무조건 대체하지 않는다.

---

# 19. Error State

Error State는 기술적 공포를 만들지 않고 실패 사실과 복구 경로를 명확히 전달한다.

## 위계

1. 무엇을 사용할 수 없는가
2. 원래 목적 중 무엇이 유지되는가
3. 사용자가 할 수 있는 가장 가까운 행동
4. 필요한 보조 설명

## 원칙

- 오류 원인을 추측하여 단정하지 않는다.
- 사용자 책임처럼 표현하지 않는다.
- 오류 코드보다 사용자 목적 복구를 우선한다.
- 오류 사실과 Primary Recovery 사이에 광고를 두지 않는다.
- 빨간색만으로 오류를 표현하지 않는다.
- 장식적 경고 Icon을 반복하지 않는다.

---

# 20. Loading State

- Loading은 실제 정보 구조와 유사한 안정적 공간을 유지한다.
- 콘텐츠가 이동하지 않도록 필요한 공간을 확보한다.
- 긴 Animation이나 브랜드 연출을 사용하지 않는다.
- 반복 Pulse를 최소화한다.
- Skeleton이 실제로 존재하지 않는 정보나 관계를 암시하지 않게 한다.
- 짧은 Loading에는 불필요한 상태 변화를 노출하지 않는다.
- 핵심 콘텐츠 접근을 Animation 때문에 지연하지 않는다.
- 보조 콘텐츠의 Loading이 핵심 답변을 가리지 않게 한다.

---

# 21. Language Entry

Language Entry는 다음 두 이동을 시각적으로 구분한다.

| 이동 유형 | 표현해야 할 내용 |
|---|---|
| 일반 언어 이동 | 대상 언어의 전체 정보공간으로 이동 |
| 대응 Knowledge 이동 | 현재 Knowledge의 승인된 대응 콘텐츠로 이동 |

## 원칙

- 국기만으로 언어를 표시하지 않는다.
- `한국어`, `English`, `Global` 등 텍스트 Label을 사용한다.
- 대응 Knowledge 존재 여부를 명확히 표현한다.
- 유지되는 문맥과 유지되지 않는 문맥을 구분한다.
- 대응 콘텐츠가 없으면 유사 콘텐츠를 번역본처럼 표현하지 않는다.
- 독립 페이지인지 보조 상태인지는 Screen Responsibility를 바꾸지 않는 범위에서 표현한다.
- 언어 이동 판단 과정에는 광고를 표시하지 않는다.
- 한국어와 영어에 별도의 브랜드 시각 체계를 만들지 않는다.

---

# 22. 광고 표현 원칙

## 광고의 시각적 지위

광고는 VA이며 콘텐츠 위계 밖의 독립된 상업 영역으로 표현한다.

## 필수 규칙

- 광고 Label을 명확히 표시한다.
- Knowledge Card·CTA·Search Result와 다른 시각 체계를 사용한다.
- 광고를 관련 글이나 추천 Knowledge처럼 보이게 하지 않는다.
- 지나친 Border·Shadow·Color로 클릭을 유도하지 않는다.
- 광고가 없어도 화면 구조가 완전해야 한다.
- 광고 영역 때문에 Learning Path가 단절되어 보이면 안 된다.
- 필요한 공간을 미리 확보하여 시각적 이동을 줄인다.

## 금지 구간

- 제목과 직접 답변 사이
- 첫 문단 내부
- 검색 표현과 첫 결과 사이
- 용어와 짧은 정의 사이
- Learning Path 단계 사이
- Previous와 Next 사이
- 오류 사실과 주요 복구 행동 사이
- Language Entry 판단 과정

구체적인 광고 코드·크기·네트워크·슬롯은 이 문서가 정의하지 않는다.

---

# 23. Accessibility

| 영역 | 승인 기준 |
|---|---|
| 텍스트 대비 | 일반 텍스트 최소 4.5:1 |
| 큰 텍스트 대비 | 최소 3:1 |
| 비텍스트 UI 대비 | 최소 3:1 |
| 터치 영역 | 최소 44×44px |
| Focus | 배경과 명확히 구별되는 시각 상태 |
| 색상 | 색상 외 Label·형태·Icon 병행 |
| 이미지 | 의미 있는 이미지에 대체 설명 가능 |
| Icon | 단독 사용 시 접근 가능한 이름 필요 |
| Motion | Reduced Motion 상태 지원 |
| 읽기 순서 | 시각 순서와 논리 순서 일치 |

## 추가 원칙

- Hover만으로 정보를 제공하지 않는다.
- 키보드 사용자가 모든 주요 행동을 식별할 수 있어야 한다.
- 작은 회색 글씨로 필수 정보를 제공하지 않는다.
- 확대 시 정보가 겹치거나 사라지지 않아야 한다.
- 접근성은 검수 단계가 아니라 모든 시각 결정의 승인 조건이다.

---

# 24. Responsive Design

Responsive Design은 정보 구조 변경이 아니라 동일한 의미의 재배치다.

## 의미 우선순위

```text
핵심 질문
→ 직접 답변
→ 현재 문맥
→ 주요 내용
→ 주요 다음 행동
→ 선택 확장
→ 보조 정보
```

## 규칙

- Desktop의 시각 순서와 Mobile의 논리 순서를 일치시킨다.
- Sidebar 정보는 본문 뒤 적절한 논리 구간으로 이동할 수 있다.
- 모바일에서 핵심 정보를 단순 삭제하지 않는다.
- Learning Path는 좁은 화면에서 세로 흐름으로 표현한다.
- 긴 제목과 버튼 문구의 줄바꿈을 허용한다.
- Card는 모바일에서 기본적으로 한 열을 사용한다.
- 표는 의미를 잃지 않는 방식으로 대응한다.
- 고정 요소가 본문이나 행동을 가리지 않게 한다.
- 장식과 보조 이미지를 핵심 정보보다 먼저 축소한다.
- 360px과 390px에서 별도 검증한다.

---

# 25. Motion

## 허용 목적

- 상태 변화 확인
- 메뉴 열기·닫기
- 현재 단계 강조
- Previous·Next 이동 Feedback
- 접기·펼치기 관계 설명
- Focus·Hover Feedback

## 기준

- 짧고 즉각적인 반응을 기본으로 한다.
- 콘텐츠를 기다리게 하지 않는다.
- Layout 이동을 만들지 않는다.
- 모바일에서는 효과를 줄인다.
- Reduced Motion 환경에서는 필수 상태 변화만 남긴다.

## 금지

- 자동 Slider
- 반복 Pulse
- Parallax
- 3D 회전
- 계속 움직이는 배경
- Scroll 가로채기
- 큰 Fade-up 반복
- 투자 긴박감을 조성하는 깜박임

---

# 26. Icon 사용 원칙

- Icon은 이해를 단축할 때만 사용한다.
- 하나의 일관된 선 굵기와 시각 Style을 사용한다.
- Icon만으로 정보 객체를 구분하지 않는다.
- Navigation·CTA에는 필요한 경우 텍스트 Label을 병행한다.
- 금융 차트·동전·로봇·전구 Icon의 상투적 반복을 금지한다.
- 장식용 Icon Grid를 만들지 않는다.
- 같은 의미에는 같은 Icon을 사용한다.
- 서로 다른 의미에 같은 Icon을 재사용하지 않는다.

---

# 27. Illustration 사용 원칙

## 허용 목적

- 추상적인 경제 관계 설명
- 개념 간 긴장이나 흐름 보조
- 콘텐츠 주제의 편집적 분위기 형성
- Empty State의 제한된 보조 표현

## 시각 방향

- 편집형
- 절제된 색상
- 텍스트 없이도 기본 의미 전달
- 파란색·회색 기반의 차분한 분위기
- 실제 콘텐츠와 연결되는 구체적 개념

## 금지

- 의미 없는 로봇·AI 뇌·회로
- 가짜 Trading Screen
- 지폐·동전의 반복
- 화면 대부분을 차지하는 추상 Hero
- 과도한 3D Object
- 콘텐츠보다 강한 Character 표현

---

# 28. Image 사용 원칙

> 이미지는 콘텐츠를 보조하며 콘텐츠를 대신하지 않는다.

- 이미지가 없어도 모든 화면이 완성되어야 한다.
- Layout 완성도를 Featured Image에 의존하지 않는다.
- 실제 맥락이 있는 사진 또는 편집형 이미지만 사용한다.
- Thumbnail은 텍스트 삽입 없이도 기본 주제가 전달되어야 한다.
- 이미지가 정보 위계를 바꾸지 않게 한다.
- 같은 Stock Image 유형을 반복하지 않는다.
- 이미지 비율이 달라도 제목과 설명의 위치 관계가 유지되어야 한다.
- 장식 이미지에는 불필요한 의미를 부여하지 않는다.
- 가짜 수익률·가짜 시세·가짜 전문가 이미지를 금지한다.

---

# 29. Dark Mode 정책

현재 공식 경험은 Light Theme로 고정한다.

- 현재 단계에서 Dark Mode는 필수 요구사항이 아니다.
- 별도의 Dark Theme 시각 체계를 작성하지 않는다.
- Token은 향후 Theme 확장이 가능하도록 의미 기반으로 설계한다.
- Dark Mode를 이유로 현재 Light Theme의 대비와 품질을 낮추지 않는다.
- 명시적 승인 없이 자동 Dark Mode를 도입하지 않는다.

---

# 30. Design Token 정책

## Token 계층

| 계층 | 역할 |
|---|---|
| Primitive Token | 원시 색상·크기·간격 값 |
| Semantic Token | Primary·Surface·Text·Border·Status 등 의미 |
| Component Token | 특정 공통 표현에 필요한 제한적 의미 |
| State Token | Hover·Focus·Active·Disabled·Error 상태 |

## 정책

- 공식 문서는 Token의 이름·역할·승인값을 정의한다.
- Token은 시각 의미를 기준으로 명명한다.
- 특정 페이지명이나 임시 Campaign명으로 Token을 만들지 않는다.
- 같은 의미에 중복 Token을 만들지 않는다.
- Component가 Primitive 값을 임의로 직접 선택하지 않게 한다.
- Token 변경은 영향 화면과 접근성 검증을 거친다.
- 실제 CSS 변수나 구현 문법은 후속 구현 문서가 담당한다.

---

# 31. Component 공통 규칙

여기서 Component는 구현 단위가 아니라 반복되는 시각 표현 유형을 뜻한다.

## 모든 공통 표현이 정의할 항목

- 시각적 목적
- 연결되는 Wireframe 정보
- 정보 우선순위
- 필수 요소
- 선택 요소
- 정상 상태
- Hover·Focus·Active 상태
- Disabled·Unavailable 상태
- Empty·Error 상태
- 긴 제목·긴 문구 상태
- 이미지 없음 상태
- 다국어 상태
- 모바일 재배치 원칙
- 광고와의 구분
- 접근성 기준

## 공통 금지

- 시각 표현 때문에 새로운 데이터 요구
- 내용 길이를 임의로 고정
- 필수 정보 생략
- 모든 표현을 동일 Card로 통일
- 가짜 완료·저장·진도 상태
- 시각적 편의를 위한 관계 의미 변경
- Component 이름을 IA 객체의 새 정의로 사용

---

# 32. 화면별 Visual Handoff

| 화면 | 가장 강한 시각 정보 | 주요 시각 과제 | 절대 혼합 금지 |
|---|---|---|---|
| Homepage | 플랫폼 정체성과 시작점 | 분야 탐색과 학습 시작 구분 | 최신 글과 대표 시작점 |
| Category | 분야 범위 | Hub·Topic·Knowledge 위계 | Category와 Hub |
| Hub | 학습 범위와 Path | 현재 단계와 전체 범위 | Path와 Related |
| Article Detail | 질문과 직접 답변 | 장문 가독성과 후속 관계 | Previous·Next와 Related |
| Search | 검색 표현과 결과 문맥 | 결과 유형 구분 | 광고와 결과 |
| Financial Glossary | 용어와 짧은 정의 | 빠른 확인과 상세 학습 | 동의어와 관련 개념 |
| Learning Guide | 목적별 시작 기준 | 목적·Path·선수 관계 | 분류와 학습 안내 |
| Language Entry | 이동 유형과 도착 범위 | 일반 이동과 대응 이동 | 유사 콘텐츠와 번역 관계 |
| Empty·Error | 상태 사실과 복구 | 원래 문맥 유지 | 실패와 추천 콘텐츠 |
| Advertisement | 광고임을 나타내는 표식 | 콘텐츠와 독립 | CTA·Knowledge Card |

## 화면별 인계 규칙

### Homepage

- Wireframe 순서인 정체성 → 대표 시작점 → Category → Path → Knowledge → 최근 정보 → 보조 진입 → 신뢰 영역을 유지한다.
- Display는 정체성에만 제한적으로 사용한다.
- 대표 시작점은 최신·인기 정보보다 명확한 V4로 표현한다.
- Category·Path·Knowledge는 서로 다른 Label과 구조를 사용한다.

### Category

- Category의 분야 범위를 V1·V2로 먼저 표현한다.
- 추천 Hub 또는 시작점과 전체 Topic·Knowledge 탐색을 구분한다.
- Hub·Topic·Knowledge를 같은 Card 유형으로 평준화하지 않는다.
- 관련 Category는 V6 보조 위계로 둔다.

### Hub

- Hub 주제·학습 범위와 핵심 질문을 V1·V2로 표현한다.
- 추천 시작점과 전체 Learning Path를 중심 V3·V4로 둔다.
- 현재 단계는 Label·표식·굵기·색상을 함께 사용한다.
- 선수·후속 관계와 선택 확장 Knowledge를 다른 시각 문법으로 구분한다.

### Article Detail

- Breadcrumb → 제목·질문 → 직접 답변 → 신뢰 정보 → 본문 순서를 시각적으로 보존한다.
- 본문은 약 `720~780px` 읽기 폭과 `1.75~1.9` 줄 높이를 적용한다.
- 핵심 정리 후 Learning Path 문맥, Previous·Next, Related, Glossary, 상위 복귀 순서를 유지한다.
- 직접 답변과 첫 문단 사이에 광고를 두지 않는다.

### Search

- 검색 표현과 결과 해석 문맥을 결과 목록보다 먼저 보이게 한다.
- 직접 Knowledge, Hub·Category, Glossary 결과는 유형별로 구분한다.
- 결과 없음은 검색 표현을 유지한 상태에서 Recovery CTA를 제공한다.
- 광고는 결과 항목의 Card·Label·간격을 모방하지 않는다.

### Financial Glossary

- 용어와 짧은 정의를 V1·V2로 결합한다.
- 명칭 관계와 개념 관계를 별도 그룹으로 표현한다.
- 상세 Knowledge 이동과 원래 Article 복귀를 서로 다른 행동으로 표시한다.
- 용어와 정의 사이에는 광고·추천·관련 용어를 두지 않는다.

### Learning Guide

- 화면이 새로운 분류가 아니라 목적별 시작 안내임을 첫 구간에서 표현한다.
- 목적·수준, 추천 시작점, Path 범위, 선수 Knowledge를 구분한다.
- 완료율·저장·재개·개인화 상태처럼 보이는 표현을 만들지 않는다.

### Language Entry

- 현재 언어, 대상 언어, 이동 유형, 유지·비유지 문맥, 도착 범위를 순서대로 표현한다.
- 일반 언어 이동과 대응 Knowledge 이동에 다른 Label을 사용한다.
- 대응 콘텐츠 없음은 유사 콘텐츠 추천보다 먼저 알린다.
- 판단 과정 전체에서 광고를 배제한다.

---

# 33. Visual Design 검증 기준

| 검증 영역 | 검증 질문 |
|---|---|
| Philosophy | 경제 교양 출판물에 가까운 차분한 인상인가? |
| Identity | 금융상품·거래·뉴스·AI SaaS 화면처럼 보이지 않는가? |
| Hierarchy | 첫 시선이 Wireframe의 1차 정보에 도달하는가? |
| Readability | 한국어 장문을 편안하게 읽을 수 있는가? |
| Context | 현재 Category·Hub·Path 위치를 이해할 수 있는가? |
| Separation | 순차 학습과 선택 확장이 다르게 보이는가? |
| CTA | 현재 목적보다 행동 유도가 강하지 않은가? |
| Search | 결과 유형과 지식 문맥이 구분되는가? |
| Glossary | 짧은 확인과 상세 학습이 구분되는가? |
| State | Empty·Error가 실제 복구 경로를 제공하는가? |
| Language | 일반 언어 이동과 대응 Knowledge 이동이 구분되는가? |
| Advertisement | 광고가 콘텐츠·버튼·결과처럼 보이지 않는가? |
| Accessibility | 대비·Focus·터치 영역·비색상 단서가 충족되는가? |
| Responsive | 화면 폭이 달라도 의미 순서가 유지되는가? |
| Motion | 움직임이 이해를 돕고 콘텐츠를 지연하지 않는가? |
| Image | 이미지 없이도 화면이 완성되는가? |
| Boundary | 새로운 구조·기능·상태를 만들지 않았는가? |
| Traceability | 모든 시각 결정이 상위 정보 위계로 추적되는가? |

---

# 34. Visual Anti-Patterns

다음을 공식적으로 금지한다.

- 증권사·거래소·리딩방형 디자인
- 시세·수익률 중심 Dashboard
- 뉴스 속보 Portal형 구성
- AI SaaS 관리자 화면
- 모든 요소를 둥근 Card로 표현
- 과도한 파랑·보라 Gradient
- Glassmorphism·Neon·Glow
- 강한 Drop Shadow 반복
- 거대한 추상 Hero Image
- 의미 없는 Icon Grid
- 로봇·뇌·회로 이미지 반복
- 콘텐츠보다 강한 CTA
- 가짜 완료율·진도·저장 상태
- Previous·Next와 Related의 통합
- Breadcrumb의 진행률화
- 광고의 콘텐츠 Card화
- 검색 광고의 결과 위장
- 작은 회색 글씨 남용
- Desktop 정보를 Mobile에서 임의 삭제
- 자동 Slider·Parallax·반복 Pulse
- 이미지가 없으면 무너지는 Layout
- 디자인 편의를 위한 Wireframe 순서 변경
- 존재하지 않는 IA 관계의 시각적 생성

---

# 35. 변경 관리

## 절차

```text
시각적 문제 발견
→ 문제 화면과 정보 영역 확인
→ Wireframe 위계·순서 확인
→ Screen Responsibility 확인
→ User Flow와 IA 관계 확인
→ Visual Design만의 문제인지 판정
→ 시각 규칙 변경안 작성
→ 접근성·반응형·다국어·광고 영향 검토
→ 사용자 승인
→ Visual Design System 반영
→ Component·Implementation 단계로 전달
```

## 변경안 필수 항목

- 문제 화면
- 대상 정보
- 현재 시각 위계
- 변경할 시각 위계
- Wireframe 근거
- Screen Responsibility 근거
- 영향받는 Design Token
- Desktop·Mobile 영향
- 한국어·영어 영향
- 접근성 영향
- 광고 구분 영향
- SEO·GEO 정보 노출 영향
- Component·Implementation 단계 전달 사항

---

# 36. 최종 불변 원칙

```text
Visual Design은 정보를 만들어내지 않는다.

Visual Design은
승인된 정보의 중요도,
관계,
현재 상태,
다음 행동을
가장 이해하기 쉬운 방식으로 보이게 한다.

시각적으로 해결할 수 없는 구조 문제는
새로운 화면·기능·관계로 우회하지 않고
해당 상위 Source of Truth로 반환한다.
```

---

# 37. 자체 검토 기록

## 상위 Source of Truth와 충돌 여부

- [x] Master Design Constitution의 경제 교양 출판물 정체성과 일치한다.
- [x] Information Architecture에 없는 정보 객체·관계를 만들지 않았다.
- [x] User Flow의 진입·분기·복귀·종료를 변경하지 않았다.
- [x] Screen Architecture의 `SR-01~SR-09` 책임을 변경하지 않았다.
- [x] Wireframe의 정보 위계와 화면별 최종 순서를 유지했다.

## 책임 범위

- [x] Visual Design의 책임을 시각 언어와 표현 규칙으로 한정했다.
- [x] 새로운 프로젝트 철학·기능·상태·데이터 요구를 만들지 않았다.
- [x] Component 단계와 Implementation 단계의 책임을 분리했다.
- [x] 구현 코드·CSS·HTML·React·Next.js·Tailwind·API를 작성하지 않았다.

## 품질

- [x] Typography 역할·범위·장문 기준을 정의했다.
- [x] Semantic Color와 접근성 대비를 함께 정의했다.
- [x] Spacing·Grid·Card·Navigation·CTA 공통 규칙을 정의했다.
- [x] Empty·Error·Loading·Language Entry·Advertisement 상태를 정의했다.
- [x] 360px·390px을 포함한 반응형 검증 기준을 정의했다.
- [x] 모든 주요 규칙을 Wireframe 정보 위계와 연결했다.
- [x] 화면별 Visual Handoff가 Component Guide로 인계 가능한 수준인지 확인했다.

---

# 38. 공식 승인 범위와 사실 확인 리스트

## 공식 승인 범위

- [x] 이 문서를 공식 Visual Design Source of Truth로 정의한다.
- [x] 0~38의 39개 장으로 문서 범위를 고정한다.
- [x] `V1~V6·VS·VA` 시각 위계 체계를 사용한다.
- [x] 4px 최소·8px 중심 Spacing Scale을 사용한다.
- [x] 12·8·4열 Responsive Grid 방향을 사용한다.
- [x] 현재 공식 경험은 Light Theme로 유지한다.
- [x] Primitive·Semantic·Component·State Token 계층을 사용한다.

## 사실 확인 리스트

- [x] 지정된 상위 Source of Truth 5종을 실제 문서 기준으로 대조했다.
- [x] 승인된 Visual Design 설계안을 그대로 공식화했다.
- [x] 새로운 기능을 만들지 않았다.
- [x] 새로운 정보 객체나 Knowledge 관계를 만들지 않았다.
- [x] User Flow를 추가하거나 변경하지 않았다.
- [x] Screen Responsibility를 변경하지 않았다.
- [x] Wireframe의 정보 순서를 변경하지 않았다.
- [x] Previous·Next와 Related Knowledge를 분리했다.
- [x] 일반 언어 이동과 대응 Knowledge 이동을 분리했다.
- [x] 실제로 없는 완료·저장·진도·개인화 상태를 만들지 않았다.
- [x] 광고를 콘텐츠 위계 밖의 독립 영역으로 정의했다.
- [x] 접근성 대비·Focus·터치 영역·비색상 단서를 포함했다.
- [x] Responsive Design에서 의미 순서를 유지했다.
- [x] Component의 실제 구현 방식을 정의하지 않았다.
- [x] 구현 코드·CSS·HTML·React·Next.js·Tailwind·API·데이터 구조를 작성하지 않았다.

