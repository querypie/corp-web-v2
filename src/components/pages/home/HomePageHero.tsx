import Button from "@/components/ui/Button";

type HomePageHeroProps = {
  ctaLabel: string;
  description: string;
  heroHeading: string;
  imageAlt: string;
  locale: string;
};

export default function HomePageHero({
  ctaLabel,
  description,
  heroHeading,
  imageAlt,
  locale,
}: HomePageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[rgba(68,69,71,0)] to-[#444547] text-fg">
      <div className="relative flex w-full justify-center px-5 md:px-10">
        <div className="flex w-full max-w-[1200px] flex-col items-start gap-6 sm:gap-8 md:gap-10 xl:gap-12">
          <div className="w-full">
            <div className="flex w-full max-w-[1200px] flex-col items-start gap-5 sm:gap-6">
              <div className="w-full">
                <h2 className="m-0 max-w-[720px] type-h2">
                  <span className="block text-mute">{heroHeading}</span>
                  <span className="block text-fg">{description}</span>
                </h2>
              </div>

              <a href="https://app.querypie.com/" rel="noreferrer noopener" target="_blank">
                <Button arrow={false} style="full" variant="secondary">
                  {ctaLabel}
                </Button>
              </a>
            </div>

            <div className="mt-[60px] flex w-full justify-center">
              <div className="relative w-full max-w-[1200px] aspect-[1200/820] overflow-hidden">
                <img
                  alt={imageAlt}
                  className="absolute inset-0 block h-full w-full object-cover"
                  src="/images/home/hero/home-hero.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
