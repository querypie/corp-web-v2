// 공식 지식 출처의 단일 설정. HTTPS 공개 사이트만 등록합니다.
export const chatSources = [
  { product: "site", url: "https://www.querypie.com" },
  { product: "aip", url: "https://aip-docs.app.querypie.com" },
  { product: "acp", url: "https://docs.querypie.com" },
  { product: "lingo", url: "https://lingo.querypie.ai" },
] as const;

export function isOfficialChatUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port &&
      chatSources.some((source) => new URL(source.url).origin === url.origin);
  } catch { return false; }
}
