const PUBLIC_LEAD_PATH = "/api/v1/public/leads";

type DeskPieLeadPayload = {
  processType: "LEAD_MS" | "CONTENT_GATING";
  requestBody: Record<string, unknown>;
};

export async function sendDeskPieLead(payload: DeskPieLeadPayload, source: string): Promise<void> {
  const endpoint = process.env.DESKPIE_API_BASE_URL;
  const apiKey = process.env.DESKPIE_API_KEY;

  if (!endpoint || !apiKey) {
    return;
  }

  try {
    const response = await fetch(new URL(PUBLIC_LEAD_PATH, endpoint).toString(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[${source}] deskpie: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error(`[${source}] deskpie: request error`, error);
  }
}
