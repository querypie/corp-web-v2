import type { ReactNode } from "react";
import Button from "../common/Button";
import type { Locale } from "../../constants/i18n";
import PromptTyper from "./PromptTyper";

type HeroProps = {
  className?: string;
  headingMuted?: ReactNode;
  headingPrimary?: ReactNode;
  locale: Locale;
  promptRotatingTexts: string[];
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const heroPreviewImageSrc = "/images/home/hero/home-hero.png";

function PlusIcon() {
  return <img alt="" aria-hidden="true" className="h-6 w-6 object-contain" src="/icons/Plus.svg" />;
}

function ChevronDownIcon() {
  return <img alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" src="/icons/chevron-down.svg" />;
}

function ArrowUpIcon() {
  return <img alt="" aria-hidden="true" className="h-6 w-6 object-contain" src="/icons/ArrowUp.svg" />;
}

export default function Hero({
  className,
  headingMuted = "Experience a new AI business,",
  headingPrimary = "QueryPie AI is the best way.",
  locale,
  promptRotatingTexts,
}: HeroProps) {
  return (
    <section className={cx("relative flex w-full justify-center overflow-hidden", className)}>
      {/* Figma 기준의 히어로 배경 그라데이션 */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(57.5% 52.53% at 50% 100%, rgba(8, 9, 10, 0) 0%, rgba(8, 9, 10, 0.5) 100%), linear-gradient(180deg, rgba(15, 16, 16, 0.5) 10%, rgba(210, 214, 220, 0.5) 100%)",
        }}
      />

      <div className="relative flex w-full justify-center px-5 pb-5 pt-0 sm:pb-6 md:px-10 md:pb-8 xl:pb-[36px]">
        <div className="flex w-full max-w-[1200px] flex-col items-start gap-8 sm:gap-10 md:gap-12 xl:gap-[60px]">
          {/* 카피와 CTA는 먼저 등장하고, 아래 제품 프리뷰가 뒤이어 올라온다. */}
          <div className="mb-5 flex w-full max-w-[320px] flex-col items-start gap-4 sm:max-w-[420px] sm:gap-5 md:max-w-[560px]">
            <div className="w-full">
              <p
                className="mb-0 type-h2 text-mute-fg"
                style={{ animation: "hero-copy-enter 0.7s ease-out both" }}
              >
                {headingMuted}
              </p>
              <p
                className="mb-0 type-h2 text-fg"
                style={{ animation: "hero-copy-enter 0.7s ease-out 0.15s both" }}
              >
                {headingPrimary}
              </p>
            </div>

            <a
              href={`/${locale}/contact-us`}
              style={{ animation: "hero-copy-enter 0.7s ease-out 0.3s both" }}
            >
              <Button arrow={false} size="small" variant="secondary">
                Free start!
              </Button>
            </a>
          </div>

          <div
            className="flex w-full justify-center md:-mt-1 xl:-mt-2"
            style={{ animation: "hero-copy-enter 0.9s ease-out 0.45s both" }}
          >
            <div className="relative w-full max-w-[1080px] aspect-[108/70]">
              {/* 메인 제품 프리뷰 이미지 */}
              <img
                alt="QueryPie AI workspace preview"
                className="absolute inset-0 z-[1] block h-full w-full object-cover"
                src={heroPreviewImageSrc}
              />

              <div
                className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6"
                style={{ animation: "hero-copy-enter 0.85s ease-out 0.65s both" }}
              >
                <div className="relative w-full max-w-[800px]">
                  {/* glow는 카드 inset을 따라가게 해서 반응형 찌그러짐을 줄인다. */}
                  <div className="pointer-events-none absolute inset-0 scale-[1] rounded-[22px] sm:rounded-[24px] md:rounded-[28px]">
                    <div
                      className="absolute inset-0 rounded-[inherit]"
                      style={{
                        animation: "hero-gradient-flow 3s ease-in-out infinite",
                        backgroundImage: "linear-gradient(90deg, #FF7051 0%, #BA709F 30%, #456BF0 100%)",
                        backgroundSize: "250% 250%",
                        filter: "blur(14px)",
                        opacity: 0.5,
                      }}
                    />
                  </div>

                  {/* 이전 입력창 UI를 히어로 이미지 위 오버레이로 재사용한다. */}
                  <div
                    className="relative rounded-[20px] p-[1px] md:rounded-[24px]"
                    style={{
                      animation: "hero-gradient-flow 3s ease-in-out infinite",
                      backgroundImage: "linear-gradient(90deg, rgba(255,112,81,0.18) 0%, rgba(186,112,159,0.18) 30%, rgba(69,107,240,0.18) 100%)",
                      backgroundSize: "250% 250%",
                    }}
                  >
                    <div className="h-full w-full overflow-hidden rounded-[19px] bg-bg-content md:rounded-[23px]">
                      <div className="flex min-h-[56px] items-center px-4 md:h-[62px] md:px-5">
                        <p className="m-0 flex-1 type-body-md text-fg md:type-body-lg">
                          {promptRotatingTexts.length > 0 ? <PromptTyper prompts={promptRotatingTexts} /> : null}
                        </p>
                      </div>
                      <div className="flex items-center justify-between px-3 pb-3">
                        <div className="flex min-w-0 items-center gap-1">
                          <button
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mute-fg"
                            type="button"
                          >
                            <PlusIcon />
                          </button>
                          <div className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary pl-3 pr-3 md:pl-4">
                            <span className="type-body-md text-fg">Agent</span>
                            <ChevronDownIcon />
                          </div>
                          <div className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary pl-3 pr-3 md:pl-4">
                            <span className="type-body-md text-fg">Skills</span>
                            <ChevronDownIcon />
                          </div>
                        </div>
                        <button
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-mute-fg"
                          type="button"
                        >
                          <ArrowUpIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
