import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { issueLicense } from "./license-service";

const ENDPOINT = "https://api.deskpie.example/api/v1/public/community-licenses";
const API_KEY = "test-api-key";

describe("issueLicense", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("환경변수 미설정 시 skip", () => {
    it("ENDPOINT와 KEY 모두 없으면 {status:'skip'}을 반환한다", async () => {
      const result = await issueLicense("TestOrg", "test@example.com");
      expect(result).toEqual({ status: "skip" });
    });

    it("ENDPOINT만 없어도 skip을 반환한다", async () => {
      vi.stubEnv("PUBLIC_API_KEY", API_KEY);
      const result = await issueLicense("TestOrg", "test@example.com");
      expect(result).toEqual({ status: "skip" });
    });

    it("KEY만 없어도 skip을 반환한다", async () => {
      vi.stubEnv("DESKPIE_COMMUNITY_LICENSE_API_ENDPOINT", ENDPOINT);
      const result = await issueLicense("TestOrg", "test@example.com");
      expect(result).toEqual({ status: "skip" });
    });
  });

  describe("필수 파라미터 검증", () => {
    beforeEach(() => {
      vi.stubEnv("DESKPIE_COMMUNITY_LICENSE_API_ENDPOINT", ENDPOINT);
      vi.stubEnv("PUBLIC_API_KEY", API_KEY);
    });

    it("organization이 없으면 throw한다", async () => {
      await expect(issueLicense(undefined, "test@example.com")).rejects.toThrow(
        "Missing required parameters",
      );
    });

    it("requestedBy가 없으면 throw한다", async () => {
      await expect(issueLicense("TestOrg", undefined)).rejects.toThrow(
        "Missing required parameters",
      );
    });
  });

  describe("API 호출", () => {
    beforeEach(() => {
      vi.stubEnv("DESKPIE_COMMUNITY_LICENSE_API_ENDPOINT", ENDPOINT);
      vi.stubEnv("PUBLIC_API_KEY", API_KEY);
    });

    it("API 성공 시 {status:'success'}를 반환한다", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: true, errorMessage: "" }),
      } as Response);

      const result = await issueLicense("TestOrg", "test@example.com");
      expect(result).toEqual({ status: "success" });
    });

    it("올바른 엔드포인트와 헤더로 요청한다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: true, errorMessage: "" }),
      } as Response);

      await issueLicense("TestOrg", "test@example.com");

      expect(fetchSpy).toHaveBeenCalledWith(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ organization: "TestOrg", requestedBy: "test@example.com" }),
      });
    });

    it("HTTP 응답이 ok가 아니면 throw한다", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);

      await expect(issueLicense("TestOrg", "test@example.com")).rejects.toThrow(
        "Failed to issue license: 500",
      );
    });

    it("201 응답 body와 무관하게 성공한다", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ licenseId: "license-id", customerCompanyId: "company-id" }),
      } as Response);

      await expect(issueLicense("TestOrg", "test@example.com")).resolves.toEqual({
        status: "success",
      });
    });
  });
});
