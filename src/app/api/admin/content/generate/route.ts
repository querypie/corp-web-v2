import { NextResponse } from "next/server";

type GenerateRequestBody = {
  instruction?: string;
  locale?: "en" | "ko" | "ja";
  title?: string;
};

type OpenAIResponsesApiResponse = {
  error?: {
    message?: string;
  };
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
    type?: string;
  }>;
};

function buildPrompt({
  instruction,
  locale,
  title,
}: {
  instruction: string;
  locale: "en" | "ko" | "ja";
  title: string;
}) {
  const localeLabel = {
    en: "English",
    ko: "Korean",
    ja: "Japanese",
  }[locale];

  return [
    `Title: ${title}`,
    `Write the result in ${localeLabel}.`,
    "",
    instruction,
  ].join("\n");
}

function extractOutputText(payload: OpenAIResponsesApiResponse) {
  const text = payload.output
    ?.flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text ?? "")
    .join("\n")
    .trim();

  return text ?? "";
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured. Add OPENAI_API_KEY to .env.local and restart the dev server.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as GenerateRequestBody;
  const title = body.title?.trim() ?? "";
  const instruction = body.instruction?.trim() ?? "";
  const locale = body.locale ?? "en";

  if (!title) {
    return NextResponse.json(
      { error: "Title is required." },
      { status: 400 },
    );
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      instructions:
        "You write admin content drafts for a CMS. Return markdown only. Do not include code fences. Follow the user's requested structure and constraints exactly.",
      input: buildPrompt({ instruction, locale, title }),
      max_output_tokens: 1400,
      text: {
        format: {
          type: "text",
        },
      },
    }),
  });

  const payload = (await response.json()) as OpenAIResponsesApiResponse;

  if (!response.ok) {
    return NextResponse.json(
      {
        error: payload.error?.message ?? "Failed to generate content.",
        status: response.status,
      },
      { status: response.status },
    );
  }

  const markdown = extractOutputText(payload);

  if (!markdown) {
    return NextResponse.json(
      { error: "The model returned an empty response." },
      { status: 502 },
    );
  }

  return NextResponse.json({ markdown });
}
