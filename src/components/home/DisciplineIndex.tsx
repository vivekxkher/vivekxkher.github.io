"use client";

import Link from "next/link";
import { useState } from "react";
import { disciplines } from "@/content/disciplines";
import { DisciplineGlyph } from "@/components/viz/DisciplineGlyph";
import { SectionHead, SectionTitle } from "@/components/ui/SectionHead";
import styles from "./DisciplineIndex.module.css";

/**
 * The six phenomena as an index rather than a card grid. Each row carries its
 * own drawn behaviour, which only runs while that row is engaged.
 */
export function DisciplineIndex() {
  const [live, setLive] = useState<string | null>(null);

  return (
    <section className={styles.section} aria-labelledby="disciplines-title">
      <div className="shell">
        <SectionHead eyebrow="PÉCLET / Disciplines" readout="06 Phenomena" />
        <SectionTitle>
          <span id="disciplines-title">Six ways a building meets its climate</span>
        </SectionTitle>

        <div className={styles.list}>
          {disciplines.map((d) => (
            <Link
              key={d.slug}
              href={`/disciplines/${d.slug}`}
              className={`${styles.row} ${live === d.slug ? "is-live" : ""}`}
              onMouseEnter={() => setLive(d.slug)}
              onMouseLeave={() => setLive((s) => (s === d.slug ? null : s))}
              onFocus={() => setLive(d.slug)}
              onBlur={() => setLive((s) => (s === d.slug ? null : s))}
              data-reveal
            >
              <span className={styles.index}>{d.index}</span>
              <span className={styles.title}>{d.title}</span>
              <span className={styles.meta}>
                <span className={styles.quantity}>{d.quantity}</span>
                <span className={styles.transport}>{d.transport}</span>
              </span>
              <span className={styles.signature}>
                <DisciplineGlyph slug={d.slug} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
