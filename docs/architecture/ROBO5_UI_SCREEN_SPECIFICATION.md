# ROBO5_UI_SCREEN_SPECIFICATION.md

Version: 0.9  
Status: Official Source of Truth Draft  
Scope: Robo5 Public UI Screen Blueprint  

---

# 0. 문서의 지위와 목적

이 문서는 Robo5의 공식 UI Screen Specification 초안이다.

승인된 Source of Truth를 실제 화면 설계로 번역한다.

```text
Information Architecture
+ User Flow
+ Screen Responsibility
+ Wireframe
+ Visual Design
→ UI Screen Blueprint
```

이 문서는 디자이너, Stitch, Figma, Component Guide 작성자와 Codex가 동일한 화면 구조와 정보 위계를 사용하게 하는 공통 기준이다.

## 입력 Source of Truth

1. `ROBO5_MASTER_DESIGN_CONSTITUTION.md`
2. `ROBO5_INFORMATION_ARCHITECTURE.md`
3. `ROBO5_USER_FLOW.md`
4. `ROBO5_SCREEN_ARCHITECTURE.md`
5. `ROBO5_WIREFRAME_GUIDE.md`
6. `ROBO5_VISUAL_DESIGN_SYSTEM.md`

## 권한 경계

이 문서는 다음을 소유한다.

- 승인된 Wireframe 순서의 화면별 UI 번역
- Section별 역할과 Visual Priority
- Desktop·Tablet·Mobile 배치
- 승인된 광고 위치와 금지 위치
- 화면별 Loading·Empty·Error 수용 방식
- 접근성과 화면 검증 기준

이 문서는 다음을 소유하지 않는다.

- 새로운 기능·화면·IA·User Flow·Navigation
- 새로운 Component 또는 Screen Responsibility
- Wireframe 순서와 Visual Design System의 변경
- HTML·CSS·Tailwind·React·Next.js·API·Database
- Component 구현과 Design Token 구현

충돌 시 더 상위 Source of Truth를 우선하고 이 문서에서 임의로 절충하지 않는다.

---

# 1. 공통 화면 프레임

## 1.1 전역 구조

각 정상 화면은 승인된 경우 다음 프레임 안에서 해당 화면의 Wireframe 순서를 유지한다.

```text
Global Header
→ Screen-specific Wireframe Sections
→ Global Footer
```

- Header는 브랜드와 교육 목적, 승인된 Global Navigation, Search와 Language Entry 접근을 제공한다.
- Footer는 브랜드 설명, 주요 정보공간, 정책·문의·교육 목적 안내를 제공한다.
- Header와 Footer는 화면별 Wireframe Section을 대체하거나 그 순서를 변경하지 않는다.
- 상태 화면에서도 유효한 전역 문맥은 유지하되, 복구보다 강하게 표현하지 않는다.

## 1.2 Visual Priority

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

## 1.3 공통 Responsive 원칙

- Desktop은 12열, Tablet은 8열, Mobile은 4열 기준으로 재배치한다.
- Desktop의 시각 순서와 Mobile의 논리 순서를 일치시킨다.
- Sidebar 정보는 Tablet·Mobile에서 관련 본문 뒤의 승인된 논리 구간으로 이동한다.
- Mobile에서 핵심 정보와 문맥을 삭제하지 않는다.
- Card는 Mobile에서 기본적으로 한 열을 사용한다.
- Learning Path는 좁은 화면에서 세로 흐름으로 표현한다.
- 장식과 보조 이미지를 핵심 정보보다 먼저 축소한다.
- 360px과 390px에서 별도 검증한다.

## 1.4 공통 광고 원칙

- 광고는 `VA`이며 콘텐츠·CTA·Knowledge·Search Result와 다른 시각 체계를 사용한다.
- 광고가 없어도 화면 구조가 완전해야 한다.
- 광고 위치는 완결된 독립 정보 단위 사이만 허용한다.
- 제목과 직접 답변, Path 단계, Previous와 Next, 상태 사실과 Recovery CTA 사이에는 광고를 두지 않는다.

## 1.5 공통 접근성 원칙

- 일반 텍스트 대비는 최소 `4.5:1`, 큰 텍스트와 비텍스트 UI는 최소 `3:1`을 충족한다.
- 모든 주요 터치 대상은 최소 `44×44px`을 확보한다.
- Focus를 배경과 명확히 구분한다.
- 색상 외에 라벨·형태·아이콘·굵기 중 하나 이상의 단서를 병행한다.
- 시각 순서와 읽기 순서를 일치시킨다.
- Hover만으로 정보를 제공하지 않는다.
- 의미 있는 이미지에는 대체 설명을 제공할 수 있어야 한다.
- 확대와 긴 한국어·영어 문구에서도 정보가 겹치거나 사라지지 않아야 한다.
- Reduced Motion에서 필수 상태 변화만 유지한다.

## 1.6 공통 Loading 원칙

- 실제 화면 구조와 유사한 공간을 미리 확보한다.
- 존재하지 않는 정보나 관계를 Skeleton으로 암시하지 않는다.
- 핵심 정보의 Loading과 보조 정보의 Loading을 분리한다.
- 긴 Animation, 반복 Pulse와 Layout Shift를 만들지 않는다.

---

# 2. Homepage

## 2.1 화면 목적

구체적인 주제를 정하지 않은 사용자가 Robo5의 정체성, 정보 범위, 대표 분야와 유효한 학습 시작점을 판단하게 한다.

## 2.2 사용자 목표

- Robo5가 금융·경제 지식 플랫폼임을 이해한다.
- 관심 분야를 찾는다.
- 대표 Hub·Learning Path·Learning Guide 중 유효한 시작점을 선택한다.

## 2.3 Screen Responsibility

### SR-01 전체 정보공간 진입 책임

- **담당 목적:** 구체적인 주제를 정하지 않은 사용자가 Robo5의 범위와 유효한 시작점을 판단하게 한다.
- **수용 상태:** 전체 정보공간 진입, 관심 분야 발견, 전문 영역과 보조 영역 구분.
- **필요 IA 문맥:** Domain, Category, 대표 Hub, 승인된 Learning Path.
- **필수 판단:** 현재 정보공간의 범위, 관심 분야, 다음 탐색 책임.
- **주요 인계:** SR-02, SR-03, SR-05, SR-07, SR-08.
- **근거 Flow:** UF-01, ML-01.

보조책임은 `SR-07`, 언어 인계는 `SR-08`, 복구 인계는 `SR-09`이다.

## 2.4 사용 시나리오

- **최초 진입:** 플랫폼 정체성·정보 범위·대표 시작점을 먼저 확인한다.
- **내부 링크:** 전체 정보공간으로 돌아와 Category·Path·Guide 중 새 시작점을 선택한다.
- **검색:** 검색 종료 후 Homepage로 복귀하여 더 넓은 분야를 탐색한다.
- **직접 URL:** 현재 언어, 플랫폼 정체성, 핵심 범위와 대표 시작점을 즉시 확인한다.

## 2.5 실제 UI 구조

```text
Header
→ 플랫폼 정체성
→ 대표 학습 시작점
→ 핵심 Category
→ 추천 Learning Path
→ 주요 Knowledge
→ 최근 업데이트
→ 금융용어 빠른 확인
→ Search·Learning Guide 진입
→ 사이트 신뢰 영역
→ Footer
```

## 2.6 Section 역할과 2.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| Header | Global Navigation, Search와 언어 진입 제공 | V6 |
| 플랫폼 정체성 | 교육 목적과 다루는 정보 범위 설명 | V1·V2 |
| 대표 학습 시작점 | 지금 시작할 유효한 Hub·Knowledge 제시 | V4 |
| 핵심 Category | 주요 분야의 범위별 진입 제공 | V3 |
| 추천 Learning Path | 승인된 순차 학습 시작 제공 | V3·V4 |
| 주요 Knowledge | 대표 Knowledge 선택 제공 | V3 |
| 최근 업데이트 | 변화한 정보의 보조 탐색 제공 | V6 |
| 금융용어 빠른 확인 | Supporting Domain의 짧은 확인 진입 | V5 |
| Search·Learning Guide 진입 | 재검색 또는 목적별 시작 지원 | V4·V5 |
| 사이트 신뢰 영역 | 교육 목적·운영 신뢰 정보 제공 | V6 |
| Footer | 유효한 전역 복귀와 정책 정보 제공 | V6 |

## 2.8 Desktop Layout

- 공통 콘텐츠 폭 안의 12열 편집 Grid를 사용한다.
- 플랫폼 정체성은 Centered 또는 제한적 Wide 구간으로 두고 Display는 이 구간에만 사용한다.
- 대표 시작점과 핵심 Category는 서로 다른 구조로 구분한다.
- Path는 전체 범위를 읽을 수 있는 가로 또는 다열 구조가 가능하나 논리 순서를 유지한다.
- 주요 Knowledge와 최근 업데이트는 같은 위계의 Card Grid로 평준화하지 않는다.

