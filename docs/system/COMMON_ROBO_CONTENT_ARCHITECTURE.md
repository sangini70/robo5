# COMMON_ROBO_CONTENT_ARCHITECTURE.md

## 목적

본 문서는 robo5의 콘텐츠 분류, 탐색, 추천, SEO 구조의 기준 문서이다.

모든 콘텐츠는 본 문서를 기준으로 작성, 분류, 연결된다.

목표는 단순 블로그가 아니라

"사용자가 필요한 정보를 빠르게 찾고 다음 콘텐츠를 자연스럽게 소비하는 콘텐츠 탐색 엔진"

을 구축하는 것이다.

---

# 1. 콘텐츠 철학

robo5는 뉴스 사이트가 아니다.

robo5는 금융 지식과 투자 판단을 돕는 콘텐츠 플랫폼이다.

콘텐츠 수가

30개
300개
3000개
30000개

로 증가해도 동일한 구조가 유지되어야 한다.

---

# 2. Category 규칙

모든 글은 반드시 하나의 Category에만 속한다.

복수 Category 금지.

현재 Category

1. 환율
2. 세금/지원금
3. 투자기초
4. 미국증시

향후 확장 가능.

Category는 URL 구조를 결정한다.

예)

/exchange-rate/
/tax-subsidy/
/investing-basics/
/us-market/

Category는 자주 변경하지 않는다.

---

# 3. Topic 규칙

Topic은 같은 주제를 묶는 논리적 그룹이다.

Category 내부에 존재한다.

예)

Category
환율

Topic
환율기초
환율전망
환율투자

Topic은 검색 엔진의 Topical Authority 구축을 위한 핵심 단위이다.

---

# 4. Tag 규칙

Tag는 횡단 탐색용이다.

Category를 넘어서 콘텐츠를 연결한다.

예)

#달러
#인플레이션
#금리
#나스닥

Tag는 표준 사전(Dictionary)을 사용한다.

임의 생성 금지.

---

# 5. Intent 규칙

모든 글은 Intent를 가진다.

Know
정보 습득

Do
실행 방법

Buy
상품 또는 서비스 검토

예)

환율이란?
→ Know

환율 보는 법
→ Do

달러 ETF 비교
→ Buy

---

# 6. Featured 규칙

Featured는 대표 콘텐츠 여부를 의미한다.

true
false

Category Hero 선정 시 우선 사용한다.

---

# 7. Hero Post 규칙

메인 Hero

시의성 + 조회수 + 사용자 반응

기준으로 선정한다.

Category Hero

반드시 에버그린 Pillar 콘텐츠 사용.

뉴스성 글 사용 금지.

---

# 8. Related Posts 규칙

우선순위

1. 같은 Topic
2. 같은 Tag
3. 같은 Category
4. 같은 Intent

관련성 없는 추천 금지.

---

# 9. SEO 구조

Category
= URL 구조

Topic
= 내부 링크 구조

Tag
= 횡단 탐색 구조

모든 Pillar 글은 Cluster 글과 상호 연결한다.

---

# 10. 관리자 입력 규칙

새 글 작성 시 필수 입력

Title
Category
Topic
Intent

선택 입력

Tag
Featured

---

# 11. 금지 사항

기타 카테고리 금지

복수 Category 금지

무제한 Tag 생성 금지

뉴스를 Category Hero로 사용 금지

관련성 없는 Related Posts 금지

Category 구조 수시 변경 금지

---

# 12. 장기 확장 계획

콘텐츠 300개 이상

Tag Dictionary 강화

콘텐츠 1000개 이상

자동 분류 검토

콘텐츠 3000개 이상

추천 알고리즘 고도화

콘텐츠 10000개 이상

벡터 검색 및 AI 추천 검토

본 문서는 robo5 콘텐츠 시스템의 최상위 헌법으로 사용한다.
