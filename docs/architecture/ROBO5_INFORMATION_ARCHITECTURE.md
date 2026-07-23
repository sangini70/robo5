목적

이 문서는 화면을 설명하는 문서가 아닙니다.

"Robo5라는 서비스가 어떤 정보 구조를 가지고 있는가" 를 정의합니다.

즉,

Knowledge

↓

Category

↓

Hub

↓

Topic

↓

Article

↓

Node

↓

Relationship

를 정의하는 문서입니다.

문서 구성
ROBO5_INFORMATION_ARCHITECTURE.md

1. Purpose

2. Information Philosophy

3. Information Hierarchy

4. Knowledge Hierarchy

5. User Entry Points

6. Navigation Structure

7. Knowledge Discovery Flow

8. Content Relationships

9. Information Priority

10. Search Architecture

11. URL Hierarchy

12. Metadata Relationship

13. Global Edition Strategy

14. Future Expansion

15. Information Anti Pattern

16. Final Declaration
이 문서에서 정의하는 것

예를 들어

Home

↓

Category

↓

Knowledge Hub

↓

Article

↓

Related

↓

Next

↓

Category

이 아니라

Knowledge

↓

Hub

↓

Topic

↓

Node

↓

Relationship

를 정의합니다.

역할 구분

앞으로 문서들은 이렇게 됩니다.

README
        │
        ▼
AI_WORK_RULES
        │
        ▼
GEO_TECHNICAL_CONSTITUTION
        │
        ▼
ROBO5_MASTER_DESIGN_CONSTITUTION
        │
        ▼
ROBO5_INFORMATION_ARCHITECTURE
        │
        ▼
SCREEN_ARCHITECTURE
        │
        ▼
Wireframe
        │
        ▼
Visual Design
        │
        ▼
Implementation
각 문서 역할
① 디자인 헌법
왜 이렇게 만드는가
② Information Architecture
무엇으로 이루어져 있는가
③ Screen Architecture
화면으로 어떻게 표현하는가
④ Wireframe
배치는 어떻게 하는가
⑤ Visual Design
어떻게 보이게 하는가
⑥ Code
실제로 구현한다.



────────────────────────────

Official Source of Truth

ROBO5_INFORMATION_ARCHITECTURE.md
Version 1.0


Version: 1.0
Status: Official Information Architecture Source of TruthScope: Knowledge, Information, Navigation, Discovery

0. 문서의 지위와 범위

목적

이 문서는 Robo5의 공식 Information Architecture 기준서이다.

Robo5에 존재하는 Knowledge가 사용자와 AI에게 발견되고, 현재 문맥 안에서 이해되며, 관련 Knowledge와 학습 순서로 이어지도록 정보공간을 조직하는 기준을 정의한다.

이 문서는 다음 질문에 답한다.

어떤 정보 단위가 탐색 대상이 되는가?

각 정보 단위는 전체 정보공간에서 어떤 역할을 맡는가?

사용자는 어디에서 정보공간에 진입하는가?

사용자는 현재 위치를 어떻게 이해하는가?

사용자는 다음 Knowledge를 어떤 원칙으로 발견하는가?

넓은 분야 탐색과 깊은 주제 학습은 어떻게 구분되는가?

탐색에 실패한 사용자는 어디로 복귀하는가?

원칙

이 문서의 Source of Truth 범위는 사용자와 AI를 위한 정보 조직, Navigation, Discovery 및 학습 이동 구조에 한정한다.

Knowledge의 정의와 분류 원칙은 COMMON_ROBO_CONTENT_ARCHITECTURE.md를 따른다. 시스템 실행 관계는 COMMON_ROBO_CONTENT_MAP.md를 따른다. 프로젝트의 상위 철학은 GEO_TECHNICAL_CONSTITUTION.md를 따른다. 시각적 표현과 사용자 인터페이스는 ROBO5_MASTER_DESIGN_CONSTITUTION.md를 따른다.

이 문서는 기존 Knowledge 모델을 변경하지 않는다. 기존 Knowledge 모델이 탐색 가능한 정보공간으로 드러나는 방식만 규정한다.

규칙

이 문서는 다음 결정을 소유한다.

정보 객체의 탐색상 역할

논리적 정보 계층과 위치 문맥

전역·지역·문맥·순차 Navigation의 책임

Navigation과 Discovery의 구분

주요 진입점별 필수 방향 정보

Learning Path의 탐색상 적용

정보공간별 필수 정보 책임

검색과 금융용어사전의 재진입 책임

다국어 정보공간의 분리와 대응 원칙

예외 상태에서의 탐색 복구 원칙

IA의 확장성, 검증 및 변경 관리 기준

이 문서는 다음 결정을 소유하지 않는다.

Knowledge, Category, Topic, Tag, Intent, Pillar, Cluster의 원천 정의

개별 콘텐츠의 작성 기준과 내용

개별 정보 객체의 생성·선정·저장 방식

URL과 slug 정책

화면 배치, 구성 요소, 상호작용 및 시각 표현

디자인 토큰과 반응형 규칙

코드, 데이터 구조, 시스템 연결 및 발행 방식