## 2.9 Tablet Layout

- 8열로 축소하고 정체성·대표 시작점은 전체 폭을 사용한다.
- Category와 Knowledge 다열 수를 줄인다.
- Path는 단계 의미가 유지될 때만 제한적 다열로 두며, 부족하면 세로 흐름으로 전환한다.

## 2.10 Mobile Layout

- 모든 주요 Section을 한 열로 쌓는다.
- 정체성 → 대표 시작점 → Category → Path 순서를 유지한다.
- 보조 이미지와 최근 업데이트의 시각 강도를 먼저 줄인다.
- Global Navigation은 승인된 Mobile Navigation 표현으로 접되 객체 명칭을 유지한다.

## 2.11 Responsive 변경 규칙

- 대표 시작점은 모든 폭에서 최근·인기 정보보다 먼저 유지한다.
- Category·Path·Knowledge의 유형 Label을 유지한다.
- 다열은 한 열로 전환하되 Section을 합치지 않는다.
- 선택 영역이 비어 있으면 공간을 남기지 않고 제거한다.

## 2.12 광고 허용 위치

- 핵심 탐색 구조를 이해한 뒤 독립된 Knowledge 구간 사이.
- 주요 과업 종료 후 보조 정보 경계.

## 2.13 광고 금지 위치

- 플랫폼 정체성, 대표 학습 시작점과 핵심 Category 사이.
- 추천 Learning Path 내부와 단계 사이.

## 2.14 접근성 고려사항

- 정체성과 교육 목적을 이미지에 의존하지 않는다.
- Category·Path·Knowledge를 색상만으로 구분하지 않는다.
- 긴 Category명과 영문 제목의 자연스러운 줄바꿈을 허용한다.

## 2.15 Loading 상태

- 정체성 문구는 가능한 한 즉시 제공한다.
- 시작점·Category·Path는 각각 실제 수만큼의 안정된 영역만 예약한다.
- 보조 영역 Loading이 대표 시작점을 가리지 않는다.

## 2.16 Empty 상태

- 최근 업데이트·추천 Knowledge·용어 미리보기가 없으면 해당 선택 영역을 제거한다.
- 유효한 대표 Path가 없으면 Category·Hub·Search 중심으로 복구한다.

## 2.17 Error 상태

- 사용할 수 없는 시작점만 제거하고 전체 Homepage를 실패 상태로 만들지 않는다.
- 핵심 범위를 불러올 수 없으면 상태 사실과 Search·유효한 정보공간 복구를 먼저 제공한다.

## 2.18 화면 검증 체크리스트

- [ ] 플랫폼이 금융상품 판매 서비스처럼 보이지 않는다.
- [ ] 대표 시작점이 최신·인기 정보보다 우선한다.
- [ ] Category·Path·Knowledge의 역할이 시각적으로 구분된다.
- [ ] Mobile에서도 전체 학습 진입 순서가 유지된다.
- [ ] 광고가 핵심 탐색 구조를 나누지 않는다.

---

# 3. Category

## 3.1 화면 목적

특정 분야의 범위와 목적을 설명하고 사용자가 적절한 Hub·Topic·Knowledge를 선택하게 한다.

## 3.2 사용자 목표

- 현재 분야의 범위와 배우는 내용을 이해한다.
- Hub와 Topic의 차이를 구분한다.
- 적합한 Hub 또는 구체적인 Knowledge를 선택한다.

## 3.3 Screen Responsibility

### SR-02 분야 탐색 책임

- **담당 목적:** 특정 분야 안에서 적절한 핵심 주제나 구체적 Knowledge를 찾게 한다.
- **수용 상태:** Category 직접 진입, 분야 범위 확인, Hub·Topic 구분, 구체적 질문으로 전환.
- **필요 IA 문맥:** Category, Hub, Topic, 대표 학습 시작점.
- **필수 판단:** 분야의 범위, 목적에 맞는 Hub 또는 Knowledge, 상위·인접 분야로의 복귀 가능성.
- **주요 인계:** SR-03, SR-04, SR-05, SR-07, SR-09.
- **근거 Flow:** UF-01, UF-02, SD-02.

## 3.4 사용 시나리오

- **최초 진입:** 분야 범위와 추천 시작 Hub를 확인한다.
- **내부 링크:** 상위·관련 문맥에서 들어와 Hub·Topic·Knowledge 중 다음 대상을 고른다.
- **검색:** 넓은 검색 표현을 Category 범위로 좁혀 재진입한다.
- **직접 URL:** 상위 Domain, 범위, 승인된 Hub·Topic과 대표 시작점을 확인한다.

## 3.5 실제 UI 구조

```text
Header
→ Breadcrumb
→ Category 제목과 범위
→ 이 분야에서 배우는 내용
→ 추천 시작 Hub
→ 핵심 Hub
→ 주요 Topic
→ 대표 Knowledge
→ 최근 또는 변경된 Knowledge
→ 승인된 관련 Category
→ 전체 정보공간 복귀
→ Footer
```

## 3.6 Section 역할과 3.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| Breadcrumb | 상위 Domain과 현재 위치 설명 | V6 |
| Category 제목과 범위 | 분야 정체성과 포함 범위 제시 | V1·V2 |
| 배우는 내용 | 탐색 목적과 기대 결과 설명 | V2 |
| 추천 시작 Hub | 대표 학습 시작점 제시 | V4 |
| 핵심 Hub | 깊은 주제 학습 진입 | V3 |
| 주요 Topic | 분야 내 범위 축소 | V3 |
| 대표 Knowledge | 구체적 질문 진입 | V3·V4 |
| 최근·변경 Knowledge | 현재성 있는 보조 탐색 | V6 |
| 관련 Category | 승인된 인접 분야 확장 | V5·V6 |
| 전체 정보공간 복귀 | Homepage 문맥 복구 | V6 |

## 3.8 Desktop Layout

- Category 소개는 Centered 또는 넓은 본문 폭을 사용한다.
- 추천 Hub는 대표성과 전체 목록의 차이가 보이는 Hub Summary 표현을 사용한다.
- 핵심 Hub와 Topic은 별도 Section으로 분리한다.
- Knowledge 목록은 구분선 기반을 우선하며 관련 Category는 후순위 영역에 둔다.

## 3.9 Tablet Layout

- 소개와 추천 Hub는 전체 8열을 사용한다.
- Hub·Topic 다열을 축소하고 긴 설명의 읽기 폭을 보호한다.
- 보조 정보가 Sidebar였다면 관련 Section 뒤로 이동한다.

## 3.10 Mobile Layout

- Breadcrumb부터 전체 복귀까지 승인 순서를 한 열로 유지한다.
- 추천 Hub를 일반 Hub 목록과 합치지 않는다.
- Topic과 Knowledge는 Label·제목·설명의 차이를 유지한다.

## 3.11 Responsive 변경 규칙

- Category·Hub를 같은 Card 유형으로 바꾸지 않는다.
- 다열 수만 변경하며 정보 객체와 Section 순서를 유지한다.
- 관련 Category와 최근 정보는 핵심 Hub·Topic 뒤에 남긴다.

## 3.12 광고 허용 위치

- 하나의 탐색 단위가 끝나고 다음 독립 단위가 시작되는 경계.
- 주된 분야 탐색 종료 후 보조 정보 전환 지점.

## 3.13 광고 금지 위치

- Category 설명과 추천 시작 Hub 사이.
- 하나의 Hub·Topic 그룹 내부.

## 3.14 접근성 고려사항

- Breadcrumb을 진행률로 표현하지 않는다.
- Hub·Topic·Knowledge 유형을 텍스트 Label과 구조로 구분한다.
- Card 전체 클릭 가능 여부와 Focus 범위를 명확히 한다.

## 3.15 Loading 상태

- Category 제목·범위를 먼저 안정적으로 표시한다.
- Hub·Topic·Knowledge별 실제 구조와 유사한 Loading 영역을 분리한다.

## 3.16 Empty 상태

- Hub가 없으면 유효한 Topic·Knowledge와 Search를 제공한다.
- Topic이 없으면 해당 Section만 제거한다.
- 유효한 하위 문맥이 없으면 상태 사실과 Search·전체 정보공간 복귀를 제공한다.

## 3.17 Error 상태

- 유효하지 않은 Hub·Knowledge를 추측해 채우지 않는다.
- Category 자체를 사용할 수 없으면 가장 가까운 Domain·Search·Homepage 복구를 제공한다.

## 3.18 화면 검증 체크리스트

- [ ] Category 범위가 첫 구간에서 명확하다.
- [ ] 추천 시작점과 전체 탐색 대상이 구분된다.
- [ ] Hub·Topic·Knowledge가 같은 객체처럼 보이지 않는다.
- [ ] 관련 Category가 보조 위계를 유지한다.
- [ ] 빈 영역을 가짜 콘텐츠로 채우지 않는다.

