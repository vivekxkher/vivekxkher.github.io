"use client";

import { useMemo, useRef, useState } from "react";
import { Control, Instrument } from "@/components/viz/Instrument";
import { DaylightRoom, type DaylightControls } from "@/components/viz/DaylightRoom";
import { Invalidate, VizCanvas } from "@/components/viz/shared/VizCanvas";
import type { Discipline } from "@/content/disciplines";
import {
  ROOM,
  apertureFor,
  floorCurve,
  peakDepth,
  uniformity,
} from "@/lib/daylight";
import styles from "./DaylightInstrument.module.css";

/** The curve is plotted in the same 0–1 space the shader works in. */
const VB = 1000;

export function DaylightInstrument({ discipline }: { discipline: Discipline }) {
  const [aperture, setAperture] = useState(0.45);
  const [altitude, setAltitude] = useState(38);

  const controls = useRef<DaylightControls>({ aperture: 0.45, altitude: 38 });

  const updateAperture = (value: number) => {
    setAperture(value);
    controls.current.aperture = value;
  };
  const updateAltitude = (value: number) => {
    setAltitude(value);
    controls.current.altitude = value;
  };

  const geometry = useMemo(() => apertureFor(aperture), [aperture]);
  const curve = useMemo(() => floorCurve(geometry), [geometry]);
  const evenness = useMemo(() => uniformity(geometry), [geometry]);
  const peak = useMemo(() => peakDepth(geometry), [geometry]);

  // Plot the floor falloff just below the floor line.
  const plotTop = ROOM.bottom + 0.03;
  const plotHeight = 0.18;
  const path = curve
    .map((point, i) => {
      const x = point.x * VB;
      const y = (plotTop + plotHeight * (1 - Math.min(point.value, 1))) * VB;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const area = `${path} L ${ROOM.right * VB} ${(plotTop + plotHeight) * VB} L ${
    ROOM.left * VB
  } ${(plotTop + plotHeight) * VB} Z`;

  const thresholdY = (plotTop + plotHeight * (1 - 0.2)) * VB;

  return (
    <Instrument
      figure="Fig. 05 — Daylight in section"
      hint="Aperture size changes how far light reaches"
      caption={discipline.altText}
      controls={
        <>
          <Control
            id="daylight-aperture"
            label="Aperture size"
            display={`${Math.round(20 + aperture * 62)} % of wall`}
            valueText={`Aperture ${Math.round(20 + aperture * 62)} per cent of the wall height`}
            min={0}
            max={1}
            step={0.01}
            value={aperture}
            onChange={updateAperture}
          />
          <Control
            id="daylight-altitude"
            label="Sun altitude"
            display={`${altitude.toFixed(0)}°`}
            valueText={`Sun altitude ${altitude.toFixed(0)} degrees`}
            min={0}
            max={85}
            step={1}
            value={altitude}
            onChange={updateAltitude}
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
            <rect
              className={styles.room}
              x={ROOM.left * VB}
              y={ROOM.top * VB}
              width={(ROOM.right - ROOM.left) * VB}
              height={(ROOM.bottom - ROOM.top) * VB}
            />
            <line
              className={styles.aperture}
              x1={ROOM.left * VB}
              y1={geometry.head * VB}
              x2={ROOM.left * VB}
              y2={geometry.sill * VB}
            />

            <path className={styles.curveArea} d={area} />
            <path className={styles.curve} d={path} />
            <line
              className={styles.threshold}
              x1={ROOM.left * VB}
              y1={thresholdY}
              x2={ROOM.right * VB}
              y2={thresholdY}
            />
          </svg>

          <div className={styles.readout}>
            <span className={styles.term}>Back of room</span>
            <span className={styles.value}>
              {Math.round(evenness * 100)}&thinsp;% of peak
            </span>
            <span className={styles.term}>
              Brightest at {Math.round(peak * 100)}&thinsp;% depth
            </span>
          </div>
        </>
      }
    >
      <VizCanvas label={discipline.altText}>
        <Invalidate signal={`${aperture}|${altitude}`} />
        <DaylightRoom controls={controls} />
      </VizCanvas>
      <span className="sr-only">
        With the aperture at {Math.round(20 + aperture * 62)} per cent of the
        wall height and the sun {altitude.toFixed(0)} degrees above the horizon,
        daylight on the floor is strongest about {Math.round(peak * 100)} per
        cent of the way into the room, and the back of the room receives about{" "}
        {Math.round(evenness * 100)} per cent of that peak. The plotted curve
        shows the distribution along the floor. Values are relative and
        indicative, not measured illuminance.
      </span>
    </Instrument>
  );
}
