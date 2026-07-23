# ROBO5_COMPONENT_GUIDE.md

Version: 0.9  
Status: Official Source of Truth Draft  
Scope: Robo5 Public UI Reusable Visual Components

---

# 0. 문서의 지위와 목적

이 문서는 Robo5의 공식 Component Source of Truth 초안이다.

승인된 Screen Blueprint와 Visual Design System에서 실제로 반복되는 UI를 동일한 시각 표현으로 재사용하기 위한 표준 규격을 정의한다.

```text
Approved Screen Blueprint
+ Approved Visual Design
→ Reusable Visual Component Rules
```

여기서 Component는 구현 단위나 새로운 IA 객체가 아니라 **승인된 정보를 반복해서 표현하는 시각 유형**이다.

이 문서는 디자이너, Stitch, Figma와 Codex가 같은 Component를 같은 의미·위계·상태·반응형 규칙으로 사용하게 한다.

## 0.1 입력 Source of Truth

1. `ROBO5_MASTER_DESIGN_CONSTITUTION.md`
2. `ROBO5_INFORMATION_ARCHITECTURE.md`
3. `ROBO5_USER_FLOW.md`
4. `ROBO5_SCREEN_ARCHITECTURE.md`
5. `ROBO5_WIREFRAME_GUIDE.md`
6. `ROBO5_VISUAL_DESIGN_SYSTEM.md`
7. `ROBO5_UI_SCREEN_SPECIFICATION.md`

## 0.2 권한과 경계

이 문서는 다음만 소유한다.

- 실제 화면에 반복 등장하는 시각 표현의 명칭과 목적
- 사용 화면·Wireframe·Visual Priority 연결
- 필수·선택 요소
- 승인된 Variant와 상태
- Desktop·Tablet·Mobile 재배치
- 접근성·광고·Component 간 관계
- 사용 금지 사례

이 문서는 다음을 소유하지 않는다.

- 새로운 기능·화면·IA·User Flow·Navigation·Screen Responsibility
- 새로운 데이터·관계·상태
- Wireframe 순서 또는 Visual Design 변경
- HTML·CSS·Tailwind·React·Next.js·API·Database
- Animation·Design Token의 구현

충돌 시 상위 Source of Truth를 우선한다. Component로 해결할 수 없는 구조 문제는 임의로 우회하지 않고 해당 상위 문서로 반환한다.

---

# 1. 공통 Component 규칙

## 1.1 Visual Priority

| 등급 | 의미 |
|---|---|
| V1 | 화면의 중심 목적 |
| V2 | 즉시 이해 정보 |
| V3 | 주된 내용 |
| V4 | 주요 다음 행동 |
| V5 | 선택 확장 |
| V6 | 보조 정보 |
| VS | Empty·Error·Loading·Unavailable 상태 |
| VA | 콘텐츠 위계 밖의 광고 |

- 하나의 Component는 화면과 문맥에 따라 승인된 복수 Priority를 가질 수 있다.
- Component가 배치된 Section의 Priority를 넘어 임의로 강해지면 안 된다.
- `VA`는 `V1~V6` 안으로 들어가지 않는다.

## 1.2 공통 상태 원칙

- `Normal`은 정보와 행동의 기본 표현이다.
- `Hover`는 포인터 보조 피드백이며 새로운 정보를 만들지 않는다.
- `Focus`는 모든 상호작용 Component에서 명확히 식별되어야 한다.
- `Active`는 실제 현재 위치·선택·단계가 확인될 때만 사용한다.
- `Disabled`는 기능상 존재하지만 현재 수행할 수 없는 경우에만 사용한다.
- `Unavailable`은 승인된 대상이 실제로 없거나 사용할 수 없음을 사실대로 표시한다.
- `Loading`은 실제 구조와 유사한 공간을 유지하되 존재하지 않는 관계를 암시하지 않는다.
- `Empty`와 `Error`는 `State Card` 및 승인된 복구 표현으로 처리한다.
- 가짜 완료·저장·진도·잠금·개인화 상태를 만들지 않는다.

## 1.3 공통 Responsive 원칙

- Desktop 12열, Tablet 8열, Mobile 4열의 승인 Grid 안에서 재배치한다.
- Desktop의 시각 순서와 Mobile의 논리 순서를 일치시킨다.
- Mobile에서 핵심 정보와 문맥을 삭제하지 않는다.
- Card 계열은 Mobile에서 기본 한 열이다.
- Sidebar 표현은 관련 본문 뒤의 승인된 논리 구간으로 이동할 수 있다.
- 긴 한국어·영어 제목과 버튼 문구의 줄바꿈을 허용한다.
- 360px과 390px에서 별도 검증한다.

## 1.4 공통 접근성 원칙

- 일반 텍스트 대비 `4.5:1` 이상, 큰 텍스트와 비텍스트 UI 대비 `3:1` 이상을 충족한다.
- 주요 터치 대상은 최소 `44×44px`이다.
- 색상만으로 유형·상태·방향·오류를 구분하지 않는다.
- 시각 순서와 논리적 읽기 순서를 일치시킨다.
- Hover만으로 정보를 제공하지 않는다.
- 의미 있는 이미지에는 대체 설명을 제공할 수 있어야 한다.
- 확대와 긴 문구에서도 정보가 겹치거나 사라지지 않아야 한다.
- Reduced Motion에서는 필수 상태 변화만 유지한다.

## 1.5 광고 공통 경계

- 광고는 항상 `Advertisement Block`으로만 표현한다.
- 광고가 없어도 화면과 다른 Component의 구조가 완전해야 한다.
- 광고를 Knowledge Card·CTA·Search Result·Information Box처럼 보이게 하지 않는다.
- 제목과 직접 답변 사이, 첫 문단 내부, Path 단계 사이, Previous와 Next 사이, 용어와 정의 사이, 검색 표현과 첫 결과 사이, 상태 사실과 Recovery CTA 사이, Language Entry 판단 과정에는 광고를 두지 않는다.

---

# 2. Global Header

## 목적

브랜드와 교육 목적을 식별하고 승인된 Global Navigation, Search, Language Entry 접근을 제공하는 전역 프레임이다.

## 사용 위치

Homepage, Category, Hub, Article, Search, Glossary, Learning Guide, Language 및 문맥 유지가 가능한 Empty·Error 화면.

## 연결되는 Screen

모든 공개 Screen. 상태 화면에서는 복구보다 낮은 위계를 유지한다.

## 연결되는 Wireframe

각 정상 화면의 최상단 `Header`. 화면별 Section 순서를 감싸며 대체하지 않는다.

## 연결되는 Visual Priority

`V6`. 현재 화면의 핵심 목적보다 강하지 않다.

## 포함 요소

- 필수: 브랜드 식별, 승인된 Global Navigation, Search 진입, Language Entry 진입.
- 선택: 현재 언어 라벨, Mobile Navigation 제어.

## Variant

