import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

interface PageIntroProps {
  /** Small technical label above the rule, e.g. "PÉCLET / DISCIPLINES". */
  eyebrow: string;
  /** Right-hand technical readout, e.g. "06 PHENOMENA". */
  readout?: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}

/**
 * The standard opening of every inner page: a labelled rule, an architectural
 * title, and an offset lede. Consistency here is what makes the site feel
 * like one instrument rather than a set of pages.
 */
export function PageIntro({
  eyebrow,
  readout,
  title,
  lede,
  children,
}: PageIntroProps) {
  return (
    <header className={styles.intro}>
      <div className="shell">
        <div className={styles.meta}>
          <span className="label">{eyebrow}</span>
          {readout ? (
            <span className="label label--blue" style={{ marginLeft: "auto" }}>
              {readout}
            </span>
          ) : null}
        </div>

        <h1 className={`display ${styles.title}`} data-reveal>
          {title}
        </h1>

        {lede || children ? (
          <div className={styles.body}>
            <div className={styles.lede} data-reveal data-reveal-delay="80">
              {lede ? <p className="lede">{lede}</p> : null}
              {children}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
