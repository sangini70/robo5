import type { PlannerInputKeywordEntry } from "../exporters";
import type { PromptBuilder } from "./prompt-builder.interface";
import type { PlannerPromptInput } from "./planner-prompt.types";

function toJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function formatKeyValueList(lines: Array<[string, string]>): string {
  return lines.map(([key, value]) => `- ${key}: ${value}`).join("\n");
}

function formatEvidenceBlock(title: string, value: unknown): string {
  return [`#### ${title}`, "", "```json", toJson(value), "```"].join("\n");
}

function getCollectedAt(entry: PlannerInputKeywordEntry): string {
  return entry.searchVolume?.collectedAt ?? entry.relatedKeywords?.collectedAt ?? entry.autocomplete?.collectedAt ?? entry.metadata.createdAt;
}

function getSource(entry: PlannerInputKeywordEntry): string {
  return entry.searchVolume?.source ?? entry.relatedKeywords?.source ?? entry.autocomplete?.source ?? "NAVER";
}

function buildKeywordSection(entry: PlannerInputKeywordEntry, index: number): string {
  const lines = [
    `### ${index + 1}. Keyword: ${entry.keyword}`,
    "",
    "#### Input Keyword",
    formatKeyValueList([
      ["keyword", entry.keyword],
      ["collectedAt", getCollectedAt(entry)],
      ["source", getSource(entry)],
      ["collectorVersion", entry.metadata.collectorVersion],
      ["validationVersion", entry.metadata.validationVersion],
    ]),
    "",
    formatEvidenceBlock("Metadata", entry.metadata),
    "",
    formatEvidenceBlock("Search Volume Evidence", entry.searchVolume),
    "",
    formatEvidenceBlock("Related Keyword Evidence", entry.relatedKeywords),
    "",
    formatEvidenceBlock("Autocomplete Evidence", entry.autocomplete),
  ];

  return lines.join("\n");
}

export class PlannerPromptBuilder implements PromptBuilder {
  build(input: PlannerPromptInput): string {
    const keywordSections = input.keywords.map((entry, index) => buildKeywordSection(entry, index)).join("\n\n");

    return [
      "# GEO Planner Input",
      "",
      "## 1. 역할",
      "",
      "GEO Planner는 검색 데이터를 그대로 콘텐츠 목록으로 바꾸지 않는다.",
      "검색량, 연관 키워드, 자동완성은 사용자의 질문과 수요를 발견하기 위한 Evidence로 사용한다.",
      "Question First",
      "Knowledge Always",
      "원칙을 적용한다.",
      "뉴스나 검색어 자체를 지식으로 취급하지 않는다.",
      "",
      "## 2. Collected Evidence",
      "",
      keywordSections,
      "",
      "## 3. Planner Task",
      "",
      "- 사용자 핵심 질문 발견",
      "- Search Intent 분류",
      "- Core Topic 판단",
      "- Knowledge Node 후보 설계",
      "- 질문형 Node와 Entity형 Node 구분",
      "- 중복유사 질문 통합",
      "- 학습 흐름 제안",
      "- Knowledge Network 관계 제안",
      "- 다음 단계에서 추가 조사해야 할 Evidence 구분",
      "",
      "## 4. Planner Rules",
      "",
      "- 검색량이 높다는 이유만으로 Node를 만들지 않는다.",
      "- 검색어를 그대로 제목 목록으로 복사하지 않는다.",
      "- 질문 해결 가능성이 있는 지식만 선택한다.",
      "- 검색 데이터에서 확인되는 사실과 Planner의 해석을 구분한다.",
      "- 아직 확인되지 않은 사실을 단정하지 않는다.",
      "- Writer용 최종 글을 작성하지 않는다.",
      "- Research 단계의 사실 조사까지 대신하지 않는다.",
      "- Planner 역할의 설계 결과만 출력한다.",
      "- Collected Evidence, Planner Task, Planner Rules를 서로 섞지 않는다.",
      "- Related Keywords와 Autocomplete의 원본 Evidence는 삭제하거나 요약하지 않는다.",
      "- 필요한 경우 원본 Evidence는 별도 참고 구조로 보존한다.",
      "- Search Evidence는 Planner 판단 자료이지 자동 Node 선정 규칙이 아니다.",
    ].join("\n");
  }
}