---

# 4. Hub

## 4.1 화면 목적

하나의 주제에서 무엇을 배우는지 설명하고 전체 Learning Path와 추천 시작점 또는 현재 단계를 판단하게 한다.

## 4.2 사용자 목표

- Hub의 학습 범위와 핵심 질문을 이해한다.
- 전체 Path와 현재 위치를 파악한다.
- 시작 Node 또는 목적에 맞는 승인된 단계를 선택한다.

## 4.3 Screen Responsibility

### SR-03 주제 학습 책임

- **담당 목적:** 하나의 Hub와 Learning Path의 범위·시작점·현재 단계를 이해하게 한다.
- **수용 상태:** Hub 직접 진입, Path 시작, Article에서 상위 Hub 발견, Path 시작·중간·끝 확인.
- **필요 IA 문맥:** Knowledge Hub, Learning Path, 승인된 Node 순서, 선수·후속 관계.
- **필수 판단:** 주제 범위, 적절한 시작 위치, 현재 Path 문맥, 다음 학습 또는 종료.
- **주요 인계:** SR-04, SR-07, SR-09.
- **근거 Flow:** UF-03, UF-05, LP-01, LP-06, LP-07.

## 4.4 사용 시나리오

- **최초 진입:** 학습 범위와 추천 시작 Node를 확인한다.
- **내부 링크:** Article에서 상위 Hub로 돌아와 전체 Path와 현재 위치를 확인한다.
- **검색:** 주제 검색 결과에서 Hub로 들어와 세부 학습 범위를 선택한다.
- **직접 URL:** 상위 Category, Path 목적·전체 순서·시작점과 확인 가능한 현재 단계를 본다.

## 4.5 실제 UI 구조

```text
Header
→ Breadcrumb
→ Hub 제목과 학습 범위
→ 핵심 질문과 학습 결과
→ 추천 시작점
→ 전체 Learning Path
→ 현재 단계 또는 주요 Node
→ 선수·후속 Knowledge
→ 선택 확장 Knowledge
→ 세부 Knowledge
→ 상위 Category 복귀
→ Footer
```

## 4.6 Section 역할과 4.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| Breadcrumb | Category·Hub 위치 설명 | V6 |
| Hub 제목과 범위 | 주제 정체성과 학습 범위 제시 | V1·V2 |
| 핵심 질문과 결과 | 무엇을 이해하게 되는지 설명 | V2 |
| 추천 시작점 | 승인된 시작 Node 진입 | V4 |
| 전체 Learning Path | 순차 학습 범위와 단계 제시 | V3 |
| 현재 단계·주요 Node | 현재 또는 선택 위치 식별 | V3·V4 |
| 선수·후속 Knowledge | 필수 순서 관계 설명 | V4 |
| 선택 확장 Knowledge | 비순차 관련 학습 제공 | V5 |
| 세부 Knowledge | 추가 세부 탐색 제공 | V5 |
| 상위 Category 복귀 | 넓은 분야로 복귀 | V6 |

## 4.8 Desktop Layout

- Hub 소개는 Centered 또는 제한된 Wide 폭을 사용한다.
- Learning Path는 화면의 중심 V3이며 전체 범위가 한 관계로 읽혀야 한다.
- 현재 단계와 선수·후속 관계는 Path에 인접시키되 선택 확장과 분리한다.
- 선택 확장·세부 Knowledge는 Path 완료 이후 별도 Section에 둔다.

## 4.9 Tablet Layout

- 8열에서 Path 단계의 제목과 상태 Label을 보존한다.
- 가로 배치가 관계를 약화하면 세로 Path로 전환한다.
- 선택 확장은 Path 뒤의 별도 영역을 유지한다.

## 4.10 Mobile Layout

- Path는 단계 번호·제목·현재 상태가 보이는 세로 흐름으로 표현한다.
- 현재 단계는 색상·굵기·표식·Label을 함께 사용한다.
- 선수·후속과 선택 확장을 서로 다른 시각 문법으로 쌓는다.

## 4.11 Responsive 변경 규칙

- 전체 Path의 논리 순서와 시작·현재·다음 상태를 유지한다.
- 일부 단계가 없으면 빈 단계나 잠금 상태를 만들지 않는다.
- Related 성격의 선택 확장을 Path 안으로 이동시키지 않는다.

## 4.12 광고 허용 위치

- 전체 Path 이해가 끝난 뒤 보조 Knowledge 구간 전후.

## 4.13 광고 금지 위치

- Hub 설명과 Learning Path 사이.
- Learning Path 단계 사이.
- 현재 단계와 선수·후속 관계 사이.

## 4.14 접근성 고려사항

- 현재 단계는 색상 하나로만 표시하지 않는다.
- 단계 번호와 제목을 함께 제공한다.
- 실제 데이터가 없는 완료 체크·진도율·잠금 상태를 사용하지 않는다.

## 4.15 Loading 상태

- Hub 제목·범위를 우선 제공한다.
- 확인된 단계 수와 관계만 Loading 구조에 반영한다.
- Path Loading이 선택 확장 영역처럼 보이지 않게 한다.

## 4.16 Empty 상태

- Path가 없으면 유효한 시작·세부 Knowledge만 제공한다.
- 시작 Node가 없으면 상태 사실과 유효한 Knowledge·Search를 제공한다.
- Path 단절 시 존재하는 단계까지만 표시한다.

## 4.17 Error 상태

- Path 문맥을 확인할 수 없으면 추측된 순서를 만들지 않는다.
- 확인 가능한 Hub 범위·Knowledge·상위 Category·Search로 복구한다.

## 4.18 화면 검증 체크리스트

- [ ] Hub 범위와 Path가 화면 중심이다.
- [ ] 추천 시작점과 전체 Path가 구분된다.
- [ ] 현재 단계가 비색상 단서로도 식별된다.
- [ ] 선수·후속과 선택 확장이 분리된다.
- [ ] 광고가 Path 연속성을 끊지 않는다.

---

# 5. Article Detail

## 5.1 화면 목적

하나의 중심 질문에 직접 답하고 현재 Knowledge의 위치와 순차·관련 관계를 판단하게 한다.

## 5.2 사용자 목표

- 질문의 직접 답변을 빠르게 확인한다.
- 본문을 읽고 신뢰 정보를 판단한다.
- 종료, Previous·Next, Related, Glossary 또는 상위 복귀 중 적합한 행동을 선택한다.

## 5.3 Screen Responsibility

### SR-04 개별 Knowledge 확인 책임

- **담당 목적:** 하나의 질문과 핵심 Knowledge를 확인하고 현재 위치와 후속 선택을 판단하게 한다.
- **수용 상태:** Article·Node 직접 진입, 외부 진입, Path 중간 진입, 순차 이동 후 진입, Related 진입, Supporting Domain 진입.
- **필요 IA 문맥:** Knowledge Node, Article, Category·Hub·Topic 문맥, Previous·Next, Related, Glossary 관계.
- **필수 판단:** 현재 질문의 답, 목적 달성 여부, 상위 문맥, 선수·후속·관련 관계의 차이, 종료 가능성.
- **주요 인계:** SR-03, SR-04, SR-05, SR-06, SR-08, SR-09.
- **근거 Flow:** UF-04~UF-09, LP-02~LP-07, SD-01, SD-03, SD-05, GL-01, ML-02.

## 5.4 사용 시나리오

- **최초 진입:** 제목·직접 답변·상위 문맥을 확인하고 본문을 읽는다.
- **내부 링크:** Path 또는 Related 관계 이유를 유지한 채 현재 Knowledge를 확인한다.
- **검색:** 구체적 질문의 직접 결과로 진입하여 답과 상위 구조를 확인한다.
- **직접 URL:** 외부 진입 여부와 관계없이 질문, 답, Category·Hub·Path와 다음 행동 의미를 확인한다.

## 5.5 실제 UI 구조

```text
Header
→ Breadcrumb
→ 제목과 중심 질문
→ 핵심 답변
→ 신뢰 정보
→ 본문
→ 핵심 정리
→ Learning Path와 현재 위치
→ Previous / Next
→ Related Knowledge
→ Glossary
→ 상위 Hub·Category
→ Footer
```

## 5.6 Section 역할과 5.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| Breadcrumb | Category·Hub·Article 위치 설명 | V6 |
| 제목과 중심 질문 | 현재 Knowledge의 단일 질문 제시 | V1 |
| 핵심 답변 | 질문에 대한 직접 답변 제공 | V2 |
| 신뢰 정보 | 게시·수정 등 필요한 판단 정보 제공 | V6 |
| 본문 | 핵심 Knowledge를 논리적으로 설명 | V3 |
| 핵심 정리 | 본문 핵심을 재확인 | V2·V3 |
| Learning Path와 현재 위치 | 전체 학습 문맥과 현재 단계 설명 | V3 |
| Previous / Next | 승인된 순차 이동 제공 | V4 |
| Related Knowledge | 비순차 선택 확장 제공 | V5 |
| Glossary | 관련 용어 빠른 확인 제공 | V5 |
| 상위 Hub·Category | 상위 학습·분야 문맥 복귀 | V6 |