- `Desktop`
- `Compact`: Tablet·Mobile에서 동일 객체를 축약 배치한다.

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Loading`. 현재 위치가 확인될 때만 `Active`를 사용한다.

## Responsive

- Desktop: 승인된 전역 항목을 한 프레임 안에 배치한다.
- Tablet: 항목 간격과 노출 방식을 축소하되 명칭과 접근을 유지한다.
- Mobile: 승인된 Mobile Navigation 표현으로 접으며 Search·Language 접근을 삭제하지 않는다.

## 접근성

Navigation 목적과 현재 위치를 텍스트로 식별한다. 키보드 순서는 시각 순서와 일치하고 제어 대상의 열림·닫힘 상태를 인식할 수 있어야 한다.

## 광고와의 관계

광고를 Header 내부 또는 Global Navigation 항목처럼 배치하지 않는다.

## 다른 Component와의 관계

`Search Bar`와 `Language Entry Block`으로 진입할 수 있으나 두 Component의 판단 책임을 Header가 대신하지 않는다.

## 사용 금지 사례

화면별 CTA 삽입, 시세 Ticker, 개인화 Dashboard, 승인되지 않은 Navigation, Sticky 요소로 본문을 가리는 표현.

---

# 3. Global Footer

## 목적

화면 종료 후 브랜드 설명, 주요 정보공간, 정책·문의·교육 목적 안내와 유효한 전역 복귀를 제공한다.

## 사용 위치

모든 정상 Screen과 문맥 유지가 가능한 상태 Screen.

## 연결되는 Screen

Homepage, Category, Hub, Article, Search, Glossary, Learning Guide, Language, Empty, Error.

## 연결되는 Wireframe

각 화면의 마지막 `Footer`. 화면별 마지막 Section 다음에 온다.

## 연결되는 Visual Priority

`V6`.

## 포함 요소

- 필수: 브랜드·교육 목적 안내, 승인된 주요 정보공간, 정책 정보.
- 선택: 문의, 언어 정보공간, 전체 정보공간 복귀.

## Variant

- `Default`
- `Compact`: 상태 화면 또는 좁은 폭에서 정보량을 줄이지 않고 재배치한다.

## 상태

`Normal`, `Hover`, `Focus`.

## Responsive

- Desktop: 정보군을 구분된 열로 배치할 수 있다.
- Tablet: 열 수를 축소한다.
- Mobile: 논리 그룹을 한 열로 쌓고 링크 목적을 유지한다.

## 접근성

정보군 제목과 링크 관계를 명확히 하고 작은 저대비 글씨로 필수 정책을 숨기지 않는다.

## 광고와의 관계

광고를 Footer 링크나 정책 정보처럼 표현하지 않는다.

## 다른 Component와의 관계

화면의 `Secondary CTA` 또는 복귀 행동을 반복해 핵심 행동처럼 강화하지 않는다.

## 사용 금지 사례

새로운 사이트맵·Navigation 생성, 과도한 링크 나열, 콘텐츠보다 강한 CTA, 광고의 정책 링크 위장.

---

# 4. Breadcrumb

## 목적

현재 화면의 상위 정보공간과 위치 관계를 설명한다.

## 사용 위치

Category, Hub, Article. 유효한 상위 문맥이 확인된 Empty·Error에서 선택적으로 유지한다.

## 연결되는 Screen

Category, Hub, Article, Empty, Error.

## 연결되는 Wireframe

Header 다음, 제목·범위 또는 질문 앞.

## 연결되는 Visual Priority

`V6`.

## 포함 요소

- 필수: 상위 경로 라벨, 현재 위치.
- 선택: 승인된 중간 Category·Hub.

## Variant

- `Default`
- `Compact`: 긴 경로를 좁은 화면에서 줄바꿈 또는 승인된 축약 방식으로 표시한다.

## 상태

`Normal`, `Hover`, `Focus`, `Active`. 현재 위치는 링크가 아닌 현재 상태로 표현할 수 있다.

## Responsive

- Desktop·Tablet: 순서 관계를 한 줄 또는 자연스러운 줄바꿈으로 유지한다.
- Mobile: 핵심 상위 문맥을 삭제하지 않고 가로 스크롤에 의존하지 않는 방식으로 재배치한다.

## 접근성

위치 Navigation임을 식별할 수 있어야 하며 구분 기호를 정보로 읽게 하지 않는다.

## 광고와의 관계

Breadcrumb와 Page Title 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

`Page Title`의 상위 문맥만 제공하며 `Learning Path`의 진행 상태를 대신하지 않는다.

## 사용 금지 사례

진행률·단계 표시, 존재하지 않는 상위 관계 추가, Homepage의 플랫폼 정체성 대체.

---

# 5. Page Title

## 목적

현재 화면의 중심 대상·질문·범위를 가장 먼저 명확히 식별한다.

## 사용 위치

Category, Hub, Article, Search, Glossary, Learning Guide, Language, Empty, Error. Homepage에서는 플랫폼 정체성 제목 역할에 한해 사용한다.

## 연결되는 Screen

모든 Screen.

## 연결되는 Wireframe

Breadcrumb가 있으면 그 다음. Article에서는 중심 질문·제목, Search에서는 검색 목적·표현, Glossary에서는 현재 용어에 연결된다.

## 연결되는 Visual Priority

`V1`; 설명은 `V2`.

## 포함 요소

- 필수: 화면의 승인된 제목 또는 중심 질문.
- 선택: 범위 설명, 현재 검색 표현, 상태 라벨.

## Variant

- `Default`
- `Article`
- `State`: Empty·Error 사실을 명확히 표시한다.

## 상태

`Normal`, `Loading`, `Unavailable`. 제목 자체에 Hover·Active를 부여하지 않는다.

## Responsive

모든 폭에서 논리상 첫 제목을 유지하며 자연스러운 여러 줄을 허용한다. Mobile에서 글자 수를 임의로 잘라 의미를 바꾸지 않는다.

## 접근성

화면의 단일 최상위 제목으로 식별하고 후속 Heading의 논리 위계를 보장한다.

## 광고와의 관계

Page Title과 `Direct Answer Block`, 짧은 정의 또는 첫 핵심 정보 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

`Breadcrumb` 다음, `Direct Answer Block` 또는 화면 설명 앞에 위치한다. `Section Heading`과 역할을 혼합하지 않는다.

## 사용 금지 사례

CTA 문구를 제목으로 사용, 장식 이미지에 의미 의존, 화면마다 임의 Typography 적용, 여러 개의 동등한 최상위 제목.

---

# 6. Direct Answer Block

## 목적

Article의 중심 질문에 대한 직접 답변을 첫 정보 구간에서 즉시 제공한다.

## 사용 위치

Article Detail.

## 연결되는 Screen

Article.

## 연결되는 Wireframe

`Breadcrumb → 중심 질문·제목 → Direct Answer → 신뢰 정보 → Article Body`.

## 연결되는 Visual Priority

`V2`.

## 포함 요소

- 필수: 질문에 직접 답하는 짧고 완결된 문장 또는 문단.
- 선택: 답변 이해에 필수인 제한적 핵심 용어.

## Variant

- `Default`
- `Wide`: 짧은 답변이 넓은 문맥에서 읽혀야 할 때 Article Width 안에서만 사용한다.

## 상태

`Normal`, `Loading`, `Unavailable`, `Error`.

## Responsive

Desktop·Tablet·Mobile에서 제목 다음 순서를 고정한다. 폭만 조정하며 본문 뒤로 이동시키지 않는다.

## 접근성

본문 텍스트 수준의 충분한 크기·줄 높이·대비를 사용하고 장식만으로 Block을 구분하지 않는다.

## 광고와의 관계

제목과 Direct Answer 사이, Direct Answer와 첫 문단 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

`Article Body`의 요약 대체물이 아니며 `Information Box`로 변형하지 않는다.

## 사용 금지 사례

상품 권유, 과장된 결론, 답변보다 강한 CTA, 접힌 상태, 광고 또는 관련 글 삽입.

---

# 7. Article Body

## 목적

직접 답변을 근거·설명·구조로 확장하여 장문 Knowledge를 편안하게 읽게 한다.

## 사용 위치

Article Detail.

## 연결되는 Screen

Article.

## 연결되는 Wireframe

Direct Answer와 신뢰 정보 뒤, 핵심 정리·Learning Path 앞.

## 연결되는 Visual Priority

`V3`.

## 포함 요소

- 필수: 승인된 본문, 논리적인 Section Heading과 문단.
- 선택: 목록, 표, 이미지, Information Box, Glossary 연결.

## Variant

- `Default`
- `With Sidebar`: 승인된 보조 정보가 존재할 때만 사용한다.

## 상태

`Normal`, `Loading`, `Unavailable`, `Error`.

## Responsive

- Desktop: 약 `720~780px` Article Width를 중심으로 제한적 Sidebar를 허용한다.
- Tablet: 본문 폭을 보호하고 Sidebar를 축소 또는 후속 구간으로 이동한다.
- Mobile: 한 열, 최소 16px 본문, 자연스러운 줄바꿈과 충분한 문단 간격을 유지한다.

## 접근성

Heading 순서, 목록·표의 의미, 링크 목적, 이미지 대체 설명을 유지한다. 작은 회색 글씨로 필수 신뢰 정보를 제공하지 않는다.

## 광고와의 관계

완결된 의미 단위 사이에만 광고를 허용한다. 첫 문단 내부와 Heading-본문 사이에는 두지 않는다.

## 다른 Component와의 관계

`Section Heading`, `Information Box`, `Glossary Block`, `Sidebar Module`을 포함할 수 있으나 화면 후속 Navigation을 본문 안에 흡수하지 않는다.

## 사용 금지 사례

고정 높이·강제 말줄임, 무분별한 Card화, Sticky CTA로 읽기 방해, 본문 순서 변경.

---

# 8. Section Heading

## 목적

한 화면 또는 Article Body 안의 정보 단위를 논리적으로 구분한다.

## 사용 위치

모든 Screen의 승인된 Section과 Article Body.

## 연결되는 Screen

Homepage, Category, Hub, Article, Search, Glossary, Learning Guide, Language, Empty, Error.

## 연결되는 Wireframe

각 승인 Section의 시작점. Wireframe Section 순서를 그대로 반영한다.

## 연결되는 Visual Priority

상위 Section의 `V2~V6`을 따른다.

## 포함 요소

- 필수: Section 제목.
- 선택: 짧은 범위 설명, 유형 Label.

## Variant

- `Default`
- `Compact`: Sidebar 또는 보조 영역.

## 상태

`Normal`, `Loading`. 상호작용 상태를 부여하지 않는다.

## Responsive

제목의 논리 수준은 유지하고 크기·간격만 승인 Typography와 Spacing 범위에서 조정한다. 긴 제목 줄바꿈을 허용한다.

## 접근성

시각 크기와 문서 Heading 수준을 일치시키며 단계 건너뛰기를 피한다.

## 광고와의 관계

Heading과 그 Heading이 설명하는 첫 내용 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

`Page Title`보다 낮은 위계이며 Card 제목을 화면 Section Heading처럼 과장하지 않는다.

## 사용 금지 사례

장식용 Heading 반복, 의미 없는 아이콘 선행, 모든 Section을 동일 강도로 표현.

---

# 9. Knowledge Card

## 목적

하나의 승인된 Knowledge를 선택 가능한 독립 단위로 표현한다.

## 사용 위치

Homepage, Category, Hub, Learning Guide의 승인된 Knowledge 목록.

## 연결되는 Screen

Homepage, Category, Hub, Learning Guide.

## 연결되는 Wireframe

주요 Knowledge, 대표 Knowledge, 세부 Knowledge, 대체 시작점 등 실제 Knowledge가 배치된 Section.

## 연결되는 Visual Priority

`V3`, `V4` 또는 선택 확장의 `V5`.

## 포함 요소

- 필수: Knowledge 제목, 유형 또는 상위 문맥, 이동 대상.
- 선택: 짧은 설명, 이미지, 현재성 정보.

## Variant

- `Default`
- `Compact`: 보조 목록 또는 좁은 영역.
- `Inline`: Card보다 구분선 기반 목록이 더 적합한 문맥.

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Unavailable`, `Loading`.

