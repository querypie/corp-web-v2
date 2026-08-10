import type { ComponentProps } from "react";
import SolutionIcon from "./SolutionIcon";
import styles from "./AiCrewBeforeAfter.module.css";

type IconName = ComponentProps<typeof SolutionIcon>["name"];

type Props = {
  afterTitle: string;
  beforePoints: readonly string[];
  beforeTitle: string;
  crewLabel: string;
  crewTasks: readonly string[];
  decisionLabel: string;
  humanLabel: string;
  humanTasks: readonly string[];
};

const beforeIcons: ReadonlyArray<{ icon: IconName; position: string }> = [
  { icon: "search", position: "left-6 top-4 -rotate-[10deg]" },
  { icon: "folder", position: "left-[114px] top-[58px] rotate-[12deg]" },
  { icon: "analysis", position: "bottom-[92px] left-[42px] -rotate-[12deg]" },
  { icon: "message", position: "right-[78px] top-[16px] rotate-[9deg]" },
  { icon: "knowledge", position: "bottom-[112px] right-[28px] -rotate-[10deg]" },
  { icon: "layers", position: "bottom-[70px] left-[142px] rotate-[7deg]" },
  { icon: "shield", position: "bottom-[48px] right-[150px] -rotate-[7deg]" },
  { icon: "calendar", position: "left-[16px] top-[130px] rotate-[8deg]" },
];

const afterGhostIcons: ReadonlyArray<{ icon: IconName; position: string }> = [
  { icon: "search", position: "left-[62px] top-[30px]" },
  { icon: "layers", position: "right-[62px] top-[30px]" },
  { icon: "knowledge", position: "left-[24px] top-[122px]" },
  { icon: "analysis", position: "right-[24px] top-[122px]" },
  { icon: "shield", position: "bottom-[70px] left-[56px]" },
  { icon: "search", position: "bottom-[70px] right-[56px]" },
  { icon: "layers", position: "left-[150px] top-[6px]" },
  { icon: "knowledge", position: "right-[150px] top-[6px]" },
];

