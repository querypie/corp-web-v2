const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

async function main() {
  const [inputPath, outputPath, renderId] = process.argv.slice(2);

  if (!inputPath || !outputPath || !renderId) {
    throw new Error("Usage: node scripts/render-mermaid-svg.cjs <inputPath> <outputPath> <renderId>");
  }

  const dompurifyPath = require.resolve("dompurify");
  require.cache[dompurifyPath] = {
    exports: {
      sanitize: (value) => value,
    },
  };

  const win = new JSDOM("<div id='root'></div>", { pretendToBeVisual: true }).window;
  global.window = win;
  global.document = win.document;
  global.navigator = win.navigator;
  global.Element = win.Element;
  global.HTMLElement = win.HTMLElement;
  global.SVGElement = win.SVGElement;
  global.SVGSVGElement = win.SVGSVGElement;

  const proto = win.SVGElement.prototype;
  if (!proto.getBBox) {
    proto.getBBox = function getBBox() {
      const text = this.textContent || "";
      return { x: 0, y: 0, width: Math.max(24, text.length * 8), height: 24 };
    };
  }

  if (!proto.getComputedTextLength) {
    proto.getComputedTextLength = function getComputedTextLength() {
      const text = this.textContent || "";
      return Math.max(24, text.length * 8);
    };
  }

  const mermaidPkg = require("mermaid");
  const mermaid = mermaidPkg.default || mermaidPkg;
  mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "dark" });

  const source = fs.readFileSync(path.resolve(inputPath), "utf8");
  const { svg } = await mermaid.render(renderId, source);
  fs.writeFileSync(path.resolve(outputPath), svg, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
