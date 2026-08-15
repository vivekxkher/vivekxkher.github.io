# PÉCLET — Building Physics | Climate Design

The practice website. Next.js 16 + React 19 + TypeScript, with live WebGL
visualisations built on three.js / React Three Fiber and GSAP.

---

## Running it

Everything is already installed. Node.js 24 lives in
`C:\Users\smitp\AppData\Local\nodejs` and is on your PATH.

Open a terminal in this folder and run:

```bash
npm run dev
```

Then open <http://localhost:3000>.

---

## Deploying it

The site builds to a plain folder of HTML, CSS, JavaScript and images. There is
no server, no database and nothing to keep running.

**Step 1 — build.**

```bash
npm run build
```

This creates a folder called **`out`** with `index.html` at its root. That
folder *is* the website — about 15 MB, 192 files, 25 pages.

**Step 2 — check it before uploading.**

```bash
npm run preview
```

Open <http://localhost:4173>. This serves `out/` the dumb way a cheap host
does, with no dev-server cleverness, so anything that would break in the wild
breaks here first.

**Step 3 — upload the *contents* of `out/`** to wherever the site is hosted.

Not the folder itself — its contents, so that `index.html` lands at the top
level of the web root. On shared hosting that usually means `public_html`.

### Netlify (the route in use)

Netlify accepts a zip drop, which avoids Git and the command line entirely.

1. Build, then package the export:

```bash
npm run build
```

```bash
powershell -c "Compress-Archive -Path out\* -DestinationPath peclet-site.zip -Force"
```

The `out\*` matters — zipping `out` itself buries every page one folder deep
and the site 404s.

2. Go to **app.netlify.com/drop** and drag `peclet-site.zip` onto the page.

Repeat both steps after any content change; the deploy is a snapshot.

`public/_headers` ships with the export and Netlify reads it: hashed assets
under `_next/static` are cached for a year, HTML always revalidates so a
redeploy actually reaches people.

### Vercel

Vercel has **no drag-and-drop**. It deploys from a Git repository or from its
CLI — trying to hand it a folder through the dashboard is the usual reason a
first attempt fails.

The repo is initialised (`main`, one commit) but has **no remote**. To use
Vercel:

1. Create an empty repository on github.com — no README, no `.gitignore`.
2. Connect and push:

```bash
git remote add origin https://github.com/<you>/peclet.git
```

```bash
git push -u origin main
```

3. On vercel.com, **Add New → Project**, import that repository.
4. **Leave every build setting at its default.** Vercel detects Next.js, reads
   `output: "export"` from `next.config.ts`, and serves `out/` by itself.

**Do not set the Output Directory to `out` by hand.** Overriding it while the
Next.js framework preset is active is a common source of a Vercel
*Configuration Error* — the preset and the override contradict each other.
Framework Preset should read **Next.js**, Root Directory should be empty, and
Build/Output/Install commands should all be blank (inherited).

`engines.node` is set to `>=20.9.0` so the host picks a Node version Next 16
can actually run on.

### Choosing a host

Any static host works. Ranked for this site:

| Host | Why |
| --- | --- |
| **Cloudflare Pages** | Free, fast worldwide, free SSL. Drag `out/` onto their dashboard. |
| **Netlify** | Same idea, equally simple drag-and-drop. |
| **Vercel** | Made by the Next.js authors; connect the repo and it builds on its own. |
| Shared hosting / cPanel | Works, but you upload by hand every time. |

`trailingSlash` is on, so every page is a real folder with an `index.html`
inside it. That is the form the widest range of hosts serve without any
rewrite rules — plain Apache included.

### Connecting péclet.com

State of the domain as checked on 2026-08-15:

| | |
| --- | --- |
| Registrar / DNS | **GoDaddy** (`ns31/ns32.domaincontrol.com`) |
| Punycode form | `xn--pclet-bsa.com` |
| Apex `A` | `216.198.79.1` — **Vercel**, left over from the failed attempt |
| `www` CNAME | `ac2d8572627d4b7c.vercel-dns-017.com` — also Vercel |
| MX | `smtp.secureserver.net`, `mailstore1.secureserver.net` — **GoDaddy email, live** |
| SPF | `v=spf1 include:secureserver.net -all` |

**Do not move the nameservers to Netlify.** There is working email on this
domain. Switching nameservers hands all DNS to Netlify and the MX and SPF
records above stop existing, which kills mail delivery until they are
recreated by hand. Keep DNS at GoDaddy and change only the two website records:

1. In Netlify, add the custom domain and let it show the records it wants.
2. In GoDaddy DNS, **edit** the existing apex `A` record — replace the Vercel
   IP with the one Netlify displays.
3. **Edit** the `www` CNAME — replace the `vercel-dns` target with the
   Netlify subdomain.
4. Leave MX, TXT and everything else untouched.
5. Wait for propagation, then let Netlify issue the certificate.

Use the values Netlify shows at the time rather than any written here; hosts
change their load-balancer addresses.

