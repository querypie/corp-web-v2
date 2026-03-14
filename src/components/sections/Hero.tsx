import type { ReactNode } from "react";
import PromptTyper from "./PromptTyper";

type HeroProps = {
  className?: string;
  headingMuted?: ReactNode;
  headingPrimary?: ReactNode;
  promptRotatingTexts: string[];
};

const heroStars = [
  { left: "4.5%", size: 1.5, top: "9%", twinkle: true },
  { left: "8.5%", size: 2, top: "27%" },
  { left: "13%", size: 1.5, top: "61%" },
  { left: "17.4%", size: 2, top: "19%", twinkle: true },
  { left: "21.8%", size: 2.5, top: "11%" },
  { left: "24.5%", size: 1.5, top: "76%" },
  { left: "29.3%", size: 1.5, top: "23%" },
  { left: "31.4%", size: 2.5, top: "51%", twinkle: true },
  { left: "34.6%", size: 1.5, top: "68%" },
  { left: "38.8%", size: 2, top: "37%", twinkle: true },
  { left: "42.3%", size: 1.5, top: "83%" },
  { left: "46%", size: 1.5, top: "6%" },
  { left: "50.5%", size: 1.5, top: "58%" },
  { left: "54.2%", size: 2.5, top: "16%", twinkle: true },
  { left: "56.8%", size: 2, top: "28%" },
  { left: "60.4%", size: 1.5, top: "74%", twinkle: true },
  { left: "64.1%", size: 2, top: "43%" },
  { left: "67.7%", size: 1.5, top: "12%" },
  { left: "71.6%", size: 2, top: "60%" },
  { left: "74.8%", size: 2.5, top: "7%", twinkle: true },
  { left: "78.5%", size: 1.5, top: "31%" },
  { left: "82.1%", size: 1.5, top: "70%", twinkle: true },
  { left: "85.6%", size: 2.5, top: "50%" },
  { left: "88.9%", size: 2, top: "17%" },
  { left: "91.5%", size: 1.5, top: "46%" },
  { left: "94.2%", size: 2, top: "73%", twinkle: true },
  { left: "96.3%", size: 1.5, top: "35%" },
  { left: "10.9%", size: 2.5, top: "88%", twinkle: true },
  { left: "36.2%", size: 2, top: "9%" },
  { left: "58.6%", size: 2, top: "87%" },
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function PlusIcon() {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="h-6 w-6 object-contain"
      src="/icons/Plus.svg"
    />
  );
}

function ChevronDownIcon() {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="h-[14px] w-[14px] object-contain"
      src="/icons/chevron-down.svg"
    />
  );
}

function ArrowUpIcon() {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="h-6 w-6 object-contain"
      src="/icons/ArrowUp.svg"
    />
  );
}

