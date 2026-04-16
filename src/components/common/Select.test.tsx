import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Select from "./Select";

const OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

describe("Select", () => {
  it("옵션 목록을 렌더링한다", () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option A" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option B" })).toBeInTheDocument();
  });

  it("placeholder가 있으면 disabled option으로 렌더링한다", () => {
    render(<Select options={OPTIONS} placeholder="Select one" />);
    const placeholderOption = screen.getByRole("option", { name: "Select one" });
    expect(placeholderOption).toBeDisabled();
  });

  it("placeholder가 없으면 placeholder 옵션을 렌더링하지 않는다", () => {
    render(<Select options={OPTIONS} />);
    expect(screen.queryByRole("option", { name: /Select/ })).not.toBeInTheDocument();
  });

  it("값을 선택하면 onChange가 호출된다", () => {
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("비제어 모드: 선택 후 내부 상태가 변경된다", () => {
    render(<Select options={OPTIONS} defaultValue="a" />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "c" } });
    expect(select.value).toBe("c");
  });

  it("value prop이 있으면 해당 값이 선택된 상태로 렌더링된다", () => {
    render(<Select options={OPTIONS} value="b" />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("b");
  });
});
