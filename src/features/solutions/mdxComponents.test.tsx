import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildSolutionMdxComponents } from "./mdxComponents";

function getComponents() {
  return buildSolutionMdxComponents({ locale: "ko", searchParams: { category: "db" } }) as any;
}

describe("buildSolutionMdxComponents", () => {
  it("내부 Link href에 locale prefix를 붙인다", () => {
    const { Link } = getComponents();

    render(<Link href="/solutions/aip">AIP</Link>);

    expect(screen.getByRole("link", { name: "AIP" })).toHaveAttribute(
      "href",
      "/ko/solutions/aip",
    );
  });

  it("Integrations는 현재 category에 맞는 product만 노출한다", () => {
    const { Integrations } = getComponents();

    render(
      <Integrations
        allLabel="All"
        basePath="/solutions/acp/integrations"
        categories={[
          { id: "db", label: "Databases" },
          { id: "cloud", label: "Cloud" },
        ]}
        products={[
          { categoryIds: ["db"], label: "PostgreSQL", svgFilename: "postgresql-icon" },
          { categoryIds: ["cloud"], label: "AWS", svgFilename: "aws-icon" },
        ]}
      />, 
    );

    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.queryByText("AWS")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Databases (1)" })).toHaveAttribute(
      "href",
      "/ko/solutions/acp/integrations?category=db",
    );
  });

  it("KillerFeatures는 marker children을 카드 목록으로 렌더링한다", () => {
    const { KillerFeatures, KillerFeatureCategory, KillerFeature, LearnMoreLink } = getComponents();

    render(
      <KillerFeatures title="ACP Features">
        <KillerFeatureCategory label="Database Access Control">
          <KillerFeature
            title="Sensitive Data Masking"
            description="Protect critical data."
            image="public/solutions/acp/dac3.gif"
          >
            <LearnMoreLink href="https://docs.querypie.com/en/test">Learn More</LearnMoreLink>
          </KillerFeature>
        </KillerFeatureCategory>
      </KillerFeatures>,
    );

    expect(screen.getByText("ACP Features")).toBeInTheDocument();
    expect(screen.getByText("Database Access Control")).toBeInTheDocument();
    expect(screen.getByText("Sensitive Data Masking")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Learn More" })).toHaveAttribute(
      "href",
      "https://docs.querypie.com/en/test",
    );
  });
});