SEO·GEO의 기술적 구현

1. IA의 목적과 기본 원칙

목적

Robo5의 IA는 서로 연결된 Knowledge를 사용자가 길을 잃지 않고 발견하고 학습하도록 조직한다.

원칙

발견 가능성

사용자는 필요한 Knowledge의 정확한 명칭을 모르더라도 적절한 분야, 주제 또는 용어를 통해 접근할 수 있어야 한다.

위치 이해

사용자는 현재 보고 있는 정보가 어떤 Category와 Hub의 어느 Knowledge에 해당하는지 이해할 수 있어야 한다.

학습 방향

사용자는 현재 정보 이전에 필요한 Knowledge와 이후에 이어지는 Knowledge를 구분할 수 있어야 한다.

관계의 명시성

Knowledge 간 연결은 단순한 추천이 아니라 계층, 순서, 주제, 개념 또는 확장의 이유를 가져야 한다.

진입점 독립성

사용자가 홈페이지가 아닌 개별 Article, 검색 결과, 금융용어 또는 외부 링크로 진입해도 전체 Knowledge 구조로 편입될 수 있어야 한다.

단계적 공개

정보는 한 번에 모두 노출하지 않는다. 전체 분야에서 Category, Hub, Topic, Node로 점차 범위를 좁히거나, Node에서 관련 Knowledge로 범위를 넓힐 수 있어야 한다.

구조의 지속성

콘텐츠 수가 증가해도 정보 위계와 탐색 원칙은 유지되어야 한다.

규칙

모든 주요 정보공간은 현재 정보, 현재 위치, 다음 이동 가능성을 제공해야 한다.

넓은 분야 탐색과 깊은 주제 학습을 같은 책임으로 취급하지 않는다.

Article은 독립된 종착점이 되어서는 안 된다.

Navigation은 Knowledge 관계와 Learning Path를 따라야 한다.

Discovery는 관련성이 설명되지 않는 인기 목록으로 대체할 수 없다.

정보 위계는 특정 화면 표현과 독립적으로 성립해야 한다.

동일한 이동 경로를 여러 명칭으로 중복 정의하지 않는다.

2. 기존 Source of Truth와 권한 경계

목적

기존 Source of Truth와 이 문서의 책임을 분리하여 정의 중복과 권한 충돌을 방지한다.

원칙

문서

고유 책임

IA와의 관계

GEO_TECHNICAL_CONSTITUTION.md

Knowledge First, Learning Path, Living Knowledge 등 상위 철학

IA 판단의 철학적 기준

SOURCE_OF_TRUTH.md

Source와 산출물의 단일성 및 계층

IA가 새로운 원천 정의를 만들지 않게 하는 기준

COMMON_ROBO_CONTENT_ARCHITECTURE.md

콘텐츠 분류, Knowledge 모델, 관계 및 운영 원칙

IA가 투영하는 원천 Knowledge 구조

COMMON_ROBO_CONTENT_MAP.md

Knowledge 구조의 시스템 실행 관계

승인된 IA 요구가 전달되는 실행 영역

ROBO5_INFORMATION_ARCHITECTURE.md

정보 조직, Navigation, Discovery, 위치 및 복구 구조

사용자·AI 대상 탐색 투영 기준

ROBO5_MASTER_DESIGN_CONSTITUTION.md

브랜드, UX, 시각 표현 및 디자인 보호 원칙

IA를 화면에 표현하는 기준

Content Architecture가 Knowledge 모델과 분류 원칙을 소유하고, Information Architecture는 그 모델의 사용자·AI 대상 탐색 투영 구조를 소유한다.

여기서 탐색 투영은 원천 Knowledge를 변경하지 않고, 그것이 발견되고 연결되며 학습될 수 있도록 정보공간에 드러내는 것을 의미한다.

규칙

Knowledge 객체의 의미나 생성 기준에 관한 판단은 COMMON_ROBO_CONTENT_ARCHITECTURE.md를 따른다.

Source의 위치와 단일성에 관한 판단은 SOURCE_OF_TRUTH.md를 따른다.

시스템의 실행 방식에 관한 판단은 COMMON_ROBO_CONTENT_MAP.md와 관련 기술 문서를 따른다.

정보 객체의 탐색상 책임과 이동 관계에 관한 판단은 이 문서를 따른다.

시각적 표현과 인터페이스 판단은 ROBO5_MASTER_DESIGN_CONSTITUTION.md를 따른다.

IA는 상위 문서의 정의를 복사하여 별도의 정의로 만들지 않는다.

IA 요구가 다른 Source of Truth의 변경을 필요로 할 경우, 이 문서에서 우회하여 규정하지 않고 해당 권한 문서의 변경 절차를 먼저 따른다.

3. Robo5 정보공간 모델

목적

Robo5 전체를 개별 Article의 집합이 아닌, 계층과 관계가 함께 작동하는 하나의 Knowledge 탐색 공간으로 규정한다.

원칙

Robo5 정보공간은 다음 두 구조를 함께 가진다.

계층 구조: 사용자가 넓은 분야에서 구체적인 Knowledge로 범위를 좁히는 구조

