import Button from "@/components/ui/Button";
import AipMockupShell from "@/components/mockups/aip/AipMockupShell";

const MOCKUP_ORIGINAL_WIDTH = 1200;
const MOCKUP_ORIGINAL_HEIGHT = 720;
const MOCKUP_DISPLAY_WIDTH = 1000;
const MOCKUP_DISPLAY_SCALE = MOCKUP_DISPLAY_WIDTH / MOCKUP_ORIGINAL_WIDTH;
const MOCKUP_DISPLAY_HEIGHT = Math.round((MOCKUP_ORIGINAL_HEIGHT / MOCKUP_ORIGINAL_WIDTH) * MOCKUP_DISPLAY_WIDTH);
const MOCKUP_MOBILE_DISPLAY_HEIGHT = 440;
const MOCKUP_MOBILE_SCALE = 0.86;
const MOCKUP_MOBILE_FRAME_HEIGHT = Math.round(MOCKUP_MOBILE_DISPLAY_HEIGHT / MOCKUP_MOBILE_SCALE);

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
    <section className="relative overflow-visible bg-bg bg-[image:var(--gradient-home-hero)] pt-[100px] text-fg md:pt-[140px]">
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

            <div className="mt-8 flex w-full justify-center md:mt-10" aria-label={imageAlt}>
              <div
                className="relative mb-12 w-full md:hidden"
                style={{ height: MOCKUP_MOBILE_DISPLAY_HEIGHT }}
              >
                <div className="relative z-10 h-full overflow-hidden">
                  <div
                    style={{
                      height: MOCKUP_MOBILE_FRAME_HEIGHT,
                      transform: `scale(${MOCKUP_MOBILE_SCALE})`,
                      transformOrigin: "top left",
                      width: `${100 / MOCKUP_MOBILE_SCALE}%`,
                    }}
                  >
                    <AipMockupShell className="homepage-aip-mockup homepage-aip-mockup-mobile" frameHeight={MOCKUP_MOBILE_FRAME_HEIGHT} withShadow={false} />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-full h-12 w-full -translate-x-1/2 rounded-t-[20px] bg-[image:var(--gradient-mockup-shadow-mobile)]"
                />
              </div>
              <div
                className="relative mb-[100px] hidden w-full md:block"
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
                  className="pointer-events-none absolute left-1/2 top-full h-[100px] w-full -translate-x-1/2 rounded-t-[14px] bg-[image:var(--gradient-mockup-shadow-desktop)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
