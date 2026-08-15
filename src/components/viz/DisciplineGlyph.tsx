import type { CSSProperties } from "react";
import type { DisciplineSlug } from "@/content/disciplines";
import styles from "./DisciplineGlyph.module.css";

const v = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * A small drawn signature for each discipline — the behaviour of the
 * phenomenon rather than an icon of it. Decorative; the row carries the text.
 */
export function DisciplineGlyph({ slug }: { slug: DisciplineSlug }) {
  const common = {
    className: styles.glyph,
    viewBox: "0 0 120 40",
    role: "presentation",
    "aria-hidden": true,
    focusable: false,
  } as const;

  switch (slug) {
    case "thermal":
      return (
        <svg {...common}>
          {Array.from({ length: 17 }, (_, i) => (
            <line
              key={i}
              className={`${styles.stroke} ${styles.thermalTick}`}
              style={v(i)}
              x1={12 + i * 6}
              y1={8}
              x2={12 + i * 6}
              y2={32}
            />
          ))}
        </svg>
      );

    case "solar":
      return (
        <svg {...common}>
          <path
            className={styles.stroke}
            d="M22 34 A38 38 0 0 1 98 34"
            opacity="0.4"
          />
          <line className={styles.stroke} x1="14" y1="34" x2="106" y2="34" />
          <g className={styles.solarArm}>
            <circle className={styles.fill} cx="60" cy="34" r="0" />
            <circle className={styles.fill} cx="60" cy="0" r="3.2" />
          </g>
        </svg>
      );

    case "air":
      return (
        <svg {...common}>
          {[10, 20, 30].map((y, i) => (
            <line
              key={y}
              className={`${styles.stroke} ${styles.airLane}`}
              style={v(i)}
              x1={38}
              y1={y}
              x2={82}
              y2={y}
            />
          ))}
          <path
            className={styles.stroke}
            d="M96 4 L96 36"
            opacity="0.35"
          />
        </svg>
      );

    case "moisture":
      return (
        <svg {...common}>
          {Array.from({ length: 13 }, (_, i) => (
            <circle
              key={i}
              className={`${styles.fill} ${styles.moistureDot}`}
              style={v(i)}
              cx={16 + (i % 7) * 14}
              cy={12 + Math.floor(i / 7) * 13 + (i % 3) * 3}
              r="1.5"
            />
          ))}
        </svg>
      );

    case "daylight":
      return (
        <svg {...common}>
          <line className={styles.stroke} x1="22" y1="4" x2="22" y2="36" opacity="0.5" />
          <polygon
            className={`${styles.fill} ${styles.daylightWedge}`}
            points="22,8 104,26 104,34 22,20"
            opacity="0.3"
          />
          <line className={styles.stroke} x1="22" y1="36" x2="106" y2="36" />
        </svg>
      );

    case "energy":
      return (
        <svg {...common}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              className={`${styles.fill} ${styles.energyBar}`}
              style={{ ...v(i), transformOrigin: `0 34px` }}
              x={22 + i * 16}
              y={10}
              width="6"
              height="24"
              opacity="0.55"
            />
          ))}
          <line className={styles.stroke} x1="14" y1="34" x2="106" y2="34" />
        </svg>
      );
  }
}