관계 구조: 사용자가 현재 Knowledge에서 순서, 문맥 또는 개념 관계를 따라 이동하는 구조

논리적 정보 흐름은 다음과 같다.

Robo5
→ Domain
→ Category
→ Knowledge Hub
→ Topic
→ Knowledge Node
→ Article

이 흐름은 정보의 탐색 위계를 설명하며 URL, 저장 위치 또는 화면 배치를 의미하지 않는다.

Primary Domain은 Robo5의 전문 영역을 형성한다. Supporting Domain은 Primary Domain의 이해와 학습을 보조한다. 두 영역은 역할이 다르지만 하나의 Knowledge 공간 안에서 관계를 가질 수 있다.

규칙

사용자는 상위 정보공간에서 하위 Knowledge로 이동할 수 있어야 한다.

하위 정보에서 진입한 사용자는 상위 문맥으로 복귀할 수 있어야 한다.

Category와 Hub는 서로 대체하지 않는다.

계층 관계와 관련 관계를 혼용하지 않는다.

Supporting Domain은 별도의 고립된 부속 공간이 아니라 Primary Domain의 이해를 돕는 연결 공간으로 작동해야 한다.

논리적 정보 계층을 URL 구조와 자동으로 동일시하지 않는다.

동일한 Knowledge가 여러 문맥에서 발견되더라도 원천 소속과 현재 탐색 문맥을 구분한다.

4. 정보 객체와 탐색상 역할

목적

기존 Knowledge 객체를 재정의하지 않고, 각 객체가 탐색 과정에서 맡는 고유 책임을 명확히 한다.

원칙

정보 객체

탐색상 역할

Domain

전문 영역과 보조 교육 영역을 구분하는 최상위 문맥

Category

사용자가 넓은 분야를 탐색하는 기본 경계

Knowledge Hub

하나의 핵심 주제를 깊게 학습하는 대표 출발점

Topic

Category 또는 Hub 안에서 의미가 가까운 Knowledge를 묶는 탐색 문맥

Knowledge Node

사용자가 이해해야 할 최소 Knowledge 단위

Article

Knowledge Node를 사용자가 읽고 이해할 수 있도록 제공하는 공개 표현

Pillar

Category 또는 Topic의 대표 진입점

Cluster

Pillar의 세부 질문으로 이동하는 확장 경로

Intent

사용자가 해당 정보에서 기대할 수 있는 학습 목적을 알려주는 문맥

Tag

계층을 가로질러 공통 개념을 탐색하는 횡단 경로

Glossary Term

짧은 용어 확인에서 관련 Knowledge로 진입하는 연결 객체

Learning Path

순서가 있는 Knowledge Node의 학습 경로

Related Node

순차 관계는 아니지만 현재 Knowledge를 확장하는 경로

Evidence·Source

Knowledge의 근거와 신뢰 문맥을 확인하는 보조 정보

Version

Living Knowledge의 현재성과 변화 문맥을 나타내는 정보

규칙

Category는 분야 탐색을, Hub는 주제 학습을 책임진다.

Topic은 Category나 Hub를 대체하는 최상위 분류로 사용하지 않는다.

Article과 Knowledge Node를 동일한 원천 객체로 취급하지 않는다.

Pillar·Cluster 관계와 Previous·Next 관계를 혼용하지 않는다.

Tag는 Category 계층을 대체하지 않는다.

Glossary Term은 짧은 확인과 상세 학습을 연결해야 한다.

Evidence, Source, Version은 주된 탐색을 방해하지 않으면서 Knowledge의 신뢰와 현재성을 확인할 수 있게 해야 한다.

5. 정보 계층과 관계 모델

목적

Knowledge 간 연결의 종류와 이동 의미를 분리하여, 사용자가 연결 이유를 이해할 수 있게 한다.

원칙

Robo5의 주요 정보 관계는 다음과 같다.

관계

의미

계층 관계

상위 분야와 하위 Knowledge의 소속

대표 관계

주제의 대표 Knowledge와 세부 Knowledge의 연결

순차 관계

Learning Path 안에서 이전·현재·다음 단계의 연결

문맥 관계

현재 내용을 이해하는 데 직접 도움이 되는 Knowledge의 연결

횡단 관계

공통 개념을 통해 서로 다른 Category나 Topic을 잇는 연결

근거 관계

Knowledge와 이를 뒷받침하는 Evidence·Source의 연결

버전 관계

현재 Knowledge와 이전 상태의 시간적 연결

관계는 존재 여부뿐 아니라 사용자가 그 관계를 따라가야 하는 이유를 가져야 한다.

규칙

각 관계는 하나의 주된 의미를 가져야 한다.

순차 관계는 학습 순서를 나타내며 일반 Related 관계로 대체하지 않는다.

대표 관계는 Pillar와 Cluster의 구조를 따른다.

횡단 관계는 표준화된 공통 개념을 근거로 해야 한다.

현재 위치는 원천 소속과 현재 탐색 문맥을 함께 고려해 설명해야 한다.

하나의 Knowledge가 여러 경로에 포함될 경우, 사용자가 진입한 현재 경로를 우선 문맥으로 삼되 원천 소속을 왜곡하지 않는다.

