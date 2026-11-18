import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const testPattern = /\.(?:test|spec)\.[cm]?[jt]sx?$/;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : file;
  }))).flat();
}

const files = (await walk(sourceRoot)).filter(file => /\.tsx?$/.test(file));
const sources = new Map(await Promise.all(files.map(async file => [file, await readFile(file, "utf8")])));
const importers = new Map(files.map(file => [file, new Set()]));

function resolveLocal(specifier, from) {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return;
  const base = specifier.startsWith("@/")
    ? path.join(sourceRoot, specifier.slice(2))
    : path.resolve(path.dirname(from), specifier);
  return [base, `${base}.tsx`, `${base}.ts`, path.join(base, "index.tsx"), path.join(base, "index.ts")].find(file => sources.has(file));
}

for (const [file, text] of sources) {
  if (testPattern.test(file)) continue;
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  function visit(node) {
    let specifier;
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      specifier = node.moduleSpecifier.text;
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      specifier = node.arguments[0].text;
    }
    const target = specifier && resolveLocal(specifier, file);
    if (target) importers.get(target).add(file);
    ts.forEachChild(node, visit);
  }
  visit(source);
}

const components = [...sources].filter(([file]) => file.startsWith(path.join(sourceRoot, "components") + path.sep) && file.endsWith(".tsx") && !testPattern.test(file))
  .map(([file, text]) => ({
    path: path.relative(root, file),
    lines: text.split("\n").length,
    client: /^\s*["']use client["'];?/m.test(text),
    importers: [...importers.get(file)].map(importer => path.relative(root, importer)).sort(),
  }));

const report = {
  componentCount: components.length,
  clientEntryCount: components.filter(component => component.client).length,
  // A static import count is a review hint, not proof of runtime reachability.
  unreferenced: components.filter(component => !component.importers.length),
  shared: components.filter(component => component.importers.length > 1).sort((a, b) => b.importers.length - a.importers.length),
  largest: [...components].sort((a, b) => b.lines - a.lines).slice(0, 10),
};

if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`컴포넌트 파일 ${report.componentCount}개 / Client 진입 파일 ${report.clientEntryCount}개`);
  console.log("\n실행 코드의 import가 없는 파일 (삭제 전 라우트·동적 참조 확인 필요)");
  report.unreferenced.forEach(component => console.log(`  ${component.path}`));
  console.log("\n여러 파일에서 사용하는 컴포넌트");
  report.shared.forEach(component => console.log(`  ${String(component.importers.length).padStart(2)}곳  ${component.path}`));
  console.log("\n크기가 큰 파일 (분리 필요 여부는 책임·상태 경계로 판단)");
  report.largest.forEach(component => console.log(`  ${String(component.lines).padStart(5)}줄  ${component.path}`));
}
