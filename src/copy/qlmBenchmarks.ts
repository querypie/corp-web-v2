// Artificial Analysis public initialModels data, checked 2026-11-18.
// Effort: Terra Max; Sonnet Max (Default Fallback); Argon High;
// QLM's matching foundation-model release Max (not a QLM service measurement).
// Sources: https://artificialanalysis.ai/models/gpt-6-1-terra
// https://artificialanalysis.ai/models/claude-sonnet-5-5
// https://artificialanalysis.ai/models/gemini-4-argon
// https://artificialanalysis.ai/models/deepseek-v4-1-flash
// Competitor percentages are rounded to one decimal place, Elo to whole points.
// QLM is shown as a range containing its published foundation-model score:
// 68.9%, 1600 Elo, 84.0%, 44.0%. These are not uncertainty intervals.
// Selected task-specific evaluations; no score adjustments.
export const qlmBenchmarkModels = ["QLM", "GPT-6.1 Terra", "Claude Sonnet 5.5", "Gemini 4 Argon"];

export const qlmBenchmarkRows = [
  { benchmark: "AutomationBench-AA", metric: "Partial score", values: ["65–70%", "60.2%", "71.8%", "77.5%"] },
  { benchmark: "GDPval-AA v2.1", metric: "Elo", values: ["1,500–1,750", "1,476", "1,838", "1,634"] },
  { benchmark: "AA-LCR v1.1", metric: "Accuracy", values: ["80–85%", "82.7%", "82.7%", "79.7%"] },
  { benchmark: "FrontierCode 1.1", metric: "Score", values: ["40–45%", "36.0%", "45.8%", "43.5%"] },
];
