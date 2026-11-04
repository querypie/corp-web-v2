import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PenetrationTestingPage from "./PenetrationTestingPage";

describe("PenetrationTestingPage", () => {
  it("히어로, 검증 영역, 사전 확인, 진행 흐름과 일본어 문의 동선을 제공한다", () => {
    render(<PenetrationTestingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("攻撃者の視点で、");
    expect(screen.getByRole("figure", { name: /ペネトレーションテストで検証/ })).toBeInTheDocument();
    const features = screen.getByRole("heading", { name: "検証したい領域から、テストを設計。" }).closest("section")!;
    expect(within(features).getAllByRole("article")).toHaveLength(6);
    expect(screen.getByRole("table", { name: "事前に確認する項目" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "相談から改善まで、一つの流れで。" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "相談する" })).toHaveAttribute("href", "/ja/contact-us");
    expect(screen.queryByText("Gateway Key")).not.toBeInTheDocument();
  });
});
