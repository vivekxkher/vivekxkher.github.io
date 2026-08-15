"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import styles from "./page.module.css";

/**
 * A rendering surface for the social cards, not a page anyone should land on.
 *
 * `tools/og.mjs` loads this at 1200 × 630 and screenshots it into each route's
 * `opengraph-image.png`. Keeping the card as a real page means it inherits the
 * site's fonts and tokens instead of a parallel definition that would drift.
 *
 * The query string is read on the client rather than from server
 * `searchParams`, because the site is exported as static HTML and there is no
 * server to parse a query at request time. The screenshot tool drives a real
 * browser, so this resolves before the capture.
 */

/** Layer widths and hatches, echoing the envelope section. */
const LAYERS = [
  { width: 9, hatch: "" },
  { width: 4, hatch: styles.hatchSheet },
  { width: 5, hatch: "" },
  { width: 19, hatch: styles.hatchBatt },
  { width: 10, hatch: styles.hatchAggregate },
  { width: 3, hatch: styles.hatchSheet },
  { width: 50, hatch: "" },
];

interface CardText {
  title: string;
  eyebrow: string;
  readout: string;
  standfirst: string;
}

const DEFAULTS: CardText = {
  title: "Buildings as climate systems",
  eyebrow: "PÉCLET",
  readout: "Pe = uL / D",
  standfirst: "A building physics and climate design practice.",
};

export default function OgPreview() {
  const [card, setCard] = useState<CardText>(DEFAULTS);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setCard({
      title: query.get("title") ?? DEFAULTS.title,
      eyebrow: query.get("eyebrow") ?? DEFAULTS.eyebrow,
      readout: query.get("readout") ?? DEFAULTS.readout,
      standfirst: query.get("standfirst") ?? DEFAULTS.standfirst,
    });
  }, []);

  const { title, eyebrow, readout, standfirst } = card;

  return (
    <>
      {/* The card is a standalone artwork, so the site chrome steps out of
          the frame while it is being rendered. */}
      <style>{`
        [data-site-chrome] { display: none !important; }
        body { background: #050607; }
        main { padding: 0 !important; }
      `}</style>

    <div className={styles.card}>
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className={styles.section} aria-hidden="true">
        {LAYERS.map((layer, i) => (
          <span
            key={i}
            className={`${styles.layer} ${layer.hatch}`}
            style={{ width: `${layer.width}%` }}
          />
        ))}
      </div>

      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div>
        <div className={styles.top}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <span className={styles.readout}>{readout}</span>
        </div>
        <div className={styles.rule} />
      </div>

      <div className={styles.middle}>
        <h1
          className={`${styles.title} ${
            title.length > 26 ? styles.titleSmall : ""
          }`}
        >
          {title}
        </h1>
        <p className={styles.standfirst}>{standfirst}</p>
      </div>

      <div className={styles.bottom}>
        <div className={styles.brand}>
          <span className={styles.mark}>{site.name}</span>
          <span className={styles.tagline}>{site.tagline}</span>
        </div>
        <span className={styles.formula}>
          <em>Pe</em> = advection / diffusion
        </span>
      </div>
    </div>
    </>
  );
}
