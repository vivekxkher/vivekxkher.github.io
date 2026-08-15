import styles from "./ProjectFigure.module.css";

/**
 * Each project is represented by a drawing rather than a photograph. These
 * are studies of unbuilt work — a line diagram is the honest image, and it
 * says what the study is about in a way a render would only obscure.
 */
export function ProjectFigure({ slug }: { slug: string }) {
  const common = {
    className: styles.figure,
    viewBox: "0 0 320 200",
    role: "presentation",
    "aria-hidden": true,
    focusable: false,
  } as const;

  if (slug === "composite-summer-section") {
    // Stacked housing section: repeated floors, shaded openings, two sun angles.
    return (
      <svg {...common}>
        <g>
          {[0, 1, 2, 3].map((i) => {
            const y = 176 - i * 36;
            return (
              <g key={i}>
                <line className={styles.line} x1="90" y1={y} x2="250" y2={y} />
                <rect
                  className={styles.solid}
                  x="90"
                  y={y - 30}
                  width="160"
                  height="30"
                />
                {/* opening */}
                <line
                  className={styles.lineBright}
                  x1="196"
                  y1={y - 24}
                  x2="196"
                  y2={y - 4}
                />
                <line
                  className={styles.lineBright}
                  x1="250"
                  y1={y - 24}
                  x2="250"
                  y2={y - 4}
                />
                {/* overhang */}
                <line
                  className={styles.line}
                  x1="250"
                  y1={y - 30}
                  x2="278"
                  y2={y - 30}
                />
              </g>
            );
          })}
          <line className={styles.line} x1="90" y1="32" x2="250" y2="32" />
          <line className={styles.line} x1="90" y1="32" x2="90" y2="176" />
          {/* ground */}
          <line className={styles.lineFaint} x1="40" y1="176" x2="300" y2="176" />
          {/* summer sun — steep */}
          <path className={styles.accent} d="M292 20 L262 74" />
          <path className={styles.accent} d="M282 14 L288 26 L276 30" />
          {/* winter sun — shallow */}
          <path className={styles.line} d="M304 96 L258 120" opacity="0.7" />
        </g>
      </svg>
    );
  }

  if (slug === "shaded-volume") {
    // A volume behind a deep external screen, with a sun arc above.
    return (
      <svg {...common}>
        <path className={styles.accent} d="M52 158 A108 108 0 0 1 268 158" opacity="0.4" />
        <circle className={styles.accent} cx="98" cy="76" r="3.5" fill="currentColor" />
        <line className={styles.lineFaint} x1="30" y1="158" x2="300" y2="158" />

        {/* volume */}
        <rect className={styles.solid} x="132" y="72" width="112" height="86" />
        <line className={styles.line} x1="132" y1="72" x2="244" y2="72" />
        <line className={styles.line} x1="132" y1="72" x2="132" y2="158" />
        <line className={styles.line} x1="244" y1="72" x2="244" y2="158" />

        {/* deep screen */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={i}
            className={styles.hatch}
            x1={108 + i * 3}
            y1={64 + i * 0}
            x2={108 + i * 3}
            y2={158}
          />
        ))}
        <line className={styles.line} x1="104" y1="64" x2="136" y2="64" />
        <line className={styles.line} x1="104" y1="64" x2="104" y2="158" />

        {/* court */}
        <line className={styles.lineBright} x1="176" y1="72" x2="176" y2="158" />
        <line className={styles.lineBright} x1="200" y1="72" x2="200" y2="158" />
      </svg>
    );
  }

  // monsoon-envelope — low-rise with deep overhangs, rain, ventilated cavity.
  return (
    <svg {...common}>
      {/* rain */}
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={i}
          className={styles.hatch}
          x1={40 + i * 24}
          y1={14 + (i % 3) * 8}
          x2={32 + i * 24}
          y2={38 + (i % 3) * 8}
          opacity="0.45"
        />
      ))}

      <line className={styles.lineFaint} x1="24" y1="170" x2="300" y2="170" />

      {/* roof + deep overhangs */}
      <path className={styles.line} d="M46 86 L160 56 L274 86" />
      <line className={styles.line} x1="46" y1="86" x2="30" y2="92" />
      <line className={styles.line} x1="274" y1="86" x2="290" y2="92" />

      {/* body */}
      <rect className={styles.solid} x="86" y="98" width="148" height="72" />
      <line className={styles.line} x1="86" y1="98" x2="234" y2="98" />
      <line className={styles.line} x1="86" y1="98" x2="86" y2="170" />
      <line className={styles.line} x1="234" y1="98" x2="234" y2="170" />

      {/* ventilated cavity */}
      <line className={styles.lineBright} x1="96" y1="98" x2="96" y2="170" />
      <line className={styles.lineBright} x1="224" y1="98" x2="224" y2="170" />

      {/* cross ventilation */}
      <path className={styles.accent} d="M62 128 L258 128" />
      <path className={styles.accent} d="M248 122 L258 128 L248 134" />
    </svg>
  );
}
