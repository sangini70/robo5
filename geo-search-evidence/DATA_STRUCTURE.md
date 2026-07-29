# DATA_STRUCTURE.md

# GEO Search Evidence Collector

Version 1.0

---

# Purpose

이 문서는 GEO Search Evidence Collector가 생성하는 모든 데이터의 구조를 정의한다.

모든 Collector는 이 문서의 구조를 따라야 한다.

새로운 Source가 추가되어도 동일한 Data Structure를 유지한다.

---

# Data Philosophy

Search Evidence는 원본(Raw Data)을 우선한다.

Collector는 데이터를 해석하지 않는다.

모든 Evidence는 Source를 추적할 수 있어야 한다.

---

# Root Structure

```
Evidence/

    keyword/

        metadata.json

        search_volume.json

        related_keywords.json

        autocomplete.json

        people_also_search.json

        popular_topics.json

        serp_urls.json
```

---

# Keyword Folder

각 Keyword는 하나의 독립 폴더를 가진다.

예시

```
Evidence/

exchange-rate/

bitcoin-tax/

nasdaq/

etf/
```

---

# metadata.json

프로젝트 메타데이터

예시

```json
{
  "keyword": "exchange-rate",
  "language": "ko",
  "country": "KR",
  "createdAt": "",
  "updatedAt": "",
  "collectorVersion": "0.1.0"
}
```

---

# search_volume.json

검색량 데이터

```json
{
  "keyword": "환율",
  "monthlyPc": 0,
  "monthlyMobile": 0,
  "source": "NAVER"
}
```

---

# related_keywords.json

연관 키워드

```json
[
  {
    "keyword": "",
    "pc": 0,
    "mobile": 0
  }
]
```

---

# autocomplete.json

자동완성

```json
[
    "환율 계산",
    "환율 전망",
    "환율 계산기"
]
```

---

# people_also_search.json

많이 찾는 검색어

```json
[
    "원달러 환율",
    "실시간 환율"
]
```

---

# popular_topics.json

인기 Topic

```json
[
    "미국 금리",
    "달러 강세"
]
```

---

# serp_urls.json

검색 결과 URL

```json
[
    {
        "rank": 1,
        "title": "",
        "url": "",
        "domain": ""
    }
]
```

---

# Common Fields

모든 JSON은 가능한 경우 다음 필드를 포함한다.

```json
{
    "source": "",
    "collectedAt": "",
    "collectorVersion": ""
}
```

---

# Naming Rules

파일명은 모두 소문자를 사용한다.

snake_case를 사용한다.

예시

```
search_volume.json

related_keywords.json

people_also_search.json
```

---

# Character Encoding

UTF-8

---

# Date Format

ISO-8601

예시

```
2026-08-01T14:20:31Z
```

---

# Source Rule

모든 Evidence는

반드시 Source를 기록한다.

예시

```
NAVER

Google

Bing

Reddit

YouTube
```

---

# Version Rule

Data Format이 변경되면

collectorVersion을 증가시킨다.

---

# Future Extension

향후 추가 가능

```
reddit_posts.json

youtube_videos.json

google_trends.json

news_articles.json
```

기존 구조는 변경하지 않는다.

새로운 Evidence 파일만 추가한다.

확장 시 기존 파일을 수정하지 않는다"

기존 스키마를 깨지 않고 새로운 Evidence를 파일 단위로 확장한다.