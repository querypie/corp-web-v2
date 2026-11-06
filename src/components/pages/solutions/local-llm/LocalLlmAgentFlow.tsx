import { ArrowRight, BrainCircuit, ClipboardList, FileSearch, Plug, ShieldCheck, Workflow } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { localLlmCopy } from "@/copy/localLlm";

const agentIcons = [ClipboardList, BrainCircuit, FileSearch, Workflow, Plug, ShieldCheck];

export default function LocalLlmAgentFlow() {
  return (
    <ol className="m-0 grid w-full list-none gap-8 p-0 xl:grid-cols-6 xl:gap-6">
      {localLlmCopy.agents.cards.map((card, index) => {
        const Icon = agentIcons[index];
        return (
          <li className="relative min-w-0 rounded-box bg-bg px-6 py-8 xl:px-4" key={card.step}>
            <div className="flex h-full flex-col items-center text-center">
              <div className="flex h-20 items-center justify-center">
                <Icon aria-hidden="true" className="h-12 w-12 shrink-0 text-brand" strokeWidth={1.5} />
              </div>
              <div className="mt-6"><Badge variant="secondary">Step {card.step}</Badge></div>
              <h3 className="mb-0 mt-4 flex items-center justify-center text-pretty type-h3 text-fg xl:min-h-14">{card.title}</h3>
              <span aria-hidden="true" className="my-5 h-0.5 w-8 shrink-0 bg-border" />
              <p className="m-0 type-body-md text-mute">{card.body}</p>
            </div>
            {index < localLlmCopy.agents.cards.length - 1 ? (
              <span aria-hidden="true" className="absolute left-1/2 top-full z-10 flex h-8 w-6 -translate-x-1/2 items-center justify-center xl:left-full xl:top-1/2 xl:h-6 xl:translate-x-0 xl:-translate-y-1/2">
                <span className="relative flex h-6 w-6 items-center justify-center text-brand">
                  <ArrowRight className="h-4 w-4 rotate-90 xl:rotate-0" />
                </span>
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