export default function Hero({
  className,
  headingMuted = "Experience a new AI business,",
  headingPrimary = "QueryPie AI is the best way.",
  promptRotatingTexts,
}: HeroProps) {
  return (
    <section className={cx("flex w-full flex-col items-center", className)}>
      {/* 콘텐츠 최대 폭 컨테이너 */}
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-8 md:gap-[120px]">
        {/* 상단 헤드라인 카피 영역 */}
        <div className="w-full type-h1">
          {/* 첫 번째 줄: 즉시 등장 */}
          <p
            className="mb-0 text-mute-fg"
            style={{ animation: "hero-copy-enter 0.7s ease-out both" }}
          >
            {headingMuted}
          </p>
          {/* 두 번째 줄: 0.15s 딜레이로 stagger */}
          <p
            className="mb-0 text-fg"
            style={{ animation: "hero-copy-enter 0.7s ease-out 0.15s both" }}
          >
            {headingPrimary}
          </p>
        </div>

        {/* 중앙 비주얼 영역: 별 배경 + 장식 아이콘 + 프롬프트 카드 */}
        <div className="relative h-[220px] w-full max-w-[1200px] md:h-[520px]">
          {/* 우주 느낌의 별 배경 */}
          <div className="pointer-events-none absolute inset-0">
            {heroStars.map((star, index) => (
              <span
                key={`${star.left}-${star.top}-${index}`}
                className="absolute rounded-full bg-white/80"
                style={{
                  animation: star.twinkle
                    ? `hero-star-twinkle ${2 + (index % 5) * 0.55}s ease-in-out ${index * 0.19}s infinite`
                    : undefined,
                  boxShadow: star.twinkle
                    ? `0 0 ${6 + star.size * 2}px rgba(255,255,255,0.38)`
                    : "none",
                  height: `${star.size}px`,
                  left: star.left,
                  opacity: star.twinkle ? 0.18 : 0.09,
                  top: star.top,
                  width: `${star.size}px`,
                }}
              />
            ))}
          </div>
          {/* 데스크톱 전용 장식 아이콘 3종 */}
          <div className="absolute hidden left-[calc(50%-191px)] top-[40px] h-[120px] w-[120px] -translate-x-1/2 md:block" style={{ animation: "hero-icon-float 4s ease-in-out infinite" }}>
            <img
              alt=""
              aria-hidden="true"
              className="block h-[120px] w-[120px] shrink-0"
              src="/icons/Gemini.svg"
            />
          </div>
          <div className="absolute hidden left-[calc(50%+70px)] top-[160px] z-20 h-[120px] w-[120px] -translate-x-1/2 md:block" style={{ animation: "hero-icon-float 4s ease-in-out 1.3s infinite" }}>
            <img
              alt=""
              aria-hidden="true"
              className="block h-[120px] w-[120px] shrink-0"
              src="/icons/Claude.svg"
            />
          </div>
          <div className="absolute hidden left-[calc(50%+244px)] top-[70px] h-[120px] w-[120px] -translate-x-1/2 md:block" style={{ animation: "hero-icon-float 4s ease-in-out 0.7s infinite" }}>
            <img
              alt=""
              aria-hidden="true"
              className="block h-[120px] w-[120px] shrink-0"
              src="/icons/ChatGPT.svg"
            />
          </div>

          {/* 프롬프트 카드 뒤에서 흐르는 그라데이션 글로우 */}
          <div className="pointer-events-none absolute hidden left-1/2 top-[255px] h-[110px] w-[800px] -translate-x-1/2 overflow-visible md:block">
            <div
              className="absolute left-1/2 top-1/2 h-[126px] w-[812px] -translate-x-1/2 -translate-y-1/2 rounded-[40px]"
              style={{
                animation: "hero-gradient-flow 3s ease-in-out infinite",
                background:
                  "linear-gradient(90deg, #FF7051 0%, #BA709F 30%, #456BF0 100%)",
                backgroundSize: "250% 250%",
                filter: "blur(10px)",
              opacity: 0.5,
            }}
          />
          </div>
          {/* 실제 프롬프트 입력 카드 */}
          <div
            className="absolute left-1/2 top-[30px] h-[110px] w-full -translate-x-1/2 rounded-[24px] p-[1px] md:top-[255px] md:w-[800px]"
            style={{
              animation: "hero-gradient-flow 3s ease-in-out infinite",
              background: "linear-gradient(90deg, rgba(255,112,81,0.3) 0%, rgba(186,112,159,0.3) 30%, rgba(69,107,240,0.3) 100%)",
              backgroundSize: "250% 250%",
            }}
          >
            {/* 카드 내부: 타이핑 텍스트 + 액션 버튼 그룹 */}
            <div className="h-full w-full overflow-hidden rounded-[23px] bg-bg-content">
              <div className="flex h-[62px] items-center px-5">
                <p className="m-0 flex-1 type-body-lg leading-6 text-fg">
                  {promptRotatingTexts.length > 0 ? (
                    <PromptTyper prompts={promptRotatingTexts} />
                  ) : null}
                </p>
              </div>
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-mute-fg"
                    type="button"
                  >
                    <PlusIcon />
                  </button>
                  <div className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary pl-4 pr-3">
                    <span className="type-body-md text-fg">Agent</span>
                    <ChevronDownIcon />
                  </div>
                  <div className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary pl-4 pr-3">
                    <span className="type-body-md text-fg">Skills</span>
                    <ChevronDownIcon />
                  </div>
                </div>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-mute-fg"
                  type="button"
                >
                  <ArrowUpIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
