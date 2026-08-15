"use client";

import styles from "./EnergyBalance.module.css";

/**
 * A cooling-season energy balance, drawn as flowing ribbons.
 *
 * The numbers are an INDEX, not a calculation. The baseline is defined as 100
 * and every measure is expressed as a proportional reduction of one term, so
 * the diagram shows which decisions move the balance and by roughly how much
 * relative to each other. It is not a prediction for any building, and the
 * caption says so.
 */

export interface EnergyTerm {
  id: string;
  label: string;
  /** Share of the baseline load. */
  baseline: number;
  colour: string;
  /** Measures that reduce this term, and by what fraction. */
  reducedBy: Record<string, number>;
}

export const energyTerms: EnergyTerm[] = [
  {
    id: "solar",
    label: "Solar gain",
    baseline: 32,
    colour: "#c2703f",
    reducedBy: { shading: 0.66, glazing: 0.24 },
  },
  {
    id: "fabric",
    label: "Fabric conduction",
    baseline: 21,
    colour: "#8c7fb8",
    reducedBy: { fabric: 0.48 },
  },
  {
    id: "infiltration",
    label: "Infiltration",
    baseline: 18,
    colour: "#3f8fa8",
    reducedBy: { airtightness: 0.62, fabric: 0.08 },
  },
  {
    id: "internal",
    label: "Internal gain",
    baseline: 17,
    colour: "#6f9464",
    reducedBy: { equipment: 0.38 },
  },
  {
    id: "latent",
    label: "Latent load",
    baseline: 12,
    colour: "#4c7db8",
    reducedBy: { airtightness: 0.34 },
  },
];

export const energyMeasures = [
  { id: "shading", label: "External shading" },
  { id: "fabric", label: "Fabric + cool roof" },
  { id: "airtightness", label: "Airtightness" },
  { id: "glazing", label: "Glazing spec" },
  { id: "equipment", label: "Efficient equipment" },
];

export function computeBalance(active: string[]) {
  const terms = energyTerms.map((term) => {
    // Reductions compound rather than add, so no combination can exceed 100 %.
    let remaining = 1;
    for (const [measure, fraction] of Object.entries(term.reducedBy)) {
      if (active.includes(measure)) remaining *= 1 - fraction;
    }
    return { ...term, value: term.baseline * remaining };
  });

  const total = terms.reduce((sum, t) => sum + t.value, 0);
  return { terms, total };
}

const VB = { w: 820, h: 400 };
const LANE_X0 = 210;
const LANE_X1 = 600;
const BAR_X = 660;

export function EnergyBalance({ active }: { active: string[] }) {
  const { terms, total } = computeBalance(active);

  // Fixed lanes: only ribbon thickness changes, so the geometry can be
  // transitioned smoothly by CSS rather than re-pathed every frame.
  const laneGap = 62;
  const laneTop = 78;

  const scale = 1.55;
  const barHeight = Math.max(total * 2.6, 6);
  const barTop = VB.h / 2 - barHeight / 2;

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        role="presentation"
        aria-hidden="true"
        focusable="false"
      >
        {terms.map((term, i) => {
          const y = laneTop + i * laneGap;
          const targetY = VB.h / 2 - barHeight / 2 + barHeight * ((i + 0.5) / terms.length);
          const d = `M ${LANE_X0} ${y} C ${LANE_X0 + 170} ${y}, ${LANE_X1 - 170} ${targetY}, ${LANE_X1} ${targetY}`;
          const width = Math.max(term.value * scale, 0.6);
          const faded = term.value < term.baseline * 0.98;

          return (
            <g key={term.id}>
              <text className={styles.termLabel} x="16" y={y - 10}>
                {term.label}
              </text>
              <text className={styles.termValue} x="16" y={y + 14}>
                {term.value.toFixed(0)}
                {faded ? ` / ${term.baseline}` : ""}
              </text>
              <line
                className={styles.rail}
                x1="16"
                y1={y - 4}
                x2={LANE_X0}
                y2={y - 4}
                opacity="0.25"
              />

              <path
                className={styles.ribbon}
                d={d}
                stroke={term.colour}
                strokeWidth={width}
                opacity={0.3}
              />
              <path
                className={styles.ribbonFlow}
                d={d}
                stroke={term.colour}
                strokeWidth={width}
              />
            </g>
          );
        })}

        {/* Residual demand */}
        <rect
          className={styles.demandBar}
          x={BAR_X}
          y={barTop}
          width="10"
          height={barHeight}
          fill="var(--paper)"
        />
        <text className={styles.demandLabel} x={BAR_X + 26} y={barTop + 14}>
          Residual demand
        </text>
        <text className={styles.demandValue} x={BAR_X + 26} y={barTop + 52}>
          {total.toFixed(0)}
        </text>
        <text className={styles.demandUnit} x={BAR_X + 26} y={barTop + 70}>
          Index · baseline = 100
        </text>
      </svg>
    </div>
  );
}
