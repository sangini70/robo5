좋다. 지금은 **원인 분석 결과문이 아니라 Codex가 저장소를 조사할 때 기준으로 삼을 Evidence 문서**를 만드는 것이 맞다.

아래를 그대로 복사해서 루트에 예를 들어 **`FIRESTORE_QUERY_INSIGHTS_EVIDENCE.md`**로 저장하면 된다.

````markdown
# FIRESTORE QUERY INSIGHTS EVIDENCE

Status: Observed Evidence
Last Updated: 2026-08-15
Source: Firebase Console > Firestore > Query Insights

---

# 1. 목적

Firestore `/posts` 컬렉션에서 발생한 높은 Read operations의 원인을 추적하기 위해
Firebase Query Insights에서 실제 관측된 Query fingerprint를 기록한다.

이 문서는 원인 확정 문서가 아니다.

이 문서의 목적은 다음과 같다.

- 실제 운영 환경에서 관측된 Query fingerprint 보존
- 각 Query의 실행량과 Read operations 확인
- Repository 코드와 Query fingerprint 대조
- 반복 호출 경로 추적
- 수정 전 원인 확정을 위한 Evidence 제공

중요:

> Query Insights에서 관측된 수치를 근거 없이 특정 코드의 책임으로 단정하지 않는다.

> 반환 문서 수, LIMIT 값, PageSize 값만으로 실제 Firestore Read operations를 추정하지 않는다.

> 각 Query fingerprint와 Repository의 실제 호출 경로를 먼저 대조한다.

---

# 2. 조사 원칙

이번 조사는 다음 순서를 따른다.

```text
Query Insights Evidence
↓
Query fingerprint 식별
↓
Repository 검색
↓
실제 호출 코드 식별
↓
호출 주체 식별
↓
호출 빈도 및 실행 조건 확인
↓
Observed Evidence와 코드 동작 비교
↓
원인 확정
↓
수정 범위 결정
````

원인 확정 전 코드 수정 금지.

특히 다음을 추측만으로 수정하지 않는다.

* sync-json
* 관리자 Posts
* slug 중복 검사
* 예약 발행 처리
* 관리자 검색
* pagination
* GitHub Actions
* cron
* 기타 Firestore 호출

---

# 3. Measurement Windows

이번 조사에서 다음 기간의 Query Insights를 확인하였다.

## 3.1 최근 30일

장기간 반복되는 구조적 Query 패턴을 확인하기 위한 핵심 Evidence이다.

30일 화면에서는 총 10개의 Query fingerprint가 관측되었다.

## 3.2 최근 7일

최근에도 동일하거나 유사한 Query가 지속되는지 확인하기 위한 보강 Evidence이다.

## 3.3 최근 24시간

기존 조사에서 일부 Evidence를 확보했으나,
현재 원인 역추적의 핵심 기준은 30일 + 7일 데이터로 한다.

24시간 데이터는 향후 수정 완료 후
Read operations 감소 여부를 확인하는 검증 Window로 활용하는 것을 우선한다.

---

# 4. 30일 Query Insights

30일 화면에서 총 10개의 Query fingerprint가 관측되었다.

아래 Query 문자열은 Firebase Query Insights에서 직접 확인한 문자열이다.

---

## Q1

```text
COLLECTION /posts SELECT __none__ PageSize 300
```

---

# 14. Admin Posts ORDER_BY 복합 index 적용 후 최종 Evidence

## 14.1 대상 Query

```text
Fingerprint: 6324825015449602801

COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
LIMIT 10
```

현재 Admin Posts 첫 페이지의 다음 코드 경로와 대응한다.

```text
GET /api/admin/posts?limit=10
→ listFirestorePosts({ pageSize: 10 })
→ Firestore /posts runQuery
→ ORDER_BY updatedAt DESC, __name__ DESC
→ LIMIT 10
```

관련 코드: `app/api/admin/posts/route.ts`

## 14.2 Production 복합 index

Production에 다음 복합 index가 생성되었다.

```text
collectionGroup: posts
queryScope: COLLECTION
fields:
  - updatedAt DESCENDING
  - __name__ DESCENDING
