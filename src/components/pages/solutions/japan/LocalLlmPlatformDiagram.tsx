import Image from "next/image";
import { Bot, BrainCircuit, ClipboardCheck, FileSearch, Landmark, LockKeyhole, Server, Workflow } from "lucide-react";
import { localLlmCopy } from "@/copy/localLlm";

const platformIcons = {
  data: LockKeyhole,
  llm: BrainCircuit,
  agent: Bot,
  rag: FileSearch,
  mcp: Workflow,
  audit: ClipboardCheck,
  security: Landmark,
  operations: Server,
};

const nodePositions = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-1 lg:row-start-2",
  "lg:col-start-1 lg:row-start-3",
  "lg:col-start-1 lg:row-start-4",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-3 lg:row-start-3",
  "lg:col-start-3 lg:row-start-4",
];

export default function LocalLlmPlatformDiagram() {
  const copy = localLlmCopy.platform;

  return (
    <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-x-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <span className="absolute bottom-[12.5%] left-[30%] top-[12.5%] w-[7%] rounded-r-box border-y border-r border-fg" />
        <span className="absolute left-[30%] top-[37.5%] w-[7%] border-t border-fg" />
        <span className="absolute left-[30%] top-[62.5%] w-[7%] border-t border-fg" />
        <span className="absolute left-[37%] top-1/2 w-[26%] border-t border-fg" />
        <span className="absolute bottom-[12.5%] right-[30%] top-[12.5%] w-[7%] rounded-l-box border-y border-l border-fg" />
        <span className="absolute right-[30%] top-[37.5%] w-[7%] border-t border-fg" />
        <span className="absolute right-[30%] top-[62.5%] w-[7%] border-t border-fg" />
      </div>

      <div className="relative flex justify-center py-4 sm:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:self-center lg:py-0">
        <div className="flex aspect-square w-4/5 max-w-xs flex-col items-center justify-center gap-4 rounded-full bg-fg p-6 text-center lg:max-w-none">
          <Image alt="" aria-hidden="true" className="h-12 w-12" height={48} src="/assets/brand/logos/querypie-symbol.svg" width={48} />
          <div className="flex flex-col items-center gap-2">
            <p className="m-0 type-h2 text-bg" lang="en" translate="no">{copy.name}</p>
            <p className="m-0 text-pretty type-body-sm text-bg">{copy.subtitle}</p>
          </div>
        </div>
      </div>

      {copy.items.map((item, index) => {
        const Icon = platformIcons[item.id];
        return (
          <article className={`relative flex min-w-0 items-start gap-4 rounded-box bg-bg-content p-5 ${nodePositions[index]}`} key={item.id}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-box bg-bg text-fg">
              <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <h3 className="m-0 text-pretty type-h3 text-fg">{item.title}</h3>
              <p className="mb-0 mt-2 type-body-sm text-mute">{item.body}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