## Responsive

Desktop·Tablet에서 승인된 다열을 사용할 수 있고 Mobile에서는 한 열이 기본이다. 이미지가 없어도 제목·설명 위치 관계가 유지된다.

## 접근성

전체 클릭 영역과 내부 링크의 Focus 범위를 명확히 한다. 유형을 색상만으로 표시하지 않는다.

## 광고와의 관계

광고와 같은 배경·테두리·Label을 사용하지 않는다.

## 다른 Component와의 관계

대표 시작점은 `Featured Knowledge Card`, Hub 범위는 `Hub Summary Card`, Search 결과는 `Search Result Item`을 사용한다.

## 사용 금지 사례

모든 정보 객체의 Card 통일, 가짜 완료·저장 상태, 내용 길이 강제, 존재하지 않는 관계 표시.

---

# 10. Featured Knowledge Card

## 목적

승인된 대표 시작 Knowledge를 일반 Knowledge 목록과 구분해 제시한다.

## 사용 위치

Homepage, Category, Hub에서 실제 대표 시작점이 승인된 경우.

## 연결되는 Screen

Homepage, Category, Hub.

## 연결되는 Wireframe

대표 학습 시작점, 추천 시작점.

## 연결되는 Visual Priority

`V4`; 화면의 `V1~V3`보다 강하지 않다.

## 포함 요소

- 필수: 대표성 또는 시작점 Label, Knowledge 제목, 도착 범위, Primary 이동.
- 선택: 짧은 설명, 보조 이미지, 상위 Hub 문맥.

## Variant

- `Default`
- `Wide`: Homepage 또는 Hub의 제한된 Wide 구간.

## 상태

`Normal`, `Hover`, `Focus`, `Unavailable`, `Loading`.

## Responsive

Desktop에서 일반 목록보다 넓게 표현할 수 있다. Tablet·Mobile에서는 한 열로 전환하되 대표 Label과 도착 범위를 유지한다.

## 접근성

Featured 의미를 크기·Label·구조로 함께 전달하며 색상만으로 구분하지 않는다.

## 광고와의 관계

광고를 Featured Knowledge처럼 만들거나 인접 배치로 오인시키지 않는다.

## 다른 Component와의 관계

내부에 `Primary CTA`를 포함할 수 있다. 일반 `Knowledge Card` 목록과 시각적으로 구분하되 과도하게 Hero화하지 않는다.

## 사용 금지 사례

인기·최신을 대표 시작점으로 임의 승격, 자동 Slider, 거대한 추상 이미지, 여러 Featured의 동등 경쟁.

---

# 11. Category Card

## 목적

Category의 분야 범위와 진입점을 Knowledge 또는 Hub와 다른 시각 유형으로 표현한다.

## 사용 위치

Homepage의 핵심 Category, Category 화면의 승인된 관련 Category.

## 연결되는 Screen

Homepage, Category.

## 연결되는 Wireframe

핵심 Category, 승인된 관련 Category.

## 연결되는 Visual Priority

핵심은 `V3`, 관련 확장은 `V5·V6`.

## 포함 요소

- 필수: Category명, 분야 범위, 이동 대상.
- 선택: 대표 주제 또는 짧은 설명.

## Variant

- `Default`
- `Compact`: 관련 Category.

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Unavailable`, `Loading`.

## Responsive

다열 수를 줄여 Mobile에서 한 열로 전환한다. 범위 설명을 임의 삭제하지 않는다.

## 접근성

Category임을 텍스트와 구조로 명시하고 Card 전체 클릭 영역을 예측 가능하게 한다.

## 광고와의 관계

광고를 Category Card와 동일한 Grid·표면으로 표현하지 않는다.

## 다른 Component와의 관계

`Hub Summary Card`, `Knowledge Card`와 객체 유형을 혼합하지 않는다.

## 사용 금지 사례

Category와 Hub 통합, 새로운 분류 생성, 의미 없는 아이콘 Grid, 최근 글을 Category로 표현.

---

# 12. Hub Summary Card

## 목적

Hub의 주제 범위, 학습 결과와 승인된 시작점을 하나의 요약 단위로 표현한다.

## 사용 위치

Homepage, Category, Learning Guide에서 Hub 진입이 실제 승인된 경우.

## 연결되는 Screen

Homepage, Category, Learning Guide.

## 연결되는 Wireframe

대표 학습 시작점, 추천 시작 Hub, 핵심 Hub, 관련 Category·Hub.

## 연결되는 Visual Priority

`V3·V4`; 보조 Hub는 `V5`.

## 포함 요소

- 필수: Hub명, 학습 범위, 승인된 진입.
- 선택: 핵심 질문, 추천 시작 Knowledge, Path 범위.

## Variant

- `Default`
- `Featured`: 추천 시작 Hub.
- `Compact`: 관련 Hub.

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Unavailable`, `Loading`.

