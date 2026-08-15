"use client";

import type { Discipline } from "@/content/disciplines";
import { AirInstrument } from "./AirInstrument";
import { DaylightInstrument } from "./DaylightInstrument";
import { EnergyInstrument } from "./EnergyInstrument";
import { MoistureInstrument } from "./MoistureInstrument";
import { SolarInstrument } from "./SolarInstrument";
import { ThermalInstrument } from "./ThermalInstrument";

/** Routes a discipline to its live instrument. */
export function DisciplineInstrument({
  discipline,
}: {
  discipline: Discipline;
}) {
  switch (discipline.slug) {
    case "thermal":
      return <ThermalInstrument discipline={discipline} />;
    case "solar":
      return <SolarInstrument discipline={discipline} />;
    case "air":
      return <AirInstrument discipline={discipline} />;
    case "moisture":
      return <MoistureInstrument discipline={discipline} />;
    case "daylight":
      return <DaylightInstrument discipline={discipline} />;
    case "energy":
      return <EnergyInstrument discipline={discipline} />;
  }
}
