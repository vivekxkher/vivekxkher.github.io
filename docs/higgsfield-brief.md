# Higgsfield — asset brief

Everything needed to generate the seven cinematic assets for the site, whether
they come through the Claude Code integration or are made by hand on
higgsfield.ai and dropped into `public/media/`.

**Nothing has been generated yet. No credits have been spent.**

---

## House style — paste this into every prompt

> Ultra-premium cinematic architectural visualisation. Contemporary
> high-performance architecture. Dark atmospheric environment. Precise
> architectural geometry. Glass, concrete, aluminium, insulation. Sophisticated
> building-envelope detail. Scientific visualisation sensibility. Subtle cool
> blue accents on a near-black and warm-white palette. Realistic physically
> based lighting. Slow cinematic camera movement. Minimal, quiet, precise,
> editorial. No cyberpunk, no neon city, no generic futuristic towers, no text
> or lettering, no logos, no stock-photo look, no people.

---

## The seven assets

Ordered by how much they matter. If the budget only covers a few, do 1, 3 and
5 — those are the three the site leans on hardest.

### 1. Hero cinematic — `hero.mp4`

Slow push toward a building envelope at dusk, reading as a section: cladding,
a shadowed cavity, insulation, structure. Light rakes across the face and falls
away. Almost still — the camera moves less than you expect.

*Where it goes:* behind the opening title, under the particle field.
*Format:* 16:9, seamless loop if possible, 8–12 s.

### 2. Architectural atmosphere — `atmosphere.mp4`

Exterior of a restrained contemporary building in low sun. Deep reveals, sharp
shadow lines, one strong horizontal. Air visibly moving — dust, haze.

*Where it goes:* About page, and the Project Atlas header.
*Format:* 16:9, 8–12 s.

### 3. Thermal visualisation — `thermal.mp4`

Heat crossing a wall assembly, seen as a scientific field rather than a
cartoon: a warm exterior face, a steep gradient through the insulation, a calm
interior. Restrained warm-to-cool ramp, no rainbow false colour.

*Where it goes:* Thermal discipline page, behind the live instrument.
*Format:* 16:9, 8 s, loopable.

### 4. Solar visualisation — `solar.mp4`

Sun tracking across a façade over a day. Shadow of a deep overhang sweeping
across glass, the reveal cutting light off entirely at midday.

*Where it goes:* Solar discipline page.
*Format:* 16:9, 10 s.

### 5. Airflow visualisation — `airflow.mp4`

Streamlines around a building mass. Separation at the windward face,
acceleration round the corner, a slow recirculating wake behind. Thin bright
lines on near-black, closer to a wind-tunnel photograph than a render.

*Where it goes:* Air discipline page.
*Format:* 16:9, 8 s, loopable.

### 6. Daylight visualisation — `daylight.mp4`

Interior of a deep room with a single tall aperture. A shaft of light on the
floor, falling away sharply toward the back of the plan. Dust in the beam.

*Where it goes:* Daylight discipline page.
*Format:* 16:9, 8–12 s.

### 7. Project atmosphere — `project.mp4`

A building read as a set of stacked volumes in flat overcast light. Neutral,
documentary, almost dull — this one sits behind text and must not compete.

*Where it goes:* case-study headers.
*Format:* 16:9, 10 s.

---

## Where finished files go

Drop them in `public/media/` with exactly the filenames above. Then say the
word and they get wired in — poster frames extracted, `<video>` elements with
`muted`, `playsInline`, `preload="none"`, lazy mounting, and a still fallback
under `prefers-reduced-motion`.

Do **not** let a video become load-bearing: every one of these sits *behind*
something that already works without it. The site is complete as it stands;
these are atmosphere, not content.

## Budget note

Generate one asset first and look at it before committing to the rest. The
house style above is worth more than the model choice, and it usually takes a
revision or two to land.