```

Repository 기록:

* `firestore.indexes.json`
* `firebase.json`

## 14.3 index 적용 전 누적 상태

동일 fingerprint의 과거 누적 Query Insights 값:

```text
Executions: 12
Read operations: 6,616
Average documents scanned: 105.833
Average returned results: 10
Scanned documents / returned results: 10.58
```

이는 12회 누적 평균이며, 개별 실행의 정확한 scan 수를 의미하지 않는다.

## 14.4 index 적용 후 추가 실행

추가 3회 실행이 반영된 후:

```text
Executions: 15
Read operations: 6,775
Average documents scanned: 86.667
Average returned results: 10
Scanned documents / returned results: 8.67
```

변화량:

```text
Executions: 12 → 15 = +3
Read operations: 6,616 → 6,775 = +159
```

새 3회 실행의 평균 Read operations:

```text
159 / 3 = 53 per execution
```

## 14.5 documents scanned 역산

기존 누적 scan 추정:

```text
105.833 × 12 ≈ 1,270
```

변경 후 누적 scan 추정:

```text
86.667 × 15 ≈ 1,300
```

증가량은 약 30 documents scanned이며, 새 3회 실행의 평균은 다음과 같다.

```text
약 30 / 3 = 약 10 documents scanned per execution
```

새 실행의 결과는 실행당 10개로 유지되었다.

따라서 index 적용 후 관찰된 추가 실행에서는:

```text
LIMIT 10
→ 약 10 documents scanned
→ 10 results returned
```

으로 scan amplification이 제거된 것으로 확인된다.

## 14.6 Read operations 해석

과거 누적 평균:

```text
6,616 / 12 ≈ 551.3 Read operations per execution
```

새 추가 실행 평균:

```text
159 / 3 = 53 Read operations per execution
```

Read operations는 약 90% 감소한 수준이다.

단, `53 Read operations`를 Firestore document reads 53건이라고 단정하지 않는다. Query Insights의 Read operations와 returned documents는 동일 지표가 아니다.

## 14.7 Cursor pagination Query와의 구분

다음 cursor Query는 별도 fingerprint다.

```text
Fingerprint: -1435267363448109727

COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
START_AFTER (?, ?)
LIMIT 10
```

관찰값:

```text
Executions: 5
Read operations: 320
Average documents scanned: 10
Average index entries read: 10
Average returned results: 10
Scanned / returned: 1.00
```

이는 Admin Posts 후속 페이지 Query이며, 첫 페이지 fingerprint `6324825015449602801`과 혼동하지 않는다.

## 14.8 최종 판정

### CONFIRMED

Production의 `posts` 복합 index:

```text
updatedAt DESC
__name__ DESC
```

가 Admin Posts `ORDER_BY ... LIMIT 10` Query의 scan 범위를 실질적으로 감소시켰다.

새 index 적용 후 추가 실행에서 약 10 documents scanned와 10 results returned가 확인되었고, Query Insights Read operations도 과거 누적 평균 약 551.3에서 새 실행 평균 53 수준으로 감소했다.

따라서 복합 index가 scan amplification을 제거한 효과는 **CONFIRMED**다.

### NOT FULLY EXPLAINED

과거 651 또는 551 Read operations가 정확히 어떤 내부 billing 구성으로 계산되었는지는 완전히 규명되지 않았다.

다음 두 명제는 분리한다.

1. 복합 index가 scan amplification을 제거했다. **CONFIRMED**
2. 과거 Read operations의 정확한 내부 billing 구성은 무엇인가. **NOT FULLY EXPLAINED**

Observed metrics:

* Executions: 1
* Read operations: 701
* Average latency: 246 ms
* Errors: 0
* Average scanned documents: 121
* Average scanned index entries: 125
* Average returned results: 121

비고:

일반적인 애플리케이션 Query인지,
Firebase Console 또는 기타 관리 작업에서 발생한 Query인지 아직 확정하지 않는다.

---

## Q2

```text
COLLECTION /posts/* SELECT __collection__ PageSize 300
```

Observed metrics:

* Executions: 1
* Read operations: 1
* Average latency: 18 ms
* Errors: 0
* Average scanned documents: 3
* Average scanned index entries: 3
* Average returned results: 0

비고:

정확한 호출 주체 미확정.

---

## Q3

```text
COLLECTION /posts
WHERE (publishDate > ? AND publishDate <= ?)
ORDER_BY publishDate ASC
LIMIT 1
```

Observed metrics:

* Executions: 50
* Read operations: 26,261
* Average latency: 16 ms
* Errors: 8
* Average scanned documents: 101.1
* Average scanned index entries: 0
* Average returned results: 0.04

특이사항:

* LIMIT 1임에도 Read operations가 크게 관측됨.
* 반환 평균 결과는 0.04로 매우 작음.
* 실행 50회 중 오류 8회가 관측됨.
* `publishDate` 기반 예약 발행 또는 발행 시각 관련 코드와 연관 가능성은 조사 대상이지만 아직 확정하지 않는다.

Repository에서 정확한 생성 코드와 호출 주기를 확인한다.

---

## Q4

```text
COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
LIMIT 10
```

Observed metrics:

* Executions: 197
* Read operations: 93,646
* Average latency: 15 ms
* Errors: 14
* Average scanned documents: 94.736
* Average scanned index entries: 0
* Average returned results: 9.289
* Average scanned documents / returned result: 10.20

특이사항:

관리자 Posts 목록 또는 유사한 최신 글 조회 코드와의 연관 가능성을 조사한다.

단, UI 용도를 추측하여 원인으로 확정하지 않는다.

---

## Q5

```text
COLLECTION /posts PageSize 1000
```

Observed metrics:

* Executions: 1,465
* Read operations: 473,026
* Average latency: 15 ms
* Errors: 40
* Average scanned documents: 66.676
* Average scanned index entries: 0
* Average returned results: 66.676
* Average scanned documents / returned result: 1.00

특이사항:

30일 Evidence에서 매우 높은 실행 횟수와 Read operations가 관측된다.

현재 조사에서 최우선 역추적 대상 중 하나이다.

다음 가능성을 모두 조사하되 사전에 어느 하나로 단정하지 않는다.

* collection 전체 조회
* 관리자 Posts
* sync-json
* migration 또는 관리 script
* API
* server-side 작업
* scheduled job
* 기타 `/posts` 전체 조회 경로

---

## Q6

```text
COLLECTION /posts WHERE slug = ?
```

Observed metrics:

* Executions: 34
* Read operations: 20,822
* Average latency: 13 ms
* Errors: 0
* Average scanned documents: 119.412
* Average scanned index entries: 0
* Average returned results: 0.176
* Average scanned documents / returned result: 676.67

특이사항:

`WHERE slug = ?`와 아래의 `WHERE slug = ? LIMIT 1`은
Query Insights에서 별도의 fingerprint로 관측되었다.

두 Query를 하나로 취급하지 않는다.

---

## Q7

```text
COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
START_AFTER (?, ?)
LIMIT 10
```

Observed metrics:

* Executions: 13
* Read operations: 5,330
* Average latency: 11 ms
* Errors: 0
* Average scanned documents: 84
* Average scanned index entries: 0
* Average returned results: 9.462
* Average scanned documents / returned result: 8.88

특이사항:

Q4와 함께 pagination 계열 Query일 가능성을 조사한다.

Q4와 Q7의 실제 코드 경로 및 pagination 동작을 대조한다.

---

## Q8

```text
COLLECTION /posts WHERE slug = ? LIMIT 1
```

Observed metrics:

* Executions: 1,031
* Read operations: 227,080
* Average latency: 7 ms
* Errors: 128
* Average scanned documents: 45.811
* Average scanned index entries: 0
* Average returned results: 0.876
* Average scanned documents / returned result: 52.30

특이사항:

30일 Evidence에서 매우 중요한 fingerprint이다.

특히:

* 1,031 executions
* 227,080 Read operations
* 128 errors

가 관측되었다.

다음 호출 경로를 우선 조사한다.

* slug availability 검사
* 신규 글 저장
* 기존 글 수정
* slug 중복 검사
* API endpoint
* 자동화 작업
* 기타 slug lookup

단, 위 목록은 조사 후보이며 원인 확정이 아니다.

---

## Q9

```text
COLLECTION * SELECT __collection__ PageSize 300
```

Observed metrics:

* Executions: 6
* Read operations: 1
* Average latency: 3 ms
* Errors: 5
* Average scanned documents: 0.5
* Average scanned index entries: 0.5
* Average returned results: 0.5

비고:

애플리케이션 핵심 Read 증가 원인인지 여부는 아직 확인되지 않았다.

---

## Q10

```text
COLLECTION /posts ORDER_BY updatedAt desc PageSize 10
```

Observed metrics:

* Executions: 4
* Read operations: 0
* Average latency: 0 ms
* Errors: 4
* Average scanned documents: 0
* Average scanned index entries: 0
* Average returned results: 0

비고:

Q4와 문자열 형태가 다르므로 별도의 fingerprint로 보존한다.

---

# 5. 최근 7일 Evidence

7일 Query Insights에서도 주요 `/posts` Query fingerprint가 반복 관측되었다.

확인된 주요 문자열:

```text
COLLECTION /posts SELECT __none__ PageSize 300
```

```text
COLLECTION /posts/* SELECT __collection__ PageSize 300
```

```text
COLLECTION /posts
WHERE (publishDate > ? AND publishDate <= ?)
ORDER_BY publishDate ASC
LIMIT 1
```

```text
COLLECTION /posts PageSize 1000
```

```text
COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
LIMIT 10
```

```text
COLLECTION /posts WHERE slug = ?
```

```text
COLLECTION /posts WHERE slug = ? LIMIT 1
```

```text
COLLECTION * SELECT __collection__ PageSize 300
```

따라서 주요 Query가 단순히 과거 한 시점에만 발생한 것이 아니라
최근 기간에도 관측되고 있다는 점을 Evidence로 보존한다.

---

# 6. 기존 24시간 Evidence

2026-08-13 ~ 2026-08-14 측정 Window에서 다음 Query들이 관측되었다.

## publishDate range

```text
COLLECTION /posts
WHERE publishDate > ?
AND publishDate <= ?
ORDER_BY publishDate ASC
LIMIT 1
```

* Executions: 20
* Read operations: 10,129

## PageSize 1000

```text
COLLECTION /posts PageSize 1000
```

* Executions: 18
* Read operations: 4,384

## slug query

```text
COLLECTION /posts WHERE slug = ?
```

* Executions: 10
* Read operations: 6,270

## updatedAt query

```text
COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
LIMIT 10
```

* Executions: 19
* Read operations: 5,629

## slug query + LIMIT 1

```text
COLLECTION /posts WHERE slug = ? LIMIT 1
```

* Executions: 24
* Read operations: 4,300

주의:

24시간 수치와 7일/30일 수치를 단순 합산하지 않는다.

각 Measurement Window는 서로 중첩될 수 있다.

---

# 7. 현재 Evidence에서 확인된 사실

현재 확정 가능한 것은 다음뿐이다.

1. `/posts`에서 여러 종류의 Query fingerprint가 실제 운영 환경에서 관측되었다.

2. 높은 Reads는 단일 Query fingerprint만으로 설명되지 않는다.

3. 특히 30일 기준 다음 두 fingerprint는 실행량과 Read operations가 매우 크다.

```text
COLLECTION /posts PageSize 1000
```

```text
COLLECTION /posts WHERE slug = ? LIMIT 1
```

4. 다음 Query 역시 상당한 Read operations가 관측된다.

```text
COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
LIMIT 10
```

5. 다음 Query는 LIMIT 1이고 반환 결과가 매우 적음에도 높은 Reads가 관측된다.

```text
COLLECTION /posts
WHERE (publishDate > ? AND publishDate <= ?)
ORDER_BY publishDate ASC
LIMIT 1
```

6. `WHERE slug = ?`와 `WHERE slug = ? LIMIT 1`은 서로 다른 fingerprint이다.

7. `updatedAt` Query 역시 첫 페이지 Query와 `START_AFTER` pagination Query가 별도 fingerprint로 존재한다.

8. Reads 급증을 sync-json 하나의 원인으로 확정할 Evidence는 현재 없다.

9. LIMIT 또는 반환 문서 수만 보고 실제 Read operations를 추정해서는 안 된다.

---

# 8. 아직 확정되지 않은 사항

다음은 아직 미확정이다.

* 각 Query fingerprint를 생성하는 정확한 Repository 코드 경로
* 각 Query를 호출하는 UI / API / server / script / automation
* 동일 Query의 반복 호출 원인
* PageSize 1000의 1,465 executions 발생 원인
* `slug = ? LIMIT 1`의 1,031 executions 발생 원인
* 각 Query의 오류 발생 원인
* GitHub Actions와 Query 실행 시각의 상관관계
* sync-json의 실제 기여량
* 관리자 Posts의 실제 기여량
* 예약 발행 로직의 실제 기여량
* slug availability 로직의 실제 기여량
* Query별 비용 기여도
* 최종 수정 대상

---

# 9. Codex 조사 지시

이 문서를 Evidence Source로 사용한다.

먼저 프로젝트 루트의 운영 규칙 문서를 읽고 해당 규칙을 우선 적용한다.

이번 단계에서는 코드를 수정하지 않는다.

## 조사 목표

위 Query fingerprint 각각을 Repository에서 역추적하여
실제 호출 코드를 식별한다.

다음 순서로 조사한다.

### Priority A

```text
COLLECTION /posts PageSize 1000
```

```text
COLLECTION /posts WHERE slug = ? LIMIT 1
```

### Priority B

```text
COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
LIMIT 10
```

```text
COLLECTION /posts
WHERE (publishDate > ? AND publishDate <= ?)
ORDER_BY publishDate ASC
LIMIT 1
```

### Priority C

```text
COLLECTION /posts WHERE slug = ?
```

```text
COLLECTION /posts
ORDER_BY updatedAt DESC, __name__ DESC
START_AFTER (?, ?)
LIMIT 10
```

나머지 fingerprint도 호출 경로가 확인되는 범위에서 조사한다.

---

# 10. Codex가 확인할 항목

각 fingerprint별로 다음을 보고한다.

```text
Query fingerprint

Repository file path

Function / handler name

Firestore query construction code

Caller

Trigger

Execution condition

Expected invocation frequency

Potential repeated-call path

Observed Evidence와 코드 동작의 일치 여부

확정 가능한 사실

아직 추정인 사항
```

가능하면 line number도 함께 기록한다.

동일 fingerprint를 여러 코드 경로가 생성할 수 있다면
모든 후보를 기록한다.

---

# 11. 금지 사항

이번 단계에서는 다음을 하지 않는다.

* 코드 수정
* Query 변경
* index 변경
* pagination 변경
* sync-json 변경
* cron 변경
* GitHub Actions 변경
* slug 로직 변경
* 관리자 Posts 변경
* 새로운 최적화 기능 추가
* Evidence 없이 원인 확정

조사 결과만 보고한다.

---

# 12. 다음 단계

Codex 조사 결과를 받은 후 다음 절차로 진행한다.

```text
Observed Query Insights
        +
Repository Trace
        ↓
Query → Code mapping
        ↓
호출 빈도/조건 분석
        ↓
Root Cause 후보 분리
        ↓
원인 확정
        ↓
최소 수정 범위 결정
        ↓
코드 수정
        ↓
build / diff / status
        ↓
Production 확인
        ↓
수정 후 24시간 Query Insights 비교
```

수정 후에는 새로운 24시간 Window를 확보하여
수정 전 Evidence와 비교한다.

---

# 13. 핵심 원칙

> 지금 필요한 것은 최적화가 아니라 원인 확정이다.

> Query Insights의 숫자와 Repository의 실제 코드를 연결하기 전에는 수정하지 않는다.

> 하나의 높은 Read Query가 발견되었다고 해서 다른 Query를 무시하지 않는다.

> Query fingerprint별 호출 경로를 분리하여 조사한다.

```

### 사실 확인 리스트

- [x] 30일 화면의 **10개 Query 행을 별도로 보존**
- [x] 7일 Evidence 반영
- [x] 기존 24시간 Evidence 반영
- [x] `slug = ?`와 `slug = ? LIMIT 1` 분리
- [x] `updatedAt LIMIT 10`과 `START_AFTER` 분리
- [x] 측정 기간이 중첩되므로 수치 합산 금지 명시
- [x] 원인 확정 전 수정 금지
- [x] Codex의 다음 작업을 **분석·역추적만**으로 제한
- [ ] 실제 Repository 코드와 fingerprint mapping은 Codex 조사 후 확정

이 문서는 지금 상태에서 **바로 루트에 넣어 Codex에게 읽히는 Evidence 문서**로 쓰면 된다. 
```