## 5.8 Desktop Layout

- 본문은 약 `720~780px`의 Article Width와 `1.75~1.9` 줄 높이를 사용한다.
- 제목·답변·본문은 Centered 읽기 축을 공유한다.
- 제한적인 Sidebar는 목차·현재 학습 위치·관련 용어·보조 광고만 수용하며 본문을 좁히지 않는다.
- Path 이후 Previous·Next, Related, Glossary를 각각 분리된 논리 구간으로 둔다.

## 5.9 Tablet Layout

- 본문 읽기 폭을 우선하고 Sidebar를 본문 뒤 관련 구간으로 이동한다.
- Previous·Next는 제목이 읽히는 범위에서 2열을 유지하거나 한 열로 전환한다.
- Related와 Glossary를 Previous·Next에 결합하지 않는다.

## 5.10 Mobile Layout

- 제목 → 답변 → 신뢰 정보 → 본문 순서를 한 열로 유지한다.
- 본문은 최소 16px, 자연스러운 줄바꿈과 충분한 문단 간격을 사용한다.
- Previous·Next는 하나의 순차 단위 안에서 세로 배치할 수 있으나 방향·제목을 유지한다.
- Sidebar 정보는 승인된 본문 뒤 논리 구간으로 이동한다.

## 5.11 Responsive 변경 규칙

- 핵심 답변과 첫 문단의 연속성을 유지한다.
- Sidebar 내용을 삭제하지 않고 관련 Section 뒤로 옮긴다.
- Previous·Next를 Related와 합치지 않는다.
- 이미지가 없어도 제목·답변·본문 위계가 완전해야 한다.

## 5.12 광고 허용 위치

- 본문의 완결된 의미 단위 사이.
- 본문 종료 후 보조 정보로 전환되는 경계.

## 5.13 광고 금지 위치

- Breadcrumb·제목·핵심 답변 사이.
- 첫 문단 내부.
- Learning Path 내부와 단계 사이.
- Previous와 Next 사이.
- Glossary 확인과 원래 문맥 복귀 사이.

## 5.14 접근성 고려사항

- H1은 하나만 사용하며 제목 위계를 논리 순서와 일치시킨다.
- 작은 회색 글씨로 신뢰 정보를 숨기지 않는다.
- 순차·관련·용어 링크는 텍스트로 목적을 식별할 수 있어야 한다.

## 5.15 Loading 상태

- 제목·직접 답변 영역의 공간을 우선 안정화한다.
- 본문과 보조 관계를 분리하여 보조 Loading이 답변을 가리지 않게 한다.
- 존재하지 않는 Path·Related·Glossary를 Skeleton으로 만들지 않는다.

## 5.16 Empty 상태

- Related·Glossary가 없으면 해당 영역을 제거한다.
- Path가 없으면 Path와 Previous·Next를 표시하지 않는다.
- 본문을 사용할 수 없으면 답을 만들지 않고 상태 사실과 유효한 상위·인접 문맥을 제공한다.

## 5.17 Error 상태

- Previous·Next 일부가 없으면 시작·끝 상태를 사실대로 표시한다.
- 상위 문맥을 확인할 수 없으면 Search 또는 유효한 Category로 복구한다.
- 오래되거나 변경된 Knowledge는 확인된 현재성 사실과 유효한 최신 문맥만 제공한다.

## 5.18 화면 검증 체크리스트

- [ ] 질문과 직접 답변이 첫 정보 구간에서 명확하다.
- [ ] 본문 폭과 줄 높이가 장문 읽기에 적합하다.
- [ ] 신뢰 정보가 답변보다 강하지 않다.
- [ ] Previous·Next와 Related가 분리된다.
- [ ] 종료 가능성을 방해하는 Sticky CTA가 없다.
- [ ] 광고가 답변·Path·순차 이동을 끊지 않는다.

---

# 6. Search

## 6.1 화면 목적

사용자의 검색 표현을 유효한 Knowledge 문맥과 연결하고 빠른 확인·깊은 학습·상위 탐색 중 적절한 경로로 재진입하게 한다.

## 6.2 사용자 목표

- 검색 표현과 결과 해석 범위를 확인한다.
- 가장 직접적인 Knowledge 또는 적절한 Hub·Category·Glossary를 선택한다.
- 결과가 없으면 표현을 조정하거나 유효한 상위 문맥으로 복구한다.

## 6.3 Screen Responsibility

### SR-05 검색·재진입 책임

- **담당 목적:** 사용자의 표현을 유효한 Knowledge 문맥과 연결하고 탐색 또는 학습으로 재진입하게 한다.
- **수용 상태:** 내부 검색 진입, 구체적 질문 검색, 넓은 표현 검색, 검색 결과 판단, 재검색, 결과 없음.
- **필요 IA 문맥:** Search, Category, Hub, Topic, Knowledge, Glossary 및 승인된 표현 관계.
- **필수 판단:** 검색 의도와 결과의 관계, 빠른 확인과 깊은 학습의 차이, 범위 축소 또는 재검색 필요성.
- **주요 인계:** SR-02, SR-03, SR-04, SR-06, SR-09.
- **근거 Flow:** SD-01~SD-06, UF-01, UF-04, UF-09.

## 6.4 사용 시나리오

- **최초 진입:** Search 목적과 입력 가능한 검색 표현을 확인한다.
- **내부 링크:** 현재 문맥에서 검색으로 이동해 표현과 상위 구조를 연결한다.
- **검색:** 구체적 질문은 직접 Knowledge, 넓은 표현은 Hub·Category 문맥을 우선 판단한다.
- **직접 URL:** 현재 검색 표현·상태·결과 문맥과 재검색 가능성을 확인한다.

## 6.5 실제 UI 구조

```text
Header
→ Search 목적과 현재 검색 표현
→ 검색 상태와 결과 해석 문맥
→ 가장 직접적인 Knowledge 결과
→ 관련 Hub·Category
→ 관련 Glossary Term
→ 범위 축소 또는 확장
→ 재검색
→ 대체 Discovery 또는 빈 상태 복구
→ Footer
```

## 6.6 Section 역할과 6.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| Search 목적·표현 | 현재 검색 과업과 표현 제시 | V1 |
| 상태·해석 문맥 | 결과가 해석되는 범위 설명 | V2 |
| 직접 Knowledge | 가장 직접적인 답의 진입 제공 | V3·V4 |
| Hub·Category | 넓은 상위 문맥으로 범위 조정 | V3·V4 |
| Glossary Term | 빠른 용어 확인 제공 | V5 |
| 범위 축소·확장 | 검색 문맥 조정 | V5 |
| 재검색 | 표현 수정과 새 검색 수행 | V4 |
| 대체 Discovery·복구 | 관계가 있는 대체 경로 제공 | V5·VS |

## 6.8 Desktop Layout

- Search 표현과 해석 문맥은 Centered 상단 영역에 둔다.
- 결과는 유형별 독립 Group으로 나누고 제목·설명·상위 문맥을 표시한다.
- Knowledge 목록은 결과 수보다 유형과 관련 이유가 먼저 읽히게 한다.

## 6.9 Tablet Layout

- 검색 입력과 문맥은 전체 8열을 사용한다.
- 결과 유형의 다열 수를 줄이되 유형별 Group 경계를 유지한다.
- 범위 조정과 재검색을 첫 결과보다 앞세우지 않는다.

## 6.10 Mobile Layout

- 검색 표현 → 해석 문맥 → 직접 결과 순서를 한 열로 유지한다.
- 결과 유형 Label, 제목, 설명과 상위 문맥을 줄바꿈해 보존한다.
- 광고와 결과의 간격·Label·경계가 명확히 달라야 한다.

## 6.11 Responsive 변경 규칙

- Knowledge·Hub·Glossary를 하나의 통합 Card 유형으로 만들지 않는다.
- 결과 수를 숨기는 대신 검색 문맥을 유지한다.
- 결과 없음에서도 현재 검색 표현을 제거하지 않는다.

## 6.12 광고 허용 위치

- 하나의 결과 유형 Group이 끝난 경계.
- 주된 결과 판단 후 보조 Discovery 전환 경계.

## 6.13 광고 금지 위치

- 검색 표현과 첫 결과 사이.
- 결과 항목처럼 오인될 수 있는 위치.
- 결과 없음 사실과 주요 Recovery CTA 사이.

## 6.14 접근성 고려사항

- 입력 Label과 현재 검색 표현을 명시한다.
- 결과 유형을 색상뿐 아니라 텍스트로 표시한다.
- 결과 제목과 상위 문맥을 키보드로 구분해 탐색할 수 있어야 한다.

