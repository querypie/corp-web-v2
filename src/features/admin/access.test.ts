import { describe, expect, it } from "vitest";
import { isAdminPath, isLocalAdminHost, shouldBlockAdminAccess } from "./access";

describe("isAdminPath", () => {
  it("admin 화면과 API 경로를 인식한다", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/news")).toBe(true);
    expect(isAdminPath("/api/admin/content/state")).toBe(true);
  });

  it("admin이 아닌 경로는 제외한다", () => {
    expect(isAdminPath("/en/admin")).toBe(false);
    expect(isAdminPath("/administrator")).toBe(false);
    expect(isAdminPath("/api/downloads/content")).toBe(false);
  });
});

describe("isLocalAdminHost", () => {
  it("포트와 무관한 로컬 host를 허용한다", () => {
    expect(isLocalAdminHost("localhost")).toBe(true);
    expect(isLocalAdminHost("LOCALHOST")).toBe(true);
    expect(isLocalAdminHost("127.0.0.1")).toBe(true);
    expect(isLocalAdminHost("127.0.1.1")).toBe(true);
    expect(isLocalAdminHost("::1")).toBe(true);
    expect(isLocalAdminHost("0.0.0.0")).toBe(true);
  });

  it("배포 host는 로컬로 보지 않는다", () => {
    expect(isLocalAdminHost("stage-v2.querypie.com")).toBe(false);
    expect(isLocalAdminHost("www-v2.querypie.com")).toBe(false);
    expect(isLocalAdminHost("cms-git-preview.vercel.app")).toBe(false);
  });
});

describe("shouldBlockAdminAccess", () => {
  it("로컬이 아닌 admin 접근만 차단한다", () => {
    expect(shouldBlockAdminAccess("/admin/news", "stage-v2.querypie.com")).toBe(true);
    expect(shouldBlockAdminAccess("/api/admin/content/state", "www-v2.querypie.com")).toBe(true);
    expect(shouldBlockAdminAccess("/admin/news", "localhost")).toBe(false);
    expect(shouldBlockAdminAccess("/en/features/demo", "stage-v2.querypie.com")).toBe(false);
  });
});
