/**
 * @param organization 회사명
 * @param requestedBy 요청자 이메일
 */
export const issueLicense = async (organization?: string, requestedBy?: string) => {
  try {
    if (!organization || !requestedBy) {
      throw new Error("Missing required parameters");
    }

    if (
      !process.env.DESKPIE_COMMUNITY_LICENSE_API_ENDPOINT ||
      !process.env.PUBLIC_API_KEY
    ) {
      console.warn("[community-license] license issue: skipped (env not set)");
      return { status: "skip" };
    }

    const response = await fetch(process.env.DESKPIE_COMMUNITY_LICENSE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.PUBLIC_API_KEY,
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
