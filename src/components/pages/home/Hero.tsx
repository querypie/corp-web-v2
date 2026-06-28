import Button from "@/components/ui/Button";
import AipMockupShell from "@/components/mockups/aip/AipMockupShell";

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
              <div className="w-full">
                <h2 className="m-0 max-w-[720px] type-h2">
                  <span className="block text-mute">{heroHeading}</span>
                  <span className="block whitespace-pre-line text-fg">{description}</span>
                </h2>
              </div>

              <a href="https://app.querypie.com/" rel="noreferrer noopener" target="_blank">
                <Button arrow={false} style="full" variant="secondary">
                  {ctaLabel}
                </Button>
              </a>
            </div>

            <div className="mt-[60px] flex w-full justify-center" aria-label={imageAlt}>
              <div className="relative mb-[112px] w-full max-w-[1200px] overflow-hidden" style={{ height: 820 }}>
                <AipMockupShell className="homepage-aip-mockup" frameHeight={820} withShadow={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
