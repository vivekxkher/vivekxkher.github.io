import Link from "next/link";
import { disciplines } from "@/content/disciplines";
import { primaryNav, secondaryNav, site } from "@/content/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} data-site-chrome="footer">
      <div className="shell">
        <div className={styles.top}>
          <div className={styles.statement}>
            <p className="label">Next</p>
            <p className={styles.statementText}>
              Let&rsquo;s build better physics.
            </p>
            <Link href="/contact" className={styles.cta}>
              Start a conversation
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div>
            <p className={`label ${styles.colTitle}`}>Navigate</p>
            <ul className={styles.colList}>
              {[...primaryNav, ...secondaryNav].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.colLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`label ${styles.colTitle}`}>Disciplines</p>
            <ul className={styles.colList}>
              {disciplines.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/disciplines/${d.slug}`}
                    className={styles.colLink}
                  >
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`label ${styles.colTitle}`}>Contact</p>
            <ul className={styles.colList}>
              <li>
                <a href={site.contact.emailHref} className={styles.colLink}>
                  {site.contact.email}
                </a>
              </li>
              <li>
                <p className={styles.colText}>{site.contact.location}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shell">
        <div className={styles.wordmark} aria-hidden="true">
          <span className={styles.wordmarkText} style={{ textTransform: "none" }}>{site.name}</span>
        </div>
      </div>

      <div className="shell">
        <div className={styles.bottom}>
          <span className="label">
            &copy; {year} <span style={{ textTransform: "none" }}>{site.name}</span> — {site.tagline}
          </span>
          <span className={styles.formula}>
            <em>Pe</em> = advection / diffusion = uL / D
          </span>
        </div>
      </div>
    </footer>
  );
}
