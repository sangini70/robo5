# Generated JSON 장애 대응

> Incident Date: 2026-07-06

---

# 1. 사건 개요

## 현상

공개 사이트에서 글 목록이 0개로 표시되었다.

## 영향 범위

- 메인(/) 글 목록 비어 있음
- /en 페이지도 글 목록 비어 있음
- 상세 페이지가 404 또는 빈 페이지로 표시됨
- 관리자에서는 정상
- Firestore는 정상
- 공개 사이트만 장애 발생

---

# 2. 증상

대표 증상은 다음과 같았다.

- "등록된 글이 없습니다."
- Runtime JSON parse error
- Error reading posts.json

예시 로그

```
SyntaxError:
Expected property name or '}' at position 6
```

```
Error reading posts.json
```

---

# 3. 처음 의심했던 원인

초기에는 아래를 의심하였다.

- Firestore
- Next.js
- Runtime Cache
- Vercel
- sync-json

그러나 모두 직접 원인은 아니었다.

---

# 4. 실제 원인 (Root Cause)

GitHub main에 Commit된 Generated JSON 산출물(posts.json 및 detail JSON)에 Git Merge Conflict Marker가 포함되어 있었다.

실제 파일에는 아래 문자열이 존재하였다.

```text
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
```

이 때문에

```
JSON.parse()
```

가 실패하였고,

```
getPostsFromJson()
```

은 빈 배열([])을 반환하였다.

결과적으로 공개 사이트 글 목록이 모두 0개가 되었다.

---

# 5. 조사 과정

아래 순서대로 원인을 확인하였다.

## 1) Firestore 확인

- 관리자 글 정상 저장 확인
- Firestore 데이터 정상 확인

결론

- Firestore 문제 아님

---

## 2) getPostsFromJson() 확인

확인 내용

- public/data/posts.json을 fs.readFileSync()로 읽는 구조
- JSON.parse() 수행

결론

- 읽는 구조 정상

---

## 3) Runtime Log 확인

로그

```
Error reading posts.json
```

```
Expected property name or '}'
```

결론

- JSON 자체가 깨져 있음

---

## 4) GitHub posts.json 확인

GitHub main의

```
public/data/posts.json
```

첫 부분에서

```
<<<<<<<
=======
>>>>>>>
```

확인

결론

- Git Conflict Marker 존재

---

## 5) Git History 확인

Git History를 추적하여

Conflict Marker가 최초 포함된 Commit을 확인하였다.

조사 결과

```
build fixed
```

커밋에서 이미 Conflict Marker가 포함된 상태로 커밋되었다.

즉

GitHub Actions가 만든 것이 아니라

사람이 충돌 상태 그대로 Commit한 것이 원인이었다.

## 추가 확인: 상세 페이지 404 원인

posts.json 복구 후 글 목록은 정상화되었지만, 상세 페이지는 계속 404가 발생했다.

추가 조사 결과, 상세 페이지는 posts.json이 아니라 아래 detail JSON을 읽는다.

- public/data/ko/detail/*.json
- public/data/en/detail/*.json

해당 detail JSON에도 Git Conflict Marker가 남아 있어 JSON.parse가 실패했고, getPostDetail() 또는 getEnglishPost()가 null을 반환하면서 notFound()가 호출되었다.

따라서 상세 페이지 복구에는 posts.json뿐 아니라 detail JSON 전체 재생성이 필요하다.

---

# 6. 복구 절차

장애 발생 시 아래 순서로 복구한다.

1. npm run sync-json 실행
2. public/data/posts.json JSON.parse 확인
3. public/data/flow-index.json JSON.parse 확인
4. public/data/ko/detail/*.json 전체 Conflict Marker 검사
5. public/data/en/detail/*.json 전체 Conflict Marker 검사
6. detail JSON 전체 JSON.parse 확인
7. npm run build
8. Commit
9. Push
10. GitHub Actions 확인
11. Vercel Deploy 확인
12. 목록과 상세 페이지 모두 복구 확인

---

# 7. 재발 방지

Publish Workflow에는 아래 검사를 반드시 수행한다.

- Validate generated JSON files
- Conflict Marker 검사
- JSON.parse 검사
- Validation 통과 후 Commit

특히 아래 파일들은 Commit 전에 반드시 검사한다.

```
public/data/posts.json
public/data/flow-index.json
public/data/ko/detail/*.json
public/data/en/detail/*.json
```

---

# 8. Lessons Learned

이번 장애를 통해 확인한 내용

- Generated JSON도 운영 자산이다.
- GitHub main도 Source of Truth처럼 검증해야 한다.
- Runtime 로그를 먼저 확인하는 것이 가장 빠르다.
- JSON 생성보다 JSON 검증이 먼저다.
- Commit 전에 Conflict Marker 존재 여부를 반드시 확인한다.

---

# 9. 10분 장애 대응 체크리스트

같은 장애가 발생하면 아래 순서대로 확인한다.

1. Runtime 로그 확인
2. Error reading posts.json 확인
3. public/data/posts.json JSON.parse 확인
4. public/data/ko/detail/*.json 확인
5. public/data/en/detail/*.json 확인
6. <<<<<<< 검색
7. npm run sync-json
8. Build
9. Push
10. GitHub Actions/Vercel 확인

---

# 10. Root Cause Summary

이번 장애의 직접 원인은

GitHub main에 Commit된 Generated JSON(posts.json 및 detail JSON)에
Git Merge Conflict Marker가 포함된 상태로 Commit된 것이다.

따라서

- Firestore 문제가 아니었다.
- Next.js 문제가 아니었다.
- Vercel 문제가 아니었다.
- sync-json 생성 로직 문제가 아니었다.

직접 원인은

GitHub main에 Commit된 손상된 Generated JSON이었다.

---

# 11. 운영 원칙

앞으로 Generated JSON은 운영 자산으로 취급한다.

모든 Publish 전에

- JSON.parse
- Conflict Marker 검사
- Generated JSON Validation

을 반드시 수행한 후 Commit한다.


## Source of Truth

Firestore는 Source of Truth이며,
public/data/posts.json,
public/data/flow-index.json,
public/data/ko/detail/*.json,
public/data/en/detail/*.json
은 모두 Firestore로부터 생성되는 Generated JSON이다.

Generated JSON은 Source of Truth가 아니라 배포 산출물이며,
손상되거나 Conflict Marker가 포함된 경우에는
수동 수정하지 말고 반드시 npm run sync-json으로 다시 생성한다.


---

# Incident Summary

원인

- Git Merge Conflict Marker가 포함된 Generated JSON이 GitHub main에 Commit되었다.

영향

- 목록 페이지 0건
- 상세 페이지 404

복구

- npm run sync-json으로 Generated JSON 전체 재생성
- Build
- Push
- GitHub Actions
- Vercel

재발 방지

- Generated JSON Validation
- Conflict Marker 검사
- JSON.parse 검사