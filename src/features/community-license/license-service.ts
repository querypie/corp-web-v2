type APIResponse = {
  status: boolean;
  errorMessage: string;
};

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
      !process.env.QUERYPIE_LICENSE_ISSUE_API_ENDPOINT ||
      !process.env.QUERYPIE_LICENSE_ISSUE_API_KEY
    ) {
      console.warn("[community-license] license issue: skipped (env not set)");
      return { status: "skip" };
    }

    const response = await fetch(process.env.QUERYPIE_LICENSE_ISSUE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.QUERYPIE_LICENSE_ISSUE_API_KEY,
      },
      body: JSON.stringify({ organization, requestedBy }),
    });

    if (!response.ok) {
      throw new Error(`Failed to issue license: ${response.status}`);
    }

    const data = (await response.json()) as APIResponse;

    if (!data.status) {
      throw new Error(data.errorMessage);
    }

    console.info("[community-license] license issue: success");
    return { status: "success" };
  } catch (error) {
    console.error("[community-license] license issue: failed", error);
    throw error;
  }
};
