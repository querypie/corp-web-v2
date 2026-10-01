import { BrainCircuit, ChartColumnIncreasing, Check, CodeXml, Cpu, Languages, SlidersHorizontal } from "lucide-react";
import { localLlmCopy } from "@/copy/localLlm";

const developmentIcons = {
  development: BrainCircuit,
  compute: Cpu,
  qlm: Languages,
  "open-source": CodeXml,
  benchmark: ChartColumnIncreasing,
  customization: SlidersHorizontal,
};

export default function LocalLlmDevelopmentCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {localLlmCopy.development.cards.map((card) => {
        const Icon = developmentIcons[card.id];
        return (
          <article className="row-span-3 grid min-w-0 grid-rows-subgrid rounded-box bg-bg-content px-6 py-8 xl:px-4" key={card.id}>
            <div className="flex h-20 items-center justify-center">
              <Icon aria-hidden="true" className="h-12 w-12 text-fg" strokeWidth={1.5} />
            </div>
            <h3 className="m-0 text-pretty type-h3 text-fg">{card.title}</h3>
            <ul className="m-0 list-none space-y-3 p-0">
              {card.points.map((point) => (
                <li className="flex items-start gap-1 type-body-sm text-mute" key={point}>
                  <Check aria-hidden="true" className="mt-1 h-3 w-3 shrink-0 text-brand" />
                  <span className="min-w-0">{point}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