## Responsive

Desktop의 다열 또는 Wide 표현을 Tablet에서 축소하고 Mobile에서 한 열로 배치한다. Hub 범위와 시작점 관계를 유지한다.

## 접근성

Hub와 Category·Knowledge 차이를 텍스트 Label과 설명으로 제공한다.

## 광고와의 관계

광고를 Hub 추천처럼 표현하지 않는다.

## 다른 Component와의 관계

Path 전체를 직접 표현하지 않으며 필요한 경우 `Primary CTA`로 Hub에 진입한 뒤 `Learning Path`를 확인하게 한다.

## 사용 금지 사례

Hub를 새로운 Category로 표현, 실제 없는 Path·Node 수 표시, 가짜 진도·완료율.

---

# 13. Learning Path

## 목적

승인된 Knowledge Node의 순차 학습 범위와 시작·현재·다음 관계를 한 구조로 표현한다.

## 사용 위치

Homepage, Hub, Article, Learning Guide.

## 연결되는 Screen

Homepage, Hub, Article, Learning Guide.

## 연결되는 Wireframe

추천 Learning Path, 전체 Learning Path, Learning Path와 현재 위치, 연결된 Learning Path.

## 연결되는 Visual Priority

`V3`; 진입 행동은 `V4`.

## 포함 요소

- 필수: Path명 또는 목적, 승인된 단계 순서, 각 `Learning Step`.
- 선택: 현재 위치, 시작점, Path 범위 설명.

## Variant

- `Default`
- `Compact`: Homepage의 추천 Path.
- `Inline`: Article의 현재 문맥.

## 상태

`Normal`, `Active`, `Loading`, `Empty`, `Unavailable`. 실제 확인된 현재 단계만 `Active`로 표시한다.

## Responsive

- Desktop: 논리 순서가 명확할 때 가로 또는 다열 관계를 허용한다.
- Tablet: 관계가 약해지면 세로로 전환한다.
- Mobile: 단계 번호·제목·상태가 보이는 세로 흐름을 사용한다.

## 접근성

순서를 구조적으로 전달하고 현재 단계는 Label·굵기·표식 등 비색상 단서를 병행한다.

## 광고와의 관계

Path 내부와 단계 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

`Learning Step`을 포함한다. `Previous / Next Navigation`은 Article의 국소 순차 이동이며 Path 자체와 동일하지 않다. `Related Knowledge List`를 Path에 포함하지 않는다.

## 사용 금지 사례

가짜 완료율·잠금·저장·재개, Related 삽입, 일부 단계를 빈 상태로 생성, 자동 Slider.

---

# 14. Learning Step

## 목적

Learning Path 안의 하나의 승인된 순차 Knowledge와 현재 관계를 표현한다.

## 사용 위치

Learning Path가 사용되는 Homepage, Hub, Article, Learning Guide.

## 연결되는 Screen

Homepage, Hub, Article, Learning Guide.

## 연결되는 Wireframe

Learning Path 내부의 실제 단계.

## 연결되는 Visual Priority

Path의 `V3`; 현재 또는 시작 행동은 `V4`.

## 포함 요소

- 필수: 단계 번호 또는 순서 단서, 제목, 이동 대상.
- 선택: 짧은 설명, 실제 현재 상태 Label.

## Variant

- `Default`
- `Compact`
- `Current`: 실제 현재 단계.

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Unavailable`, `Loading`.

## Responsive

가로 Path에서는 순서를 유지하고 좁은 화면에서는 세로로 쌓는다. 번호·제목·현재 상태를 삭제하지 않는다.

## 접근성

현재 단계와 순서를 색상 외 텍스트·번호·형태로 식별한다. 링크 목적은 제목만으로 이해 가능해야 한다.

## 광고와의 관계

Step 사이에 광고를 삽입하지 않는다.

## 다른 Component와의 관계

반드시 `Learning Path` 문맥 안에서 사용한다. 독립 Knowledge 목록은 `Knowledge Card` 또는 목록 표현을 사용한다.

## 사용 금지 사례

Related Knowledge를 Step으로 표시, 실제 없는 완료 체크·잠금, Drag·재정렬 기능 암시.

---

# 15. Previous / Next Navigation

## 목적

Article에서 승인된 순차 학습의 이전·다음 Knowledge 이동을 제공한다.

## 사용 위치

Article Detail.

## 연결되는 Screen

Article.

## 연결되는 Wireframe

Learning Path와 현재 위치 다음, Related Knowledge 앞.

## 연결되는 Visual Priority

`V4`.

## 포함 요소

- 필수: 방향 Label, 대상 제목, 유효한 이동 대상.
- 선택: 짧은 Path 문맥, 시작·끝 사실.

## Variant

- `Default`: Desktop의 관계형 2방향.
- `Stacked`: Tablet·Mobile의 세로 배치.

## 상태

`Normal`, `Hover`, `Focus`, `Unavailable`, `Loading`. 대상이 없으면 가짜 비활성 링크 대신 시작·끝 사실을 표시하거나 해당 방향을 제거한다.

## Responsive

Desktop에서 같은 Container 안의 2열 관계를 허용한다. Tablet은 제목 가독성에 따라 1열로 전환하고 Mobile은 방향·제목을 유지한 세로 배치를 사용한다.

## 접근성

이전·다음 방향과 대상 제목을 텍스트로 제공하고 키보드 순서를 논리 방향과 일치시킨다.

## 광고와의 관계

Previous와 Next 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

`Related Knowledge List`와 영역·제목·시각 문법을 분리한다. `Primary CTA`처럼 과도하게 강화하지 않는다.

## 사용 금지 사례

Related 통합, Carousel, 존재하지 않는 다음 글 추천, 시작·끝에서 가짜 Disabled 링크 생성.

---

# 16. Related Knowledge List

## 목적

현재 Knowledge와 승인된 비순차 관계를 선택 확장으로 제공한다.

## 사용 위치

Article, Hub의 선택 확장 Knowledge.

## 연결되는 Screen

Article, Hub.

## 연결되는 Wireframe

Related Knowledge, 선택 확장 Knowledge.

## 연결되는 Visual Priority

`V5`.

## 포함 요소

- 필수: Section Label, 관련 Knowledge 제목, 이동 대상.
- 선택: 관계 이유 또는 상위 문맥, 짧은 설명.

## Variant

- `Default`
- `Compact`
- `Inline`

## 상태

`Normal`, `Hover`, `Focus`, `Loading`, `Empty`.

## Responsive

Desktop·Tablet의 목록 또는 제한적 다열을 Mobile에서 한 열로 전환한다. 관계 Label과 제목을 유지한다.

## 접근성

관련 항목임을 Section 제목으로 명시하고 각 링크의 목적을 제목으로 식별한다.

## 광고와의 관계

광고를 관련 Knowledge 항목처럼 섞지 않는다.

## 다른 Component와의 관계

항목에 `Knowledge Card` 또는 구분선 기반 목록 표현을 사용할 수 있다. `Previous / Next Navigation`과 결합하지 않는다.

## 사용 금지 사례

순차 단계처럼 번호 부여, 인기 글로 자동 대체, 관련 이유 없는 임의 추천, 광고 혼합.

---

# 17. Glossary Block

## 목적

용어의 짧은 정의, 명칭 관계, 관련 개념과 상세 Knowledge 전환을 빠른 확인 구조로 표현한다.

## 사용 위치

Financial Glossary, Article의 승인된 용어 확인 구간.

## 연결되는 Screen

Glossary, Article.

## 연결되는 Wireframe

Glossary의 현재 용어→짧은 정의→관련 분야→명칭 관계→개념 관계→상세 Knowledge, Article의 Glossary 연결.

## 연결되는 Visual Priority

용어 `V1`, 정의 `V2`, 상세 전환 `V4`, 관련 관계 `V5·V6`.

## 포함 요소

- 필수: 용어명, 짧은 정의.
- 선택: 관련 분야, 동의어·약어·영문명, 상위·하위·관련 용어, 상세 Knowledge, 원래 문맥 복귀.

## Variant

- `Default`: Glossary Screen.
- `Inline`: Article 문맥.
- `Compact`: 빠른 확인 목록.

## 상태

`Normal`, `Hover`, `Focus`, `Loading`, `Empty`, `Error`, `Unavailable`.

## Responsive

용어와 정의 사이의 순서를 고정한다. Mobile에서 명칭 관계와 개념 관계를 서로 다른 Group으로 한 열 배치한다.

## 접근성

용어와 정의의 읽기 관계를 명확히 하고 약어·동의어·관련 개념을 Label로 구분한다.

## 광고와의 관계

용어와 짧은 정의 사이, 원래 문맥과 복귀 행동 사이, 하나의 관계군 내부에 광고를 두지 않는다.

## 다른 Component와의 관계

상세 학습은 `Secondary CTA`, 문맥 복귀는 목적에 맞는 `Recovery CTA` 또는 보조 Navigation으로 표현할 수 있다.

## 사용 금지 사례

동의어와 관련 개념 혼합, 가짜 정의 생성, 상세 Knowledge가 없는데 비활성 링크 표시.

---

# 18. Search Bar

## 목적

사용자의 검색 표현 입력·수정·재검색을 명확한 과업으로 제공한다.

## 사용 위치

Global Header의 Search 진입, Homepage의 Search 진입, Search Screen, Glossary의 용어 접근.

## 연결되는 Screen

Homepage, Search, Glossary 및 Header가 존재하는 정상 Screen.

## 연결되는 Wireframe

Homepage의 Search·Learning Guide 진입, Search의 검색 목적·현재 표현 및 재검색, Glossary 목적·용어 접근.

## 연결되는 Visual Priority

Search Screen에서는 `V1·V4`, 보조 진입에서는 `V4·V5`, Header에서는 `V6`.

## 포함 요소

- 필수: 명시적 Label, 입력 영역, 검색 실행.
- 선택: 현재 검색 표현, 표현 조정 안내, 지우기.

## Variant

- `Default`
- `Compact`: Header.
- `Wide`: Search Screen 상단.

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Disabled`, `Loading`, `Error`.

