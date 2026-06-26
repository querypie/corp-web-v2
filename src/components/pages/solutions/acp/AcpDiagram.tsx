"use client";

import type { Locale } from "@/constants/i18n";
import { useEffect, useRef, useState } from "react";
import styles from "./AcpDiagram.module.css";

const assetBase = "/solutions/acp/Diagram";
const diagramWidth = 1080;
const diagramHeight = 480;

const roleItems = [
  { icon: "role-ai-agents.png", label: "AI Agents" },
  { icon: "role-developers.png", label: "Developers" },
  { icon: "role-admin.png", label: "Admin" },
  { icon: "role-general-user.png", label: "General user" },
] as const;

const capabilityItems = [
  { icon: "access-control.svg", label: "Access Control" },
  { icon: "approval.svg", label: "Approval" },
  { icon: "audit-logging.svg", label: "Audit Logging" },
  { icon: "dlp.svg", label: "DLP (Data Loss Prevention)" },
  { icon: "policy.svg", label: "Policy" },
  { icon: "session-recording.svg", label: "Session Recording" },
] as const;

const targetItems = [
  { icon: "target-data.svg", label: "Data" },
  { icon: "target-system.svg", label: "System" },
  { icon: "target-kubernetes.svg", label: "Kubernetes" },
  { icon: "target-web.svg", label: "Web/SaaS" },
  { icon: "target-mcp.svg", label: "MCP Tools", padded: true },
] as const;

const diagramCopy = {
  en: {
    ariaLabel: "QueryPie ACP access flow diagram",
    roleTitle: "User",
    roles: ["AI Agents", "Developers", "Admin", "General user"],
    controllerSubtitle: "AI Control Platform",
    capabilities: [
      "Access Control",
      "Approval",
      "Audit Logging",
      "DLP (Data Loss Prevention)",
      "Policy",
      "Session Recording",
    ],
    targetTitle: "Approach target",
    targets: ["Data", "System", "Kubernetes", "Web/SaaS", "MCP Tools"],
  },
  ko: {
    ariaLabel: "QueryPie ACP 접근 흐름 다이어그램",
    roleTitle: "사용자",
    roles: ["AI 에이전트", "개발자", "관리자", "일반 사용자"],
    controllerSubtitle: "AI 제어 플랫폼",
    capabilities: ["접근 제어", "승인", "감사 로그", "DLP (데이터 보호)", "정책", "세션 녹화"],
    targetTitle: "접근 대상",
    targets: ["데이터", "시스템", "Kubernetes", "Web/SaaS", "MCP 도구"],
  },
  ja: {
    ariaLabel: "QueryPie ACPアクセスフロー図",
    roleTitle: "ユーザー",
    roles: ["AIエージェント", "開発者", "管理者", "一般ユーザー"],
    controllerSubtitle: "AI制御プラットフォーム",
    capabilities: ["アクセス制御", "承認", "監査ログ", "DLP (データ保護)", "ポリシー", "セッション録画"],
    targetTitle: "アクセス対象",
    targets: ["データ", "システム", "Kubernetes", "Web/SaaS", "MCPツール"],
  },
} satisfies Record<
  Locale,
  {
    ariaLabel: string;
    roleTitle: string;
    roles: string[];
    controllerSubtitle: string;
    capabilities: string[];
    targetTitle: string;
    targets: string[];
  }
>;

const leftFlowPaths = [
  "M5.76576e-06 9L0.505293 9C22.5967 9 40.5053 26.9086 40.5053 49L40.5053 93.5053C40.5053 115.318 58.1877 133 80 133L180 133",
  "M-1.86364e-06 91L9.79973 91C24.4136 91 37.8643 98.9696 44.8836 111.787L45.2126 112.388C52.1725 125.098 65.5096 133 80 133L180 133",
  "M-1.86364e-06 175L9.79973 175C24.4136 175 37.8643 167.03 44.8836 154.213L45.2126 153.612C52.1725 140.902 65.5096 133 80 133L180 133",
  "M1.46468e-05 259L0.505302 259C22.5967 259 40.5053 241.091 40.5053 219L40.5053 172.495C40.5053 150.682 58.1877 133 80 133L180 133",
] as const;

