"use client";

import { useEffect, useRef, useState } from "react";
import { AirFlow, type AirControls } from "@/components/viz/AirFlow";
import { Control, Instrument } from "@/components/viz/Instrument";
import { Invalidate, VizCanvas } from "@/components/viz/shared/VizCanvas";
import {
  GROUND_Y,
  massingOpenings,
  massingSolids,
} from "@/components/viz/shared/massing";
import type { Discipline } from "@/content/disciplines";
import styles from "./AirInstrument.module.css";

/** Stage coordinates run y-up; SVG runs y-down. */
const VB = 1000;
const sx = (x: number) => x * VB;
const sy = (y: number) => (1 - y) * VB;

/**
 * The wind vector is (cos θ, sin θ) with screen right as east and screen up as
 * north, so θ is the direction the wind blows *toward*. Meteorology names wind
 * by where it comes from, which is the opposite point — four steps round.
 */
const COMPASS = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];

function windFrom(deg: number): string {
  const step = Math.round(((deg % 360) + 360) / 45);
  return COMPASS[(step + 4) % 8];
}

export function AirInstrument({ discipline }: { discipline: Discipline }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [porosity, setPorosity] = useState(0.6);

  const controls = useRef<AirControls>({ angle: 0, porosity: 0.6 });

  const updateAngle = (deg: number) => {
    setAngle(deg);
    controls.current.angle = (deg * Math.PI) / 180;
  };
  const updatePorosity = (value: number) => {
    setPorosity(value);
    controls.current.porosity = value;
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let dragging = false;

    const fromPointer = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Screen y grows downward; the field's y grows upward.
      const deg =
        (Math.atan2(-(e.clientY - cy), e.clientX - cx) * 180) / Math.PI;
      updateAngle(Math.round(deg));
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      fromPointer(e);
    };
    const onMove = (e: PointerEvent) => dragging && fromPointer(e);
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <Instrument
      figure="Fig. 03 — Flow around and through"
      hint="Drag anywhere on the field to turn the wind"
      caption={discipline.altText}
      draggable
      stageRef={stageRef}
      controls={
        <>
          <Control
            id="air-angle"
            label="Wind direction"
            display={`${angle}° · from ${windFrom(angle)}`}
            valueText={`Wind from the ${windFrom(angle)}, ${angle} degrees`}
            min={-180}
            max={180}
            step={1}
            value={angle}
            onChange={updateAngle}
          />
          <Control
            id="air-porosity"
            label="Openings"
            display={
              porosity < 0.2 ? "Sealed" : porosity < 0.6 ? "Partly open" : "Open"
            }
            valueText={`Openings ${Math.round(porosity * 100)} per cent`}
            min={0}
            max={1}
            step={0.01}
            value={porosity}
            onChange={updatePorosity}
          />
        </>
      }
      overlay={
        <>
          <svg
            className={styles.overlaySvg}
            viewBox={`0 0 ${VB} ${VB}`}
            preserveAspectRatio="none"
            role="presentation"
            aria-hidden="true"
            focusable="false"
          >
            <line
              className={styles.ground}
              x1={0}
              y1={sy(GROUND_Y)}
              x2={VB}
              y2={sy(GROUND_Y)}
            />
            {massingSolids.map((box, i) => (
              <rect
                key={`solid-${i}`}
                className={styles.solid}
                x={sx(box.cx - box.hx)}
                y={sy(box.cy + box.hy)}
                width={sx(box.hx * 2)}
                height={sx(0) + (box.hy * 2 * VB)}
              />
            ))}
            {massingOpenings.map((box, i) => (
              <rect
                key={`open-${i}`}
                className={styles.opening}
                x={sx(box.cx - box.hx)}
                y={sy(box.cy + box.hy * porosity)}
                width={sx(box.hx * 2)}
                height={Math.max(box.hy * 2 * porosity * VB, 2)}
              />
            ))}
          </svg>

          <div className={styles.readout}>
            <span className={styles.term}>Wind from</span>
            <span className={styles.value}>{windFrom(angle)}</span>
          </div>

          <svg
            className={styles.windDial}
            viewBox="0 0 100 100"
            role="presentation"
            aria-hidden="true"
            focusable="false"
          >
            <circle className={styles.dialRing} cx="50" cy="50" r="30" />
            <g
              className={styles.dialArrow}
              style={{ transform: `rotate(${-angle}deg)` }}
            >
              <line x1="20" y1="50" x2="76" y2="50" />
              <polyline points="66,43 76,50 66,57" fill="none" />
            </g>
            <text className={styles.dialLabel} x="50" y="14">
              N
            </text>
          </svg>

          <div className={styles.zones}>
            <span className={styles.zoneNote}>Windward — flow separates</span>
            <span className={styles.zoneNote}>Leeward — flow stalls</span>
          </div>
        </>
      }
    >
      <VizCanvas label={discipline.altText} interactive>
        <Invalidate signal={`${angle}|${porosity}`} />
        <AirFlow controls={controls} />
      </VizCanvas>
      <span className="sr-only">
        Wind arriving from the {windFrom(angle)}. The openings are{" "}
        {porosity < 0.2 ? "sealed" : porosity < 0.6 ? "partly open" : "open"},
        so air {porosity < 0.2 ? "passes only around" : "passes both around and through"}{" "}
        the massing.
      </span>
    </Instrument>
  );
}
