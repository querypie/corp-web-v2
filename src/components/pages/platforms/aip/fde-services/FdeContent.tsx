import {
  ArrowDown, ArrowRight, Bot, BrainCircuit, ChartColumnIncreasing, Check,
  Database, FileSearch, Layers, Plug, Search,
  ShieldCheck, Target, Users, Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FdeCopy } from "@/copy/fde";

function IconTile({ icon: Icon, onShaded = false }: { icon: LucideIcon; onShaded?: boolean }) {
  return (
    <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-box ${onShaded ? "bg-bg" : "bg-bg-content"} text-fg`}>
      <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
    </span>
  );
}

function DetailCard({ title, body, icon: Icon, bareIcon = false, shaded = false }: { title: string; body: string; icon: LucideIcon; bareIcon?: boolean; shaded?: boolean }) {
  return (
    <article className={`flex min-w-0 flex-col items-start gap-5 rounded-box ${shaded ? "bg-bg-content" : "bg-bg"} p-6 md:p-8`}>
      {bareIcon ? null : <IconTile icon={Icon} onShaded={shaded} />}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="m-0 min-w-0 text-pretty type-h3 text-fg">{title}</h3>
          {bareIcon ? <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-fg" strokeWidth={1.5} /> : null}
        </div>
        <p className="m-0 type-body-md text-mute">{body}</p>
      </div>
    </article>
  );
}

const discoveryIcons = [Search, Database, Target];
const inputIcons = [FileSearch, BrainCircuit];
const outputIcons = [Plug, Users];
const exampleIcons = [FileSearch, Workflow, Layers];

export function FdeDiscovery({ copy }: { copy: FdeCopy["discovery"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {copy.cards.map((card, index) => <DetailCard {...card} shaded icon={discoveryIcons[index]} key={card.title} />)}
    </div>
  );
}

export function FdePlanning({ copy }: { copy: FdeCopy["planning"] }) {
  return (
    <ol className="m-0 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
      {copy.steps.map((step, index) => {
        return (
          <li className="relative flex min-w-0 flex-col rounded-box bg-bg-content p-6" key={step.title}>
            <span className="type-h1 tabular-nums text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mb-3 mt-6 text-pretty type-h3 text-fg">{step.title}</h3>
            <p className="mb-6 mt-0 flex-1 type-body-md text-mute">{step.body}</p>
            <div className="space-y-2 border-t border-border pt-4">
              <p className="m-0 type-body-sm font-medium text-fg">{step.output}</p>
            </div>
            {index < copy.steps.length - 1 ? (
              <ArrowRight aria-hidden="true" className="absolute -right-6 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-brand lg:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function AgentNode({ title, body, icon: Icon }: { title: string; body: string; icon: LucideIcon }) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-4 rounded-box bg-bg-content p-5 text-left">
      <Icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-brand" strokeWidth={1.5} />
      <div className="min-w-0 space-y-2">
        <h3 className="m-0 text-left text-pretty type-h3 text-fg">{title}</h3>
        <p className="m-0 type-body-sm text-mute">{body}</p>
      </div>
    </div>
  );
}

export function FdeBuilding({ copy }: { copy: FdeCopy["building"] }) {
  return (
    <div className="space-y-10">
      <div className="rounded-box bg-bg p-5 md:p-8">
        <div className="grid items-stretch gap-5 lg:grid-cols-3 lg:gap-10">
          <div className="flex min-w-0 flex-col gap-4">
            {copy.inputs.map((item, index) => <AgentNode {...item} icon={inputIcons[index]} key={item.title} />)}
          </div>
          <div className="relative min-w-0 self-center">
            <ArrowRight aria-hidden="true" className="absolute -left-7 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-brand lg:block" />
            <ArrowDown aria-hidden="true" className="mx-auto mb-5 h-5 w-5 text-brand lg:hidden" />
            <div className="theme-inverse flex flex-col items-center gap-5 rounded-box bg-bg p-8 text-center text-fg">
              <Bot aria-hidden="true" className="h-12 w-12 text-brand" strokeWidth={1.5} />
              <p className="m-0 type-body-sm" lang="en" translate="no">QueryPie AIP</p>
              <h3 className="m-0 w-full text-balance type-h2">{copy.agent.title}</h3>
              <p className="m-0 w-full text-pretty type-body-md">{copy.agent.body}</p>
            </div>
            <ArrowDown aria-hidden="true" className="mx-auto mt-5 h-5 w-5 text-brand lg:hidden" />
            <ArrowRight aria-hidden="true" className="absolute -right-7 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-brand lg:block" />
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            {copy.outputs.map((item, index) => <AgentNode {...item} icon={outputIcons[index]} key={item.title} />)}
          </div>
        </div>
        <div className="mt-8 flex items-start gap-4 border-t border-border pt-6 text-left">
          <IconTile icon={ShieldCheck} />
          <div className="min-w-0 space-y-2 text-left">
            <h3 className="m-0 text-left text-pretty type-h3 text-fg">{copy.foundation.title}</h3>
            <p className="m-0 text-left type-body-md text-mute">{copy.foundation.body}</p>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <p className="m-0 text-center type-body-lg font-medium text-fg">{copy.examplesLabel}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {copy.examples.map((item, index) => <DetailCard {...item} bareIcon icon={exampleIcons[index]} key={item.title} />)}
        </div>
      </div>
    </div>
  );
}

export function FdeOperations({ copy }: { copy: FdeCopy["operations"] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-box border border-border p-6 md:p-8">
          <div className="flex items-center gap-4">
            <h3 className="m-0 text-pretty type-h2 text-fg">{copy.checklistTitle}</h3>
          </div>
          <ul className="mb-0 mt-8 list-none space-y-6 p-0">
            {copy.checklist.map((item) => (
              <li className="flex items-start gap-3" key={item.title}>
                <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand" />
                <div className="space-y-2">
                  <h4 className="m-0 type-h3 text-fg">{item.title}</h4>
                  <p className="m-0 type-body-md text-mute">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-box border border-border p-6 md:p-8">
          <div className="flex items-center gap-4">
            <h3 className="m-0 text-pretty type-h2 text-fg">{copy.cycleTitle}</h3>
          </div>
          <ul className="mb-0 mt-8 list-none space-y-6 p-0">
            {copy.cycle.map((item) => (
              <li className="flex items-start gap-3" key={item.title}>
                <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand" />
                <div className="space-y-2">
                  <h4 className="m-0 type-h3 text-fg">{item.title}</h4>
                  <p className="m-0 type-body-md text-mute">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-5 rounded-box bg-bg-deep p-6 md:flex-row md:items-center md:p-8">
        <ChartColumnIncreasing aria-hidden="true" className="h-10 w-10 shrink-0 text-fg" strokeWidth={1.5} />
        <div className="space-y-2">
          <h3 className="m-0 text-pretty type-h3 text-fg">{copy.feedback.title}</h3>
          <p className="m-0 type-body-md text-mute">{copy.feedback.body}</p>
        </div>
      </div>
    </div>
  );
}