## Responsive

Desktop의 입력·실행 배치를 Tablet·Mobile에서 필요 시 세로 또는 가변 폭으로 바꾸되 Label과 실행 대상을 유지한다.

## 접근성

Placeholder에 Label 역할을 맡기지 않는다. 입력 목적, 현재 값, 오류와 실행 제어를 인식할 수 있어야 한다.

## 광고와의 관계

현재 검색 표현·Search Bar와 첫 결과 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

결과는 `Search Result Item`, 결과 없음·실패는 `State Card`와 `Recovery CTA`가 담당한다.

## 사용 금지 사례

자동완성 결과가 없는 상태에서 가짜 제안, 광고 키워드 삽입, 결과 유형 필터를 새 기능으로 생성.

---

# 19. Search Result Item

## 목적

검색 표현과 연결된 Knowledge·Hub·Category·Glossary 결과를 유형과 문맥이 보이는 단위로 표현한다.

## 사용 위치

Search Screen.

## 연결되는 Screen

Search.

## 연결되는 Wireframe

가장 직접적인 Knowledge 결과, 관련 Hub·Category, 관련 Glossary Term.

## 연결되는 Visual Priority

직접 결과 `V3·V4`, 상위 문맥 `V3·V4`, Glossary `V5`.

## 포함 요소

- 필수: 결과 유형 Label, 제목, 상위 문맥, 이동 대상.
- 선택: 설명, 검색 표현과의 관련 이유.

## Variant

- `Knowledge`
- `HubCategory`
- `Glossary`

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Loading`, `Unavailable`.

## Responsive

유형별 Group 경계를 유지한다. Mobile에서도 유형 Label·제목·설명·상위 문맥을 줄바꿈해 보존한다.

## 접근성

유형을 색상 외 텍스트로 표시하고 제목과 상위 문맥을 키보드로 구분해 탐색할 수 있게 한다.

## 광고와의 관계

광고와 같은 Container·Label·간격을 사용하지 않는다.

## 다른 Component와의 관계

`Knowledge Card`를 그대로 재사용해 결과 유형 차이를 없애지 않는다. `Information Box`로 검색 해석 문맥을 별도 제공할 수 있다.

## 사용 금지 사례

모든 유형 통합 Card, 광고의 결과 위장, 결과 수를 시각적 우선순위로 과장, 존재하지 않는 관련 이유.

---

# 20. Language Entry Block

## 목적

일반 언어 정보공간 이동과 승인된 대응 Knowledge 이동을 구분하고 유지·비유지 문맥과 도착 범위를 설명한다.

## 사용 위치

Language Entry Screen 또는 승인된 화면의 보조 상태.

## 연결되는 Screen

Language 및 언어 이동이 승인된 정상 Screen.

## 연결되는 Wireframe

현재 언어·문맥→대상 언어→이동 유형→유지 정보→비유지 정보→도착 정보공간→대응 없음→복구.

## 연결되는 Visual Priority

현재 문맥 `V1·V2`, 대상·유지 판단 `V2·V3`, 이동 `V4`, 대응 없음 `VS`.

## 포함 요소

- 필수: 현재 언어, 대상 언어, 이동 유형, 도착 범위.
- 선택: 현재 Knowledge 문맥, 유지·비유지 정보, 대응 없음 사실, 복구 행동.

## Variant

- `Default`
- `Inline`: 승인된 화면의 보조 상태.

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Unavailable`, `Loading`, `Empty`, `Error`.

## Responsive

Desktop의 판단·비교 구조를 Tablet·Mobile에서 순서가 유지되는 한 열로 전환한다. 유지·비유지 문맥을 삭제하지 않는다.

## 접근성

국기만으로 언어를 표시하지 않고 `한국어`, `English`, `Global` 등 텍스트 Label을 사용한다.

## 광고와의 관계

언어 이동 판단 과정과 대응 없음 사실·Recovery CTA 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

이동은 `Primary CTA`, 상위 정보공간·Search 복구는 `Recovery CTA`를 사용할 수 있다.

## 사용 금지 사례

유사 콘텐츠를 번역본처럼 표현, 한국어·영어 별도 브랜드 체계, 자동 이동, 존재하지 않는 대응 Knowledge 생성.

---

# 21. Primary CTA

## 목적

현재 정보 구간에서 가장 중요한 승인된 다음 행동 하나를 명확히 제공한다.

## 사용 위치

Homepage 대표 시작점, Category 추천 Hub, Hub 추천 Node, Search 직접 진입·재검색, Learning Guide 시작점, Language 이동.

## 연결되는 Screen

Homepage, Category, Hub, Search, Learning Guide, Language.

## 연결되는 Wireframe

각 화면의 대표 시작점 또는 가장 중요한 이동 Section.

## 연결되는 Visual Priority

`V4`.

## 포함 요소

- 필수: 행동 Label, 예측 가능한 도착 대상.
- 선택: 방향 아이콘, 짧은 도착 범위 설명.

## Variant

