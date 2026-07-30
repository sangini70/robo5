# GEO Planner Input

## 1. Issue

단일종목 레버리지 기본예탁금 상향

## 2. Role

GEO Planner does not turn search data directly into a content outline.
Search volume, related keywords, and autocomplete are evidence for discovering user questions and demand.
Question First
Knowledge Always
apply these principles.
Do not treat news or search terms themselves as knowledge.

## 3. Collected Evidence

### 1. Keyword: 기본예탁금

#### Input Keyword
- keyword: 기본예탁금
- collectedAt: 2026-07-30T17:34:57.422Z
- source: NAVER
- collectorVersion: 0.1.0
- validationVersion: 0.1.0

#### Metadata

```json
{
  "keyword": "기본예탁금",
  "createdAt": "2026-07-30T17:17:34.709Z",
  "updatedAt": "2026-07-30T17:34:57.548Z",
  "collectorVersion": "0.1.0",
  "validationVersion": "0.1.0"
}
```

#### Search Volume Evidence

```json
{
  "keyword": "기본예탁금",
  "searchVolume": {
    "keyword": "기본예탁금",
    "monthlyPc": 490,
    "monthlyMobile": 1620,
    "source": "NAVER"
  },
  "source": "NAVER",
  "collectedAt": "2026-07-30T17:34:57.422Z"
}
```

#### Related Keyword Evidence

```json
{
  "keyword": "기본예탁금",
  "relatedKeywords": [
    {
      "keyword": "기본예탁금",
      "monthlyPc": 490,
      "monthlyMobile": 1620,
      "source": "NAVER"
    }
  ],
  "source": "NAVER",
  "collectedAt": "2026-07-30T17:34:57.465Z"
}
```

#### Autocomplete Evidence

```json
{
  "keyword": "기본예탁금",
  "suggestions": [
    "레버리지 기본예탁금",
    "기본예탁금",
    "기본예탁금 부족",
    "레버리지 etf 기본예탁금",
    "기본예탁금 뜻",
    "기본예탁금 충족",
    "기본예탁금 기준",
    "삼성증권 기본예탁금",
    "기본예탁금 충족 계좌",
    "etf 기본 예탁금"
  ],
  "source": "NAVER",
  "collectedAt": "2026-07-30T17:34:57.509Z"
}
```

## 4. Planner Task

- Discover the user's core question
- Classify search intent
- Judge the core topic
- Design candidate knowledge nodes
- Separate question-shaped nodes from entity-shaped nodes
- Merge duplicate or near-duplicate questions
- Propose a learning flow
- Propose knowledge network relationships
- Distinguish evidence that needs additional research next

## 5. Planner Rules

- Do not create nodes only because search volume is high.
- Do not copy search terms into title lists verbatim.
- Select only knowledge that can solve a question.
- Keep facts seen in the evidence separate from Planner interpretation.
- Do not assert facts that are not yet confirmed.
- Do not write the final article for the Writer.
- Do not replace the Research stage.
- Output only the Planner design result.
- Keep Collected Evidence, Planner Task, and Planner Rules separate.
- Do not delete or summarize the raw Related Keywords and Autocomplete evidence.
- Preserve raw evidence in a separate reference structure when needed.
- Search Evidence is a planning signal, not an automatic node selection rule.
