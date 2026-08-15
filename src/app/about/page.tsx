import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { founder } from "@/content/people";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "PÉCLET studies how buildings exchange heat, light, air and moisture with their climate, and translates those interactions into design decisions.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — PÉCLET",
    description:
      "Buildings are physical systems. PÉCLET studies their interactions and translates them into design decisions.",
    url: "/about",
  },
};

const exchanges = [
  { name: "Sun", note: "The largest thermal event in a building's life." },
  { name: "Air", note: "The fastest way to move energy in or out." },
  { name: "Heat", note: "Crosses whatever you build, at a rate you set." },
  { name: "Moisture", note: "Slow, invisible, and the longest-lived failure." },
  { name: "Materials", note: "Decide what the envelope actually does." },
  { name: "People", note: "Occupy it, operate it, and judge it." },
  { name: "Energy", note: "The arithmetic left once the rest is decided." },
];

const principles = [
  {
    title: "Physics before preference",
    body: "We start from what the climate demands and what the assembly can do, not from a strategy chosen in advance. Where the analysis contradicts the intent, we say so early, while it is still cheap to change.",
  },
  {
    title: "Sequence over specification",
    body: "Most envelope failures are ordering failures. Reduce the load before resisting it; resolve the geometry before sizing the plant. A measure applied out of order costs money without moving the outcome.",
  },
  {
    title: "Comparative, not predictive",
    body: "Modelling an unbuilt building tells you which option is better under identical assumptions. It does not tell you what the meter will read. We report the ranking and the margin, and we are explicit about what the model cannot know.",
  },
  {
    title: "Detail is where it is decided",
    body: "A continuous insulation line broken at every slab is not an insulated building. A vapour control layer on the wrong side is a trap. We work at junctions because that is where performance is won or lost.",
  },
  {
    title: "Climate is local",
    body: "A build-up that is correct in one Indian climate zone can be a defect in another. Strategies transfer only when the resource they depend on transfers with them.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="PÉCLET / About"
        readout="Building Physics | Climate Design"
        title={
          <>
            Buildings are
            <br />
            physical systems.
          </>
        }
        lede="They continuously interact with sun, air, heat, moisture, materials, people and energy. PÉCLET studies those interactions and translates them into design decisions."
      />

      <section className="shell" aria-label="What a building exchanges">
        <div className={styles.statement}>
          <div className={styles.exchanges}>
            {exchanges.map((exchange, i) => (
              <div key={exchange.name} className={styles.exchange} data-reveal
                data-reveal-delay={i * 60}>
                <span className={styles.exchangeIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.exchangeName}>{exchange.name}</span>
                <span className={styles.exchangeNote}>{exchange.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell" aria-labelledby="practice-title">
        <div className={styles.body}>
          <div>
            <p className={`label ${styles.columnHead}`} id="practice-title">
              The practice
            </p>
          </div>
          <div className="prose">
            <p>
              PÉCLET is a building physics and climate design practice. We work
              alongside architects and engineers on the parts of a building that
              decide how it will behave: the envelope, the openings, the
              orientation, and the sequence in which those decisions are taken.
            </p>
            <p>
              The name is borrowed from the Péclet number, the ratio between
              transport by flow and transport by spreading. It is a useful thing
              to keep in mind, because almost every question in this field turns
              out to be a question about which of those two is doing the work —
              and answering it wrongly is how a well-intentioned detail becomes
              a defect.
            </p>
            <p>
              We are interested in buildings that are comfortable before they are
              conditioned, and in being able to say why. That means comparative
              analysis rather than headline figures, junctions rather than
              averages, and a willingness to report a result that is
              inconvenient.
            </p>
          </div>
        </div>
      </section>

      <section className="shell" aria-labelledby="founder-title">
        <div className={styles.body}>
          <div>
            <p className={`label ${styles.columnHead}`} id="founder-title">
              {founder.role}
            </p>
          </div>

          <div className={styles.founder}>
            <div data-reveal>
              <h2 className={`display ${styles.founderName}`}>
                {founder.name}
              </h2>
              <p className={`label ${styles.founderRole}`}>{founder.role}</p>
              <p className={styles.founderStandfirst}>{founder.standfirst}</p>
            </div>

            <div data-reveal data-reveal-delay="80">
              <div className="prose">
                {founder.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <dl className={styles.credentials}>
                {founder.credentials.map((credential) => (
                  <div key={credential.term} className={styles.credential}>
                    <dt className={styles.credentialTerm}>{credential.term}</dt>
                    <dd className={styles.credentialValue}>
                      {credential.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="shell" aria-labelledby="principles-title">
        <div className={styles.body}>
          <div>
            <p className={`label ${styles.columnHead}`} id="principles-title">
              How we work
            </p>
          </div>
          <div>
            <div className={styles.principles}>
              {principles.map((principle, i) => (
                <div key={principle.title} className={styles.principle} data-reveal>
                  <span className={styles.principleNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className={`display ${styles.principleTitle}`}>
                      {principle.title}
                    </h2>
                    <p className={styles.principleBody}>{principle.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