- `Default`
- `Wide`: Mobile에서 문구 가독성과 터치 영역을 위해 전체 가용 폭을 사용할 수 있다.

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Disabled`, `Loading`.

## Responsive

한 정보 구간에 하나를 기본으로 한다. Mobile에서 줄바꿈과 충분한 터치 영역을 허용하되 Sticky로 본문을 가리지 않는다.

## 접근성

행동과 도착 범위를 문구만으로 이해할 수 있어야 하며 Focus와 Disabled 상태를 색상 외 단서로 구분한다.

## 광고와의 관계

광고와 같은 색·형태·문구 체계를 사용하지 않는다.

## 다른 Component와의 관계

보조 행동은 `Secondary CTA`, 상태 복구는 `Recovery CTA`를 사용한다. Article의 Previous·Next를 Primary CTA로 과장하지 않는다.

## 사용 금지 사례

한 구간의 복수 Primary, 콘텐츠보다 강한 크기, 투자 긴박감·수익 약속, 새로운 행동 생성.

---

# 22. Secondary CTA

## 목적

Primary 행동을 방해하지 않는 승인된 보조 이동 또는 선택 확장을 제공한다.

## 사용 위치

모든 정상 Screen의 보조 탐색·상위 복귀·상세 학습.

## 연결되는 Screen

Homepage, Category, Hub, Article, Search, Glossary, Learning Guide, Language.

## 연결되는 Wireframe

상위 복귀, 상세 Knowledge, 관련 Category·Hub, 대체 시작점 등 `V5·V6` 행동.

## 연결되는 Visual Priority

`V5` 또는 `V6`.

## 포함 요소

- 필수: 행동 Label, 이동 대상.
- 선택: 방향 단서, 짧은 보조 설명.

## Variant

- `Default`
- `Text`
- `Inline`

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Disabled`, `Unavailable`, `Loading`.

## Responsive

Primary와 경쟁하지 않도록 크기·배치 관계를 유지한다. Mobile에서 줄바꿈과 세로 배치를 허용한다.

## 접근성

링크인지 행동인지 목적이 명확해야 하며 작은 저대비 텍스트에 의존하지 않는다.

## 광고와의 관계

광고 Label 또는 광고 클릭 영역처럼 보이지 않는다.

## 다른 Component와의 관계

`Primary CTA`보다 낮고 `Recovery CTA`와 상태 책임을 혼합하지 않는다.

## 사용 금지 사례

숨겨진 필수 행동, 과도한 다수 나열, Primary와 동일 강조, 승인되지 않은 외부 이동.

---

# 23. Recovery CTA

## 목적

Empty·Error·Unavailable 상태에서 사용자의 원래 목적과 문맥을 보존하는 가장 가까운 유효 복구 행동을 제공한다.

## 사용 위치

Search 결과 없음, Glossary 부재, Language 대응 없음, Empty State, Error State 및 부분 실패.

## 연결되는 Screen

Search, Glossary, Language, Empty, Error와 부분 상태를 수용하는 모든 Screen.

## 연결되는 Wireframe

상태 사실→유지 문맥→가장 가까운 Recovery CTA→보조 Recovery.

## 연결되는 Visual Priority

`V4`; 상태 사실은 `VS`.

## 포함 요소

- 필수: 복구 행동 Label, 실제 도착 범위.
- 선택: 재시도, 상위 정보공간, Search, 보조 복구.

## Variant

- `Primary Recovery`
- `Secondary Recovery`
- `Inline Recovery`

## 상태

`Normal`, `Hover`, `Focus`, `Active`, `Disabled`, `Loading`.

## Responsive

상태 설명과 같은 의미 단위 안에서 배치하며 Mobile에서는 상태 사실 다음에 한 열로 둔다.

## 접근성

“돌아가기”만 쓰지 않고 도착 대상과 목적을 명시한다. Focus와 오류 상태를 색상만으로 전달하지 않는다.

## 광고와의 관계

상태 사실과 Primary Recovery 사이에 광고를 두지 않는다.

## 다른 Component와의 관계

`State Card` 안 또는 직후에 사용한다. 정상 화면의 `Primary CTA`와 목적을 혼합하지 않는다.

## 사용 금지 사례

존재하지 않는 콘텐츠 추천, 무조건 Homepage 이동, 사용자 책임 표현, 오류 해결과 무관한 전환 CTA.

---

# 24. Information Box

## 목적

본문이나 화면의 핵심 흐름을 바꾸지 않고 주의·정의·문맥·신뢰 정보를 제한적으로 구분한다.

## 사용 위치

Article Body, Search의 결과 해석 문맥, Glossary의 명칭·개념 관계, Language의 유지·비유지 정보.

## 연결되는 Screen

Article, Search, Glossary, Language.

## 연결되는 Wireframe

Article의 신뢰 정보·핵심 정리, Search의 상태·해석 문맥, Glossary와 Language의 보조 설명 Section.

## 연결되는 Visual Priority

`V2`, `V5` 또는 `V6`; 화면 중심보다 강하지 않다.

## 포함 요소

- 필수: 정보 유형 Label 또는 제목, 내용.
- 선택: 이해를 돕는 제한적 아이콘, 출처·현재성 정보.

## Variant

- `Default`
- `Inline`
- `Notice`

## 상태

`Normal`, `Loading`, `Unavailable`, `Error`.

## Responsive

본문 폭 안에서 사용하며 Mobile에서도 내용과 Label을 유지한다. 고정 높이를 사용하지 않는다.

## 접근성

색상만으로 정보 유형을 구분하지 않고 제목·Label·형태를 병행한다. 경고를 아이콘만으로 전달하지 않는다.

## 광고와의 관계

광고와 같은 표면·테두리·Label을 사용하지 않는다.

## 다른 Component와의 관계

`Direct Answer Block`, `State Card`, `Advertisement Block`을 대신하지 않는다.

## 사용 금지 사례

모든 문단 Box화, 새로운 경고·등급 생성, 장식 아이콘 반복, 광고·CTA 삽입.

---

# 25. State Card

## 목적

Empty·Error·Unavailable 상태의 사실, 유지되는 문맥과 복구 행동을 하나의 안정된 시각 단위로 표현한다.

## 사용 위치

Empty State, Error State와 각 Screen의 부분 Empty·Error.

## 연결되는 Screen

Homepage, Category, Hub, Article, Search, Glossary, Learning Guide, Language, Empty, Error.

## 연결되는 Wireframe

- Empty: 존재하지 않는 정보→유지 문맥→제거된 정상 영역→가장 가까운 복구→보조 복구.
- Error: 사용할 수 없는 대상→유지 목적·문맥→Recovery CTA→보조 설명.

## 연결되는 Visual Priority

상태 사실 `VS`, 복구 행동 `V4`, 보조 문맥 `V6`.

## 포함 요소

- 필수: 상태 제목, 사실 설명, 유지 문맥, `Recovery CTA`.
- 선택: 제거된 영역 설명, 보조 복구, 제한적 Illustration.

## Variant

- `Empty`
- `Error`
- `Unavailable`
- `Inline`: 부분 상태.

## 상태

`Normal`, `Loading`. Variant 자체가 상태를 나타내며 가짜 상태를 추가하지 않는다.

## Responsive

Desktop에서 Centered State를 사용하고 Tablet·Mobile에서 상태→문맥→복구 순서의 한 열을 유지한다.

## 접근성

오류를 빨간색만으로 표현하지 않는다. 상태 제목과 복구 목적을 텍스트로 제공하고 Focus가 상태 장식과 구분되어야 한다.

## 광고와의 관계

상태 사실과 Primary Recovery 사이에는 광고를 두지 않는다. 핵심 복구가 끝난 뒤에만 독립 광고를 검토할 수 있다.

## 다른 Component와의 관계

`Recovery CTA`를 포함한다. `Information Box`보다 상태 책임이 강하고 `Advertisement Block`과 완전히 분리한다.

## 사용 금지 사례

“아무것도 없습니다”로 종료, 인기 글 무조건 대체, 원인 추측, 사용자 책임 표현, 과도한 경고 Illustration.

---

# 26. Advertisement Block

