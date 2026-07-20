import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  headers: vi.fn(),
}));

vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

import PlansProductRoute from "./page";

describe("PlansProductRoute", () => {
  const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);

  beforeEach(() => {
    mocks.headers.mockResolvedValue(new Headers());
    consoleInfo.mockClear();
  });

  it("uses ip-country query string before the Vercel country header for AIP", async () => {
    mocks.headers.mockResolvedValue(new Headers({ "x-vercel-ip-country": "JP" }));

    const page = await PlansProductRoute({
      params: Promise.resolve({ locale: "en", product: "aip" }),
      searchParams: Promise.resolve({ "ip-country": "vn" }),
    });

    expect(page.props).toMatchObject({
      enterpriseOnly: true,
      productKey: "aip",
    });
    expect(page.props.productHrefOverrides).toBeUndefined();
    expect(consoleInfo).toHaveBeenCalledWith("[plans/aip] country detection", {
      ipCountryQuery: "vn",
      resolvedCountry: "VN",
      xVercelIpCountry: "JP",
    });
  });

  it("uses the Vercel country header when no query override is present", async () => {
    mocks.headers.mockResolvedValue(new Headers({ "x-vercel-ip-country": "TH" }));

    const page = await PlansProductRoute({
      params: Promise.resolve({ locale: "en", product: "aip" }),
      searchParams: Promise.resolve({}),
    });

    expect(page.props).toMatchObject({ enterpriseOnly: true, productKey: "aip" });
    expect(consoleInfo).toHaveBeenCalledWith("[plans/aip] country detection", {
      ipCountryQuery: null,
      resolvedCountry: "TH",
      xVercelIpCountry: "TH",
    });
  });

  it("keeps standard AIP plans when a non-target query country overrides a target header", async () => {
    mocks.headers.mockResolvedValue(new Headers({ "x-vercel-ip-country": "TH" }));

    const page = await PlansProductRoute({
      params: Promise.resolve({ locale: "en", product: "aip" }),
      searchParams: Promise.resolve({ "ip-country": "JP" }),
    });

    expect(page.props).toMatchObject({ productKey: "aip" });
    expect(page.props.enterpriseOnly).toBeUndefined();
    expect(consoleInfo).toHaveBeenCalledWith("[plans/aip] country detection", {
      ipCountryQuery: "JP",
      resolvedCountry: "JP",
      xVercelIpCountry: "TH",
    });
  });

  it("falls back to XX and keeps standard AIP plans for an unrecognized country", async () => {
    mocks.headers.mockResolvedValue(new Headers({ "x-vercel-ip-country": "Japan" }));

    const page = await PlansProductRoute({
      params: Promise.resolve({ locale: "en", product: "aip" }),
      searchParams: Promise.resolve({ "ip-country": "invalid" }),
    });

    expect(page.props).toMatchObject({ productKey: "aip" });
    expect(page.props.enterpriseOnly).toBeUndefined();
    expect(consoleInfo).toHaveBeenCalledWith("[plans/aip] country detection", {
      ipCountryQuery: "invalid",
      resolvedCountry: "XX",
      xVercelIpCountry: "Japan",
    });
  });
});