## 6.15 Loading 상태

- 현재 검색 표현은 유지한다.
- 확인되는 결과 유형만 안정된 공간으로 표시한다.
- 결과 Skeleton과 광고 Placeholder를 같은 형태로 만들지 않는다.

## 6.16 Empty 상태

```text
결과 없음 사실
→ 현재 검색 표현
→ 검색 표현 조정
→ 승인된 인접 용어
→ 유효한 Category·Hub·Glossary
→ 새로운 검색
```

## 6.17 Error 상태

- 검색을 사용할 수 없다는 사실과 유지되는 검색 표현을 먼저 알린다.
- 재시도 또는 유효한 Category·Hub·Glossary 복구를 제공한다.
- 오류 원인을 추측하거나 사용자 책임으로 표현하지 않는다.

## 6.18 화면 검증 체크리스트

- [ ] 검색 표현과 해석 문맥이 결과보다 먼저 보인다.
- [ ] 직접 Knowledge와 상위 Hub·Category가 구분된다.
- [ ] Glossary가 Article 결과처럼 보이지 않는다.
- [ ] 결과 없음에도 검색 목적과 표현이 유지된다.
- [ ] 광고가 결과처럼 보이지 않는다.

---

# 7. Financial Glossary

## 7.1 화면 목적

용어의 의미를 빠르게 확인하고 관련 분야·관련 용어·상세 Knowledge로 확장하게 한다.

## 7.2 사용자 목표

- 현재 용어의 짧은 정의를 확인한다.
- 명칭 관계와 개념 관계를 구분한다.
- 종료, 원래 Article 복귀 또는 상세 Knowledge 전환을 선택한다.

## 7.3 Screen Responsibility

### SR-06 용어 확인 책임

- **담당 목적:** 용어의 짧은 의미를 확인하고 원래 문맥 복귀 또는 상세 학습 전환을 판단하게 한다.
- **수용 상태:** Glossary 독립 진입, Article 문맥의 용어 확인, 관련 용어 확인, 상세 Knowledge 없음.
- **필요 IA 문맥:** Glossary Term, 관련 분야, 상세 Knowledge 관계, 상위·하위·관련 용어 관계.
- **필수 판단:** 짧은 정의로 목적이 달성됐는지, 원래 문맥으로 복귀할지, 상세 Knowledge로 전환할지.
- **주요 인계:** SR-02, SR-03, SR-04, SR-05, SR-06, SR-09.
- **근거 Flow:** GL-01~GL-03, SD-04, UF-09.

## 7.4 사용 시나리오

- **최초 진입:** Glossary의 빠른 확인 목적과 현재 용어·정의를 본다.
- **내부 링크:** Article 문맥을 유지한 채 용어를 확인하고 원래 위치로 복귀한다.
- **검색:** 용어 결과로 진입해 정의 확인 또는 상세 Knowledge로 이동한다.
- **직접 URL:** 독립 진입 문맥에서 관련 분야·용어 관계·상세 학습 가능성을 확인한다.

## 7.5 실제 UI 구조

```text
Header
→ Glossary 목적과 용어 접근
→ 현재 용어 또는 용어군
→ 짧은 정의
→ 관련 분야
→ 승인된 명칭 관계
→ 상위·하위·관련 용어
→ 상세 Knowledge
→ 원래 문맥 복귀 또는 추가 탐색
→ Footer
```

## 7.6 Section 역할과 7.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| Glossary 목적·접근 | 빠른 용어 확인 공간임을 설명 | V2 |
| 현재 용어 | 확인 대상 명시 | V1 |
| 짧은 정의 | 즉시 의미 제공 | V2 |
| 관련 분야 | 용어의 상위 문맥 제공 | V6 |
| 명칭 관계 | 동의어·약어·영문명 제공 | V5 |
| 개념 관계 | 상위·하위·관련 용어 구분 | V5 |
| 상세 Knowledge | 깊은 학습으로 전환 | V4 |
| 복귀·추가 탐색 | 원래 Article 또는 Search로 이동 | V4·V6 |

## 7.8 Desktop Layout

- 용어와 정의는 하나의 강한 Centered 의미 단위로 묶는다.
- 관련 분야와 명칭 관계는 보조 정보 폭을 사용할 수 있다.
- 관련 용어와 상세 Knowledge는 별도 Group으로 분리한다.
- Article 문맥 진입 시 복귀 행동을 명확히 표시한다.

## 7.9 Tablet Layout

- 용어·정의는 전체 폭을 유지한다.
- 명칭 관계와 개념 관계의 다열 수를 줄인다.
- 원래 문맥 복귀를 관련 용어 목록에 섞지 않는다.

## 7.10 Mobile Layout

- 현재 용어 → 정의 → 관련 분야 순서를 한 열로 유지한다.
- 동의어·약어와 관련 용어를 다른 Label과 Group으로 구분한다.
- 상세 학습과 원래 Article 복귀를 서로 다른 행동으로 표시한다.

## 7.11 Responsive 변경 규칙

- 용어와 정의 사이에 어떤 요소도 이동시키지 않는다.
- Article 진입 문맥을 Mobile에서도 삭제하지 않는다.
- 존재하지 않는 상세 Knowledge의 비활성 링크를 만들지 않는다.

## 7.12 광고 허용 위치

- 독립적인 용어군 또는 상세 학습 구간이 끝난 뒤.

## 7.13 광고 금지 위치

- 용어와 짧은 정의 사이.
- Article 문맥과 복귀 행동 사이.
- 하나의 용어 관계군 내부.

## 7.14 접근성 고려사항

- 용어명과 정의의 읽기 관계를 명확히 한다.
- 약어·동의어·관련 개념을 색상만으로 구분하지 않는다.
- 원래 Article 복귀 대상의 제목이나 문맥을 제공한다.

## 7.15 Loading 상태

- 용어와 짧은 정의 공간을 먼저 안정화한다.
- 확인되지 않은 관계군을 Skeleton으로 암시하지 않는다.
- 원래 Article 문맥은 가능한 경우 즉시 유지한다.

## 7.16 Empty 상태

- 상세 Knowledge·관련 용어가 없으면 해당 영역을 제거한다.
- 용어가 없으면 상태 사실, 표현 조정, 승인된 인접 용어와 Search를 제공한다.
- 관련 분야가 없으면 추측하지 않는다.

## 7.17 Error 상태

- 정의를 사용할 수 없으면 가짜 정의를 만들지 않는다.
- 원래 문맥이 유지되면 복귀를 우선하며, 아니면 Search를 제공한다.

## 7.18 화면 검증 체크리스트

- [ ] 용어와 짧은 정의가 가장 먼저 읽힌다.
- [ ] 명칭 관계와 개념 관계가 구분된다.
- [ ] 빠른 확인과 상세 학습이 분리된다.
- [ ] Article 진입 시 복귀 문맥이 유지된다.
- [ ] 광고가 용어 확인을 끊지 않는다.

---

# 8. Learning Guide

## 8.1 화면 목적

사용 목적이나 학습 수준에 맞는 승인된 시작점과 Learning Path를 찾게 한다.

## 8.2 사용자 목표

- Guide가 새로운 분류가 아니라 시작점 안내임을 이해한다.
- 목적 또는 수준에 맞는 시작점과 Path를 선택한다.
- 필요한 선수 Knowledge와 도착 정보공간을 확인한다.

## 8.3 Screen Responsibility

### SR-07 목적별 학습 시작 책임

- **담당 목적:** 사용 목적 또는 수준에 맞는 승인된 학습 시작점과 Path를 찾게 한다.
- **수용 상태:** Learning Guide 진입, 전체·분야 정보공간에서 목적별 시작점 선택.
- **필요 IA 문맥:** Learning Guide와 승인된 Learning Path의 관계.
- **필수 판단:** 목적에 맞는 시작점, Guide와 실제 Path의 차이, 전환할 주제 학습 책임.
- **주요 인계:** SR-02, SR-03, SR-04, SR-09.
- **근거 Flow:** UF-01, UF-02, UF-03.

SR-07은 새로운 Knowledge 분류나 User Flow를 만들지 않는다.

## 8.4 사용 시나리오

- **최초 진입:** Guide 역할과 목적·수준 선택 기준을 확인한다.
- **내부 링크:** Homepage·Category에서 목적별 시작점을 찾기 위해 진입한다.
- **검색:** 학습 방법을 찾는 사용자가 승인된 Hub·Path·Knowledge 시작점으로 이동한다.
- **직접 URL:** 현재 제공되는 기준과 각 선택의 실제 도착 정보공간을 확인한다.

## 8.5 실제 UI 구조

```text
Header
→ Learning Guide의 역할
→ 학습 목적 또는 수준
→ 목적별 시작점
→ 연결된 Learning Path
→ Path 범위와 시작 Knowledge
→ 필요한 선수 Knowledge
→ 관련 Category·Hub
→ 대체 시작점
→ Footer
```

