type FooterSection = {
  items: string[];
  title: string;
};

type FooterProps = {
  addressLines?: string[];
  className?: string;
  legalLinks?: string[];
  locale?: string;
  sections?: FooterSection[];
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const socialLinks = [
  {
    className: "h-6 w-6",
    href: "/",
    label: "LinkedIn",
    src: "/icons/linkedin.svg",
  },
  {
    className: "h-6 w-6",
    href: "/",
    label: "YouTube",
    src: "/icons/youtube.svg",
  },
  {
    className: "h-6 w-6",
    href: "/",
    label: "X",
    src: "/icons/x.svg",
  },
] as const;

export default function Footer({
  addressLines = [
    "© 2017-2024 QueryPie, Inc. All rights reserved.",
    "Headquarter : 3003 North 1st Street, Suite 221, San Jose, CA 95134",
    "Seoul Magok Office : 7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul, Republic of Korea",
    "Seoul Gangnam Office : 3F, 464, Gangnam-daero, Gangnam-gu, Seoul, Republic of Korea",
    "Japan Office : 15F, 1 Chome-17-1 Toranomon, Minato City, Tokyo 105-6490",
  ],
  className,
  legalLinks = ["Cookie Preference", "Terms of Use", "Privacy Policy", "EULA"],
  locale = "en",
  sections = [
    { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
    { title: "Features", items: ["Demo", "Documentation"] },
    { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us"] },
  ],
}: FooterProps) {
  const [copyright, ...officeLines] = addressLines;

  /* 푸터 내부 링크가 현재 locale 기준으로 이동할 경로를 결정 */
  function getFooterHref(item: string) {
    if (item === "AI Platform (AIP)") {
      return `/${locale}/aip-not-found`;
    }

    if (item === "Access Control Platform (ACP)") {
      return `/${locale}/acp-not-found`;
    }

    if (item === "About Us" || item === "회사 소개") {
      return `/${locale}/about-us-not-found`;
    }

    if (item === "Certifications" || item === "인증") {
      return `/${locale}/certifications-not-found`;
    }

    if (item === "Demo" || item === "데모") {
      return `/${locale}/demo`;
    }

    if (
      item === "Contact Us" ||
      item === "문의하기"
    ) {
      return `/${locale}/contact-us`;
    }

    if (item === "News" || item === "뉴스") {
      return `/${locale}/news`;
    }

    if (item === "Documentation" || item === "문서") {
      return `/${locale}/docs`;
    }

    return "/";
  }

  return (
    <footer className={cx("relative flex w-full justify-center overflow-hidden bg-bg px-5 md:px-10", className)}>
      {/* 하단 오렌지 광원 효과 */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[800px] w-full opacity-50">
        <div className="h-full w-full bg-[radial-gradient(120%_80%_at_50%_100%,#FF7759_0%,rgba(255,119,89,0.60)_30%,rgba(255,119,89,0.00)_60%)]" />
      </div>

      {/* 실제 푸터 콘텐츠 래퍼 */}
      <div className="relative flex w-full max-w-[1200px] flex-col gap-[60px] border-t border-border py-[60px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* 좌측 로고 */}
          <a aria-label="QueryPie AI" className="inline-flex h-5 w-[116px] shrink-0 items-center" href={`/${locale}`}>
            <img
              alt="QueryPie AI"
              className="block h-5 w-[116px]"
              src="/icons/querypie-ai-logo.svg"
            />
          </a>

          {/* 우측 섹션 링크 묶음 */}
          <div className="flex flex-wrap items-start gap-8 md:gap-[60px] md:px-5">
            {sections.map((section) => (
              <div
                key={section.title}
                className={cx(
                  "flex flex-col gap-5 type-body-md leading-5",
                  section.title === "Solutions" && "w-[191px]",
                  section.title === "Features" && "w-[96px]",
                  section.title === "Company" && "w-[84px]",
                )}
              >
                <p className="m-0 text-mute-fg">{section.title}</p>
                <div className="flex flex-col gap-2 text-fg">
                  {section.items.map((item) => (
                    <a key={item} className="transition-colors hover:text-mute-fg" href={getFooterHref(item)}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 메타 영역: SNS / 법적 링크 / 주소 */}
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              {/* SNS 링크 */}
              <div className="flex items-center gap-[14px]">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    aria-label={link.label}
                    className="inline-flex h-6 w-6 items-center justify-center opacity-100 transition-opacity hover:opacity-50"
                    href={link.href}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      className={link.className}
                      src={link.src}
                    />
                  </a>
                ))}
              </div>

            {/* 법적 링크 */}
            <div className="flex w-full flex-wrap items-center gap-x-5 gap-y-[10px] whitespace-nowrap type-body-md leading-5 text-fg">
              {legalLinks.map((item) => (
                <a key={item} className="transition-colors hover:text-mute-fg" href="/">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* 회사 주소 및 카피라이트 */}
          <div className="flex flex-col gap-[10px] leading-5">
            <p className="m-0 type-body-md text-fg">{copyright}</p>
            <div className="type-body-sm text-fg">
              {officeLines.map((line) => (
                <p key={line} className="m-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
