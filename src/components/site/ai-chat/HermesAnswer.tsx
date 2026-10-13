import { renderHermesMarkdown } from "@/features/ai-chat/markdown";
import styles from "./HermesAnswer.module.css";

export default function HermesAnswer({ children, tableLabel }: { children: string; tableLabel: string }) {
  return <div className={styles.answer} dangerouslySetInnerHTML={{ __html: renderHermesMarkdown(children, tableLabel) }} />;
}
