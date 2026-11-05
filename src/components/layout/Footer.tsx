type FooterSection = {
  items: string[];
  title: string;
};
import { getFooterHref, getLegalHref, getShellMenuCopy } from "@/constants/navigation";
import { getLocalePath, type Locale } from "@/constants/i18n";
import ExternalLinkIcon from "@/components/ui/ExternalLinkIcon";

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
    className: "h-7 w-7",
    href: "/",
    label: "LinkedIn",
    src: "/assets/brand/icons/linkedin.svg",
  },
  {
    className: "h-7 w-7",
    href: "/",
    label: "YouTube",
    src: "/assets/brand/icons/youtube.svg",
  },
  {
    className: "h-7 w-7",
    href: "/",
    label: "X",
    src: "/assets/brand/icons/x.svg",
  },
  {
    className: "h-7 w-7",
    href: "https://www.facebook.com/querypie",
    label: "Facebook",
    src: "/assets/brand/icons/Facebook.svg",
  },
  {
    className: "h-7 w-7",
    href: "https://www.instagram.com/querypie.ai",
    label: "Instagram",
    src: "/assets/brand/icons/Instagram.svg",
  },
] as const;

export default function Footer({
  addressLines = [
    "© 2017-2026 QueryPie, Inc. All rights reserved.",
    "Headquarters : CHEQUER Global, Inc., 2525 West 8th Street, Suite 300, Los Angeles, CA 90057",
    "R&D : 주식회사 쿼리파이, 7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul 07807",
    "Japan : QueryPie AI合同会社, 〒105-6490 東京都港区虎ノ門1丁目17番1号 虎ノ門ヒルズビジネスタワー15階",
  ],
  className,
  legalLinks = ["Cookie Preference", "Terms of Service", "Privacy Policy", "EULA"],
  locale = "en",
  sections = getShellMenuCopy(locale).footerSections,
}: FooterProps) {
  const [copyright, ...officeLines] = addressLines;

  return (
    <footer
      className={cx(
        "relative flex w-full justify-center overflow-hidden bg-bg px-5 md:px-10 md:bg-[image:var(--gradient-footer)]",
        className,
      )}
    >
      {/* 실제 푸터 콘텐츠 래퍼 */}
      <div className="relative flex w-full max-w-[1200px] flex-col gap-[60px] border-t border-border py-[60px]">
        <div className="flex flex-col gap-10 md:gap-12">
          {/* 메뉴와 분리해 모든 언어에서 링크 열의 너비를 확보한다. */}
          <a aria-label="QueryPie AI" className="inline-flex h-5 w-[116px] shrink-0 items-center" href={getLocalePath(locale as Locale, "/")}>
            <img
              alt="QueryPie AI"
              className="theme-icon block h-5 w-[116px]"
              src="/assets/brand/logos/querypie-ai-logo.svg"
            />
          </a>

          {/* 모바일 2열, 태블릿 3열, 데스크톱은 전체 메뉴를 한 줄로 배치한다. */}
          <div className={cx(
            "grid grid-cols-2 items-start gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-12 xl:gap-x-6",
            sections.length === 5
              ? "xl:grid-cols-[1.2fr_1.6fr_0.8fr_1.3fr_0.8fr]"
              : "xl:grid-cols-[1.25fr_1.3fr_0.8fr_1.3fr_0.8fr_0.55fr]",
          )}>
            {sections.map((section) => (
              <div
                key={section.title}
                className="flex min-w-0 flex-col gap-5 type-body-md leading-6"
              >
                <p className="m-0 text-mute">{section.title}</p>
                <div className="flex flex-col gap-[10px] text-fg">
                  {section.items.map((item) => {
                    const href = getFooterHref(item, locale);
                    const isExternal = href.startsWith("http");

                    return (
                      <a
                        key={item}
                        className="inline-flex max-w-full self-start items-start gap-1.5 transition-colors hover:text-mute"
                        href={href}
                        rel={isExternal ? "noreferrer noopener" : undefined}
                        target={isExternal ? "_blank" : undefined}
                      >
                        <span className="min-w-0 [overflow-wrap:anywhere]">{item}</span>
                        {isExternal ? (
                          <ExternalLinkIcon className="mt-[5px] h-3.5 w-3.5 shrink-0 text-mute" />
                        ) : null}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 메타 영역: SNS / 법적 링크 / 주소 */}
        <div className="flex flex-col gap-6 pt-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* SNS 링크 */}
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-[14px]">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      aria-label={link.label}
                      className="inline-flex h-7 w-7 items-center justify-center opacity-100 transition-opacity hover:opacity-50"
                      href={link.href}
                      rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                    >
                      <img
                        alt=""
                        aria-hidden="true"
                        className={`theme-icon ${link.className}`}
                        src={link.src}
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* 법적 링크 */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-[10px] type-body-md leading-5 text-fg">
              {legalLinks.map((item) => (
                <a
                  key={item}
                  className={cx(
                    "transition-colors hover:text-mute",
                    ["Privacy Policy", "개인정보처리방침", "プライバシーポリシー"].includes(item) &&
                      "font-bold",
                  )}
                  href={getLegalHref(item, locale)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* 회사 주소 및 카피라이트 */}
          <div className="flex flex-col gap-[10px] leading-5">
            <p className="m-0 type-body-md text-fg opacity-50">{copyright}</p>
            <div className="type-body-sm text-fg opacity-50">
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