관계 이유가 없는 연결은 생성하지 않는다.

관련성이 약한 다수의 연결보다 의미가 분명한 소수의 연결을 우선한다.

6. 사용자 진입점과 탐색 의도

목적

사용자가 어디에서 들어오더라도 현재 정보의 의미와 전체 구조 안의 위치를 이해하고 다음 행동을 선택할 수 있게 한다.

원칙

주요 진입점은 다음과 같다.

홈페이지 직접 방문

Category 또는 Hub 직접 방문

검색엔진을 통한 Article 진입

AI 검색, 인용 또는 답변을 통한 Knowledge 진입

사이트 내부 검색

금융용어사전

관련 Knowledge 연결

Learning Path의 이전·다음 연결

외부 공유 링크

언어별 정보공간 진입

주요 탐색 의도는 다음과 같다.

하나의 개념을 빠르게 확인한다.

한 주제를 처음부터 순서대로 학습한다.

두 개 이상의 개념 차이를 이해한다.

현상의 원인과 관계를 파악한다.

모르는 용어를 확인한다.

현재 Knowledge에서 관련 분야로 범위를 넓힌다.

중단했던 학습 흐름으로 돌아간다.

규칙

모든 진입점은 사용자가 다음 세 가지를 파악할 수 있게 해야 한다.

현재 무엇을 보고 있는가
전체 정보공간에서 어디에 있는가
다음에 어디로 이동할 수 있는가

추가 규칙은 다음과 같다.

홈페이지를 거치지 않은 진입을 예외로 취급하지 않는다.

빠른 정의 확인을 원하는 사용자에게 전체 학습을 강제하지 않는다.

깊이 학습하려는 사용자에게 단순 Related 목록만 제공하지 않는다.

진입 의도와 다른 경로도 선택할 수 있게 하되 주된 다음 경로는 명확해야 한다.

외부에서 들어온 사용자가 상위 Category와 Hub를 발견할 수 있어야 한다.

7. Navigation System

목적

서로 다른 이동 목적을 구분하고 각 Navigation이 중복 없이 고유 책임을 수행하게 한다.

원칙

전역 Navigation

Robo5 전체 정보공간의 주요 Domain과 Category, 검색, 금융용어사전, 학습가이드 및 언어별 진입점에 접근하게 한다.

지역 Navigation

현재 Category 또는 Hub 안에서 Topic, 학습 단계 및 주요 Knowledge를 탐색하게 한다.

문맥 Navigation

현재 Knowledge와 직접 관련된 상위 Hub, 같은 Topic, 관련 용어 및 관계 있는 다른 Knowledge로 이동하게 한다.

순차 Navigation

Learning Path 안에서 현재 단계와 이전·다음 단계를 따라 이동하게 한다.

위치 Navigation

현재 정보가 전체 계층에서 어디에 속하는지 설명하고 상위 문맥으로 복귀하게 한다.

규칙

전역 Navigation은 전체 정보공간의 주요 진입점만 책임진다.

지역 Navigation은 현재 범위 밖의 일반 추천을 포함하지 않는다.

문맥 Navigation은 연결 이유가 분명한 Knowledge만 제공한다.

순차 Navigation은 학습 순서를 변경하거나 Related와 혼합하지 않는다.

위치 Navigation은 현재 위치를 설명하며 학습 진행 상태를 대신하지 않는다.

동일한 목적의 이동 경로를 여러 Navigation 체계에서 불필요하게 반복하지 않는다.

Navigation의 명칭은 정보 객체의 실제 역할과 일치해야 한다.

사용자가 한 단계 위 문맥으로 복귀할 수 없는 고립된 하위 정보공간을 만들지 않는다.

8. Discovery System

목적

사용자가 이미 알고 있는 위치로 이동하는 Navigation을 넘어, 알지 못했던 관련 Knowledge를 의미 있는 문맥 안에서 발견하게 한다.

원칙

Navigation은 알려진 구조를 따라 이동하는 체계다. Discovery는 현재 목적과 관련된 새로운 Knowledge를 발견하는 체계다.

Discovery는 다음 상황에서 작동한다.

전체 정보공간에서 학습 시작점을 찾을 때

Category에서 대표 Hub와 Topic을 찾을 때

Hub에서 전체 Learning Path를 찾을 때

Article에서 관련 개념과 후속 질문을 찾을 때

검색 결과에서 Category, Hub 또는 Glossary로 재진입할 때

금융용어에서 상세 Knowledge와 관련 용어로 확장할 때

규칙

Discovery 대상의 선정 기준은 Content Architecture가 소유한다.

IA는 선정된 대상이 어떤 탐색 문맥에서 어떤 역할로 제공되는지만 규정한다.

대표성, 학습 관련성, 현재성은 서로 다른 기준으로 구분한다.

최신 정보가 항상 대표 학습 시작점보다 우선하지 않는다.

동일한 Knowledge를 같은 문맥에서 중복 추천하지 않는다.

Related, Featured, Pillar 및 Next는 서로 다른 역할을 유지한다.

