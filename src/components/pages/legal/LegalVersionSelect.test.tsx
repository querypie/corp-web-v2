import { fireEvent, render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

import { useRouter } from "next/navigation";
import LegalVersionSelect from "./LegalVersionSelect";

const OPTIONS = [
  { href: "/en/legal/privacy-policy/v1", label: "v1 (2024-01-01)", value: "v1" },
  { href: "/en/legal/privacy-policy/v2", label: "v2 (2025-01-01)", value: "v2" },
  { href: "/en/legal/privacy-policy/v3", label: "v3 (2026-01-01)", value: "v3" },
];

describe("LegalVersionSelect", () => {
  it("마운트 전에는 선택된 레이블을 텍스트로 표시한다 (SSR 폴백)", () => {
    // mounted=false 상태에서의 SSR 폴백 렌더링
    render(<LegalVersionSelect options={OPTIONS} value="v2" />);
    expect(screen.getByText("v2 (2025-01-01)")).toBeInTheDocument();
  });

  it("마운트 후에는 select 요소를 렌더링한다", async () => {
    render(<LegalVersionSelect options={OPTIONS} value="v2" />);
    // useEffect로 mounted=true가 되면 Select 컴포넌트가 렌더링됨
    await act(async () => {});
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("마운트 후 옵션을 변경하면 해당 href로 router.push를 호출한다", async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);

    render(<LegalVersionSelect options={OPTIONS} value="v1" />);
    await act(async () => {});

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "v3" } });

    expect(mockPush).toHaveBeenCalledWith("/en/legal/privacy-policy/v3");
  });

  it("존재하지 않는 value여도 select를 정상 렌더링한다", async () => {
    render(<LegalVersionSelect options={OPTIONS} value="unknown-version" />);
    await act(async () => {});
    // 알 수 없는 value여도 select는 렌더링되어야 한다
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    // 옵션 목록은 정상적으로 존재해야 한다
    expect(screen.getAllByRole("option")).toHaveLength(OPTIONS.length);
  });
});
