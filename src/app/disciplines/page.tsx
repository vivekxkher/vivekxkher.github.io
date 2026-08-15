import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { DisciplineGrid } from "./DisciplineGrid";

export const metadata: Metadata = {
  title: "Disciplines",
  description:
    "The six transport phenomena PÉCLET works with — thermal, solar, air, moisture, daylight and energy — each with a live, interactive visualisation.",
  alternates: { canonical: "/disciplines" },
  openGraph: {
    title: "Disciplines — PÉCLET",
    description:
      "Six transport phenomena: thermal, solar, air, moisture, daylight and energy.",
    url: "/disciplines",
  },
};

export default function DisciplinesPage() {
  return (
    <>
      <PageIntro
        eyebrow="PÉCLET / Disciplines"
        readout="06 Phenomena"
        title={
          <>
            Six transport
            <br />
            problems.
          </>
        }
        lede="A building exchanges heat, light, air and moisture with its climate continuously. These are the six exchanges we work with, each with its own governing quantity, its own dominant transport mechanism, and its own way of going wrong."
      />

      <section className="shell section--tight" aria-label="Disciplines">
        <DisciplineGrid />
      </section>
    </>
  );
}
