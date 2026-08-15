import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro";
import { ProjectFigure } from "@/components/viz/ProjectFigure";
import { disciplineBySlug } from "@/content/disciplines";
import { projects, projectBySlug } from "@/content/projects";
import { site } from "@/content/site";
import styles from "./page.module.css";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug.get(slug);
  if (!project) return {};

  const description = `${project.status} — ${project.summary}`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description,
      url: `/work/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = projectBySlug.get(slug);
  if (!project) notFound();

  const position = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(position + 1) % projects.length];

  return (
    <>
      <PageIntro
        eyebrow={`PÉCLET / Project Atlas / ${project.index}`}
        readout={project.climate}
        title={project.title}
        lede={project.summary}
      >
        <div className={styles.specs}>
          <span className={styles.spec}>
            <span className={styles.specTerm}>Status</span>
            <span className={styles.specValue}>
              <span className={styles.status}>{project.status}</span>
            </span>
          </span>
          <span className={styles.spec}>
            <span className={styles.specTerm}>Typology</span>
            <span className={styles.specValue}>{project.typology}</span>
          </span>
          <span className={styles.spec}>
            <span className={styles.specTerm}>Climate zone</span>
            <span className={styles.specValue}>{project.climate}</span>
          </span>
          <span className={styles.spec}>
            <span className={styles.specTerm}>Stage</span>
            <span className={styles.specValue}>{project.stage}</span>
          </span>
          <span className={styles.spec}>
            <span className={styles.specTerm}>Governing phenomena</span>
            <span className={styles.specValue}>
              {project.focus
                .map((f) => disciplineBySlug.get(f)?.title ?? f)
                .join(" · ")}
            </span>
          </span>
        </div>

        <div className={styles.disclaimer}>
          <span className="label label--blue">{project.status}</span>
          <p className={styles.disclaimerText}>
            This is a self-directed study. It describes no client, no site and
            no built work. No measured performance, energy saving,
            certification or simulation result is claimed for it, and any
            figures discussed are illustrative of method rather than outcomes.
          </p>
        </div>
      </PageIntro>

      <div className="shell">
        <div className={styles.hero} data-reveal>
          <div className={styles.heroInner}>
            <ProjectFigure slug={project.slug} />
          </div>
        </div>
      </div>

      <div className="shell">
        <div className={styles.layout}>
          <nav className={styles.indexRail} aria-label="Case study sections">
            <p className={`label ${styles.indexTitle}`}>Case study</p>
            <div className={styles.indexList}>
              {project.sections.map((section, i) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={styles.indexLink}
                >
                  <span className={styles.indexNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.label}
                </a>
              ))}
            </div>
          </nav>

          <div className={styles.sections}>
            {project.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className={styles.sectionBlock}
                aria-labelledby={`${section.id}-title`}
                data-reveal
              >
                <div className={styles.sectionHead}>
                  <span className="index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 id={`${section.id}-title`} className={styles.sectionTitle}>
                    {section.label}
                  </h2>
                </div>

                <div className="prose">
                  {section.body.map((paragraph, k) => (
                    <p key={k}>{paragraph}</p>
                  ))}
                </div>

                {section.notes ? (
                  <dl className={styles.notes}>
                    {section.notes.map((note) => (
                      <div key={note.term} className={styles.note}>
                        <dt className={styles.noteTerm}>{note.term}</dt>
                        <dd className={styles.noteValue}>{note.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className="shell">
        <div className={styles.next}>
          <span className="label">Next study</span>
          <Link href={`/work/${next.slug}`} className={styles.nextLink}>
            <span className="index">{next.index}</span>
            <span className={`display ${styles.nextTitle}`}>{next.title}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
