/**
 * RESEARCH / OBSERVATIONS.
 *
 * Short written positions, not published papers. Nothing here cites a result
 * PÉCLET has not produced or claims a credential the practice does not hold.
 *
 * ADDING AN ARTICLE: copy an entry, change the slug, write the body as an
 * array of paragraphs. `kicker` paragraphs render as pull statements.
 */

export const researchCategories = [
  "Building Physics",
  "Climate",
  "Materials",
  "Passive House",
  "Energy",
  "Simulation",
  "India",
] as const;

export type ResearchCategory = (typeof researchCategories)[number];

export interface ResearchBlock {
  type: "text" | "statement" | "list";
  /** For text and statement. */
  body?: string;
  /** For list. */
  items?: string[];
}

export interface ResearchNote {
  slug: string;
  index: string;
  title: string;
  standfirst: string;
  categories: ResearchCategory[];
  /** Reading time in minutes, rounded. */
  minutes: number;
  blocks: ResearchBlock[];
}

export const research: ResearchNote[] = [
  {
    slug: "insulation-is-not-a-strategy",
    index: "01",
    title: "Insulation is not a strategy",
    standfirst:
      "Adding resistance to a wall is a decision about one term in a balance. In several Indian climates it is not the term that matters.",
    categories: ["Building Physics", "India", "Materials"],
    minutes: 5,
    blocks: [
      {
        type: "text",
        body: "Insulation has become shorthand for environmental seriousness. It is measurable, specifiable, and easy to point at in a drawing. It is also, in a large part of the country, not the first thing a building needs.",
      },
      {
        type: "statement",
        body: "Resistance answers conduction. Most of India's envelope problem is not conduction.",
      },
      {
        type: "text",
        body: "In a hot dry climate the dominant term is direct solar gain on surfaces and through glass. A wall with twice the resistance and no shade in front of it is still receiving the same enormous incident load; it simply takes marginally longer to pass it on. Shade removes the load rather than delaying it.",
      },
      {
        type: "text",
        body: "In a warm humid climate the dominant term is moisture, and the resource that insulation would normally protect — a cool interior charged overnight — barely exists, because the diurnal swing is small. Worse, an assembly detailed to hold heat out is frequently detailed to hold moisture in.",
      },
      {
        type: "text",
        body: "None of this is an argument against insulation. It is an argument for order. Establish which term dominates in this climate, on this orientation, for this use, and then decide what the envelope is made of.",
      },
      {
        type: "list",
        items: [
          "Hot & dry — shade first, then mass, then resistance.",
          "Warm & humid — shed and dry first, then air movement, then modest resistance.",
          "Composite — sequence for the worse season, then check the other has not been made unliveable.",
          "Cold — resistance and airtightness genuinely do lead.",
        ],
      },
      {
        type: "text",
        body: "The failure mode we see most often is not an under-insulated building. It is a well-insulated building that never had its solar loads or its drying paths resolved, and which therefore performs no better than the one it replaced.",
      },
    ],
  },
  {
    slug: "the-dew-point-is-a-design-decision",
    index: "02",
    title: "The dew point is a design decision",
    standfirst:
      "Condensation inside an assembly is not bad luck. Its location is set by the order of the layers, and somebody chose that order.",
    categories: ["Building Physics", "Materials", "Simulation"],
    minutes: 4,
    blocks: [
      {
        type: "text",
        body: "Water vapour moves through materials along a pressure gradient, slowly and invisibly. Somewhere in the thickness of a wall the temperature falls low enough that the vapour present can no longer stay vapour. That plane exists in every assembly. The only question is where it lands and what is sitting there when it does.",
      },
      {
        type: "statement",
        body: "Every wall has a condensation plane. Detailing decides whether it falls somewhere harmless.",
      },
      {
        type: "text",
        body: "Placed inside a vapour-open, drying-capable layer, condensate forms, migrates and leaves. Placed against a vapour-tight membrane, or at the face of a material that holds water and loses strength when wet, the same quantity of moisture accumulates year on year until something structural is discovered by accident.",
      },
      {
        type: "text",
        body: "This is why permeability sequence matters more than any single layer's specification. An assembly should get more vapour-open as it moves toward the direction it needs to dry in. Reverse that and a perfectly compliant build-up becomes a trap.",
      },
      {
        type: "text",
        body: "In climates where the vapour drive reverses seasonally — and, in cooled buildings in humid regions, daily — the assembly must be able to dry in both directions. Designing for one is designing for half the year.",
      },
    ],
  },
  {
    slug: "comfort-is-not-a-temperature",
    index: "03",
    title: "Comfort is not a temperature",
    standfirst:
      "Air temperature is one of six variables, and often not the one doing the work.",
    categories: ["Building Physics", "Climate", "Energy"],
    minutes: 4,
    blocks: [
      {
        type: "text",
        body: "Thermal comfort is conventionally described by six variables: air temperature, mean radiant temperature, air speed, humidity, clothing and metabolic rate. Design practice tends to control the first and ignore the rest, which is why buildings meet their setpoint and still feel wrong.",
      },
      {
        type: "statement",
        body: "A cool surface and moving air will do more for an occupant than two degrees off the thermostat.",
      },
      {
        type: "text",
        body: "Radiant conditions dominate in high-mass buildings and next to large glazed areas. A person standing beside a west-facing window at five in the afternoon is exchanging heat with a surface far hotter than the room, and no amount of cooled air makes that comfortable — it only makes it expensive.",
      },
      {
        type: "text",
        body: "Air movement is the other neglected variable, and in warm humid climates it is the decisive one. Moving air raises the temperature at which people remain comfortable by a meaningful margin, which is why buildings designed around cross-ventilation can be comfortable at conditions where a sealed building would be running plant hard.",
      },
      {
        type: "text",
        body: "Designing for comfort rather than for temperature usually reduces energy demand as a side effect. Designing for temperature alone reliably does not.",
      },
    ],
  },
  {
    slug: "what-passive-house-does-and-does-not-transfer",
    index: "04",
    title: "What Passive House does and does not transfer",
    standfirst:
      "The method is sound. Some of the assumptions underneath it were formed in a climate that is not this one.",
    categories: ["Passive House", "India", "Energy"],
    minutes: 6,
    blocks: [
      {
        type: "text",
        body: "The Passive House method's real contribution is not a set of numbers. It is a discipline: reduce demand through fabric and form, verify with a consistent calculation, and do not let a system specification paper over a geometry problem. That discipline transfers anywhere.",
      },
      {
        type: "statement",
        body: "The rigour travels. The default targets were calibrated somewhere colder.",
      },
      {
        type: "text",
        body: "What travels less well are the assumptions baked into a heating-dominated origin. Very high insulation levels and near-total airtightness are the right answer when the problem is keeping heat in through a long winter. Where the problem is keeping solar gain out, removing moisture, or exploiting night ventilation, the same measures range from marginal to counterproductive.",
      },
      {
        type: "text",
        body: "Latent load is the sharpest example. In warm humid conditions, dehumidification can dominate the cooling energy entirely, and a metric focused on sensible demand will rank options in the wrong order.",
      },
      {
        type: "text",
        body: "The productive position is to take the method and re-derive the targets from the climate at hand, rather than importing both. That is more work, and it is the work.",
      },
    ],
  },
  {
    slug: "models-compare-they-do-not-predict",
    index: "05",
    title: "Models compare, they do not predict",
    standfirst:
      "A simulation of an unbuilt building tells you which option is better. It does not tell you what the meter will say.",
    categories: ["Simulation", "Energy", "Building Physics"],
    minutes: 4,
    blocks: [
      {
        type: "text",
        body: "Energy models are routinely presented as forecasts. They are not, and treating them as such is how a project ends up defending a number rather than improving a building.",
      },
      {
        type: "statement",
        body: "Hold every assumption constant and change one thing. The difference is trustworthy. The absolute value is not.",
      },
      {
        type: "text",
        body: "Occupancy, operation, weather, and the gap between specified and installed construction each introduce more variance than most of the design decisions being tested. What survives all of that is the ranking: option B used less than option A under identical assumptions, and by roughly this margin.",
      },
      {
        type: "text",
        body: "This is not a limitation to apologise for. Comparative modelling answers the question a design team actually has, which is what to do next. It only becomes a problem when the output is promoted into a performance guarantee somewhere between the report and the brochure.",
      },
      {
        type: "text",
        body: "The honest form of words is narrow and worth using: under these assumptions, this option reduced this demand by this much relative to this baseline.",
      },
    ],
  },
  {
    slug: "five-climates-one-country",
    index: "06",
    title: "Five climates, one country",
    standfirst:
      "A detail that is correct in one Indian climate zone can be a defect in another. The zones are not a formality.",
    categories: ["Climate", "India", "Building Physics"],
    minutes: 5,
    blocks: [
      {
        type: "text",
        body: "The National Building Code divides India into five climate zones — hot and dry, warm and humid, composite, temperate, and cold — on the basis of mean monthly maximum temperature and relative humidity. The classification is old, coarse, and far more useful than the attention it receives.",
      },
      {
        type: "statement",
        body: "The same wall build-up cannot be right in Jaisalmer and in Kochi. It is routinely specified in both.",
      },
      {
        type: "text",
        body: "Zones differ not only in severity but in which phenomenon governs. Hot and dry is a solar problem with a night-cooling resource. Warm and humid is a moisture problem with no night-cooling resource. Composite is both, six months apart. Temperate is mild enough that the envelope can be simple. Cold is the only zone where the imported cold-climate playbook applies more or less as written.",
      },
      {
        type: "text",
        body: "Because the governing phenomenon changes, the order of design decisions changes with it — and a strategy is only transferable if the resource it depends on exists at the new location.",
      },
      {
        type: "text",
        body: "Our climate atlas exists to make that concrete: which zone, which governing phenomenon, which resource available, and therefore which decisions come first.",
      },
    ],
  },
];

export const researchBySlug = new Map(research.map((r) => [r.slug, r]));
