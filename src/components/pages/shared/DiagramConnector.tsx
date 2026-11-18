import styles from "./DiagramConnector.module.css";

export default function DiagramConnector() {
  return <span className={styles.connector} aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor" /></svg></span>;
}