## 8.6 Section 역할과 8.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| Guide 역할 | 시작 안내 화면의 목적 설명 | V1·V2 |
| 목적·수준 | 승인된 선택 기준 제시 | V3 |
| 목적별 시작점 | 가장 적합한 시작 행동 제공 | V4 |
| 연결 Path | 선택과 실제 학습 순서 연결 | V3 |
| Path 범위·시작 Knowledge | 도착 범위와 첫 Node 설명 | V2·V4 |
| 선수 Knowledge | 시작 전 필요한 승인 관계 제시 | V4 |
| 관련 Category·Hub | 상위 학습 문맥 제공 | V5 |
| 대체 시작점 | 적합한 대안 제공 | V5 |

## 8.8 Desktop Layout

- Guide 역할과 선택 기준은 Centered 상단에 둔다.
- 목적·수준별 단위는 시작점·Path·선수 관계가 한 문맥으로 읽히게 구성한다.
- 여러 목적은 구분하되 새로운 Category Grid처럼 보이지 않게 한다.

## 8.9 Tablet Layout

- 목적별 단위의 다열 수를 줄이고 Path 범위 설명을 보존한다.
- 선수 Knowledge와 대체 시작점은 해당 목적 단위 뒤에 둔다.

## 8.10 Mobile Layout

- Guide 역할 → 목적·수준 → 시작점 → Path 순서를 한 열로 유지한다.
- Path는 세로 흐름으로 표현한다.
- 목적 선택을 완료·저장·진도 UI처럼 표현하지 않는다.

## 8.11 Responsive 변경 규칙

- 목적과 연결 Path를 서로 떨어뜨리지 않는다.
- 선수 Knowledge를 선택 확장과 혼합하지 않는다.
- 실제 존재하는 목적·Path만 표시한다.

## 8.12 광고 허용 위치

- 학습 시작점 판단이 끝난 뒤 독립 정보 구간.

## 8.13 광고 금지 위치

- 목적 선택과 추천 Path 사이.
- 하나의 목적별 안내 단위 내부.
- Path 단계 사이.

## 8.14 접근성 고려사항

- 선택 기준과 도착 정보공간을 텍스트로 명확히 한다.
- 목적별 선택 대상은 최소 터치 영역과 명확한 Focus를 갖는다.
- 완료율·개인화처럼 오인되는 비활성 상태를 만들지 않는다.

## 8.15 Loading 상태

- Guide 역할과 현재 제공 기준을 먼저 표시한다.
- 확인된 목적과 Path 수만 구조에 반영한다.
- 가짜 개인화·재개 상태를 Loading으로 암시하지 않는다.

## 8.16 Empty 상태

- 적합한 Path가 없으면 승인된 Hub·Knowledge 또는 Search를 제공한다.
- 시작점이 없는 목적은 선택 가능하게 표시하지 않는다.
- 모든 시작점이 유효하지 않으면 상태 사실과 Category·Search 복구를 제공한다.

## 8.17 Error 상태

- 특정 목적 단위만 실패하면 다른 유효한 단위를 유지한다.
- 전체 Guide를 사용할 수 없으면 Category·Hub·Search로 복구한다.

## 8.18 화면 검증 체크리스트

- [ ] Guide가 새로운 Knowledge 분류처럼 보이지 않는다.
- [ ] 목적·시작점·Path·선수 관계가 구분된다.
- [ ] 선택 후 도착 범위가 예측 가능하다.
- [ ] 가짜 완료·저장·재개·개인화 상태가 없다.
- [ ] 광고가 선택 판단을 끊지 않는다.

---

# 9. Language Entry

## 9.1 화면 목적

일반 언어 정보공간 이동과 동일 Knowledge의 대응 언어 이동을 구분하고 이동 후 도달할 정보 범위를 예측하게 한다.

## 9.2 사용자 목표

- 현재 언어와 대상 언어를 확인한다.
- 같은 Knowledge 이동인지 전체 정보공간 이동인지 구분한다.
- 유지·비유지 문맥과 도착 범위를 확인한 뒤 이동 또는 취소한다.

## 9.3 Screen Responsibility

### SR-08 언어 정보공간 진입 책임

- **담당 목적:** 일반 언어 정보공간 이동과 승인된 대응 Knowledge 이동을 구분하게 한다.
- **수용 상태:** 특정 언어 정보공간 진입, 일반 언어 이동, 대응 Knowledge 존재, 대응 Knowledge 없음.
- **필요 IA 문맥:** 언어별 Category·Hub·Search·Glossary·Learning Path, 승인된 대응 Knowledge 관계.
- **필수 판단:** 이동 대상의 언어 범위, 현재 Knowledge 문맥 유지 여부, 상위 정보공간 재진입 여부.
- **주요 인계:** SR-01~SR-07, SR-09.
- **근거 Flow:** ML-01~ML-03.

## 9.4 사용 시나리오

- **최초 진입:** 현재 언어 정보공간과 이동 가능한 대상 언어를 확인한다.
- **내부 링크:** 현재 Knowledge·Category·Hub·Path 문맥을 가진 채 언어 이동을 판단한다.
- **검색:** 언어별 Search 공간으로 이동할 때 유지되지 않는 검색·분류 문맥을 확인한다.
- **직접 URL:** 대상 언어의 실제 범위와 대응 Knowledge 유무를 확인한다.

## 9.5 실제 UI 구조

```text
Header
→ 현재 언어와 현재 Knowledge 문맥
→ 이동 가능한 대상 언어
→ 일반 언어 이동 또는 대응 Knowledge 이동 구분
→ 이동 후 유지되는 정보
→ 이동 후 유지되지 않는 정보
→ 도착할 정보공간
→ 대응 Knowledge 없음 안내
→ 대상 언어의 상위 정보공간 또는 Search
→ Footer
```

Language Entry는 독립 페이지 또는 승인된 화면의 보조 상태로 표현할 수 있으나 위 순서와 책임은 동일하다.

## 9.6 Section 역할과 9.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| 현재 언어·문맥 | 출발 정보공간과 현재 위치 설명 | V1·V2 |
| 대상 언어 | 실제 이동 가능한 언어 제시 | V3 |
| 이동 유형 구분 | 일반 이동과 대응 Knowledge 이동 구분 | V2 |
| 유지 정보 | 이동 후 보존되는 문맥 설명 | V3 |
| 비유지 정보 | 이동 후 사라지는 문맥 설명 | V3 |
| 도착 정보공간 | 실제 도착 범위 설명 | V2·V4 |
| 대응 없음 안내 | 번역 관계 부재 사실 제시 | VS |
| 상위 정보공간·Search | 유효한 대체 이동 제공 | V4 |

## 9.8 Desktop Layout

- 판단 영역은 과도하게 넓지 않은 Centered 폭을 사용한다.
- 일반 언어 이동과 대응 Knowledge 이동을 다른 Label과 구조로 나란히 비교할 수 있다.
- 유지·비유지 정보와 도착 범위를 이동 CTA보다 먼저 둔다.

## 9.9 Tablet Layout

- 비교 구조가 충분히 읽히면 2열을 유지하고, 아니면 순서 있는 한 열로 전환한다.
- 현재 문맥과 도착 범위를 생략하지 않는다.

## 9.10 Mobile Layout

- 현재 언어 → 대상 언어 → 이동 유형 → 유지·비유지 → 도착 범위 → 행동 순서를 한 열로 유지한다.
- 국기만으로 언어를 표시하지 않고 텍스트 Label을 사용한다.

## 9.11 Responsive 변경 규칙

- 대응 Knowledge 유무를 모든 폭에서 명확히 유지한다.
- 유사 콘텐츠를 번역본처럼 재배치하지 않는다.
- 보조 상태로 표현해도 배경 화면의 정보와 이동 판단이 혼동되지 않아야 한다.

## 9.12 광고 허용 위치

- 없음.

## 9.13 광고 금지 위치

- 언어 이동 판단 과정 전체.
- 대응 Knowledge 없음 안내와 Recovery CTA 사이.

## 9.14 접근성 고려사항

- 언어명은 `한국어`, `English`, `Global` 등 텍스트로 제공한다.
- 이동 유형·유지 여부를 색상만으로 구분하지 않는다.
- 보조 상태인 경우 Focus 이동·복귀 순서가 명확해야 한다.

## 9.15 Loading 상태

- 현재 언어와 현재 문맥을 우선 유지한다.
- 대응 Knowledge 확인 중에는 동일 콘텐츠가 있다고 암시하지 않는다.
- 판단 완료 전 잘못된 이동 CTA를 활성화하지 않는다.

## 9.16 Empty 상태

- 대상 언어 콘텐츠가 없으면 이동 가능 대상으로 표시하지 않는다.
- 대응 Knowledge가 없으면 대상 언어 Homepage·Category·Search 중 유효한 경로만 제공한다.

## 9.17 Error 상태

