import Image from "next/image";
import Cta from "@/components/sections/Cta";
import type { Locale } from "@/constants/i18n";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { fdeCopy } from "@/copy/fde";
import { FdeBuilding, FdeDiscovery, FdeOperations, FdePlanning } from "./FdeContent";
import FdeSection from "./FdeSection";

export default function FdeServicesPage({ locale }: { locale: Locale }) {
  const copy = fdeCopy[locale];

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className={pageContentWidthClassName}>
        <header className="grid items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-7.5">
          <h1 className="m-0 text-pretty type-h1 text-fg">
            {copy.hero.title[0]}<br className="hidden md:block" /> {copy.hero.title[1]}
          </h1>
          <div className="min-w-0 space-y-6">
            <p className="m-0 text-pretty type-body-lg leading-relaxed text-fg">{copy.hero.description}</p>
            <Image
              alt={copy.hero.imageAlt}
              className="h-auto w-full rounded-box"
              height={690}
              priority
              sizes="(min-width: 1280px) 585px, (min-width: 768px) 50vw, 100vw"
              src="/assets/pages/platforms/aip/fde-services/field-collaboration.webp"
              width={1232}
            />
          </div>
        </header>
      </section>

      <FdeSection id="fde-discovery" {...copy.discovery}>
        <FdeDiscovery copy={copy.discovery} />
      </FdeSection>
      <FdeSection id="fde-planning" {...copy.planning}>
        <FdePlanning copy={copy.planning} />
      </FdeSection>
      <FdeSection id="fde-building" {...copy.building} shaded>
        <FdeBuilding copy={copy.building} />
      </FdeSection>
      <FdeSection id="fde-operations" {...copy.operations}>
        <FdeOperations copy={copy.operations} />
      </FdeSection>

      <div><Cta locale={locale} /></div>
    </div>
  );
}