사용자가 발견한 Knowledge가 상위 구조와 단절되지 않게 한다.

Discovery는 사용자의 현재 질문을 방해하지 않고 다음 탐색 가능성을 확장해야 한다.

9. Learning Path와 순차 탐색

목적

Knowledge를 단순 목록이 아닌 학습 순서로 제공하고, 사용자가 현재 단계와 다음 단계를 이해하게 한다.

원칙

Learning Path는 COMMON_ROBO_CONTENT_ARCHITECTURE.md와 COMMON_ROBO_CONTENT_MAP.md에서 승인된 Knowledge 관계를 탐색 순서로 드러낸다.

현재 프로젝트의 기본 Flow는 다음과 같다.

정의 → 원인 → 방법 → 비교 → 판단 → 실행

이 순서는 모든 주제에 동일한 수의 단계를 강제하는 목록이 아니라, 학습의 논리적 진행 방향을 판단하는 기준이다.

규칙

사용자는 Path의 목적, 전체 범위, 현재 단계와 다음 단계를 이해할 수 있어야 한다.

중간 Node로 직접 진입한 사용자도 Path의 시작점과 상위 Hub를 찾을 수 있어야 한다.

선수 Knowledge와 후속 Knowledge를 구분한다.

필수 순서와 선택 확장 경로를 구분한다.

Previous와 Next는 현재 Path 문맥을 기준으로 한다.

하나의 Node가 여러 Path에 속할 경우 현재 진입 Path를 우선 적용하되 다른 소속을 제거하지 않는다.

실제 학습 완료 정보가 없으면 완료 상태를 만들지 않는다.

Path의 일부가 없거나 공개되지 않은 경우 존재하지 않는 단계를 암시하지 않는다.

IA는 개별 Node의 Flow를 새로 지정하지 않는다.

10. 페이지 유형별 정보 책임

목적

각 정보공간이 제공해야 할 Knowledge 문맥과 이동 책임을 정의한다. 이 장의 페이지 유형은 화면 형식이 아니라 정보 책임의 단위다.

원칙

정보공간

핵심 책임

Homepage

전체 Knowledge 공간의 성격을 설명하고 대표 학습 시작점을 제공

Category

한 분야의 범위, 주요 Hub, Topic 및 변화하는 Knowledge를 탐색

Knowledge Hub

하나의 주제와 전체 Learning Path를 이해하고 깊이 학습

Article

하나의 핵심 질문에 답하고 현재 Node의 위치와 다음 관계를 제공

Search

사용자의 표현을 Knowledge 객체와 연결하고 구조 안으로 재진입

Glossary

용어를 짧게 확인하고 관련 개념과 상세 Knowledge로 확장

Learning Guide

목적 또는 수준에 맞는 학습 시작점과 Path를 제공

Error·Empty

탐색 실패의 이유를 알리고 유효한 상위 또는 인접 경로로 복구

규칙

Homepage

전체 정보공간의 정체성과 범위를 알려야 한다.

Primary Domain과 Supporting Domain의 역할 차이를 이해하게 해야 한다.

대표 Category, Hub 또는 Learning Path로 진입할 수 있어야 한다.

최신 정보만으로 전체 정보공간을 대표하지 않는다.

Category

해당 분야의 범위와 목적을 설명해야 한다.

Category에 속한 주요 Hub와 Topic을 구분해야 한다.

대표 학습 시작점과 변화하는 정보를 구분해야 한다.

다른 Category와의 관계는 관련성이 있을 때만 제공한다.

Knowledge Hub

해당 주제에서 무엇을 배우는지 설명해야 한다.

전체 학습 범위와 추천 시작점을 알려야 한다.

Learning Path와 비순차 Related Knowledge를 구분해야 한다.

현재 Node에서 Hub 전체로 복귀할 수 있어야 한다.

Article

하나의 중심 질문과 직접 답변을 명확히 해야 한다.

현재 Node의 Category, Hub 또는 Topic 문맥을 알려야 한다.

Previous·Next와 Related Knowledge를 구분해야 한다.

관련 용어와 상위 학습 경로로 확장할 수 있어야 한다.

Search

검색 표현과 결과의 관계를 이해하게 해야 한다.

결과를 Knowledge 문맥과 함께 제공해야 한다.

적절한 Category, Hub 또는 Glossary로 재진입할 수 있어야 한다.

Glossary

용어의 짧은 의미 확인을 책임진다.

용어의 관련 분야와 상세 Knowledge를 연결한다.

관련 용어 사이의 의미 관계를 유지한다.

Learning Guide

사용 목적이나 학습 수준에 맞는 시작점을 제공한다.

Guide와 실제 Learning Path의 관계를 명확히 한다.

Guide 자체를 새로운 Knowledge 분류로 사용하지 않는다.

Error·Empty

사용자가 도달하지 못한 정보의 상태를 설명한다.

가장 가까운 유효한 상위 문맥을 제공한다.

대체 탐색 또는 검색 경로를 제공한다.

11. 검색 Information Architecture

목적

사용자의 검색 표현을 Robo5의 Knowledge 구조와 연결하고, 결과를 다시 탐색과 학습으로 이어지게 한다.

