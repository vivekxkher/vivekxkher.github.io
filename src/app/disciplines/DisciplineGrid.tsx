"use client";

import Link from "next/link";
import { useState } from "react";
import { DisciplineGlyph } from "@/components/viz/DisciplineGlyph";
import { disciplines } from "@/content/disciplines";
import styles from "./page.module.css";

export function DisciplineGrid() {
  const [live, setLive] = useState<string | null>(null);

  return (
    <div className={styles.grid}>
      {disciplines.map((d) => (
        <Link
          key={d.slug}
          href={`/disciplines/${d.slug}`}
          className={`${styles.cell} ${live === d.slug ? "is-live" : ""}`}
          onMouseEnter={() => setLive(d.slug)}
          onMouseLeave={() => setLive((s) => (s === d.slug ? null : s))}
          onFocus={() => setLive(d.slug)}
          onBlur={() => setLive((s) => (s === d.slug ? null : s))}
          data-reveal
        >
          <span className={styles.top}>
            <span className="index">{d.index}</span>
            <span className="label">{d.quantity}</span>
            <span className={styles.unit}>{d.unit}</span>
          </span>

          <h2 className={`display ${styles.title}`}>{d.title}</h2>
          <p className={styles.lede}>{d.lede}</p>

          <span className={styles.foot}>
            <span className={styles.transport}>{d.transport}</span>
            <span className={styles.signature}>
              <DisciplineGlyph slug={d.slug} />
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