const rightFlowPaths = [
  "M460 133L560 133C581.812 133 599.495 115.318 599.495 93.5053L599.495 41C599.495 18.9086 617.403 0.999999 639.495 1L640 1",
  "M460 133L560 133L560.694 133C580.048 133 596.418 118.682 598.995 99.5C601.571 80.3177 617.941 66 637.296 66L640 66",
  "M460 133L640 133",
  "M460 133L560 133L560.694 133C580.048 133 596.418 147.318 598.995 166.5C601.571 185.682 617.941 200 637.296 200L640 200",
  "M460 133L560 133C581.812 133 599.495 150.682 599.495 172.495L599.495 225C599.495 247.091 617.403 265 639.495 265L640 265",
] as const;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function iconSrc(icon: string) {
  return `${assetBase}/${icon}`;
}

function SidePanel({
  className,
  items,
  title,
  variant,
}: {
  className?: string;
  items: readonly { icon: string; label: string; padded?: boolean }[];
  title: string;
  variant: "role" | "target";
}) {
  return (
    <div
      className={cx(
        "flex flex-col items-center gap-5 overflow-hidden rounded-modal px-5 py-5",
        className,
      )}
    >
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-bg-content to-bg-content/0"
        aria-hidden="true"
      />
      <p className="relative z-20 m-0 text-center font-sans text-sm leading-5 text-fg">{title}</p>
      <div className="relative z-20 flex w-full flex-col gap-2.5">
        {items.map((item) => (
          <div
            key={item.icon}
            className={cx(
              "flex w-full items-center gap-2.5 rounded-box bg-bg px-5 text-fg",
              variant === "role" ? "py-5" : "py-3",
            )}
          >
            <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden">
              <img
                alt=""
                aria-hidden="true"
                className={cx("block object-contain", item.padded ? "size-6" : "size-8")}
                height={32}
                src={iconSrc(item.icon)}
                width={32}
              />
            </span>
            <span className="min-w-0 font-sans text-sm leading-5 text-fg">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShieldPanel({ className, subtitle, capabilities }: { className?: string; subtitle: string; capabilities: string[] }) {
  return (
    <div
      className={cx(
        styles.shieldPanel,
        "relative flex flex-col items-center overflow-hidden rounded-modal px-9 pb-8 pt-10",
        className,
      )}
    >
      <img
        alt=""
        aria-hidden="true"
        className={cx(styles.shieldPanelArtwork, "absolute inset-0 block size-full object-cover")}
        height={480}
        src={iconSrc("shield-mask.svg")}
        width={280}
      />
      <div className="relative flex w-full flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-5">
          <AcpControllerIcon className="h-[46px] w-10" />
          <div className="flex w-full flex-col items-center gap-2.5">
            <p className={cx(styles.controllerTitle, "m-0 whitespace-nowrap text-center font-sans text-lg font-medium leading-6 tracking-[0] text-fg")}>
              QueryPie ACP
            </p>
            <p className={cx(styles.controllerBadge, "m-0 rounded-full bg-bg px-3 py-0.5 text-center font-sans text-xs font-light leading-[18px] text-fg")}>
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3.5">
          {capabilityItems.map((item, index) => (
            <div key={item.icon} className="flex w-full items-center gap-2.5">
              <img
                alt=""
                aria-hidden="true"
                className="size-[18px] shrink-0"
                height={18}
                src={iconSrc(item.icon)}
                width={18}
              />
              <span className="font-sans text-sm leading-5 text-fg">{capabilities[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AcpControllerIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cx(styles.controllerIcon, "pointer-events-none", className)}
      fill="none"
      height={46}
      overflow="visible"
      preserveAspectRatio="none"
      viewBox="0 0 40 46"
      width={40}
    >
      <path
        className={styles.controllerIconBg}
        d="M6.10351e-05 21.0833L2.8193e-05 7.66668C2.8193e-05 7.66668 7.87428 6.5489 10.9091 5.3077C14.1084 3.99922 20 0 20 0C20 0 25.8916 3.99922 29.0909 5.3077C32.1257 6.5489 40 7.66668 40 7.66668V21.0833C40 32.7876 31.4666 43.3428 20 46C8.53332 43.3428 6.10351e-05 32.7876 6.10351e-05 21.0833Z"
      />
      <path
        clipRule="evenodd"
        d="M24.1421 14.7157C21.8545 12.4281 18.1455 12.4281 15.8579 14.7157L11.7157 18.8579C9.42809 21.1455 9.42809 24.8545 11.7157 27.1421L15.8579 31.2843C18.1455 33.5719 21.8545 33.5719 24.1421 31.2843L25.0463 30.3801L22.9837 28.3175L22.4853 28.816C21.1127 30.1886 18.8873 30.1886 17.5147 28.816L14.201 25.5023C12.8284 24.1297 12.8284 21.9043 14.201 20.5317L17.5147 17.218C18.8873 15.8454 21.1127 15.8454 22.4853 17.218L25.799 20.5317C27.1716 21.9043 27.1716 24.1297 25.799 25.5023L25.5519 25.7494L27.6144 27.812L28.2843 27.1421C30.5719 24.8545 30.5719 21.1455 28.2843 18.8579L24.1421 14.7157ZM21.218 20.0759C20.5317 19.3896 19.419 19.3896 18.7327 20.0759L17.0759 21.7327C16.3896 22.419 16.3896 23.5317 17.0759 24.218L18.7327 25.8749C19.419 26.5611 20.5317 26.5611 21.218 25.8749L22.8749 24.218C23.5611 23.5317 23.5611 22.419 22.8749 21.7327L21.218 20.0759Z"
        fill="var(--color-white)"
        fillRule="evenodd"
      />
    </svg>
  );
}

function AnimatedConnectionFlow({ svgRef }: { svgRef?: (svg: SVGSVGElement | null) => void }) {
  return (
    <svg
      aria-hidden="true"
      className={cx(styles.connectionFlow, "pointer-events-none absolute left-[220px] top-[88px] z-20 h-[264px] w-[640px]")}
      fill="none"
      height={266}
      overflow="visible"
      preserveAspectRatio="none"
      ref={svgRef}
      viewBox="0 0 640 266"
      width={640}
    >
      {leftFlowPaths.map((path) => (
        <g className={styles.flowPulse} key={path}>
          <line className={styles.flowPulseHalo} x1="-9" x2="7" y1="0" y2="0" />
          <line className={styles.flowPulseCore} x1="-5" x2="5" y1="0" y2="0" />
          <animateMotion
            calcMode="linear"
            dur="4.8s"
            keyPoints="0;1;1"
            keyTimes="0;0.46;1"
            path={path}
            repeatCount="indefinite"
            rotate="auto"
          />
          <animate
            attributeName="opacity"
            dur="4.8s"
            keyTimes="0;0.04;0.43;0.48;1"
            repeatCount="indefinite"
            values="0;1;1;0;0"
          />
        </g>
      ))}
      {rightFlowPaths.map((path) => (
        <g className={styles.flowPulse} key={path}>
          <line className={styles.flowPulseHalo} x1="-9" x2="7" y1="0" y2="0" />
          <line className={styles.flowPulseCore} x1="-5" x2="5" y1="0" y2="0" />
          <animateMotion
            calcMode="linear"
            dur="4.8s"
            keyPoints="0;0;1;1"
            keyTimes="0;0.56;0.96;1"
            path={path}
            repeatCount="indefinite"
            rotate="auto"
          />
          <animate
            attributeName="opacity"
            dur="4.8s"
            keyTimes="0;0.56;0.6;0.94;1"
            repeatCount="indefinite"
            values="0;0;1;1;0"
          />
        </g>
      ))}
    </svg>
  );
}

function ConnectorLock({ className, side }: { className: string; side: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={cx(styles.lock, side === "right" && styles.lockRight, "pointer-events-none", className)}
      fill="none"
      height={46}
      overflow="visible"
      preserveAspectRatio="none"
      viewBox="0 0 40 46"
      width={40}
    >
      <path
        className={styles.lockBg}
        d="M6.10351e-05 21.0833L2.8193e-05 7.66668C2.8193e-05 7.66668 7.87428 6.5489 10.9091 5.3077C14.1084 3.99922 20 0 20 0C20 0 25.8916 3.99922 29.0909 5.3077C32.1257 6.5489 40 7.66668 40 7.66668V21.0833C40 32.7876 31.4666 43.3428 20 46C8.53332 43.3428 6.10351e-05 32.7876 6.10351e-05 21.0833Z"
      />
      <path
        d="M16.1111 20.4V18C16.1111 16.9391 16.5208 15.9217 17.2501 15.1716C17.9794 14.4214 18.9686 14 20 14C21.0314 14 22.0206 14.4214 22.7499 15.1716C23.4792 15.9217 23.8889 16.9391 23.8889 18V20.4M20.7778 25.2C20.7778 25.6418 20.4296 26 20 26C19.5704 26 19.2222 25.6418 19.2222 25.2C19.2222 24.7582 19.5704 24.4 20 24.4C20.4296 24.4 20.7778 24.7582 20.7778 25.2ZM14.5556 20.4H25.4444C26.3036 20.4 27 21.1163 27 22V28.4C27 29.2837 26.3036 30 25.4444 30H14.5556C13.6964 30 13 29.2837 13 28.4V22C13 21.1163 13.6964 20.4 14.5556 20.4Z"
        stroke="var(--color-fg)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

export default function AcpDiagram({ locale }: { locale: Locale }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const animationSvgRef = useRef<SVGSVGElement | null>(null);
  const [scale, setScale] = useState(1);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const copy = diagramCopy[locale];
  const localizedRoleItems = roleItems.map((item, index) => ({ ...item, label: copy.roles[index] }));
  const localizedTargetItems = targetItems.map((item, index) => ({ ...item, label: copy.targets[index] }));

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      setScale(Math.min(1, frame.clientWidth / diagramWidth));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAnimationActive(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.08 },
    );

    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = animationSvgRef.current;
    if (!svg) return;

    if (isAnimationActive && document.visibilityState === "visible") {
      svg.unpauseAnimations();
      return;
    }

    svg.pauseAnimations();
  }, [isAnimationActive]);

  return (
    <section className="flex w-full justify-center" aria-label={copy.ariaLabel}>
      <div className="w-full max-w-[1200px]">
        <div ref={frameRef} className="mx-auto w-full max-w-[1080px]">
          <div
            className="relative w-full overflow-hidden"
            style={{
              height: diagramHeight * scale,
            }}
          >
            <div
              className={cx(
                "absolute left-0 top-0 h-[480px] w-[1080px] origin-top-left",
                !isAnimationActive && styles.paused,
              )}
              style={{
                transform: `scale(${scale})`,
              }}
            >
              <SidePanel
                className="absolute left-0 top-0 h-[480px] w-[240px]"
                items={localizedRoleItems}
                title={copy.roleTitle}
                variant="role"
              />
              <img
                alt=""
                aria-hidden="true"
                className="absolute left-[220px] top-[88px] z-10 h-[264px] w-[640px]"
                height={264}
                src={iconSrc("connections.svg")}
                width={640}
              />
              <AnimatedConnectionFlow
                svgRef={(svg) => {
                  animationSvgRef.current = svg;
                  if (svg && !isAnimationActive) {
                    svg.pauseAnimations();
                  }
                }}
              />
              <ConnectorLock className="absolute left-[320px] top-[197px] z-30 h-[46px] w-[40px]" side="left" />
              <ConnectorLock className="absolute left-[720px] top-[197px] z-30 h-[46px] w-[40px]" side="right" />
              <ShieldPanel
                capabilities={copy.capabilities}
                className="absolute left-[400px] top-0 h-[480px] w-[280px]"
                subtitle={copy.controllerSubtitle}
              />
              <SidePanel
                className="absolute right-0 top-0 h-[480px] w-[240px]"
                items={localizedTargetItems}
                title={copy.targetTitle}
                variant="target"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
