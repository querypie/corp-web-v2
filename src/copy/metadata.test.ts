import { describe, expect, it } from "vitest";

import {
  getAboutUsMetadataDescription,
  getAboutUsMetadataTitle,
  getCertificationsMetadataDescription,
  getCertificationsMetadataTitle,
  getNewsPageCopy,
} from "./company";
import { getContactPageCopy } from "./contact";
import { getHomeMetadataDescription, getHomeMetadataTitle } from "./homeMetadata";

describe("metadata copy", () => {
  it("홈 메타데이터를 locale별로 반환한다", () => {
    expect(getHomeMetadataTitle()).toBe("QueryPie AI");
    expect(getHomeMetadataDescription("en")).toContain("Agentic AI Platform for Enterprises");
    expect(getHomeMetadataDescription("ko")).toContain("엔터프라이즈 기업을 위한 Agentic AI Platform");
    expect(getHomeMetadataDescription("ja")).toContain("エンタープライズ向け Agentic AI Platform");
  });

  it("회사 소개 메타데이터를 locale별로 반환한다", () => {
    expect(getAboutUsMetadataTitle("ko")).toBe("회사 소개");
    expect(getAboutUsMetadataDescription("ko")).toContain("엔터프라이즈 AI 전환");
    expect(getAboutUsMetadataTitle("ja")).toBe("会社概要");
    expect(getAboutUsMetadataDescription("ja")).toContain("エンタープライズ AI");
  });

  it("인증 메타데이터를 locale별로 반환한다", () => {
    expect(getCertificationsMetadataTitle("ko")).toBe("QueryPie AI 인증");
    expect(getCertificationsMetadataDescription("ko")).toContain("보안");
    expect(getCertificationsMetadataTitle("ja")).toBe("QueryPie AI: 認証");
    expect(getCertificationsMetadataDescription("ja")).toContain("セキュリティ");
  });

  it("뉴스 메타데이터를 locale별로 반환한다", () => {
    expect(getNewsPageCopy("ko").metadataTitle).toBe("QueryPie 뉴스");
    expect(getNewsPageCopy("ko").metadataDescription).toContain("최신 뉴스");
    expect(getNewsPageCopy("ja").metadataTitle).toBe("QueryPie: ニュース");
    expect(getNewsPageCopy("ja").metadataDescription).toContain("最新ニュース");
  });

  it("문의 메타데이터를 locale별로 반환한다", () => {
    expect(getContactPageCopy("ko").metadataTitle).toBe("QueryPie 문의");
    expect(getContactPageCopy("ko").formDescription).toContain("제품 상담");
    expect(getContactPageCopy("ja").metadataTitle).toBe("QueryPie: お問い合わせ");
    expect(getContactPageCopy("ja").formDescription).toContain("製品相談");
  });
});
