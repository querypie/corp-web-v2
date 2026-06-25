import type { Locale } from "@/constants/i18n";

const ellipsis = "...";
const maxTitleLines = 2;
const titleFontSize = 64;
const titleLineMaxWidth = 960;
const maxDescriptionLines = 3;
const descriptionLineMaxWidth = 1064;

type OgTextLineOptions = {
  fontSize: number;
  maxLines: number;
  maxWidth: number;
};

function getCharacterWidthRatio(character: string, locale: Locale) {
  if (character === " ") return 0.28;
  if (/[\t\n\r]/.test(character)) return 0;
  if (/[0-9]/.test(character)) return 0.55;
  if (/[A-Z]/.test(character)) return 0.62;
  if (/[a-z]/.test(character)) return 0.53;
  if (/[-–—_/\\|.,:;'"!?()[\]{}]/.test(character)) return 0.34;
  if (locale === "ko") return 0.92;
  if (locale === "ja") return 0.94;
  return 0.64;
}

function getTextWidth(text: string, locale: Locale, fontSize: number) {
  return Array.from(text).reduce((width, character) => {
    return width + getCharacterWidthRatio(character, locale) * fontSize;
  }, 0);
}

function getTrimmedLineEnd(text: string) {
  return text.trimEnd().replace(/[.,:;'"!?、。・，．：；！？ー-]+$/, "");
}

function truncateLineToWidth(
  text: string,
  locale: Locale,
  { fontSize, maxWidth }: Pick<OgTextLineOptions, "fontSize" | "maxWidth">,
) {
  const characters = Array.from(getTrimmedLineEnd(text));

  while (characters.length > 0 && getTextWidth(`${characters.join("").trimEnd()}${ellipsis}`, locale, fontSize) > maxWidth) {
    characters.pop();
  }

  const truncated = getTrimmedLineEnd(characters.join(""));
  return truncated ? `${truncated}${ellipsis}` : ellipsis;
}

function getOgTextLines(text: string, locale: Locale, options: OgTextLineOptions) {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  if (!normalizedText) return [""];

  const characters = Array.from(normalizedText);
  const lines: string[] = [];
  let startIndex = 0;

  while (startIndex < characters.length && lines.length < options.maxLines) {
    let endIndex = startIndex;
    let width = 0;
    let lastBreakIndex = -1;

    while (endIndex < characters.length) {
      const character = characters[endIndex];
      width += getCharacterWidthRatio(character, locale) * options.fontSize;

      if (character === " ") {
        lastBreakIndex = endIndex;
      }

      if (width > options.maxWidth) {
        break;
      }

      endIndex += 1;
    }

    if (endIndex >= characters.length) {
      lines.push(characters.slice(startIndex).join("").trim());
      startIndex = characters.length;
      break;
    }

    const breakIndex = lastBreakIndex > startIndex ? lastBreakIndex : Math.max(endIndex, startIndex + 1);
    const lineText = characters.slice(startIndex, breakIndex).join("").trim();
    lines.push(lineText);
    startIndex = characters[breakIndex] === " " ? breakIndex + 1 : breakIndex;
  }

  const hasRemainingText = startIndex < characters.length;
  if (hasRemainingText && lines.length > 0) {
    lines[lines.length - 1] = truncateLineToWidth(lines[lines.length - 1], locale, options);
  }

  return lines;
}

export function getOgTitleLines(title: string, locale: Locale) {
  return getOgTextLines(title, locale, {
    fontSize: titleFontSize,
    maxLines: maxTitleLines,
    maxWidth: titleLineMaxWidth,
  });
}

export function getOgDescriptionLines(description: string, locale: Locale, fontSize: number) {
  return getOgTextLines(description, locale, {
    fontSize,
    maxLines: maxDescriptionLines,
    maxWidth: descriptionLineMaxWidth,
  });
}
