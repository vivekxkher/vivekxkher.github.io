"use client";

import { useRef, useState } from "react";
import { Control, Instrument } from "@/components/viz/Instrument";
import { EnvelopeSection } from "@/components/viz/EnvelopeSection";
import {
  ThermalField,
  type ThermalControls,
} from "@/components/viz/ThermalField";
import { usePointerField } from "@/components/viz/shared/usePointerField";
import { Invalidate, VizCanvas } from "@/components/viz/shared/VizCanvas";
import type { Discipline } from "@/content/disciplines";

const EXT_MIN = 20;
const EXT_MAX = 48;
const INTERIOR = 24;

export function ThermalInstrument({ discipline }: { discipline: Discipline }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [exterior, setExterior] = useState(38);

  const controls = useRef<ThermalControls>({
    reveal: 1,
    progress: 0,
    exterior: (38 - EXT_MIN) / (EXT_MAX - EXT_MIN),
  });

  const pointer = usePointerField(stageRef);

  const update = (value: number) => {
    setExterior(value);
    controls.current.exterior = (value - EXT_MIN) / (EXT_MAX - EXT_MIN);
  };

  // A well-insulated assembly passes very little of the swing inward.
  const interior = INTERIOR + (exterior - INTERIOR) * 0.055;
  const gradient = exterior - interior;

  return (
    <Instrument
      figure="Fig. 01 — Envelope section"
      hint="Move across the section to add a heat source"
      caption={discipline.altText}
      stageRef={stageRef}
      controls={
        <>
          <Control
            id="thermal-exterior"
            label="Exterior condition"
            display={`${exterior.toFixed(0)} °C`}
            valueText={`${exterior.toFixed(0)} degrees Celsius`}
            min={EXT_MIN}
            max={EXT_MAX}
            step={0.5}
            value={exterior}
            onChange={update}
          />
          <Control
            id="thermal-interior"
            label="Interior (design condition)"
            display={`${interior.toFixed(1)} °C`}
            valueText={`${interior.toFixed(1)} degrees Celsius`}
            min={INTERIOR}
            max={INTERIOR}
            step={1}
            value={INTERIOR}
            onChange={() => {}}
          />
        </>
      }
      overlay={
        <EnvelopeSection
          active
          exteriorTemp={exterior}
          interiorTemp={interior}
        />
      }
    >
      <VizCanvas label={discipline.altText}>
        <Invalidate signal={exterior} />
        <ThermalField pointer={pointer} controls={controls} count={18000} />
      </VizCanvas>
      <span className="sr-only">
        Temperature difference across the assembly: {gradient.toFixed(1)} kelvin.
      </span>
    </Instrument>
  );
}
