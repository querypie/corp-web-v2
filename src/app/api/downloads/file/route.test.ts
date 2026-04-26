// @vitest-environment node
import path from "path";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockReadFile } = vi.hoisted(() => ({
  mockReadFile: vi.fn(),
}));

vi.mock("fs", () => ({
  promises: {
    readFile: mockReadFile,
  },
}));

import { GET } from "./route";

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/downloads/file", () => {
  it("documentation PDF는 읽어서 attachment 응답을 반환한다", async () => {
    mockReadFile.mockResolvedValue(Buffer.from("pdf-data"));

    const request = new Request(
      "http://localhost/api/downloads/file?src=/documentation/white-papers/sample.pdf&fileName=sample.pdf",
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toContain('filename="sample.pdf"');
    expect(mockReadFile).toHaveBeenCalledWith(
      path.join(process.cwd(), "public", "documentation", "white-papers", "sample.pdf"),
    );
  });

  it("demo PDF는 읽어서 attachment 응답을 반환한다", async () => {
    mockReadFile.mockResolvedValue(Buffer.from("pdf-data"));

    const request = new Request(
      "http://localhost/api/downloads/file?src=/demo/webinars/sample.pdf&fileName=sample.pdf",
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockReadFile).toHaveBeenCalledWith(
      path.join(process.cwd(), "public", "demo", "webinars", "sample.pdf"),
    );
  });

  it("허용되지 않은 public 경로는 404를 반환한다", async () => {
    const request = new Request(
      "http://localhost/api/downloads/file?src=/path/solutions/acp/acp-integration.pdf&fileName=sample.pdf",
    );
    const response = await GET(request);
    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(404);
    expect(data.error).toBe("File not found.");
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("PDF가 아니면 400을 반환한다", async () => {
    const request = new Request(
      "http://localhost/api/downloads/file?src=/documentation/white-papers/sample.png&fileName=sample.png",
    );
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(mockReadFile).not.toHaveBeenCalled();
  });
});
