import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiCrewBeforeAfter from "./AiCrewBeforeAfter";
import { aiCrewCopy } from "./aiCrewCopy";

describe("AiCrewBeforeAfter", () => {
  it("기존 Before/After 역할과 작업 내용을 생략하지 않고 표시한다", () => {
    const { description: _description, titleLines: _titleLines, ...copy } = aiCrewCopy.ko.beforeAfter;

    render(<AiCrewBeforeAfter {...copy} />);

    expect(screen.getByText("1차 대응에 시간이 걸린다")).toBeInTheDocument();
    expect(screen.getByText("정보가 흩어져 조사와 확인에 시간이 걸린다.")).toBeInTheDocument();
    expect(screen.getByText("아래 준비가 많고 본래 판단에 시간을 사용할 수 없다")).toBeInTheDocument();
    expect(screen.getAllByText("사람에 의한 최종 판단")).toHaveLength(2);

    for (const task of [...copy.humanTasks, ...copy.crewTasks]) {
      expect(screen.getAllByText(task).length).toBeGreaterThanOrEqual(2);
    }
  });
});
