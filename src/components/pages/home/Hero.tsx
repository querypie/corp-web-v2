import Button from "@/components/ui/Button";
import AipMockupShell from "@/components/mockups/aip/AipMockupShell";

const MOCKUP_ORIGINAL_WIDTH = 1200;
const MOCKUP_ORIGINAL_HEIGHT = 720;
const MOCKUP_DISPLAY_WIDTH = 1000;
const MOCKUP_DISPLAY_SCALE = MOCKUP_DISPLAY_WIDTH / MOCKUP_ORIGINAL_WIDTH;
const MOCKUP_DISPLAY_HEIGHT = Math.round((MOCKUP_ORIGINAL_HEIGHT / MOCKUP_ORIGINAL_WIDTH) * MOCKUP_DISPLAY_WIDTH);

type HeroProps = {
  ctaLabel: string;
  description: string;
  heroHeading: string;
  imageAlt: string;
  locale: string;
};

export default function Hero({
  ctaLabel,
  description,
  heroHeading,
  imageAlt,
  locale,
}: HeroProps) {
  return (
    <section className="relative overflow-visible bg-gradient-to-b from-[rgba(68,69,71,0)] to-[#444547] text-fg">
      <div className="relative flex w-full justify-center px-5 md:px-10">
        <div className="flex w-full max-w-[1200px] flex-col items-start gap-6 sm:gap-8 md:gap-10 xl:gap-12">
          <div className="w-full">
            <div className="flex w-full max-w-[1200px] flex-col items-start gap-5 sm:gap-6">
              <div className="w-full max-w-[720px]">
                <h2 className="m-0 type-h2 text-fg">{heroHeading}</h2>
                <p className="m-0 mt-2.5 whitespace-pre-line type-body-lg text-mute">{description}</p>
              </div>

              <a href="https://app.querypie.com/" rel="noreferrer noopener" target="_blank">
                <Button arrow={false} style="full" variant="secondary">
                  {ctaLabel}
                </Button>
              </a>
            </div>

            <div className="mt-[60px] flex w-full justify-center" aria-label={imageAlt}>
              <div
                className="relative mb-[100px] w-full"
                style={{ height: MOCKUP_DISPLAY_HEIGHT, maxWidth: MOCKUP_DISPLAY_WIDTH }}
              >
                <div className="relative z-10 h-full overflow-hidden">
                  <div
                    style={{
                      height: MOCKUP_ORIGINAL_HEIGHT,
                      transform: `scale(${MOCKUP_DISPLAY_SCALE})`,
                      transformOrigin: "top left",
                      width: MOCKUP_ORIGINAL_WIDTH,
                    }}
                  >
                    <AipMockupShell className="homepage-aip-mockup" frameHeight={MOCKUP_ORIGINAL_HEIGHT} withShadow={false} />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-full h-[100px] w-full -translate-x-1/2 rounded-t-[14px] bg-[linear-gradient(180deg,rgba(18,18,18,0.36)_0%,rgba(18,18,18,0.24)_32%,rgba(18,18,18,0.11)_68%,rgba(18,18,18,0)_100%)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
