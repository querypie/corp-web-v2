import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Gnb from "./Gnb";

const routerPush = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: routerPush }),
}));

describe("Gnb", () => {
  it("팝오버 메뉴를 누르는 동안 blur가 발생해도 click 전에는 닫히지 않는다", () => {
    render(<Gnb locale="en" />);

    const trigger = screen.getByRole("button", { name: "Solutions" });
    const popoverRoot = trigger.parentElement;

    if (!popoverRoot) {
      throw new Error("Solutions popover root not found");
    }

    fireEvent.mouseEnter(popoverRoot);

    const item = screen.getByRole("link", { name: "AI Platform (AIP)" });
    const popover = item.closest(".absolute");

    expect(popover).toHaveClass("pointer-events-auto");

    fireEvent.pointerDown(item);
    fireEvent.blur(trigger, { relatedTarget: null });

    expect(popover).toHaveClass("pointer-events-auto");

    fireEvent.pointerUp(item);
    fireEvent.click(item, { ctrlKey: true });

    expect(popover).toHaveClass("pointer-events-none");
  });
});
