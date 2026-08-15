"use client";

import { useRef, useState } from "react";
import { Control, Instrument } from "@/components/viz/Instrument";
import {
  MoistureField,
  type MoistureControls,
} from "@/components/viz/MoistureField";
import { Invalidate, VizCanvas } from "@/components/viz/shared/VizCanvas";
import type { Discipline } from "@/content/disciplines";
import styles from "./MoistureInstrument.module.css";

/**
 * Interior humidity pushes the condensation plane outward through the
 * build-up; a vapour control layer holds it back. Both are expressed as
 * positions across the section rather than as calculated values, because the
 * point of the instrument is where the plane lands, not what it measures.
 */
function dewPointPosition(humidity: number, vapourControl: number): number {
  // 0 = exterior face, 1 = interior face.
  const base = 0.62 - humidity * 0.42;
  return Math.min(Math.max(base + vapourControl * 0.26, 0.06), 0.86);
}

export function MoistureInstrument({ discipline }: { discipline: Discipline }) {
  const [humidity, setHumidity] = useState(0.55);
  const [vapourControl, setVapourControl] = useState(0.3);

  const dew = dewPointPosition(humidity, vapourControl);
  const controls = useRef<MoistureControls>({
    humidity: 0.55,
    dewPoint: dew,
  });

  const updateHumidity = (value: number) => {
    setHumidity(value);
    controls.current.humidity = value;
    controls.current.dewPoint = dewPointPosition(value, vapourControl);
  };

  const updateControl = (value: number) => {
    setVapourControl(value);
    controls.current.dewPoint = dewPointPosition(humidity, value);
  };

  const rhPercent = Math.round(20 + humidity * 70);
  // Condensation inside the structural depth is the outcome worth flagging.
  const inStructure = dew > 0.18 && dew < 0.62;

  return (
    <Instrument
      figure="Fig. 04 — Vapour through a build-up"
      hint="Raise interior humidity and watch the plane move outward"
      caption={discipline.altText}
      controls={
        <>
          <Control
            id="moisture-rh"
            label="Interior relative humidity"
            display={`${rhPercent} %`}
            valueText={`${rhPercent} per cent relative humidity`}
            min={0}
            max={1}
            step={0.01}
            value={humidity}
            onChange={updateHumidity}
          />
          <Control
            id="moisture-vcl"
            label="Vapour control"
            display={
              vapourControl < 0.2
                ? "Vapour open"
                : vapourControl < 0.65
                  ? "Moderate"
                  : "Vapour tight"
            }
            valueText={`Vapour control ${Math.round(vapourControl * 100)} per cent`}
            min={0}
            max={1}
            step={0.01}
            value={vapourControl}
            onChange={updateControl}
          />
        </>
      }
      overlay={
        <>
          <span
            className={styles.plane}
            style={{ left: `${dew * 100}%` }}
            aria-hidden="true"
          >
            <span className={styles.planeLabel}>Dew point</span>
          </span>

          <span className={`${styles.side} ${styles.sideLeft}`}>
            <span className={styles.sideName}>Exterior</span>
            <span className={styles.sideValue}>Cool · dry</span>
          </span>

          <span className={`${styles.side} ${styles.sideRight}`}>
            <span className={styles.sideName}>Interior</span>
            <span className={styles.sideValue}>{rhPercent}&thinsp;% RH</span>
          </span>

          <span className={styles.drift}>
            Vapour drive &larr; outward
          </span>

          <span
            className={`${styles.verdict} ${
              inStructure ? styles.verdictRisk : styles.verdictSafe
            }`}
          >
            {inStructure
              ? "Condensation plane inside the structural depth"
              : "Condensation plane clear of the structure"}
          </span>
        </>
      }
    >
      <VizCanvas label={discipline.altText}>
        <Invalidate signal={`${humidity}|${vapourControl}`} />
        <MoistureField controls={controls} />
      </VizCanvas>
      <span className="sr-only">
        With interior humidity at {rhPercent} per cent and{" "}
        {vapourControl < 0.2
          ? "a vapour-open"
          : vapourControl < 0.65
            ? "a moderately vapour-resistant"
            : "a vapour-tight"}{" "}
        inner layer, the condensation plane sits{" "}
        {Math.round(dew * 100)} per cent of the way through the build-up from
        the exterior face —{" "}
        {inStructure
          ? "inside the structural depth, where accumulated moisture would be a durability risk."
          : "clear of the structural depth."}
      </span>
    </Instrument>
  );
}