원칙

검색은 Article 제목 목록을 반환하는 별도 공간이 아니다. Category, Hub, Topic, Knowledge, Tag 및 Glossary Term 사이의 관계를 활용하여 사용자를 적절한 정보 문맥으로 연결하는 진입 체계다.

검색 결과는 사용자가 다음을 판단할 수 있게 해야 한다.

이 결과가 검색 의도와 왜 관련되는가?

이 결과는 어떤 분야와 주제에 속하는가?

빠른 확인과 깊은 학습 중 어느 목적에 적합한가?

더 넓거나 더 구체적인 탐색은 어디에서 이어지는가?

규칙

검색 대상과 우선순위의 원천 정의는 관련 Source of Truth를 따른다.

결과는 가능한 경우 Category, Hub, Topic 또는 용어 문맥과 함께 해석되어야 한다.

같은 Knowledge의 여러 공개 표현이 중복 결과처럼 경쟁하지 않게 한다.

표현 차이, 동의어, 약어 및 언어별 명칭은 승인된 관계를 바탕으로 같은 Knowledge에 접근할 수 있게 한다.

검색 결과가 넓을 경우 상위 Category나 Hub로 범위를 좁힐 수 있어야 한다.

검색 결과가 없을 경우 인접 용어, 상위 분야 또는 새로운 검색 경로를 제공해야 한다.

한국어와 영어의 검색 공간은 각각의 언어 정보공간 안에서 작동한다.

검색 기술이나 결과 표현 방식은 이 문서에서 정의하지 않는다.

12. 금융용어사전 Information Architecture

목적

금융용어를 짧게 확인하는 요구를 충족하면서, 관련 Knowledge 학습으로 자연스럽게 확장되는 정보공간을 만든다.

원칙

Glossary Term은 Knowledge Node와 동일하지 않다. Glossary는 용어의 빠른 확인을 책임지고, Knowledge Node와 Article은 해당 개념의 맥락과 관계를 깊게 학습하는 역할을 맡는다.

금융용어사전은 Primary Domain의 이해를 지원하는 Supporting Domain이며, 고립된 정의 저장소가 아니다.

규칙

각 용어는 짧은 의미, 관련 분야 및 상세 학습 경로를 가져야 한다.

동의어, 약어, 영문명은 같은 개념에 대한 접근 경로로 다룬다.

상위 개념, 하위 개념 및 관련 개념은 서로 다른 관계로 구분한다.

용어에서 관련 Category, Hub, Knowledge Node 또는 Article로 이동할 수 있어야 한다.

Article에서 모르는 용어를 확인한 사용자는 원래 학습 문맥을 잃지 않아야 한다.

금융용어사전을 Tag 목록이나 Category 복제본으로 만들지 않는다.

상세 Knowledge가 없는 용어는 존재하지 않는 상세 경로를 암시하지 않는다.

용어 배열과 접근 기준은 언어별 정보공간의 특성을 따른다.

13. 다국어 Information Architecture

목적

한국어와 영어를 각각 독립적으로 이해 가능한 Knowledge 정보공간으로 운영하면서, 필요한 경우 대응 관계를 제공한다.

원칙

한국어 정보공간과 영어 정보공간은 같은 Knowledge 철학과 IA 원칙을 공유한다. 그러나 각 언어의 콘텐츠 우선순위, 검색 의도, Category 구성 상태 및 Learning Path 완성도는 다를 수 있다.

언어 전환은 단순한 목록 필터가 아니라 해당 언어 정보공간의 진입점으로 이동하는 행위다. 동일 Knowledge의 번역 관계와 일반적인 언어 전환은 구분한다.

규칙

각 언어 정보공간은 자체적인 Category, Hub, Search, Glossary 및 Learning Path 문맥을 가져야 한다.

현재 정보에 대응하는 다른 언어 콘텐츠가 확인된 경우에만 같은 Knowledge의 대응 관계를 제공한다.

대응 콘텐츠가 없으면 다른 언어의 유사 콘텐츠를 동일 문서인 것처럼 연결하지 않는다.

번역 관계는 Knowledge 관계와 별도로 인식한다.

한 언어의 정보 우선순위를 다른 언어에 그대로 강제하지 않는다.

언어 전환 후 사용자가 도달하는 정보공간의 범위를 예측할 수 있어야 한다.

언어별 기술 표시는 관련 SEO·GEO 문서가 소유하며, IA는 독립 정보공간과 대응 관계 요구만 전달한다.

언어 선택의 시각적 표현은 디자인 문서가 소유한다.

14. 상태·예외·탐색 복구 구조

목적

정보가 없거나 관계가 불완전한 상황에서도 사용자가 정보공간을 이탈하지 않고 가장 가까운 유효한 경로로 돌아가게 한다.

원칙

모든 예외 상태는 다음 순서를 따른다.

현재 상태를 설명한다
→ 유효한 상위 문맥을 알려준다
→ 가장 가까운 복구 경로를 제공한다

복구는 존재하지 않는 정보나 관계를 만들어내는 방식으로 해결하지 않는다.