## 목적

광고를 콘텐츠 위계 밖의 독립된 상업 영역으로 명확히 식별한다.

## 사용 위치

UI Screen Specification이 허용한 완결된 독립 정보 단위 사이.

## 연결되는 Screen

Homepage, Category, Hub, Article, Search, Glossary, Learning Guide. Language 판단 과정과 핵심 상태 복구 과정에는 사용하지 않는다.

## 연결되는 Wireframe

화면별 광고 허용 위치에만 삽입하며 Wireframe Section이 아니다. 어떤 Section도 대체하거나 순서를 변경하지 않는다.

## 연결되는 Visual Priority

`VA`.

## 포함 요소

- 필수: 명확한 광고 Label, 독립 광고 영역.
- 선택: 사전에 확보된 안정적 공간.

## Variant

- `Inline`
- `Wide`
- `Sidebar`

구체적인 광고 코드·네트워크·슬롯·크기는 이 문서가 정의하지 않는다.

## 상태

`Normal`, `Loading`, `Empty`, `Error`. 광고가 없거나 실패하면 콘텐츠 구조에 빈 구멍을 남기지 않는다.

## Responsive

Desktop·Tablet·Mobile에서 콘텐츠와 독립된 경계를 유지하고 Layout Shift를 줄인다. Mobile에서 본문이나 CTA를 가리는 고정 광고를 사용하지 않는다.

## 접근성

광고임을 텍스트로 식별하고 콘텐츠 읽기 순서와 주요 행동의 Focus 흐름을 끊지 않는다.

## 광고와의 관계

본 Component 자체가 유일한 광고 표현이다.

## 다른 Component와의 관계

Knowledge Card·Search Result Item·CTA·Information Box·State Card·Sidebar Module과 다른 시각 체계를 사용한다.

## 사용 금지 사례

콘텐츠 카드화, 검색 결과 위장, Path·Previous/Next·정의·답변·복구 관계의 분할, 과도한 클릭 유도.

---

# 27. Sidebar Module

## 목적

Desktop Article 또는 승인된 화면에서 핵심 흐름을 방해하지 않는 보조 정보·문맥을 제한적으로 제공한다.

## 사용 위치

Article의 승인된 보조 정보. 다른 Screen에서는 UI Screen Specification에 Sidebar가 명시된 경우만 사용한다.

## 연결되는 Screen

주로 Article. 승인 근거가 없는 Homepage·Category·Hub·Search·Glossary·Learning Guide·Language에는 새로 만들지 않는다.

## 연결되는 Wireframe

Article의 신뢰 정보, Glossary 또는 관련 보조 정보 중 Sidebar로 표현하도록 승인된 항목. 논리 순서는 본문 Section 순서를 따른다.

## 연결되는 Visual Priority

`V5` 또는 `V6`.

## 포함 요소

- 필수: Module 제목, 보조 정보.
- 선택: `Compact` Knowledge 목록, Glossary 연결, Secondary CTA.

## Variant

- `Default`
- `Compact`
- `Sticky`: 상위 Visual Design이 허용하고 본문·Footer·광고를 가리지 않는 제한적 경우만 사용한다.

## 상태

`Normal`, `Hover`, `Focus`, `Loading`, `Empty`, `Unavailable`.

## Responsive

- Desktop: 본문 폭을 침범하지 않는 제한적 보조 열.
- Tablet: 본문 읽기 폭이 부족하면 관련 논리 Section 뒤로 이동한다.
- Mobile: Sidebar를 별도 열로 유지하지 않고 승인된 본문 뒤 구간으로 이동한다.

## 접근성

본문보다 먼저 읽히지 않게 논리 순서를 유지하고 Module 제목으로 관계를 명확히 한다.

## 광고와의 관계

Sidebar 광고는 `Advertisement Block`의 `Sidebar` Variant로 별도 표시한다. 콘텐츠 Sidebar와 같은 표면을 쓰지 않는다.

## 다른 Component와의 관계

내부에 `Information Box`, `Glossary Block`, `Secondary CTA`의 Compact 표현을 포함할 수 있으나 새로운 정보군을 만들지 않는다.

## 사용 금지 사례

Mobile에서 핵심 정보 삭제, 본문보다 강한 CTA, 임의 인기 글, 승인되지 않은 Sticky, 광고와 콘텐츠 혼합.

---

# 28. Component 조합 규칙

## 28.1 전역 프레임

```text
Global Header
→ Screen-specific approved Components
→ Global Footer
```

Header와 Footer는 화면별 Wireframe 순서를 변경하지 않는다.

## 28.2 Article 핵심 조합

```text
Global Header
→ Breadcrumb
→ Page Title
→ Direct Answer Block
→ Information Box 또는 신뢰 정보
→ Article Body
→ Learning Path
→ Previous / Next Navigation
→ Related Knowledge List
→ Glossary Block
→ Global Footer
```

- Optional Component가 없으면 공간을 남기지 않는다.
- `Previous / Next Navigation`과 `Related Knowledge List`를 합치지 않는다.
- `Direct Answer Block`을 `Information Box`로 대체하지 않는다.

## 28.3 Search 핵심 조합

```text
Page Title·현재 검색 표현
→ Search Bar
→ Information Box 성격의 검색 문맥
→ Search Result Item Group
→ Recovery CTA 또는 대체 Discovery
```

- 결과 유형을 하나의 동일 Card로 평준화하지 않는다.
- 광고를 결과 항목 사이에 결과처럼 삽입하지 않는다.

## 28.4 Hub·Learning 조합

```text
Page Title·학습 범위
→ Featured Knowledge Card 또는 Hub 시작 CTA
→ Learning Path
  → Learning Step
→ 선수·후속 Knowledge
→ Related Knowledge List
```

- 필수 순차 관계와 선택 확장을 분리한다.
- 실제 없는 현재·완료·잠금 상태를 만들지 않는다.

## 28.5 상태 조합

```text
Page Title 또는 상태 제목
→ State Card
  → 상태 사실
  → 유지 문맥
  → Recovery CTA
→ 보조 Recovery
```

- 광고는 상태 사실과 Primary Recovery 사이에 들어가지 않는다.
- 정상 Component를 가짜 데이터로 채워 Empty·Error를 숨기지 않는다.

---

# 29. Component Matrix

