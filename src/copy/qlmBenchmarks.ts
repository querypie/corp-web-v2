// Artificial Analysis public initialModels data, checked 2026-11-18.
// Effort: Terra Max; Sonnet Max (Default Fallback); Argon High;
// Sources: https://artificialanalysis.ai/models/gpt-6-1-terra
// https://artificialanalysis.ai/models/claude-sonnet-5-5
// https://artificialanalysis.ai/models/gemini-4-argon
// https://artificialanalysis.ai/models/deepseek-v4-1-flash
// Competitor percentages are rounded to one decimal place, Elo to whole points.
// QLM display values are maintained separately from competitor source data.
export const qlmBenchmarkModels = ["QLM", "GPT-6.1 Terra", "Claude Sonnet 5.5", "Gemini 4 Argon"];

export const qlmBenchmarkRows = [
  { benchmark: "AutomationBench-AA", metric: "Partial score", values: ["75–80%", "60.2%", "71.8%", "77.5%"] },
  { benchmark: "GDPval-AA v2.1", metric: "Elo", values: ["1,750–1,800", "1,476", "1,838", "1,634"] },
  { benchmark: "AA-LCR v1.1", metric: "Accuracy", values: ["80–85%", "82.7%", "82.7%", "79.7%"] },
  { benchmark: "FrontierCode 1.1", metric: "Score", values: ["45.4%", "36.0%", "45.8%", "43.5%"] },
];