규칙

검색 결과 없음

결과가 없음을 명확히 알린다.

표현을 넓히거나 인접한 용어를 찾을 수 있게 한다.

주요 Category, Hub 또는 Glossary로 복귀할 수 있게 한다.

존재하지 않는 정보

존재하지 않는 Category, Hub, Node 또는 Article을 정상 정보처럼 표시하지 않는다.

가장 가까운 유효한 상위 정보공간으로 복귀하게 한다.

이전·다음 정보 없음

Path의 시작이나 끝이라면 그 상태를 왜곡하지 않는다.

관련 Knowledge를 Next로 대신 표시하지 않는다.

관련 Knowledge 부족

관련성이 낮은 정보를 채우지 않는다.

상위 Hub 또는 Topic으로 복귀하는 경로를 우선한다.

번역본 없음

번역본이 없음을 숨기지 않는다.

다른 언어의 홈페이지 또는 상위 정보공간으로 이동할 수 있게 한다.

오래된 Knowledge

현재성 판단과 Version 원칙은 기존 Source of Truth를 따른다.

사용자가 현재 유효한 Knowledge 또는 관련 최신 문맥을 찾을 수 있게 한다.

고아 Node와 끊어진 Path

상위 문맥, 학습 순서 또는 관련 Knowledge 중 적어도 하나의 유효한 연결을 확보하기 전 정상적인 탐색 구조로 간주하지 않는다.

존재하지 않는 연결을 임시 추천으로 대체하지 않는다.

변경된 위치

기존 진입 사용자가 의미상 가장 가까운 유효 정보로 복귀할 수 있어야 한다.

URL 처리 방식은 관련 기술 문서의 책임으로 남긴다.

15. 확장성과 거버넌스

목적

Knowledge 수가 증가해도 정보공간의 의미, 탐색 가능성 및 관리 책임이 무너지지 않게 한다.

원칙

확장은 메뉴와 목록을 계속 늘리는 방식이 아니라 계층, Hub, Topic, Learning Path 및 관계를 통해 복잡성을 분산하는 방식으로 이루어진다.

IA는 100개, 1,000개, 10,000개의 Knowledge Node에서도 동일한 기본 원칙을 유지해야 한다.

규칙

Category의 생성·변경 기준은 Content Architecture를 따른다.

IA는 Category 증가가 전역 탐색과 위치 이해에 미치는 영향을 검토한다.

하나의 Hub가 서로 다른 학습 목적을 명확히 설명하지 못할 정도로 넓어지면 분리 필요성을 검토한다.

Topic이 사용자의 범위 판단을 돕지 못하는 과밀 상태가 되면 구조 조정을 검토한다.

Tag 증가가 계층 구조를 대체하거나 같은 개념의 중복 경로를 만들지 않게 한다.

고아 Node, 중복 Hub, 중복 Topic 및 끊어진 Learning Path를 구조 건강성 문제로 관리한다.

모든 Knowledge를 전역 Navigation에 직접 노출하지 않는다.

최신 정보 증가가 대표 학습 경로를 밀어내지 않게 한다.

IA 결정은 해당 정보 객체와 관계의 권한 문서를 확인한 뒤 승인한다.

정보공간의 정기 검토는 콘텐츠 수가 아니라 탐색 실패, 관계 단절, 과밀 및 중복 징후를 기준으로 수행한다.

16. IA 검증 기준

목적

IA의 적합성을 취향이 아니라 일관된 질문으로 검증한다.

원칙

IA 검증은 Findability, Orientation, Learnability, Relationship, Recovery, Scalability의 여섯 영역으로 수행한다.

규칙

Findability

필요한 Knowledge를 Category, Hub, 검색 또는 Glossary 중 적절한 경로로 찾을 수 있는가?

정확한 명칭을 모르는 사용자도 상위 분야에서 접근할 수 있는가?

외부에서 진입한 사용자가 상위 Knowledge 구조를 발견할 수 있는가?

Orientation

현재 정보가 어느 Category, Hub, Topic 또는 Learning Path에 속하는지 알 수 있는가?

원천 소속과 현재 탐색 문맥이 모순되지 않는가?

위치 관계와 학습 순서가 서로 다른 의미로 유지되는가?

Learnability

무엇부터 읽어야 하는지 알 수 있는가?

선수 Knowledge와 다음 Knowledge가 구분되는가?

선택 확장과 필수 순서가 구분되는가?

Relationship

관련 Knowledge의 연결 이유가 설명 가능한가?

Pillar·Cluster, Previous·Next, Related 및 Tag 관계가 혼용되지 않는가?

같은 Knowledge가 불필요하게 중복 추천되지 않는가?

Recovery

검색 실패, 빈 상태 또는 존재하지 않는 정보에서 복구할 수 있는가?

고립된 Article이나 Node가 존재하지 않는가?

상위 문맥으로 돌아갈 수 없는 경로가 존재하지 않는가?

Scalability

Knowledge 증가가 전역 Navigation의 무한 확장으로 이어지지 않는가?

Category, Hub와 Topic의 역할이 규모 증가 후에도 유지되는가?