### The accent is a real liability

`péclet.com` is an internationalised domain. Every system stores it as
`xn--pclet-bsa.com`, and that punycode form surfaces in places you would rather
it did not — some address bars, some link previews, plenty of mail clients.

More practically: most people cannot type `é` without effort, and
**`peclet.com` without the accent belongs to someone else** — it is parked on
Afternic (a domain marketplace), so it is for sale rather than available.

Two consequences worth planning around:

- Anyone who types the name without the accent lands on a for-sale page, not
  on this site. Buying `peclet.com` and redirecting it is the only fix, and it
  will not be cheap.
- An email address like `hello@péclet.com` will be rejected or mangled by a
  meaningful share of mail systems. Consider a plain-ASCII address on a
  different domain for anything printed on a business card.

### Before it goes live

- Point the domain **péclet.com** at the host, and let it issue the SSL
  certificate.
- Replace the placeholder contact details in `src/content/site.ts`.
- Decide whether the contact form should post to a real service instead of
  opening the visitor's mail app.
- Rebuild after any content change and re-upload — the folder is a snapshot,
  not a live app.

---

## Where things live

```
src/
  app/                     One folder per page (Next.js App Router)
    page.tsx               Homepage
    work/                  Project Atlas + case studies
    disciplines/           The six phenomena + live instruments
    research/              Observations
    atlas/                 India Climate Atlas
    about/  contact/
    sitemap.ts robots.ts   SEO plumbing
  content/                 ALL WRITTEN CONTENT — edit here, not in components
    site.ts                Name, nav, contact details
    disciplines.ts         The six phenomena
    projects.ts            Project Atlas entries + 14-part case studies
    research.ts            Observations
    climate.ts             Five climate zones + 50 located cities
  components/
    layout/                Header, footer, grid, smooth scroll
    home/                  Homepage sections
    viz/                   WebGL and SVG visualisations
    instruments/           Each discipline's interactive instrument
    ui/                    Shared editorial primitives
    atlas/                 Climate atlas plot
  styles/
    tokens.css             Colour, type, space, motion — one source of truth
    base.css               Reset + editorial base layer
  lib/                     Solar geometry, daylight model, hooks
tools/
  shot.mjs                 Screenshot harness for visual checking
  shots/                   Generated screenshots (not part of the site)
```

### Adding content later

- **A project**: copy an entry in `src/content/projects.ts`, change the slug,
  fill in the fourteen case-study sections. The index page, the case-study
  page, the sitemap and the "next study" links all pick it up automatically.
- **An article**: copy an entry in `src/content/research.ts`.
- **Contact details**: `src/content/site.ts` — currently placeholders.

---

## Content rule enforced throughout

Nothing on this site claims real clients, real sites, built work, measured
performance, energy savings, certifications or awards. Every project is
labelled **Conceptual study** or **Demo project**, each case study carries an
explicit disclaimer, and the energy instrument states that its figures are an
illustrative index rather than a calculation. Keep it that way until there is
real work to describe.

Climate-zone thresholds quoted in the atlas are the published National
Building Code of India classification, cited as such.

---

## State of play

### Done

- Development environment, project scaffold, dependencies
- Design system: tokens, Archivo + IBM Plex Mono, grid, navigation, footer
- Homepage hero — heat carriers advecting through a wall section, slowing
  through the insulation, responding to the pointer as a heat source, with the
  "Buildings as climate systems" scroll reveal
- Péclet instrument — draggable advection/diffusion balance
- Disciplines index and six detail pages
- Instruments: Thermal, Solar (true 3D with real solar geometry and shadows),
  Moisture, Daylight (per-pixel sky-view model), Energy (SVG balance)
