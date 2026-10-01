import {
  ArrowRight, Bot, BrainCircuit, CirclePlay, Database, FileClock, FileSearch,
  LockKeyhole, MessageCircleQuestion, Plug, Puzzle,
  ShieldAlert, ShieldCheck, Unplug, Users,
} from "lucide-react";
import { localLlmCopy } from "@/copy/localLlm";

const beforeIcons = [MessageCircleQuestion, ShieldAlert, LockKeyhole, Puzzle, FileClock, Unplug];
const afterIcons = [Database, ShieldCheck, Users, Plug, FileSearch, CirclePlay];

export default function LocalLlmComparison() {
  const { before, after } = localLlmCopy.comparison;

  return (
    <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-1">
      <div className="theme-dark min-w-0 rounded-modal bg-secondary p-6 md:p-8">
        <header className="text-center">
          <h3 className="m-0 text-pretty type-h2 text-fg">{before.title}</h3>
        </header>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <span aria-hidden="true" className="flex h-12 items-center justify-center">
              <BrainCircuit className="h-12 w-12 text-fg" strokeWidth={1.5} />
            </span>
            <div>
              <p className="m-0 type-body-md text-fg">{before.source}</p>
              <p className="mb-0 mt-1 type-body-sm text-mute">({before.result})</p>
            </div>
          </div>
        </div>

        <ul className="mb-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
          {before.items.map((item, index) => {
            const Icon = beforeIcons[index];
            return (
              <li className="relative min-w-0 rounded-box bg-bg-content p-3" key={item.title}>
                <Icon aria-hidden="true" className="h-6 w-6 text-fg" strokeWidth={1.5} />
                <h4 className="mb-0 mt-3 text-pretty type-body-md text-fg">{item.title}</h4>
                <p className="mb-0 mt-2 type-body-sm text-mute">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div aria-hidden="true" className="flex items-center justify-center text-brand">
        <ArrowRight className="h-6 w-6 rotate-90 xl:rotate-0" />
      </div>

      <div className="relative min-w-0 rounded-modal bg-bg p-6 md:p-8">
        <header className="text-center">
          <h3 className="m-0 text-pretty type-h2 text-fg">{after.title}</h3>
        </header>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <span aria-hidden="true" className="flex h-12 items-center justify-center">
              <Bot className="h-12 w-12 text-brand" strokeWidth={1.5} />
            </span>
            <div>
              <p className="m-0 type-body-md text-fg">{after.source}</p>
              <p className="mb-0 mt-1 type-body-sm text-brand">{after.result}</p>
            </div>
          </div>
        </div>

        <ul className="mb-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
          {after.items.map((item, index) => {
            const Icon = afterIcons[index];
            return (
              <li className="relative min-w-0 rounded-box bg-bg-content p-3" key={item.title}>
                <Icon aria-hidden="true" className="h-6 w-6 text-fg" strokeWidth={1.5} />
                <h4 className="mb-0 mt-3 text-pretty type-body-md text-fg">{item.title}</h4>
                <p className="mb-0 mt-2 type-body-sm text-mute">{item.body}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-center justify-center gap-3 rounded-box border border-brand p-4">
          <LockKeyhole aria-hidden="true" className="h-6 w-6 shrink-0 text-brand" />
          <div>
            <p className="m-0 type-body-md text-brand">{after.foundation}</p>
            <p className="mb-0 mt-1 type-body-sm text-mute">{after.foundationBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
