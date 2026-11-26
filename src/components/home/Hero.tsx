"use client";

import { useEffect, useRef, useState } from "react";
import { EnvelopeSection } from "@/components/viz/EnvelopeSection";
import {
  ThermalField,
  type ThermalControls,
} from "@/components/viz/ThermalField";
import { usePointerField } from "@/components/viz/shared/usePointerField";
import { VizCanvas } from "@/components/viz/shared/VizCanvas";
import styles from "./Hero.module.css";

type Phase = "opening" | "section" | "reveal";

const EXTERIOR_MIN = 26;
const EXTERIOR_MAX = 46;
const INTERIOR_BASE = 24;

const VIZ_DESCRIPTION =
  "An interactive cross-section through a wall assembly. Reading from the outside in: a rainscreen, a ventilated cavity, insulation, structure and an internal finish. Particles carrying heat cross the section from the hot exterior toward the cooler interior. They move quickly through the air layers and the cavity, and slow markedly inside the insulation, where most of the temperature drop occurs. Moving the pointer adds a local heat source and changes the exterior condition.";

export function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("opening");
  const [engaged, setEngaged] = useState(false);
  const [temps, setTemps] = useState({
    exterior: 34,
    interior: INTERIOR_BASE + 0.6,
  });

  const controls = useRef<ThermalControls>({
    reveal: 0,
    progress: 0,
    exterior: 0.4,
  });

  const pointer = usePointerField(stickyRef, () => setEngaged(true));

  // The field wakes on its own if nobody moves — touch visitors and anyone
  // who simply starts scrolling should still see the section appear.
  useEffect(() => {
    const id = window.setTimeout(() => setEngaged(true), 2400);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    controls.current.reveal = engaged ? 1 : 0;
  }, [engaged]);

  // Scroll phase + readouts, both driven from one rAF loop.
  useEffect(() => {
    let frame = 0;
    let lastReadout = 0;
    let currentPhase: Phase = "opening";

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;

      const rect = track.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);

      controls.current.progress = progress;
      sticky.style.setProperty("--hero-progress", progress.toFixed(4));

      const next: Phase =
        progress > 0.58 ? "reveal" : progress > 0.14 ? "section" : "opening";
      if (next !== currentPhase) {
        currentPhase = next;
        setPhase(next);
      }

      // Pointer height sets the exterior condition: high sun, hot façade.
      const p = pointer.current;
      const level = p.everMoved ? 1 - p.sy : 0.4;
      controls.current.exterior = level;

      if (now - lastReadout > 140) {
        lastReadout = now;
        const exterior = EXTERIOR_MIN + level * (EXTERIOR_MAX - EXTERIOR_MIN);
        setTemps({
          exterior,
          interior: INTERIOR_BASE + (exterior - INTERIOR_BASE) * 0.055,
        });
      }
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [pointer]);

  return (
    <section
      ref={trackRef}
      className={styles.track}
      aria-labelledby="hero-title"
    >
      <div
        ref={stickyRef}
        className={styles.sticky}
        data-hero-stage=""
        data-phase={phase}
        data-engaged={engaged}
      >
        <VizCanvas label={VIZ_DESCRIPTION}>
          <ThermalField pointer={pointer} controls={controls} />
        </VizCanvas>

        <div className={styles.sectionHost}>
          <EnvelopeSection
            active={engaged}
            exteriorTemp={temps.exterior}
            interiorTemp={temps.interior}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.inner}>
            <span className={`${styles.hud} ${styles.hudLeft}`} aria-hidden="true">
              Fig. 01 — Envelope section
            </span>
            <span className={`${styles.hud} ${styles.hudRight}`} aria-hidden="true">
              <em>Pe</em> = uL / D
            </span>

            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railFill} />
            </div>

            <div className={styles.opening}>
              <h1 id="hero-title" className={styles.openingMark}>
                PÉCLET
                <span className={styles.openingSub}>Climate Design</span>
              </h1>
              <p className={styles.openingHint} aria-hidden="true">
                Move to disturb the field
              </p>
            </div>

            <div className={styles.cue} aria-hidden="true">
              <span className={styles.cueLine} />
              <span className={styles.cueLabel}>Scroll</span>
              <span className={styles.cueLine} />
            </div>

            <div className={styles.reveal}>
              <h2 className={styles.revealTitle}>
                <span>Buildings as</span>
                <span>
                  Climate systems<em>.</em>
                </span>
              </h2>
              <div className={styles.revealMeta}>
                <span className="label">Premise</span>
                <p className={styles.revealNote}>
                  A building is not a static object. It is a system exchanging
                  heat, light, air and moisture with its climate, every hour of
                  its life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only">{VIZ_DESCRIPTION}</p>
    </section>
  );
}
