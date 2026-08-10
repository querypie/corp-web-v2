import type { ComponentProps } from "react";
import Badge from "@/components/ui/Badge";
import SolutionIcon from "./SolutionIcon";
import styles from "./AiCrewPlatformDiagram.module.css";

const japaneseItems = [
  {
    icon: "brain",
    label: "頭脳",
    title: "Brain",
    tag: "マルチLLM / データ保護",
    points: ["業務特性に合わせて最適なLLMを使い分け", "入力した社内データの外部学習はなし"],
    position: "top",
  },
  {
    icon: "connect",
    label: "連携",
    title: "Connect",
    tag: "社内連携 / アクセス制御",
    points: ["ゼロトラスト基準で社内システムと繋がり文脈を理解", "QueryPieが誇る厳格なアクセス制御"],
    position: "right",
  },
  {
    icon: "knowledge",
    label: "業務知識",
    title: "Knowledge",
    tag: "業務再現 / 事実参照",
    points: ["手順書を記憶しハルシネーションを抑える", "自社の信頼できるデータを参照"],
    position: "bottom",
  },
  {
    icon: "shield",
    label: "統制",
    title: "Governance",
    tag: "監査ログ / 人の承認",
    points: ["エンタープライズ水準の監査ログ", "シャドーAIや情報漏洩リスクを低減"],
    position: "left",
  },
] as const;

type PlatformItem = {
  icon: ComponentProps<typeof SolutionIcon>["name"];
  label: string;
  title: string;
  tag: string;
  points: readonly string[];
  position: "top" | "right" | "bottom" | "left";
};

type Props = {
  coreBody?: string;
  items?: readonly PlatformItem[];
};

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function PlatformCard({ item, positioned = false }: { item: PlatformItem; positioned?: boolean }) {
  return (
    <article className={cx(styles.card, positioned && styles[item.position])}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <SolutionIcon className={styles.icon} name={item.icon} />
        </div>
        <h3 className={`${styles.cardTitle} type-h2`}>
          {item.label} <span className="type-body-md">{item.title}</span>
        </h3>
      </div>
      <Badge className={styles.tag} variant="primary">{item.tag}</Badge>
      <ul className={styles.points}>
        {item.points.map((point) => (
          <li key={point}>
            <span className={styles.bullet} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function PlatformCore({ body }: { body: string }) {
  return (
    <div className={styles.core}>
      <div className={styles.coreContent}>
        <p className={`${styles.coreKicker} type-body-sm`}>Secure Enterprise AI</p>
        <p className={`${styles.coreTitle} type-h2`}>
          QueryPie <span className="text-brand">AIP</span>
        </p>
        <p className={`${styles.coreBody} type-body-sm`}>{body}</p>
      </div>
    </div>
  );
}

export default function AiCrewPlatformDiagram({
  coreBody = "AIエージェントの実務性能とガバナンスを支える中核基盤",
  items = japaneseItems,
}: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.diagram}>
        <div className={cx(styles.ring, styles.ringOuter)} />
        <div className={styles.diagramGrid}>
          <PlatformCore body={coreBody} />
          {items.map((item) => <PlatformCard item={item} key={item.title} positioned />)}
        </div>
      </div>
    </div>
  );
}
