"use client";

import { useEffect, useRef, useState } from "react";
import { Control, Instrument } from "@/components/viz/Instrument";
import { SolarStudy } from "@/components/viz/SolarStudy";
import { VizCanvas } from "@/components/viz/shared/VizCanvas";
import type { Discipline } from "@/content/disciplines";
import { MONTH_NAMES, daylightHours, formatHour, sunPosition } from "@/lib/solar";
import styles from "./SolarInstrument.module.css";

export function SolarInstrument({ discipline }: { discipline: Discipline }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [latitude, setLatitude] = useState(28.6);
  const [month, setMonth] = useState(5);
  const [hour, setHour] = useState(10);

  // Dragging the stage scrubs the day horizontally and the year vertically.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - lastX) / rect.width;
      const dy = (e.clientY - lastY) / rect.height;
      lastX = e.clientX;
      lastY = e.clientY;

      setHour((h) => Math.min(Math.max(h + dx * 26, 0), 24));
      setMonth((m) => Math.min(Math.max(m + dy * 14, 0), 11));
    };

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

  const monthIndex = Math.round(month);
  const sun = sunPosition(latitude, monthIndex, hour);
  const day = daylightHours(latitude, monthIndex);

  return (
    <Instrument
      figure="Fig. 02 — Sun path and shadow"
      hint="Drag: sideways for time of day, up and down for month"
      caption={discipline.altText}
      draggable
      stageRef={stageRef}
      controls={
        <>
          <Control
            id="solar-latitude"
            label="Latitude"
            display={`${latitude.toFixed(1)}° N`}
            valueText={`${latitude.toFixed(1)} degrees north`}
            min={8}
            max={35}
            step={0.1}
            value={latitude}
            onChange={setLatitude}
          />
          <Control
            id="solar-month"
            label="Month"
            display={MONTH_NAMES[monthIndex]}
            valueText={MONTH_NAMES[monthIndex]}
            min={0}
            max={11}
            step={1}
            value={monthIndex}
            onChange={setMonth}
          />
          <Control
            id="solar-hour"
            label="Solar time"
            display={formatHour(hour)}
            valueText={`${formatHour(hour)} solar time`}
            min={0}
            max={24}
            step={0.25}
            value={hour}
            onChange={setHour}
          />
        </>
      }
      overlay={
        <>
          <div className={styles.readout}>
            <span className={styles.row}>
              <span className={styles.term}>Altitude</span>
              <span className={styles.value}>
                {sun.altitude.toFixed(1)}&deg;
              </span>
            </span>
            <span className={styles.row}>
              <span className={styles.term}>Azimuth</span>
              <span className={styles.value}>
                {sun.azimuth.toFixed(1)}&deg;
              </span>
            </span>
            <span className={styles.row}>
              <span className={styles.term}>Day length</span>
              <span className={styles.value}>
                {day ? `${day.length.toFixed(1)} h` : "—"}
              </span>
            </span>
          </div>

          <span
            className={`${styles.state} ${sun.up ? styles.stateUp : ""}`}
          >
            {sun.up ? "Sun above horizon" : "Sun below horizon"}
          </span>

          <span className={styles.compass}>
            Azimuth measured from south, positive west
          </span>
        </>
      }
    >
      <VizCanvas
        label={discipline.altText}
        shadows
        flat
        interactive
        camera={{ position: [15.5, 10.5, 19], fov: 30, near: 0.5, far: 140 }}
      >
        <SolarStudy latitude={latitude} month={monthIndex} hour={hour} />
      </VizCanvas>
      <span className="sr-only">
        At latitude {latitude.toFixed(1)} degrees north in{" "}
        {MONTH_NAMES[monthIndex]} at {formatHour(hour)} solar time, the sun sits
        at an altitude of {sun.altitude.toFixed(1)} degrees and an azimuth of{" "}
        {sun.azimuth.toFixed(1)} degrees from south.{" "}
        {sun.up
          ? "The building casts a shadow across the ground."
          : "The sun is below the horizon and the model is unlit."}
      </span>
    </Instrument>
  );
}
