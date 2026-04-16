import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseUtm,
  updateUtmAttribution,
  toSalesforceFields,
  UTM_ATTRIBUTION_COOKIE_KEY,
  readUtmCookie,
} from "./utm";
import { getCookie } from "./cookie";

vi.mock("./cookie", () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  getExpires: vi.fn(() => new Date()),
}));

describe("parseUtm", () => {
  it("UTM 파라미터가 있으면 UtmTouch를 반환한다", () => {
    const params = new URLSearchParams("utm_source=google&utm_medium=cpc&utm_campaign=brand");
    const touch = parseUtm(params, "/en/");
    expect(touch).not.toBeNull();
    expect(touch!.source).toBe("google");
    expect(touch!.medium).toBe("cpc");
    expect(touch!.campaign).toBe("brand");
    expect(touch!.landing).toBe("/en/");
    expect(touch!.ts).toBeDefined();
  });

  it("UTM 파라미터가 없으면 null을 반환한다", () => {
    const params = new URLSearchParams("foo=bar");
    expect(parseUtm(params, "/en/")).toBeNull();
  });

  it("일부 파라미터만 있으면 있는 것만 포함한다", () => {
    const params = new URLSearchParams("utm_source=email");
    const touch = parseUtm(params, "/ko/");
    expect(touch!.source).toBe("email");
    expect(touch!.medium).toBeUndefined();
    expect(touch!.campaign).toBeUndefined();
  });
});

describe("updateUtmAttribution", () => {
  const touch1 = { source: "google", landing: "/", ts: "2026-01-01T00:00:00Z" };
  const touch2 = { source: "email", landing: "/contact", ts: "2026-02-01T00:00:00Z" };
  const touch3 = { source: "linkedin", landing: "/plans", ts: "2026-03-01T00:00:00Z" };

  it("첫 번째 방문이면 first === recent[0]이다", () => {
    const result = updateUtmAttribution(null, touch1);
    expect(result.first).toEqual(touch1);
    expect(result.recent).toEqual([touch1]);
  });

  it("두 번째 방문이면 first는 불변이고 recent 길이는 2다", () => {
    const initial = updateUtmAttribution(null, touch1);
    const result = updateUtmAttribution(initial, touch2);
    expect(result.first).toEqual(touch1);
    expect(result.recent).toHaveLength(2);
    expect(result.recent[1]).toEqual(touch2);
  });

  it("세 번째 방문이면 first는 불변이고 recent는 최신 2개만 유지한다", () => {
    const step1 = updateUtmAttribution(null, touch1);
    const step2 = updateUtmAttribution(step1, touch2);
    const result = updateUtmAttribution(step2, touch3);
    expect(result.first).toEqual(touch1);
    expect(result.recent).toHaveLength(2);
    expect(result.recent[0]).toEqual(touch2);
    expect(result.recent[1]).toEqual(touch3);
  });
});

describe("toSalesforceFields", () => {
  it("정상 쿠키에서 6개 Salesforce 필드를 매핑한다", () => {
    const attribution = {
      first: { source: "google", landing: "/en/", ts: "2026-01-01T00:00:00Z" },
      recent: [
        {
          source: "linkedin",
          medium: "paid",
          campaign: "q1",
          content: "v2",
          term: "data",
          landing: "/en/contact",
          ts: "2026-03-01T00:00:00Z",
        },
      ],
    };
    const encoded = encodeURIComponent(JSON.stringify(attribution));
    const fields = toSalesforceFields(encoded);

    expect(fields["pi__utm_source__c"]).toBe("linkedin");
    expect(fields["pi__utm_medium__c"]).toBe("paid");
    expect(fields["pi__utm_campaign__c"]).toBe("q1");
    expect(fields["pi__utm_content__c"]).toBe("v2");
    expect(fields["pi__utm_term__c"]).toBe("data");
    expect(fields["pi__first_touch_url__c"]).toBe("/en/");
  });

  it("손상된 쿠키이면 빈 객체를 반환한다", () => {
    expect(toSalesforceFields("not-valid-json%%%")).toEqual({});
  });

  it("UTM 필드가 없으면 해당 키를 포함하지 않는다", () => {
    const attribution = {
      first: { landing: "/", ts: "2026-01-01T00:00:00Z" },
      recent: [{ landing: "/contact", ts: "2026-02-01T00:00:00Z" }],
    };
    const fields = toSalesforceFields(encodeURIComponent(JSON.stringify(attribution)));
    expect(fields).not.toHaveProperty("pi__utm_source__c");
    expect(fields["pi__first_touch_url__c"]).toBe("/");
  });
});

describe("UTM_ATTRIBUTION_COOKIE_KEY", () => {
  it("쿠키 키는 utm-attribution이다", () => {
    expect(UTM_ATTRIBUTION_COOKIE_KEY).toBe("utm-attribution");
  });
});

describe("readUtmCookie", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("쿠키가 있으면 문자열을 반환한다", () => {
    vi.mocked(getCookie).mockReturnValue("encoded-value");
    expect(readUtmCookie()).toBe("encoded-value");
  });

  it("쿠키가 없으면 undefined를 반환한다", () => {
    vi.mocked(getCookie).mockReturnValue(null);
    expect(readUtmCookie()).toBeUndefined();
  });
});
