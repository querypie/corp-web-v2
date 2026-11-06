import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiGatewayContent from "./AiGatewayContent";
import { aiGatewaySecurityCopy } from "@/copy/aiGatewaySecurity";

describe("AiGatewayContent", () => {
  it("필요성과 기존 핵심 기능을 유지한다", () => {
    render(<AiGatewayContent />);

    expect(screen.getByRole("heading", { name: "AI運用の課題" })).toBeInTheDocument();
    const features = screen.getByRole("heading", { name: "AIの一元管理" }).closest("section")!;
    expect(within(features).getAllByRole("article")).toHaveLength(6);
    expect(within(features).getByRole("heading", { name: "再デプロイなしでモデルを切り替え" })).toBeInTheDocument();
    expect(within(features).getByText(/許可されたツールだけを利用/)).toBeInTheDocument();
    expect(within(features).getByText(/価格情報がないモデル/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "役割に応じたアクセス制御" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "MCPツールを集約" })).not.toBeInTheDocument();
  });

  it.each(["ko", "en", "ja"] as const)("%s에서 DLP와 ACP 연동을 설명한다", locale => {
    render(<AiGatewayContent locale={locale} />);
    const { dlp, acp } = aiGatewaySecurityCopy[locale];
    const dlpSection = screen.getByRole("heading", { name: dlp.title }).closest("section")!;
    const steps = within(within(dlpSection).getByRole("list")).getAllByRole("listitem");
    expect(steps).toHaveLength(3);
    dlp.points.forEach((point, index) => {
      expect(within(steps[index]).getByRole("heading", { name: point.title })).toBeInTheDocument();
      expect(within(steps[index]).getByText(point.body)).toBeInTheDocument();
    });
    const scan = screen.getByRole("figure", { name: dlp.label });
    expect(within(scan).getByRole("table", { name: dlp.scan })).toBeInTheDocument();
    dlp.rows.forEach(row => expect(within(scan).getByText(row.preview)).toBeInTheDocument());
    expect(screen.getByRole("heading", { name: acp.title })).toBeInTheDocument();
    const diagram = screen.getByRole("figure", { name: acp.label });
    expect(within(diagram).getByRole("heading", { level: 3, name: "QueryPie ACP" })).toBeInTheDocument();
    expect(within(diagram).getByRole("heading", { level: 3, name: "AI Gateway" })).toBeInTheDocument();
    expect(within(diagram).getByText(acp.user)).toBeInTheDocument();
    expect(within(diagram).getByRole("img", { name: "Gemini" })).toBeInTheDocument();
    acp.resources.forEach(resource => expect(within(diagram).getByText(resource)).toBeInTheDocument());
  });
});
