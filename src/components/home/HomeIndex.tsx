import Link from "next/link";
import { SectionHead, SectionTitle } from "@/components/ui/SectionHead";
import { climateZones } from "@/content/climate";
import { projects } from "@/content/projects";
import { research } from "@/content/research";
import styles from "./HomeIndex.module.css";

export function WorkPreview() {
  return (
    <section className={styles.section} aria-labelledby="work-preview-title">
      <div className="shell">
        <SectionHead
          eyebrow="PÉCLET / Project Atlas"
          readout={`${String(projects.length).padStart(2, "0")} Studies`}
        />
        <SectionTitle>
          <span id="work-preview-title">An atlas of problems</span>
        </SectionTitle>

        <div className={styles.projects}>
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={styles.project}
              data-reveal
            >
              <span className="index">{project.index}</span>
              <span>
                <span className={`display ${styles.projectTitle}`}>
                  {project.title}
                </span>
                <span className={styles.projectTags}>
                  <span className={styles.status}>{project.status}</span>
                  <span className={styles.zone}>{project.climate}</span>
                </span>
              </span>
              <span className={styles.projectSub}>{project.subtitle}</span>
              <span className={styles.arrow} aria-hidden="true">
                &rarr;
              </span>
            </Link>
          ))}
        </div>

        <Link href="/work" className={styles.more}>
          Open the atlas
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

export function AtlasTeaser() {
  return (
    <section
      className={`${styles.section} ${styles.sectionAlt}`}
      aria-labelledby="atlas-teaser-title"
    >
      <div className="shell">
        <SectionHead eyebrow="PÉCLET / India Climate Atlas" readout="05 Zones" />

        <div className={styles.atlas}>
          <div className={styles.atlasBody} data-reveal>
            <span className="label label--blue">Signature study</span>
            <h2 id="atlas-teaser-title" className={`display ${styles.atlasTitle}`}>
              Five climates,
              <br />
              one country
            </h2>
            <p className={styles.atlasText}>
              A wall build-up that is correct in Jaisalmer can be a defect in
              Kochi. The atlas sets out what governs each Indian climate zone,
              what resource each one offers, and the order in which decisions
              should be taken.
            </p>
            <Link href="/atlas" className={styles.more}>
              Open the climate atlas
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className={styles.zones} data-reveal data-reveal-delay="80">
            {climateZones.map((zone) => (
              <div key={zone.id} className={styles.zoneCell}>
                <span
                  className={styles.zoneSwatch}
                  style={{ background: zone.accent }}
                  aria-hidden="true"
                />
                <span className="index">{zone.index}</span>
                <span className={styles.zoneName}>{zone.name}</span>
                <span className={styles.zoneGoverns}>
                  Governed by
                  <br />
                  {zone.governs}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResearchPreview() {
  const latest = research.slice(0, 3);

  return (
    <section className={styles.section} aria-labelledby="research-preview-title">
      <div className="shell">
        <SectionHead
          eyebrow="PÉCLET / Research"
          readout={`${String(research.length).padStart(2, "0")} Observations`}
        />
        <SectionTitle>
          <span id="research-preview-title">Positions worth arguing with</span>
        </SectionTitle>

        <div className={styles.notes}>
          {latest.map((note) => (
            <Link
              key={note.slug}
              href={`/research/${note.slug}`}
              className={styles.note}
              data-reveal
            >
              <span className="index">{note.index}</span>
              <span className={`display ${styles.noteTitle}`}>{note.title}</span>
              <span className={styles.noteText}>{note.standfirst}</span>
              <span className={styles.noteFoot}>
                <span className="label">{note.categories[0]}</span>
                <span className="label" style={{ marginLeft: "auto" }}>
                  {note.minutes} min
                </span>
              </span>
            </Link>
          ))}
        </div>

        <Link href="/research" className={styles.more}>
          All observations
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
