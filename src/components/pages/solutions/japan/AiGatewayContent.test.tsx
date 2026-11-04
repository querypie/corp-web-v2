import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiGatewayContent from "./AiGatewayContent";

describe("AiGatewayContent", () => {
  it("필요성, 기능, 접근제어, MCP 도구 묶음을 설명한다", () => {
    render(<AiGatewayContent />);

    expect(screen.getByRole("heading", { name: "AI運用の課題" })).toBeInTheDocument();
    const roles = screen.getByRole("heading", { name: "役割に応じたアクセス制御" }).closest("section")!;
    expect(within(roles).getAllByRole("article")).toHaveLength(4);
    expect(within(roles).getByText(/読み取り専用/)).toBeInTheDocument();
    const scopeTable = within(roles).getByRole("table", { name: "役割ごとの権限範囲" });
    const orgAdmin = within(scopeTable).getByRole("rowheader", { name: "org-admin" }).closest("tr")!;
    expect(within(orgAdmin).getAllByRole("cell").map(cell => cell.textContent)).toEqual(["割り当て可能", "対象外"]);
    const auditor = within(scopeTable).getByRole("rowheader", { name: "audit-viewer" }).closest("tr")!;
    expect(within(auditor).getAllByRole("cell").map(cell => cell.textContent)).toEqual(["割り当て可能", "割り当て可能"]);
    const features = screen.getByRole("heading", { name: "AI接続を一元管理" }).closest("section")!;
    expect(within(features).getAllByRole("article")).toHaveLength(6);
    expect(within(features).getByRole("heading", { name: "再デプロイなしでモデルを切り替え" })).toBeInTheDocument();
    expect(within(features).getByText(/許可されたツールだけを利用/)).toBeInTheDocument();
    expect(within(features).getByText(/価格情報がないモデル/)).toBeInTheDocument();
    const toolset = screen.getByRole("heading", { name: "MCPツールを集約" }).closest("section")!;
    const diagram = within(toolset).getByRole("figure", { name: /GitHub・Slack・Notion・Google Drive/ });
    expect(within(diagram).getAllByText("選択したツール")).toHaveLength(4);
    expect(within(diagram).getByText("Toolset Endpoint")).toBeInTheDocument();
  });
});