- Project Atlas + three case studies with generated line drawings
- India Climate Atlas — 50 real locations plotted at their coordinates
- Research index and six observations
- About — practice statement, founder (Vivek Kher), and working principles
- Contact (form composes a message into the visitor's mail client)
- Metadata, sitemap, robots, canonicals, 404
- Social cards: a per-page 1200 × 630 Open Graph and Twitter image for the
  home page and each top-level section, with alt text
- Production build passes: 27 pages, all statically prerendered

### Verified

**Accessibility — 0 violations across 12 routes** (axe-core), with a focus ring
on every keyboard stop and no heading-outline problems.

**No text collisions** — every route walked in resting, hover and pressed
states at 1440 px and 390 px, comparing the rectangles of all leaf text
elements. 0 overlaps.

**Lighthouse**, production build, desktop. Accessibility, best practices and
SEO are **100 on every route measured**. CLS is 0 and LCP 0.5–0.9 s throughout.

Performance splits cleanly in two:

| Route | Perf |
| --- | --- |
| `/about`, `/contact`, `/research`, `/work` | 100 |
| `/atlas` | 95–100 |
| `/disciplines/*` (WebGL) | 76–99 |
| `/` (WebGL hero) | 71–100 |

Pages without a live simulation are a solid 100. The WebGL pages carry genuine
main-thread cost — shader compilation and buffer generation — and their score
**varies a lot between runs depending on what else the machine is doing**. The
best clean runs were 99 for the discipline pages and 94 for the home page; runs
taken with the dev server also running dropped to the low 70s. Measure on a
quiet machine before treating any number here as the real one.

**Responsive** — no horizontal overflow at 390 px, 834 px, 1280 px or 1440 px.
Particle counts scale with canvas area, so a phone is not asked to draw a
desktop's worth of carriers.

**Reduced motion** — the frame loop stops, values snap to their settled state
rather than freezing mid-transition, and controls still repaint when the
visitor moves them.

### Still open

1. **Higgsfield** is installed and signed in, but the account has **0 credits**,
   so nothing can be generated yet — see below. No credits spent.
2. **Performance on the WebGL routes** could be trimmed further if the numbers
   matter: the cost is shader compilation and buffer generation on first paint.
   Lowering carrier counts is the lever, at some cost to how the fields read.

### Fixed after review

- **Cards vanished on hover.** The scroll-reveal state was a class added
  imperatively, and React rewrites `className` wholesale on re-render — so
  hovering a card wiped the class and dropped it back to opacity 0. The
  revealed state is now an attribute, which React leaves alone.
- **Too much air between sections.** Every section had a full unit of padding
  top *and* bottom, so the visible gap was double what it looked like in the
  token — 346 px on the home page. Now roughly 158 px at 1440.
- **`ENERGY` collided with its meta column** on the home page: the title track
  was 7 rem and the display type is wider than that.
- **Moisture rendered nothing.** Two shader bugs: `pow()` with a negative base
  is undefined in GLSL, and a variable rename left a dangling reference that
  failed compilation silently apart from one console line.
- **Header floated translucently over page text.** Opaque once scrolled.

### Needed from you before launch

- Real contact email and practice location (`src/content/site.ts`)
- Whether the contact form should post to a real service rather than opening
  the visitor's mail client
- Domain and deployment authorisation

---

## Checking things visually

```bash
node tools/shot.mjs /disciplines/solar desktop 0.2
```

Arguments: path, preset (`desktop` `wide` `laptop` `tablet` `mobile`), scroll
fraction. Add `--full` for a whole-page capture, `--motion=reduce` to test the
reduced-motion path. Screenshots land in `tools/shots/`.

```bash
node tools/audit.mjs
```

Accessibility audit across every route — axe-core, heading outline, and a real
Tab-key walk that checks each stop actually shows a focus ring.

```bash
node tools/lighthouse.mjs
```

Lighthouse against the production build. Run `npm run build` first and start
the built site on port 3100.

```bash
node tools/probe.mjs /
```

Console errors, failed requests and label/name mismatches on a page.

```bash
node tools/overlap.mjs
```

Walks every route in resting, hover and pressed states and reports any text
that has landed on top of other text. `PECLET_VIEWPORT=mobile` to check at
390 px.

```bash
node tools/og.mjs
```

Re-renders the social cards. Run it after changing the card design or the
titles inside the script, then `npm run build` so the new images are picked up.

```bash
node tools/rhythm.mjs /
```

Prints the height and padding of each top-level section — useful when the
vertical spacing feels wrong.

These all drive the copy of Chrome already installed on this machine, because
Playwright's own browser download is blocked here. They default to
`http://localhost:3000`; set `PECLET_BASE` to point at the production build on
3100 instead.

---

## Higgsfield

**Installed and signed in. Blocked on credits — the account has none.**

Set up on 2026-08-15:

- `@higgsfield/cli` v1.1.23 installed globally. Its postinstall was read before
  being allowed: it fetches the official release binary from
  `github.com/higgsfield-ai/cli` and extracts it, nothing else.
- Signed in via browser OAuth. Workspace `Private` selected. Check the current
  account with `higgsfield account status`.
- Eight companion skills installed to `.agents/skills/` from
  `higgsfield-ai/skills`, symlinked for Claude Code.
- The MCP server in `.mcp.json` is a second, independent route to the same
  service. The CLI supersedes it; the entry is harmless either way.

**Account state: free plan, 0 credits.** No generation will run until credits
are bought at higgsfield.ai. Nothing has been generated and nothing has been
spent.

Useful commands:

```bash
higgsfield account status
```

```bash
higgsfield model list --video
```

When there are credits, the seven assets and their prompts are in
`docs/higgsfield-brief.md`. Generate **one** first and look at it before
committing to the rest — the house style usually needs a revision or two to
land. Finished files go in `public/media/` under the filenames listed there.

### Two cautions

- The skills installer prints its own warning: skills *run with full agent
  permissions*. They are from the official Higgsfield GitHub org, but they are
  third-party instructions, so treat them as such.
- `higgsfield auth token` prints the raw access token to the terminal. Avoid
  running it where the output gets recorded. To invalidate a token that has
  been exposed, run `higgsfield auth logout` and sign in again.