- 대응 관계 확인 실패를 번역본 없음으로 단정하지 않는다.
- 현재 언어 문맥 유지와 대상 언어 전체 정보공간·Search 복구를 제공한다.

## 9.18 화면 검증 체크리스트

- [ ] 일반 언어 이동과 대응 Knowledge 이동이 구분된다.
- [ ] 현재·대상 언어가 텍스트로 표시된다.
- [ ] 유지·비유지 문맥과 도착 범위가 행동 전에 보인다.
- [ ] 유사 콘텐츠를 번역본으로 표시하지 않는다.
- [ ] 판단 과정에 광고가 없다.

---

# 10. Empty State

## 10.1 화면 목적

기대한 정보나 관계가 존재하지 않는 사실을 알리고, 유지되는 목적과 문맥을 바탕으로 가장 가까운 유효 경로로 복구하게 한다.

## 10.2 사용자 목표

- 무엇이 존재하지 않는지 이해한다.
- 자신의 원래 목적과 남아 있는 문맥을 확인한다.
- 복귀·재검색·대체 탐색 중 실제 가능한 행동을 선택한다.

## 10.3 Screen Responsibility

### SR-09 실패·빈 상태 복구 책임

- **담당 목적:** 사용할 수 없는 경로의 사실을 알리고 가장 가까운 유효 문맥으로 복구하게 한다.
- **수용 상태:** 검색 결과 없음, 존재하지 않는 정보, 상위 문맥 없음, 관계 부재, Path 단절, 번역본 없음, 변경된 Knowledge, 예상과 다른 정보 도달.
- **필요 IA 문맥:** 현재 유효한 상위·인접 정보공간과 승인된 복구 관계.
- **필수 판단:** 현재 사용할 수 없는 경로, 남아 있는 유효 문맥, 복귀·재검색·대체 탐색 중 가능한 선택.
- **주요 인계:** SR-01~SR-08 또는 정상 종료.
- **근거 Flow:** SD-06, GL-03, ML-03, User Flow 11장.

## 10.4 사용 시나리오

- **최초 진입:** 기대한 목록·관계·콘텐츠가 비어 있음을 확인한다.
- **내부 링크:** 원래 Category·Hub·Article·Glossary 문맥을 유지한 채 복구한다.
- **검색:** 검색 표현을 유지하고 표현 조정 또는 상위 문맥으로 이동한다.
- **직접 URL:** 확인 가능한 가장 가까운 상위 정보공간 또는 Search로 복구한다.

## 10.5 실제 UI 구조

```text
Header
→ 존재하지 않는 정보
→ 유지되는 사용자 목적과 문맥
→ 제거된 정상 영역에 대한 설명
→ 가장 가까운 Recovery CTA
→ 보조 복구 행동
→ 유효한 경우 Footer
```

## 10.6 Section 역할과 10.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| 존재하지 않는 정보 | 빈 상태의 사실 명시 | VS·V1 |
| 유지되는 목적·문맥 | 사용자의 원래 과업과 위치 보존 | VS·V2 |
| 제거된 정상 영역 설명 | 표시되지 않는 범위를 오해 없이 설명 | VS·V6 |
| 가장 가까운 Recovery CTA | 실제 승인된 복구 경로 제공 | V4 |
| 보조 복구 행동 | 재검색·상위 복귀 등 추가 선택 제공 | V5 |

## 10.8 Desktop Layout

- 상태 Container는 Centered 폭을 사용하고 원래 화면의 유효한 상위 문맥을 유지한다.
- 상태 설명과 Recovery CTA를 하나의 의미 단위로 묶는다.
- 제한적 Illustration은 설명보다 약하게 둔다.

## 10.9 Tablet Layout

- 상태 사실·문맥·복구 순서를 유지하며 장식을 축소한다.
- 여러 복구 행동은 우선순위가 보이게 재배치한다.

## 10.10 Mobile Layout

- 한 열에서 상태 사실 → 문맥 → Primary Recovery → 보조 복구 순서를 유지한다.
- 버튼 문구의 줄바꿈과 최소 터치 영역을 보장한다.

## 10.11 Responsive 변경 규칙

- 정상 화면의 비어 있는 Section은 제거하되 상태 사실을 숨기지 않는다.
- 장식을 먼저 제거하고 복구 문맥을 유지한다.
- 추천 콘텐츠를 상태 사실보다 앞으로 이동시키지 않는다.

## 10.12 광고 허용 위치

- 주요 복구가 끝난 뒤 별도의 보조 정보가 실제로 존재하는 경우 그 경계만 검토할 수 있다.

## 10.13 광고 금지 위치

- 상태 사실과 Primary Recovery CTA 사이.
- 검색 결과 없음에서 검색 표현과 복구 행동 사이.
- 번역본 없음에서 대체 언어 경로 판단 과정.

## 10.14 접근성 고려사항

- 빈 상태를 색상·Illustration만으로 전달하지 않는다.
- Recovery CTA의 목적과 도착 범위를 텍스트로 표시한다.
- 상태 발생 전 Focus 문맥을 가능한 범위에서 유지한다.

## 10.15 Loading 상태

- Loading 중이라는 이유만으로 Empty를 먼저 표시하지 않는다.
- 실제 빈 상태 판정 전에는 안정된 원래 구조를 유지한다.

## 10.16 Empty 상태

- 이 화면 자체가 Empty 상태의 공식 표현이다.
- “아무것도 없습니다”로 끝내지 않고 실제 존재하는 복구 관계를 제공한다.
- 관련성이 낮은 인기 콘텐츠로 빈 공간을 채우지 않는다.

## 10.17 Error 상태

- 빈 상태와 기술적 실패를 혼동하지 않는다.
- 실패로 인해 비어 보이는 경우 Error State로 전환하고 원인을 추측하지 않는다.

## 10.18 화면 검증 체크리스트

- [ ] 무엇이 존재하지 않는지 명확하다.
- [ ] 원래 목적과 남아 있는 문맥이 보존된다.
- [ ] 가짜 콘텐츠·관계·비활성 경로가 없다.
- [ ] 가장 가까운 복구 행동이 먼저 보인다.
- [ ] 광고가 복구를 방해하지 않는다.

---

# 11. Error State

## 11.1 화면 목적

사용할 수 없는 정보나 기능의 실패 사실을 알리고, 사용자 책임이나 원인을 추측하지 않은 채 가장 가까운 유효 경로로 복구하게 한다.

## 11.2 사용자 목표

- 무엇을 현재 사용할 수 없는지 이해한다.
- 원래 목적 중 유지되는 부분을 확인한다.
- 재시도·상위 복귀·Search·다른 유효 경로 중 가능한 행동을 선택한다.

## 11.3 Screen Responsibility

### SR-09 실패·빈 상태 복구 책임

- **담당 목적:** 사용할 수 없는 경로의 사실을 알리고 가장 가까운 유효 문맥으로 복구하게 한다.
- **수용 상태:** 검색 결과 없음, 존재하지 않는 정보, 상위 문맥 없음, 관계 부재, Path 단절, 번역본 없음, 변경된 Knowledge, 예상과 다른 정보 도달.
- **필요 IA 문맥:** 현재 유효한 상위·인접 정보공간과 승인된 복구 관계.
- **필수 판단:** 현재 사용할 수 없는 경로, 남아 있는 유효 문맥, 복귀·재검색·대체 탐색 중 가능한 선택.
- **주요 인계:** SR-01~SR-08 또는 정상 종료.
- **근거 Flow:** SD-06, GL-03, ML-03, User Flow 11장.

## 11.4 사용 시나리오

- **최초 진입:** 대상 화면을 사용할 수 없다는 사실과 유효한 대체 경로를 확인한다.
- **내부 링크:** 원래 진입 관계와 상위 문맥을 유지한 채 복구한다.
- **검색:** 검색 표현을 유지하고 재시도 또는 다른 정보공간으로 이동한다.
- **직접 URL:** 확인 가능한 상위 Category·Hub·Homepage·Search로 복구한다.

## 11.5 실제 UI 구조

```text
Header
→ 무엇을 사용할 수 없는가
→ 원래 목적 중 유지되는 정보
→ 가장 가까운 Recovery CTA
→ 필요한 보조 설명
→ 보조 복구 행동
→ 유효한 경우 Footer
```

## 11.6 Section 역할과 11.7 Visual Priority

| Section | 역할 | Priority |
|---|---|---|
| 사용할 수 없는 대상 | 실패 사실과 범위 명시 | VS·V1 |
| 유지되는 목적 | 현재 질문·검색·상위 문맥 보존 | VS·V2 |
| Recovery CTA | 가장 가까운 유효 행동 제공 | V4 |
| 보조 설명 | 필요한 범위에서만 상태 설명 | V6 |
| 보조 복구 행동 | Search·상위 복귀·다른 경로 제공 | V5 |

## 11.8 Desktop Layout

