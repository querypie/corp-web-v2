/**
 * @param organization 회사명
 * @param requestedBy 요청자 이메일
 */
const COMMUNITY_LICENSE_PATH = "/api/v1/public/community-licenses";

export class DeskPieApiConfigurationError extends Error {
  constructor() {
    super("DeskPie API is not configured");
  }
}

/**
 * @param organization 회사명
 * @param requestedBy 요청자 이메일
 */
export const issueLicense = async (organization?: string, requestedBy?: string) => {
  try {
    if (!organization || !requestedBy) {
      throw new Error("Missing required parameters");
    }

    const endpoint = process.env.DESKPIE_API_BASE_URL;
    const apiKey = process.env.DESKPIE_API_KEY;
    if (!endpoint || !apiKey) {
      throw new DeskPieApiConfigurationError();
    }

    const response = await fetch(new URL(COMMUNITY_LICENSE_PATH, endpoint).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ organization, requestedBy }),
    });

    if (!response.ok) {
      throw new Error(`Failed to issue license: ${response.status}`);
    }

    console.info("[community-license] license issue: success");
    return { status: "success" };
  } catch (error) {
    console.error("[community-license] license issue: failed", error);
    throw error;
  }
};
