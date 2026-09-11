import { readFile } from "node:fs/promises";

const cases = JSON.parse(await readFile(new URL("./answer-eval-cases.json", import.meta.url), "utf8"));
const endpoint = process.env.AI_CHAT_EVAL_URL ?? "http://localhost:3000/api/ai-chat";
const requestedIds = new Set((process.env.AI_CHAT_EVAL_CASES ?? "").split(",").map((value) => value.trim()).filter(Boolean));
const selectedCases = requestedIds.size ? cases.filter(({ id }) => requestedIds.has(id)) : cases;
const concurrency = Math.max(1, Number.parseInt(process.env.AI_CHAT_EVAL_CONCURRENCY ?? "2", 10));
const requestTimeoutMs = Math.max(1_000, Number.parseInt(process.env.AI_CHAT_EVAL_TIMEOUT_MS ?? "30000", 10));

if (!selectedCases.length) throw new Error("No answer evaluation cases selected.");

const normalize = (value) => String(value ?? "").normalize("NFKC").toLowerCase();
const includes = (value, term) => normalize(value).includes(normalize(term));
const percentile = (values, fraction) => {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
};

function inspectResponse(testCase, payload, elapsedMs) {
  const failures = [];
  const expected = testCase.expect;
  const answer = payload?.answer ?? "";
  const sources = Array.isArray(payload?.sources) ? payload.sources : [];
  const sourceUrls = sources.map(({ url }) => url).filter(Boolean);

  if (payload?.status !== expected.status) failures.push(`status: expected ${expected.status}, received ${payload?.status ?? "missing"}`);
  for (const term of expected.answerAll ?? []) {
    if (!includes(answer, term)) failures.push(`answer missing required term: ${term}`);
  }
  for (const group of expected.answerAnyGroups ?? []) {
    if (!group.some((term) => includes(answer, term))) failures.push(`answer missing one of: ${group.join(" | ")}`);
  }
  for (const term of expected.answerNone ?? []) {
    if (includes(answer, term)) failures.push(`answer contains forbidden term: ${term}`);
  }

  const minSources = expected.minSources ?? (expected.status === "answered" ? 1 : 0);
  const maxSources = expected.maxSources ?? (expected.status === "answered" ? Infinity : 0);
  if (sources.length < minSources) failures.push(`sources: expected at least ${minSources}, received ${sources.length}`);
  if (sources.length > maxSources) failures.push(`sources: expected at most ${maxSources}, received ${sources.length}`);
  for (const term of expected.sourceUrlAll ?? []) {
    if (!sourceUrls.some((url) => includes(url, term))) failures.push(`source URL missing required pattern: ${term}`);
  }
  if (expected.sourceUrlAny?.length && !sourceUrls.some((url) => expected.sourceUrlAny.some((term) => includes(url, term)))) {
    failures.push(`source URLs missing all accepted patterns: ${expected.sourceUrlAny.join(" | ")}`);
  }
  for (const url of sourceUrls) {
    try {
      if (new URL(url).protocol !== "https:") failures.push(`source URL is not HTTPS: ${url}`);
    } catch {
      failures.push(`source URL is invalid: ${url}`);
    }
  }
  if (elapsedMs > (expected.maxLatencyMs ?? 10_000)) failures.push(`latency: ${elapsedMs}ms exceeded ${expected.maxLatencyMs ?? 10_000}ms`);

  return failures;
}

async function evaluate(testCase, index) {
  const startedAt = performance.now();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Each case represents an independent anonymous website visitor. Vercel
        // overwrites this header in production; it only prevents one local test
        // process from exhausting a single visitor's request budget.
        "x-vercel-forwarded-for": `198.51.100.${(index % 250) + 1}`,
      },
      body: JSON.stringify({ locale: testCase.locale, messages: testCase.messages }),
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    const elapsedMs = Math.round(performance.now() - startedAt);
    const text = await response.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      return { ...testCase, passed: false, elapsedMs, failures: [`invalid JSON response (HTTP ${response.status})`], raw: text.slice(0, 500) };
    }
    if (!response.ok) {
      return { ...testCase, passed: false, elapsedMs, failures: [`HTTP ${response.status}: ${payload?.error ?? text.slice(0, 300)}`], response: payload };
    }
    const failures = inspectResponse(testCase, payload, elapsedMs);
    return { id: testCase.id, group: testCase.group, locale: testCase.locale, question: testCase.messages.at(-1)?.content, passed: failures.length === 0, elapsedMs, failures, response: payload };
  } catch (error) {
    return { id: testCase.id, group: testCase.group, locale: testCase.locale, question: testCase.messages.at(-1)?.content, passed: false, elapsedMs: Math.round(performance.now() - startedAt), failures: [error instanceof Error ? error.message : String(error)] };
  }
}

const results = new Array(selectedCases.length);
let nextIndex = 0;
async function worker() {
  while (true) {
    const index = nextIndex++;
    if (index >= selectedCases.length) return;
    const result = await evaluate(selectedCases[index], index);
    results[index] = result;
    process.stderr.write(`${result.passed ? "PASS" : "FAIL"} ${result.id} (${result.elapsedMs}ms)${result.failures.length ? ` — ${result.failures.join("; ")}` : ""}\n`);
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, selectedCases.length) }, () => worker()));

const durations = results.map(({ elapsedMs }) => elapsedMs);
const groups = Object.fromEntries([...new Set(results.map(({ group }) => group))].map((group) => {
  const groupResults = results.filter((result) => result.group === group);
  return [group, { passed: groupResults.filter(({ passed }) => passed).length, total: groupResults.length }];
}));
const report = {
  endpoint,
  generatedAt: new Date().toISOString(),
  summary: {
    passed: results.filter(({ passed }) => passed).length,
    failed: results.filter(({ passed }) => !passed).length,
    total: results.length,
    passRate: Number((results.filter(({ passed }) => passed).length / results.length).toFixed(4)),
    averageLatencyMs: Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length),
    p95LatencyMs: percentile(durations, 0.95),
    groups,
  },
  results,
};

console.log(JSON.stringify(report, null, 2));
if (report.summary.failed) process.exitCode = 1;
