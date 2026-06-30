import { ImageResponse } from "next/og";
import type { Locale } from "@/constants/i18n";
import { getOgDescriptionLines, getOgTitleLines } from "@/features/seo/ogTitle";

export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;
const ogImagePaddingX = 68;

type OgImageProps = {
  description: string;
  locale: Locale;
  origin: string;
  title: string;
};

type OgFontConfig = {
  data: ArrayBuffer;
  name: string;
  style: "normal";
  weight: 400;
};

const ogFontConfigs = {
  mona: { path: "/assets/fonts/og/MonaSans-Regular.ttf", name: "Mona Sans" },
  pretendard: { path: "/assets/fonts/og/Pretendard-Regular.ttf", name: "Pretendard" },
  mPlus1: { path: "/assets/fonts/og/MPLUS1-Regular.ttf", name: "M PLUS 1" },
} as const;

const fontDataCache = new Map<string, Promise<ArrayBuffer>>();

async function loadOgFont(
  origin: string,
  config: { path: string; name: string },
): Promise<OgFontConfig> {
  const fontUrl = new URL(config.path, origin).toString();
  let fontData = fontDataCache.get(fontUrl);

  if (!fontData) {
    fontData = fetch(fontUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load OG font: ${fontUrl}`);
      }

      return response.arrayBuffer();
    });
    fontDataCache.set(fontUrl, fontData);
  }

  return {
    name: config.name,
    data: await fontData,
    style: "normal",
    weight: 400,
  };
}

async function getOgFonts(origin: string, locale: Locale): Promise<OgFontConfig[]> {
  const localeFallbackFont =
    locale === "ko" ? ogFontConfigs.pretendard :
    locale === "ja" ? ogFontConfigs.mPlus1 :
    undefined;
  const configs = localeFallbackFont
    ? [ogFontConfigs.mona, localeFallbackFont]
    : [ogFontConfigs.mona];

  return Promise.all(configs.map((config) => loadOgFont(origin, config)));
}

function getOgFontFamily(locale: Locale) {
  if (locale === "ko") return "Mona Sans, Pretendard";
  if (locale === "ja") return "Mona Sans, M PLUS 1";
  return "Mona Sans";
}

function getLocaleTextStyle(locale: Locale) {
  if (locale === "en" || locale === "ko") {
    return {
      titleSize: 64,
      descriptionSize: 36,
      descriptionLineHeight: 52,
    };
  }

  return {
    titleSize: 64,
    descriptionSize: 34,
    descriptionLineHeight: 52,
  };
}

export async function createOgImage({ description, locale, origin, title }: OgImageProps) {
  const [backgroundImageUrl, fonts] = await Promise.all([
    Promise.resolve(new URL("/assets/og/base.jpg", origin).toString()),
    getOgFonts(origin, locale),
  ]);
  const textStyle = getLocaleTextStyle(locale);
  const fontFamily = getOgFontFamily(locale);
  const titleLines = getOgTitleLines(title, locale);
  const descriptionLines = getOgDescriptionLines(description, locale, textStyle.descriptionSize);

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#000000",
          color: "#f2f2f2",
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <img
          alt=""
          height={ogImageSize.height}
          src={backgroundImageUrl}
          style={{
            height: ogImageSize.height,
            left: 0,
            objectFit: "cover",
            position: "absolute",
            top: 0,
            width: ogImageSize.width,
          }}
          width={ogImageSize.width}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            left: ogImagePaddingX,
            position: "absolute",
            top: 220,
            width: ogImageSize.width - ogImagePaddingX * 2,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily,
              fontFeatureSettings: '"ss01" on, "ss09" on',
              fontSize: textStyle.titleSize,
              fontWeight: 400,
              letterSpacing: "-0.5px",
              lineHeight: 1.3,
              margin: 0,
              width: "100%",
              whiteSpace: "pre-wrap",
              wordBreak: "keep-all",
            }}
          >
            {titleLines.map((line, index) => (
              <div
                key={`${line}-${index}`}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                {line}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily,
              fontSize: textStyle.descriptionSize,
              fontWeight: 400,
              letterSpacing: "-0.2px",
              lineHeight: `${textStyle.descriptionLineHeight}px`,
              marginTop: 32,
              width: "100%",
              whiteSpace: "pre-wrap",
              wordBreak: "keep-all",
            }}
          >
            {descriptionLines.map((line, index) => (
              <div
                key={`${line}-${index}`}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts,
    },
  );
}
