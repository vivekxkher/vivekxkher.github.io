"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { research, researchCategories } from "@/content/research";
import styles from "./page.module.css";

export function ResearchIndex() {
  const [filter, setFilter] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      filter
        ? research.filter((note) =>
            note.categories.includes(filter as never),
          )
        : research,
    [filter],
  );

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter by category">
        <button
          type="button"
          className={styles.filter}
          aria-pressed={filter === null}
          onClick={() => setFilter(null)}
        >
          All
        </button>
        {researchCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={styles.filter}
            aria-pressed={filter === category}
            onClick={() => setFilter(filter === category ? null : category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.list} aria-live="polite">
        {visible.map((note) => (
          <Link
            key={note.slug}
            href={`/research/${note.slug}`}
            className={styles.item}
            data-reveal
          >
            <span className="index">{note.index}</span>
            <span>
              <span className={`display ${styles.title}`}>{note.title}</span>
              <span className={styles.tags}>
                {note.categories.map((category) => (
                  <span key={category} className={styles.tag}>
                    {category}
                  </span>
                ))}
                <span className={styles.tag}>{note.minutes} min</span>
              </span>
            </span>
            <span className={styles.standfirst}>{note.standfirst}</span>
          </Link>
        ))}

        {visible.length === 0 ? (
          <p className={styles.empty}>
            Nothing filed under that heading yet.
          </p>
        ) : null}
      </div>
    </>
  );
}
