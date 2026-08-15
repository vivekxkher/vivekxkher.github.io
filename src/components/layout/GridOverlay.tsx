import styles from "./GridOverlay.module.css";

/**
 * The structural grid, left faintly visible. Decorative and inert — hidden
 * from assistive technology.
 */
export function GridOverlay() {
  return (
    <div className={styles.overlay} aria-hidden="true" data-site-chrome="grid">
      <div className={styles.inner}>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className={styles.col} />
        ))}
      </div>
    </div>
  );
}