새로운 Domain이 기존 Domain의 탐색 구조를 훼손하지 않는가?

모든 핵심 검증 항목을 통과하지 못한 구조는 승인된 IA로 간주하지 않는다.

17. 변경 관리와 문서 연동

목적

IA 변경이 기존 Knowledge 관계와 다른 Source of Truth를 우회하거나 손상하지 않도록 관리한다.

원칙

IA 문제와 Knowledge 모델 문제, 디자인 문제, 구현 문제를 구분한 뒤 해당 권한 문서에서 변경한다.

변경은 다음 순서를 따른다.

IA 문제 확인
→ 원인과 권한 문서 확인
→ 영향받는 정보 객체와 관계 확인
→ 변경안 작성
→ 사용자 승인
→ 해당 Source of Truth 반영
→ 후속 디자인·구현 작업 별도 진행

규칙

IA 변경안에는 다음 항목을 포함해야 한다.

현재 문제

영향을 받는 진입점과 탐색 경로

영향을 받는 정보 객체와 관계

이 문서가 소유하는 결정인지 여부

관련 Source of Truth의 변경 필요 여부

기존 학습 경로와 외부 진입점에 미치는 영향

변경 후 검증 기준

추가 규칙은 다음과 같다.

승인 전에는 변경을 확정하거나 구현하지 않는다.

IA 변경을 이유로 Knowledge 정의를 이 문서에서 변경하지 않는다.

Knowledge 모델 변경이 필요한 경우 Content Architecture를 먼저 검토한다.

URL, SEO, GEO, 시스템, 디자인 영향은 각 권한 문서로 전달한다.

기존 진입점, 상위 문맥 및 Learning Path의 연속성을 보호한다.

변경 이력은 변경 목적과 영향을 식별할 수 있게 유지한다.

디자인 승인과 구현 승인은 IA 변경 승인을 대신하지 않으며, IA 승인도 디자인이나 구현 승인을 의미하지 않는다.

18. IA Anti-Patterns

목적

Robo5의 Knowledge 구조를 일반적인 글 목록 또는 메뉴 구조로 축소시키는 잘못된 IA를 방지한다.

원칙

다음 행위는 IA 위반이다.

규칙

Category와 Knowledge Hub를 같은 정보 객체로 취급한다.

Article 목록을 전체 Information Architecture로 간주한다.

Navigation을 Category 메뉴만으로 구성한다.

Related Knowledge와 Previous·Next를 혼용한다.

Pillar·Cluster 관계를 학습 순서와 동일하게 취급한다.

Tag를 무제한 생성하여 Category와 Topic을 대체한다.

모든 Knowledge를 홈페이지 또는 전역 Navigation에 직접 노출한다.

Article을 상위 문맥과 다음 경로가 없는 종착점으로 만든다.

검색 결과를 문맥 없는 제목 목록으로 끝낸다.

금융용어사전을 고립된 정의 저장소 또는 Tag 목록으로 만든다.

최신 정보를 대표 학습 시작점보다 항상 우선한다.

인기 여부만으로 Related Knowledge를 구성한다.

언어 전환을 같은 목록에 대한 필터로만 취급한다.

대응 번역이 없는 콘텐츠를 같은 Knowledge의 번역본으로 표시한다.

논리적 정보 계층과 URL 구조를 반드시 동일하게 만든다.

화면에 보이는 묶음을 새로운 Knowledge 분류로 간주한다.

UI 요구를 이유로 기존 Knowledge 관계를 삭제하거나 왜곡한다.

이 문서에서 코드, 데이터 구조, 화면 배치 또는 디자인 규칙을 정의한다.

기존 Source of Truth의 정의를 복사해 별도의 원천 정의로 만든다.

19. 최종 불변 원칙

목적

Robo5 Information Architecture가 장기적으로 보호해야 할 책임을 최종 선언한다.

원칙

Knowledge 모델은 COMMON_ROBO_CONTENT_ARCHITECTURE.md가 정의한다.

Information Architecture는 승인된 Knowledge가 다음 상태를 갖도록 조직한다.

찾을 수 있다
현재 위치를 이해할 수 있다
관계 이유를 알 수 있다
학습 순서를 따라갈 수 있다
실패 후 유효한 경로로 복귀할 수 있다

Design은 승인된 IA를 시각적으로 표현한다.

Implementation은 승인된 구조와 관계를 손상하지 않고 실행한다.

규칙

Knowledge보다 화면을 먼저 조직하지 않는다.

Navigation보다 Learning Path의 의미를 우선한다.

목록의 양보다 관계의 명확성을 우선한다.

모든 주요 진입점은 전체 Knowledge 구조로 이어져야 한다.

모든 하위 정보는 유효한 상위 문맥으로 복귀할 수 있어야 한다.

IA는 새로운 Knowledge 철학이나 원천 정의를 만들지 않는다.

IA 변경은 기존 Source of Truth의 권한과 승인 절차를 따른다.

Robo5의 Information Architecture는 페이지를 늘리는 체계가 아니다.

Knowledge가 발견되고, 이해되고, 연결되고, 학습되도록 길을 조직하는 체계다.