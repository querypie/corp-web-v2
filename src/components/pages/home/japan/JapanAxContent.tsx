import Image from "next/image";
import { CertificationCard } from "@/components/pages/company/CertificationsPage";
import Button from "@/components/ui/Button";
import ButtonGroup from "@/components/ui/ButtonGroup";
import SolutionIcon from "@/components/pages/solutions/japan/SolutionIcon";
import { getLocalePath } from "@/constants/i18n";
import { pageSectionGapClassName } from "@/constants/layout";
import { getCertificationsPageCopy } from "@/copy/company";
import { japanHomeAxCopy } from "@/copy/homeJapan";

const japanCertificationItems = getCertificationsPageCopy("ja").items.slice(0, 10);

function SectionHeading({
  description,
  title,
}: {
  description: readonly string[];
  title: string;
}) {
  return (
    <header className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="m-0 text-pretty type-h1 text-fg">{title}</h2>
      <p className="m-0 text-pretty type-body-lg text-mute">
        {description.map((line) => (
          <span className="block" key={line}>{line}</span>
        ))}
      </p>
    </header>
  );
}

function CapabilityGrid({ emphasizeIcons = false }: { emphasizeIcons?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {japanHomeAxCopy.capabilities.map((item) => (
        <article className="flex h-full flex-col rounded-box border border-border bg-bg p-6" key={item.title}>
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${emphasizeIcons ? "bg-brand text-white" : "bg-bg-content text-fg"}`}
          >
            <SolutionIcon name={item.icon} />
          </span>
          <h3 className="mb-3 mt-6 type-h3 text-fg">{item.title}</h3>
          <p className="m-0 type-body-md text-mute">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

export default function JapanAxContent() {
  const contactHref = getLocalePath("ja", "/company/contact-us");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName}`} data-testid="japan-ax-content">
      <section className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-2 md:items-center md:gap-[30px]">
        <div className="flex flex-col items-start gap-6">
          <h2 className="m-0 text-pretty type-h1 text-fg">{japanHomeAxCopy.introduction.title}</h2>
          <div className="flex max-w-[560px] flex-col gap-4 type-body-lg text-mute">
            {japanHomeAxCopy.introduction.paragraphs.map((paragraph) => (
              <p className="m-0" key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ButtonGroup className="flex-wrap">
            <Button
              href="https://lingo.querypie.com/"
              rel="noreferrer noopener"
              style="full"
              target="_blank"
              variant="primary"
            >
              {japanHomeAxCopy.introduction.primaryActionLabel}
            </Button>
            <Button href={contactHref} style="full" variant="outline">
              {japanHomeAxCopy.introduction.secondaryActionLabel}
            </Button>
          </ButtonGroup>
        </div>
        <Image
          alt={japanHomeAxCopy.introduction.imageAlt}
          className="aspect-video w-full rounded-box object-cover"
          height={459}
          sizes="(min-width: 768px) 50vw, 100vw"
          src="/assets/pages/home/japan/ax-introduction.webp"
          width={816}
        />
      </section>

      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">
        <SectionHeading
          description={japanHomeAxCopy.meeting.description}
          title={japanHomeAxCopy.meeting.title}
        />
        <CapabilityGrid emphasizeIcons />
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-20 md:-mx-10 md:px-10 md:py-24">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10">
          <SectionHeading
            description={japanHomeAxCopy.connectedPlatform.description}
            title={japanHomeAxCopy.connectedPlatform.title}
          />
          <Image
            alt={japanHomeAxCopy.connectedPlatform.imageAlt}
            className="h-auto w-full max-w-[900px] rounded-box"
            height={975}
            sizes="(min-width: 1200px) 900px, 100vw"
            src="/assets/pages/home/japan/ai-platform-diagram.webp"
            width={1463}
          />
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">
        <SectionHeading
          description={japanHomeAxCopy.trustedAi.description}
          title={japanHomeAxCopy.trustedAi.title}
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5" data-testid="certification-grid">
          {japanCertificationItems.map((item, index) => (
            <CertificationCard key={`${item.title}-${item.imageSrc}-${index}`} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
