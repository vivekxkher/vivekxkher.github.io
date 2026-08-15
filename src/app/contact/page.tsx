import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with PÉCLET about a project, a research question, a collaboration, or anything else.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — PÉCLET",
    description: "Let's build better physics.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="PÉCLET / Contact"
        readout="Let&rsquo;s talk"
        title={
          <>
            Let&rsquo;s build
            <br />
            better physics.
          </>
        }
        lede="Tell us the climate, the typology, the stage, and the question you are stuck on. The earlier the conversation, the more of it we can actually change."
      />

      <section className="shell" aria-label="Contact">
        <div className={styles.layout}>
          <aside className={styles.aside}>
            <div className={styles.block}>
              <span className="label">Email</span>
              <span className={styles.blockValue}>
                <a href={site.contact.emailHref}>{site.contact.email}</a>
              </span>
            </div>

            <div className={styles.block}>
              <span className="label">Location</span>
              <span className={styles.blockValue}>
                {site.contact.location}
              </span>
            </div>

            <div className={styles.block}>
              <span className="label">Best time to reach us</span>
              <p className={styles.blockNote}>
                At the start of a project, while orientation, massing and
                envelope are still open. We are useful later, but we are
                cheapest early.
              </p>
            </div>

            <div className={styles.block}>
              <span className="label">What helps</span>
              <p className={styles.blockNote}>
                A location, a rough programme and area, the stage you are at,
                and any drawings you already have. None of it is required to
                start a conversation.
              </p>
            </div>
          </aside>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
