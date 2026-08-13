import { ImageResponse } from "next/og";
import type { Locale } from "@/constants/i18n";
import { ogImageCacheVersion, ogImageSize } from "@/features/seo/ogImageConfig";
import { getOgDescriptionLines, getOgTitleLines } from "@/features/seo/ogTitle";

const ogImageScale = ogImageSize.width / 1200;

function scaleOgValue(value: number) {
  return Math.round(value * ogImageScale);
}

const ogImagePaddingX = scaleOgValue(68);

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
  pretendardJp: { path: "/assets/fonts/og/PretendardJP-Regular.ttf", name: "Pretendard JP" },
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
    locale === "ja" ? ogFontConfigs.pretendardJp :
    undefined;
  const configs = localeFallbackFont
    ? [ogFontConfigs.mona, localeFallbackFont]
    : [ogFontConfigs.mona];

  return Promise.all(configs.map((config) => loadOgFont(origin, config)));
}

function getOgFontFamily(locale: Locale) {
  if (locale === "ko") return "Mona Sans, Pretendard";
  if (locale === "ja") return "Mona Sans, Pretendard JP";
  return "Mona Sans";
}

function getLocaleTextStyle(locale: Locale) {
  if (locale === "en" || locale === "ko") {
    return {
      titleSize: scaleOgValue(64),
      descriptionSize: scaleOgValue(36),
      descriptionLineHeight: scaleOgValue(52),
    };
  }

  return {
    titleSize: scaleOgValue(64),
    descriptionSize: scaleOgValue(34),
    descriptionLineHeight: scaleOgValue(52),
  };
}

export async function createOgImage({ description, locale, origin, title }: OgImageProps) {
  const backgroundImage = new URL("/assets/og/base.jpg", origin);
  backgroundImage.searchParams.set("v", ogImageCacheVersion);

  const [backgroundImageUrl, fonts] = await Promise.all([
    Promise.resolve(backgroundImage.toString()),
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
            top: scaleOgValue(220),
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
              marginTop: scaleOgValue(32),
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
