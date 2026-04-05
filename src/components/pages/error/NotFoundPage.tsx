"use client";

import { usePathname } from "next/navigation";
import Button from "../../common/Button";
import Footer from "../../layout/Footer";
import Gnb from "../../layout/Gnb";
import { defaultLocale, isLocale, type Locale } from "../../../constants/i18n";
import { getShellMenuCopy } from "../../../constants/navigation";

type NotFoundPageProps = {};

function BowingBotIcon() {
  return (
    /* 404 전용 보잉 bot 아이콘 */
    <svg
      aria-hidden="true"
      className="h-[80px] w-[80px] overflow-visible [animation:bowBody_4s_ease-in-out_infinite]"
      viewBox="0 0 88 88"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad-bow-body" x1="1" y1="4" x2="87" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D3D6DB" />
          <stop offset="1" stopColor="#A0A2A5" />
        </linearGradient>
        <linearGradient id="grad-bow-screen" x1="16" y1="34" x2="73.5" y2="73.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#515151" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
      </defs>
      <g fill="url(#grad-bow-body)">
        <path d="M0.88 50.78C0.88 36.6 10.8 24.05 24.88 22.35C38.2 20.74 49.94 20.7 63.28 22.31C77.29 24 87.12 36.52 87.12 50.63V53.99C87.12 68.84 76.24 81.69 61.43 82.86C49.13 83.84 38.28 83.84 26.44 82.91C11.68 81.76 0.88 68.91 0.88 54.11V50.78Z" />
        <path d="M45.76 21.12C45.76 22.09 44.97 22.88 44 22.88C43.03 22.88 42.24 22.09 42.24 21.12V14.08C42.24 13.11 43.03 12.32 44 12.32C44.97 12.32 45.76 13.11 45.76 14.08V21.12ZM50.16 10.56C50.16 13.96 47.4 16.72 44 16.72C40.6 16.72 37.84 13.96 37.84 10.56C37.84 7.16 40.6 4.4 44 4.4C47.4 4.4 50.16 7.16 50.16 10.56Z" />
      </g>
      <g className="[transform-origin:center_bottom] [animation:bowFace_4s_ease-in-out_infinite]">
        <path
          d="M12.87 39.47C13.16 35.12 16.76 31.71 21.25 31.49C27.74 30.3 37.01 29.92 44 29.92C50.99 29.92 60.26 30.3 66.75 31.49C71.24 31.71 74.84 35.12 75.13 39.47C75.41 43.64 75.68 48.77 75.68 52.8C75.68 56.83 75.41 61.96 75.13 66.13C74.84 70.48 71.24 73.89 66.75 74.11C60.26 75.3 50.99 75.68 44 75.68C37.01 75.68 27.74 75.3 21.25 74.11C16.76 73.89 13.16 70.48 12.87 66.13C12.59 61.96 12.32 56.83 12.32 52.8C12.32 48.77 12.59 43.64 12.87 39.47Z"
          fill="url(#grad-bow-screen)"
        />
        <g fill="none" stroke="white" strokeLinecap="round">
          <path
            className="[transform-origin:31.68px_51.92px] [animation:bowBlink_4s_infinite]"
            d="M31.68 55.44V48.4"
            strokeWidth="3.5"
          />
          <path
            className="[transform-origin:56.32px_51.92px] [animation:bowBlink_4s_infinite]"
            d="M56.32 55.44V48.4"
            strokeWidth="3.5"
          />
          <path d="M38.98 61.34C41.75 64.12 46.25 64.12 49.02 61.34" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}

export default function NotFoundPage({}: NotFoundPageProps) {
  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale: Locale = firstSegment && isLocale(firstSegment) ? firstSegment : defaultLocale;

  // 현재 locale 기준으로 404 카피와 링크를 분기
  const copy = {
    en: {
      ctaHref: "/en",
      ctaLabel: "Back to home",
      ...getShellMenuCopy("en"),
      messageLines: [
        "The page you’re looking for has wandered off, but don’t worry!",
        "Let’s get you back on track.",
      ],
      title: "404",
    },
    ko: {
      ctaHref: "/ko",
      ctaLabel: "홈으로 돌아가기",
      ...getShellMenuCopy("ko"),
      messageLines: [
        "찾으시는 페이지가 다른 곳으로 이동했거나 사라졌습니다.",
        "홈으로 돌아가 다시 시작해 보세요.",
      ],
      title: "404",
    },
    ja: {
      ctaHref: "/ja",
      ctaLabel: "ホームへ戻る",
      ...getShellMenuCopy("ja"),
      messageLines: [
        "お探しのページは移動したか、見つかりませんでした。",
        "ホームに戻ってもう一度お試しください。",
      ],
      title: "404",
    },
  }[locale];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Gnb actionLabel={copy.navActionLabel} items={copy.navItems} locale={locale} />
      {/* 404 중앙 메시지 영역 */}
      <main className="flex flex-1 px-5 pt-[100px] text-fg md:px-10 md:pt-page-top">
        <section className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center pb-10">
          <div className="flex w-full max-w-[488px] flex-col items-center gap-8 md:flex-row md:items-start md:gap-[60px]">
            <div className="shrink-0">
              <BowingBotIcon />
            </div>

            <div className="flex w-full max-w-[340px] flex-col items-start gap-5 text-left">
              <h1 className="m-0 type-h1 text-fg">{copy.title}</h1>
              <div className="flex w-full flex-col gap-[10px]">
                {copy.messageLines.map((line) => (
                  <p key={line} className="m-0 type-body-md text-mute-fg">
                    {line}
                  </p>
                ))}
              </div>
              <a href={copy.ctaHref}>
                <Button style="round" variant="secondary">
                  {copy.ctaLabel}
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer className="mt-20 md:mt-footer-gap" legalLinks={copy.footerLegalLinks} locale={locale} sections={copy.footerSections} />
    </div>
  );
}
