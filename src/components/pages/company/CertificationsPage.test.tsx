import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getCompanySubItems } from "@/constants/navigation";
import { trustCenterCopy, trustCenterHref } from "@/copy/trustCenter";
import Footer from "@/components/layout/Footer";
import CertificationsPage from "./CertificationsPage";

describe("트러스트 센터 연결", () => {
  it.each(["en", "ko", "ja"] as const)("%s 인증 페이지와 푸터에서 새 탭으로 연결하고 GNB는 유지한다", (locale) => {
    const copy = trustCenterCopy[locale];
    render(<>
      <CertificationsPage intro="Introduction" title="Certifications" items={[]} locale={locale} />
      <Footer locale={locale} />
    </>);
    expect(screen.getByText(copy.description)).toBeInTheDocument();
    const links = screen.getAllByRole("link", { name: "Trust Center" });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute("href", trustCenterHref);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
    expect(getCompanySubItems(locale).some(item => item.href === trustCenterHref)).toBe(false);
  });
});