| Component | 사용 화면 | Primary 역할 | Visual Priority | Variant | Responsive | Accessibility 핵심 |
|---|---|---|---|---|---|---|
| Global Header | 전체 공개 화면 | 전역 식별·Navigation 진입 | V6 | Desktop, Compact | Mobile Navigation으로 재배치 | 현재 위치·제어 상태·키보드 순서 |
| Global Footer | 전체 공개 화면 | 전역 복귀·정책 안내 | V6 | Default, Compact | 다열→한 열 | 정보군 제목·충분한 대비 |
| Breadcrumb | Category, Hub, Article, 상태 | 현재 위치 | V6 | Default, Compact | 줄바꿈하며 문맥 유지 | 위치 Navigation 식별 |
| Page Title | 전체 화면 | 중심 대상·질문 식별 | V1 | Default, Article, State | 긴 제목 줄바꿈 | 단일 최상위 제목 |
| Direct Answer Block | Article | 즉시 답변 | V2 | Default, Wide | 제목 다음 순서 고정 | 본문 수준 가독성 |
| Article Body | Article | 장문 Knowledge | V3 | Default, With Sidebar | Article Width→1열 | Heading·표·링크·이미지 의미 |
| Section Heading | 전체 화면 | 정보 단위 구분 | V2~V6 | Default, Compact | 논리 수준 유지 | Heading 단계 일치 |
| Knowledge Card | Home, Category, Hub, Guide | Knowledge 선택 | V3~V5 | Default, Compact, Inline | 다열→1열 | 유형 Label·Focus |
| Featured Knowledge Card | Home, Category, Hub | 대표 시작점 | V4 | Default, Wide | Wide→1열 | Featured 비색상 단서 |
| Category Card | Home, Category | 분야 진입 | V3, V5·V6 | Default, Compact | 다열→1열 | Category 유형 명시 |
| Hub Summary Card | Home, Category, Guide | Hub 범위·시작점 | V3~V5 | Default, Featured, Compact | 범위 유지 1열 | 객체 유형·도착 범위 |
| Learning Path | Home, Hub, Article, Guide | 순차 학습 관계 | V3·V4 | Default, Compact, Inline | 가로/다열→세로 | 순서·현재 상태 비색상 표현 |
| Learning Step | Path 사용 화면 | 개별 순차 단계 | V3·V4 | Default, Compact, Current | 단계 순서 세로 유지 | 번호·제목·현재 Label |
| Previous / Next Navigation | Article | 국소 순차 이동 | V4 | Default, Stacked | 2열→1열 | 방향·대상 제목 |
| Related Knowledge List | Hub, Article | 비순차 선택 확장 | V5 | Default, Compact, Inline | 다열→1열 | 관련 Section 식별 |
| Glossary Block | Glossary, Article | 용어 빠른 확인 | V1·V2·V4~V6 | Default, Inline, Compact | 용어→정의 순서 고정 | 명칭·개념 관계 Label |
| Search Bar | Header, Home, Search, Glossary | 검색 입력·재검색 | V1, V4~V6 | Default, Compact, Wide | 가변 폭·세로 배치 | 명시적 Label·오류 인식 |
| Search Result Item | Search | 유형별 결과 | V3~V5 | Knowledge, HubCategory, Glossary | 유형 Group 유지 | 유형 텍스트·Focus |
| Language Entry Block | Language, 보조 상태 | 언어 이동 판단 | V1~V4, VS | Default, Inline | 비교→판단 순서 1열 | 국기 외 텍스트 언어명 |
| Primary CTA | 주요 정상 화면 | 가장 중요한 행동 | V4 | Default, Wide | 줄바꿈·충분한 터치 영역 | 행동·도착 범위 |
| Secondary CTA | 정상 화면 | 보조 이동 | V5·V6 | Default, Text, Inline | Primary와 위계 유지 | 링크 목적·대비 |
| Recovery CTA | 상태 수용 화면 | 가장 가까운 복구 | V4 | Primary, Secondary, Inline | 상태 뒤 1열 | 구체적 도착 대상 |
| Information Box | Article, Search, Glossary, Language | 제한적 문맥 강조 | V2, V5·V6 | Default, Inline, Notice | 본문 폭·고정 높이 없음 | Label·비색상 단서 |
| State Card | 전체 상태 화면 | 상태 사실·복구 | VS·V4·V6 | Empty, Error, Unavailable, Inline | Centered→1열 | 오류 비색상 표현 |
| Advertisement Block | 허용된 화면 경계 | 독립 상업 영역 | VA | Inline, Wide, Sidebar | 독립 경계·이동 최소화 | 광고 Label·읽기 흐름 보호 |
| Sidebar Module | 주로 Article | 제한적 보조 문맥 | V5·V6 | Default, Compact, 제한적 Sticky | Sidebar→본문 후속 구간 | 본문 뒤 논리 순서 |

---

# 30. 자체 검토

## 30.1 상위 Source of Truth와 충돌 여부

- [x] Master Design Constitution의 교육·지식 중심 철학을 유지했다.
- [x] IA 객체를 Component 이름으로 새로 정의하지 않았다.
- [x] User Flow와 Navigation을 추가하지 않았다.
- [x] Screen Responsibility를 변경하지 않았다.

## 30.2 UI Screen Specification 일치 여부

- [x] Homepage, Category, Hub, Article, Search, Glossary, Learning Guide, Language, Empty, Error의 실제 Section과 상태만 사용했다.
- [x] UI Screen Specification의 공통 Header·Footer와 화면별 Component 순서를 유지했다.
- [x] Article의 Direct Answer, Path, Previous·Next, Related, Glossary 순서를 유지했다.
- [x] Search의 표현·문맥·직접 결과·상위 결과·Glossary·복구 순서를 유지했다.

## 30.3 Visual Design System 일치 여부

- [x] `V1~V6·VS·VA` 위계를 그대로 사용했다.
- [x] Typography·Color·Grid·Spacing 값을 변경하지 않았다.
- [x] Card를 모든 정보 표현의 기본값으로 만들지 않았다.
- [x] Light Theme, 접근성, Motion과 Image 원칙을 변경하지 않았다.

## 30.4 Wireframe 순서와 화면 책임

- [x] Component 조합이 Wireframe Section 순서를 바꾸지 않는다.
- [x] Sidebar의 Mobile 이동은 관련 본문 뒤의 승인된 논리 구간으로 제한했다.
- [x] Optional Component 부재 시 가짜 영역이나 관계를 만들지 않는다.

## 30.5 Component 경계

- [x] 지정된 26개 Component만 정의했다.
- [x] 같은 의미의 Component를 중복 정의하지 않았다.
- [x] Learning Path와 Learning Step의 Container·Item 책임을 분리했다.
- [x] Search Bar와 Search Result Item의 입력·결과 책임을 분리했다.
- [x] State Card와 Recovery CTA의 상태·행동 책임을 분리했다.
- [x] Previous·Next와 Related Knowledge를 분리했다.
- [x] 광고와 콘텐츠 Component를 분리했다.

## 30.6 접근성·Responsive

- [x] 텍스트·비텍스트 대비, 최소 터치 영역, Focus와 비색상 단서를 공통 기준으로 적용했다.
- [x] Desktop 12열·Tablet 8열·Mobile 4열의 의미 유지 원칙을 적용했다.
- [x] 360px·390px 검증 기준과 긴 한국어·영어 문구 대응을 포함했다.

## 30.7 구현 경계

- [x] HTML·CSS·Tailwind·React·Next.js·API·Database를 작성하지 않았다.
- [x] Animation과 Design Token 구현을 작성하지 않았다.
- [x] 구체적인 광고 코드·네트워크·슬롯·크기를 작성하지 않았다.
- [x] Component Matrix를 완성했다.

---

# 31. 최종 불변 원칙

```text
Component는 정보를 만들지 않는다.

Component는
승인된 화면에 이미 존재하는 정보와 행동을
같은 의미,
같은 위계,
같은 상태,
같은 반응형 규칙으로
반복 표현한다.

새로운 화면은
승인된 Screen Responsibility와 Wireframe을 먼저 가져야 하며,
이 문서의 기존 Component만 조합한다.

기존 Component로 표현할 수 없는 요구는
새 Component를 즉시 만들지 않고
상위 Source of Truth로 반환한다.
```

# 사실 확인 리스트

- [x] 지정된 7개 상위 Source of Truth를 실제 문서 기준으로 대조했다.
- [x] UI Screen Specification에 실제 등장하는 반복 UI만 정의했다.
- [x] 요청된 26개 Component를 모두 작성했다.
- [x] 각 Component에 목적, 사용 위치, 연결 Screen, Wireframe, Visual Priority를 포함했다.
- [x] 각 Component에 필수·선택 요소, Variant, 필요한 상태를 포함했다.
- [x] 각 Component에 Desktop·Tablet·Mobile 변경 규칙을 포함했다.
- [x] 각 Component에 접근성, 광고 관계, 다른 Component 관계와 금지 사례를 포함했다.
- [x] 새로운 기능·화면·IA·User Flow·Navigation을 만들지 않았다.
- [x] Wireframe·Visual Design·Screen Blueprint·Master Constitution을 변경하지 않았다.
- [x] 구현 코드와 Design Token 구현을 포함하지 않았다.
- [x] Component Matrix와 자체 검토를 완료했다.
- [x] 현재 결과는 공식 문서가 아닌 승인용 Source of Truth 초안이다.
