"use client";

import { useRef, useState } from "react";
import {
  PecletTransport,
  type PecletControls,
} from "@/components/viz/PecletTransport";
import { Invalidate, VizCanvas } from "@/components/viz/shared/VizCanvas";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./PecletSection.module.css";

/** Map the 0…1 slider onto a Péclet number spanning six decades. */
function pecletFromRatio(ratio: number): number {
  return Math.pow(10, (ratio - 0.5) * 6);
}

function formatPeclet(pe: number): string {
  if (pe >= 1000) return pe.toExponential(1).replace("e+", " × 10^");
  if (pe >= 10) return pe.toFixed(0);
  if (pe >= 1) return pe.toFixed(1);
  if (pe >= 0.01) return pe.toFixed(2);
  return pe.toExponential(1).replace("e-", " × 10⁻");
}

function verdict(pe: number): string {
  if (pe < 0.1) return "Diffusion dominates";
  if (pe < 1) return "Diffusion leads";
  if (pe < 10) return "Both matter";
  if (pe < 100) return "Advection leads";
  return "Advection dominates";
}

const VIZ_DESCRIPTION =
  "A field of particles whose motion can be shifted between two transport modes. At a low Péclet number the particles wander individually as a spreading cloud — diffusion. At a high Péclet number they resolve into ordered horizontal lanes streaming in one direction — advection. The same particles are shown throughout; only the balance between random and directed motion changes.";

export function PecletSection() {
  const [ratio, setRatio] = useState(0.5);
  const controls = useRef<PecletControls>({ ratio: 0.5 });

  const pe = pecletFromRatio(ratio);

  const update = (value: number) => {
    setRatio(value);
    controls.current.ratio = value;
  };

  return (
    <section className={styles.section} aria-labelledby="peclet-title">
      <div className="shell">
        <SectionHead eyebrow="PÉCLET / Namesake" readout="Pe = uL / D" />

        <div className={styles.lead}>
          <h2 id="peclet-title" className={`display ${styles.leadTitle}`} data-reveal>
            Two ways to move
          </h2>
          <div className={`prose ${styles.leadBody}`} data-reveal data-reveal-delay="80">
            <p>
              Heat, air and moisture reach a building in two ways. They are
              carried — pushed along by a flow. Or they spread — working their
              way through a material without going anywhere in particular.
            </p>
            <p>
              The Péclet number is the ratio between the two. Below one,
              spreading wins and the material decides the outcome. Above one,
              the flow does. Almost every question in building physics is
              really a question about which side of that line you are standing
              on.
            </p>
          </div>
        </div>

        <div className={styles.instrument}>
          <div className={styles.stage}>
            <VizCanvas label={VIZ_DESCRIPTION}>
              <Invalidate signal={ratio} />
              <PecletTransport controls={controls} />
            </VizCanvas>

            <div className={styles.stageLabels}>
              <div
                className={styles.mode}
                style={{ opacity: 0.85 + (1 - ratio) * 0.15 }}
              >
                <span className={styles.modeGlyph}>
                  &middot;&nbsp;&middot;&nbsp;&middot;&nbsp;&middot;
                </span>
                <span className={styles.modeName}>Diffusion</span>
                <span className={styles.modeNote}>
                  Spreading through material
                </span>
              </div>

              <div
                className={`${styles.mode} ${styles.modeRight}`}
                style={{ opacity: 0.85 + ratio * 0.15 }}
              >
                <span className={styles.modeGlyph}>
                  &rarr;&nbsp;&rarr;&nbsp;&rarr;&nbsp;&rarr;
                </span>
                <span className={styles.modeName}>Advection</span>
                <span className={styles.modeNote}>Carried by a flow</span>
              </div>
            </div>
          </div>

          <div className={styles.control}>
            <div className={styles.sliderRow}>
              <div className={styles.sliderLabel}>
                <span className="label">Transport balance</span>
                <span className="label">Drag &middot; or use arrow keys</span>
              </div>
              <input
                id="peclet-slider"
                className={styles.slider}
                type="range"
                min={0}
                max={1}
                step={0.005}
                value={ratio}
                onChange={(e) => update(Number(e.target.value))}
                aria-label="Balance between diffusion and advection"
                aria-valuetext={`Péclet number ${formatPeclet(pe)}. ${verdict(pe)}.`}
              />
            </div>

            <div className={styles.readout} aria-hidden="true">
              <span className={styles.readoutValue}>
                <em>Pe</em> = {formatPeclet(pe)}
              </span>
              <span className={styles.readoutVerdict}>{verdict(pe)}</span>
            </div>
          </div>
        </div>

        <p className={styles.caption}>
          {VIZ_DESCRIPTION}
        </p>
      </div>
    </section>
  );
}