- 상태 사실과 복구를 Centered State 영역으로 표현한다.
- 유효한 Header·Breadcrumb 문맥은 유지할 수 있으나 오류 사실보다 강하지 않게 한다.
- 오류 코드와 기술 세부정보는 사용자 목적 복구보다 후순위다.

## 11.9 Tablet Layout

- 상태·목적·복구의 순서를 유지한다.
- 반복 경고 아이콘과 장식을 줄이고 읽기 폭을 보호한다.

## 11.10 Mobile Layout

- 한 열에서 실패 사실 → 유지 문맥 → Recovery CTA → 보조 설명 순서를 유지한다.
- 고정 요소가 복구 행동을 가리지 않게 한다.

## 11.11 Responsive 변경 규칙

- 기술 설명보다 상태 사실과 복구 행동을 유지한다.
- 좁은 폭에서도 Error를 빨간색만으로 표현하지 않는다.
- 복구 행동을 광고·추천 Card와 비슷하게 만들지 않는다.

## 11.12 광고 허용 위치

- 주요 복구가 완료된 뒤 독립된 정상 정보 구간이 실제로 이어지는 경우에만 그 경계를 검토한다.

## 11.13 광고 금지 위치

- 오류 사실과 Primary Recovery CTA 사이.
- 유지되는 사용자 문맥과 복구 행동 사이.

## 11.14 접근성 고려사항

- 오류를 텍스트·Label·형태로 명확히 전달한다.
- Focus를 Primary Recovery에 예측 가능하게 제공하되 사용자의 탐색을 강제로 빼앗지 않는다.
- 오류 원인을 사용자 책임처럼 표현하지 않는다.

## 11.15 Loading 상태

- 짧은 Loading을 Error로 전환하지 않는다.
- 확정된 실패 전에는 원래 화면의 안정된 구조를 유지한다.
- 자동 재시도가 콘텐츠 접근을 장시간 지연하지 않게 한다.

## 11.16 Empty 상태

- 정보가 실제로 존재하지 않는 경우 Error 대신 Empty State 규칙을 적용한다.
- 빈 결과와 전송·처리 실패를 같은 문구로 표현하지 않는다.

## 11.17 Error 상태

- 이 화면 자체가 Error 상태의 공식 표현이다.
- 원인을 추측하여 단정하지 않는다.
- 오류 코드보다 원래 목적과 가장 가까운 복구 경로를 우선한다.

## 11.18 화면 검증 체크리스트

- [ ] 사용할 수 없는 대상과 범위가 명확하다.
- [ ] 사용자 책임처럼 표현하지 않는다.
- [ ] 원래 질문·검색·상위 문맥이 가능한 범위에서 유지된다.
- [ ] Primary Recovery가 기술 설명보다 먼저 보인다.
- [ ] 빨간색만으로 오류를 전달하지 않는다.
- [ ] 광고가 오류와 복구 사이에 없다.

---

# 12. Screen Summary Matrix

| 화면 | 목적 | 가장 중요한 정보 | 가장 중요한 행동 | Primary CTA | Visual Focus | Desktop Layout | Mobile Layout |
|---|---|---|---|---|---|---|---|
| Homepage | 전체 정보공간 진입 | 플랫폼 정체성과 대표 시작점 | 분야·학습 시작점 선택 | 대표 Hub·Path 시작 | 정체성·시작점 | 12열 편집 Grid, 제한적 Wide | 승인 순서의 1열 |
| Category | 분야 탐색 | Category 범위와 핵심 Hub | Hub 또는 Knowledge 선택 | 추천 시작 Hub | 분야 범위 | 소개 + 분리된 Hub·Topic·Knowledge | 객체 구분을 유지한 1열 |
| Hub | 주제 학습 | 학습 범위와 전체 Path | 시작·현재 단계 선택 | 추천 시작 Node | Path와 현재 단계 | Path 중심의 편집 Layout | 세로 Learning Path |
| Article Detail | 질문에 답변 | 중심 질문과 직접 답변 | 종료 또는 승인된 순차 이동 | Next Knowledge 또는 필요한 Previous | 답변과 장문 가독성 | 720~780px Article Width, 제한적 Sidebar | 본문 중심 1열 |
| Search | Knowledge 재진입 | 검색 표현과 결과 문맥 | 직접 결과·상위 문맥 선택 또는 재검색 | 가장 직접적인 Knowledge | 검색 표현·유형 구분 | 유형별 Result Group | 유형 Label을 유지한 1열 |
| Financial Glossary | 용어 빠른 확인 | 용어와 짧은 정의 | 복귀 또는 상세 학습 | 원래 Article 복귀 또는 상세 Knowledge | 용어·정의 | Centered 정의 + 분리된 관계 Group | 용어→정의 중심 1열 |
| Learning Guide | 목적별 시작 | 목적·수준과 승인된 시작점 | Path·Hub·Knowledge 시작 | 목적별 시작점 | 시작 기준·Path | 목적 단위별 편집 Layout | 목적→시작점→Path 1열 |
| Language Entry | 언어 이동 판단 | 이동 유형과 도착 범위 | 대응 Knowledge 또는 정보공간 이동 | 승인된 대상 이동 | 유지·비유지 문맥 | Centered 판단·비교 Layout | 판단 순서의 1열 |
| Empty State | 빈 상태 복구 | 존재하지 않는 정보와 유지 문맥 | 가장 가까운 유효 경로 복구 | Recovery CTA | 상태 사실·복구 | Centered State | 상태→복구 1열 |
| Error State | 실패 후 복구 | 사용할 수 없는 대상과 유지 목적 | 재시도 또는 유효 경로 복구 | Recovery CTA | 실패 사실·복구 | Centered State | 실패→복구 1열 |

---

# 13. 공통 최종 검증

## Source of Truth 정합성

- [ ] 각 화면 목적과 Section 순서가 Wireframe과 일치한다.
- [ ] Screen Responsibility 문구와 인계 범위를 변경하지 않았다.
- [ ] Category·Hub·Topic·Knowledge의 IA 의미를 혼합하지 않았다.
- [ ] User Flow의 진입·이동·종료·복구를 변경하지 않았다.
- [ ] Previous·Next와 Related Knowledge를 분리했다.
- [ ] 일반 언어 이동과 대응 Knowledge 이동을 분리했다.

## Visual Design 정합성

- [ ] V1~V6·VS·VA가 정보 역할에 맞게 적용되었다.
- [ ] 한 화면의 V1 중심이 명확하다.
- [ ] Desktop·Tablet·Mobile에서 논리 순서가 같다.
- [ ] Article 본문 폭과 장문 가독성 기준을 유지한다.
- [ ] 광고가 콘텐츠·CTA·결과·상태 복구를 모방하지 않는다.
- [ ] 접근성 대비·Focus·터치 영역·비색상 단서를 충족한다.

## Boundary 정합성

- [ ] 새로운 기능·화면·Navigation·Component를 만들지 않았다.
- [ ] 존재하지 않는 완료·저장·진도·개인화 상태를 만들지 않았다.
- [ ] HTML·CSS·Tailwind·React·Next.js·API·Database를 작성하지 않았다.
- [ ] Component 구현과 Design Token 구현을 정의하지 않았다.

---

# 14. 최종 불변 원칙

```text
UI Screen Specification은 정보를 만들지 않는다.

승인된 화면 책임,
Wireframe 순서,
정보 위계,
시각 언어를
동일한 실제 화면 Blueprint로 번역한다.

시각적으로 해결할 수 없는 구조 문제는
새로운 화면·기능·관계로 우회하지 않고
해당 상위 Source of Truth로 반환한다.
```

---

# 사실 확인 리스트

- [x] 지정된 상위 Source of Truth 6종을 실제 문서 기준으로 대조했다.
- [x] Homepage, Category, Hub, Article Detail, Search, Financial Glossary, Learning Guide, Language Entry를 작성했다.
- [x] Empty State와 Error State를 `SR-09`의 서로 다른 공식 상태 표현으로 작성했다.
- [x] 각 화면에 목적, 사용자 목표, Screen Responsibility, 네 가지 진입 시나리오를 포함했다.
- [x] 각 화면에 실제 UI 순서, Section 역할, Visual Priority를 포함했다.
- [x] 각 화면에 Desktop, Tablet, Mobile과 Responsive 변경 규칙을 포함했다.
- [x] 각 화면에 광고 허용·금지, 접근성, Loading·Empty·Error와 검증 체크리스트를 포함했다.
- [x] Screen Summary Matrix를 포함했다.
- [x] Wireframe의 화면별 Section 순서를 변경하지 않았다.
- [x] 새로운 기능·화면·IA·User Flow·Navigation·Component를 만들지 않았다.
- [x] Visual Design System과 Master Design Constitution을 변경하지 않았다.
- [x] 구현 코드와 기술 구현 방식을 작성하지 않았다.
- [x] 현재 결과는 공식 Source of Truth 초안이다.
