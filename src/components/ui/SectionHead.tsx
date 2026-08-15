import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

interface SectionHeadProps {
  eyebrow: string;
  readout?: string;
}

/** The labelled rule that opens every section on the site. */
export function SectionHead({ eyebrow, readout }: SectionHeadProps) {
  return (
    <div className={styles.head} data-reveal>
      <span className="label">{eyebrow}</span>
      {readout ? (
        <span className={`label label--blue ${styles.readout}`}>{readout}</span>
      ) : null}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className={`display ${styles.title}`} data-reveal>
      {children}
    </h2>
  );
}
