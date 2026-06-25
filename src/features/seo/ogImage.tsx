import { ImageResponse } from "next/og";
import type { Locale } from "@/constants/i18n";

export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

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

const fontConfigByLocale: Record<Locale, { path: string; name: string }> = {
  en: { path: "/fonts/og/MonaSans-Regular.ttf", name: "Mona Sans" },
  ko: { path: "/fonts/og/Pretendard-Regular.ttf", name: "Pretendard" },
  ja: { path: "/fonts/og/MPLUS1-Regular.ttf", name: "M PLUS 1" },
};

const fontDataCache = new Map<string, Promise<ArrayBuffer>>();

async function getOgFont(origin: string, locale: Locale): Promise<OgFontConfig> {
  const config = fontConfigByLocale[locale];
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

function getLocaleTextStyle(locale: Locale) {
  if (locale === "en") {
    return {
      titleSize: 64,
      descriptionSize: 36,
      descriptionLineHeight: 52,
    };
  }

  return {
    titleSize: 60,
    descriptionSize: 34,
    descriptionLineHeight: 50,
  };
}

export async function createOgImage({ description, locale, origin, title }: OgImageProps) {
  const [backgroundImageUrl, font] = await Promise.all([
    Promise.resolve(new URL("/og/base.png", origin).toString()),
    getOgFont(origin, locale),
  ]);
  const textStyle = getLocaleTextStyle(locale);

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
            left: 68,
            position: "absolute",
            top: 220,
            width: 940,
          }}
        >
          <div
            style={{
              fontFamily: font.name,
              fontSize: textStyle.titleSize,
              fontWeight: 400,
              letterSpacing: "-0.2px",
              lineHeight: 1.08,
              margin: 0,
              maxWidth: 940,
              whiteSpace: "pre-wrap",
              wordBreak: "keep-all",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: font.name,
              fontSize: textStyle.descriptionSize,
              fontWeight: 400,
              letterSpacing: "-0.2px",
              lineHeight: `${textStyle.descriptionLineHeight}px`,
              marginTop: 46,
              maxWidth: 931,
              whiteSpace: "pre-wrap",
              wordBreak: "keep-all",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [font],
    },
  );
}