const afterOrbitIcons: ReadonlyArray<{ icon: IconName; position: string }> = [
  { icon: "search", position: "right-[132px] top-[44px]" },
  { icon: "layers", position: "right-[34px] top-[112px]" },
  { icon: "knowledge", position: "bottom-[118px] right-[138px]" },
  { icon: "analysis", position: "bottom-[110px] right-[30px]" },
];

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function PersonSilhouette({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 100 100">
      <path
        d="M50 2C35 2 29 12 30 27c-4 1-3 13 1 15 2 8 5 14 9 17v7c-1 4-9 7-19 11C7 82 2 88 1 98c29 4 69 4 98 0-1-10-6-16-20-21-10-4-18-7-19-11v-7c4-3 7-9 9-17 4-2 5-14 1-15 1-15-5-22-12-21-2-3-5-4-8-4Z"
        stroke="var(--color-border-strong)"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function TaskColumn({ label, tasks, positioned }: { label: string; positioned?: "left" | "right"; tasks: readonly string[] }) {
  return (
    <div className={cx(
      "rounded-[1rem] shadow-lg backdrop-blur-sm",
      positioned ? "px-3 py-4" : "px-3 py-3",
      positioned && "absolute top-1/2 z-30 w-[124px] -translate-y-1/2",
      positioned === "left" && "left-[14px]",
      positioned === "right" && "right-[14px]",
      styles.afterPanel,
    )}>
      <p className={cx("m-0 uppercase tracking-[0.12em] type-body-sm", styles.afterMuted)}>{label}</p>
      <div className={cx("grid", positioned ? "mt-3 gap-2" : "mt-2 gap-1.5")}>
        {tasks.map((task) => <div className={cx("rounded-[0.9rem] type-body-sm", positioned ? "px-3 py-2" : "px-2.5 py-1.5", styles.afterTask)} key={task}>{task}</div>)}
      </div>
    </div>
  );
}

function HumanDecision({ decisionLabel, inverted = false }: { decisionLabel: string; inverted?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <PersonSilhouette className={cx("h-[74px] w-[74px]", inverted ? styles.afterCoreIcon : "text-fg")} />
      <span className={cx("mt-2 text-center type-body-sm", inverted ? styles.afterCoreMuted : "text-mute")}>{decisionLabel}</span>
    </div>
  );
}

export default function AiCrewBeforeAfter({
  afterTitle,
  beforePoints,
  beforeTitle,
  crewLabel,
  crewTasks,
  decisionLabel,
  humanLabel,
  humanTasks,
}: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-[1.8rem] bg-bg p-6">
        <div className="text-center">
          <p className="m-0 type-h2 text-fg">Before</p>
          <p className="mb-0 mt-1 type-body-md text-mute">{beforeTitle}</p>
        </div>
        <div className="mt-8 flex min-h-[18rem] items-center justify-center">
          <div className="relative h-[320px] w-full max-w-[27rem]">
            {beforeIcons.map(({ icon, position }) => (
              <div className={cx("absolute", position)} key={`${icon}-${position}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-bg-content text-fg shadow-lg">
                  <SolutionIcon className="h-[18px] w-[18px]" name={icon} />
                </div>
              </div>
            ))}
            <div className="absolute left-1/2 top-[44%] z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg-content shadow-lg">
              <PersonSilhouette className="h-11 w-11 text-fg" />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2">
              {beforePoints.map((point) => (
                <div className="max-w-[330px] rounded-full border border-border bg-bg px-4 py-2 text-center type-body-sm text-fg shadow-lg" key={point}>{point}</div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <article className={cx("rounded-[1.8rem] p-6", styles.afterCard)}>
        <div className="text-center">
          <p className={cx("m-0 type-h2", styles.afterForeground)}>After</p>
          <p className={cx("mb-0 mt-1 type-body-md", styles.afterMuted)}>{afterTitle}</p>
        </div>

        <div className="mt-5 lg:hidden">
          <div className="flex flex-col items-center gap-3">
            <div className={cx("flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full shadow-lg sm:h-[136px] sm:w-[136px]", styles.afterCore)}>
              <HumanDecision decisionLabel={decisionLabel} inverted />
            </div>
            <div className="grid w-full max-w-[30rem] grid-cols-2 gap-2">
              <TaskColumn label={humanLabel} tasks={humanTasks} />
              <TaskColumn label={crewLabel} tasks={crewTasks} />
            </div>
          </div>
        </div>

        <div className="mt-8 hidden min-h-[18rem] items-center justify-center lg:flex">
          <div className="relative h-[356px] w-full max-w-[33rem]">
            {afterGhostIcons.map(({ icon, position }) => (
              <div className={cx("absolute z-10 flex h-11 w-11 items-center justify-center rounded-[15px] opacity-[0.18]", position, styles.afterGhost)} key={`${icon}-${position}`}>
                <SolutionIcon className="h-4 w-4" name={icon} />
              </div>
            ))}
            <div className={cx("absolute left-1/2 top-1/2 z-20 h-[312px] w-[312px] -translate-x-1/2 -translate-y-1/2 rounded-full border", styles.afterRing)} />
            <div className={cx("absolute left-1/2 top-1/2 z-30 flex h-[154px] w-[154px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full shadow-lg", styles.afterCore)}>
              <HumanDecision decisionLabel={decisionLabel} inverted />
            </div>
            {afterOrbitIcons.map(({ icon, position }) => (
              <div className={cx("absolute z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg", position, styles.afterOrbit)} key={`${icon}-${position}`}>
                <SolutionIcon className="h-5 w-5" name={icon} />
              </div>
            ))}
            <div className={cx("absolute left-1/2 top-[22px] z-40 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full shadow-lg", styles.afterOrbit)}>
              <SolutionIcon className="h-5 w-5" name="shield" />
            </div>
            <div className={cx("absolute left-1/2 top-[88px] z-40 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 type-body-sm shadow-lg", styles.afterOrbit)}>{crewTasks[crewTasks.length - 1]}</div>
            <TaskColumn label={humanLabel} positioned="left" tasks={humanTasks} />
            <TaskColumn label={crewLabel} positioned="right" tasks={crewTasks} />
          </div>
        </div>
      </article>
    </div>
  );
}
