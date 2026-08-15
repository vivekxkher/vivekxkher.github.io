import type { DisciplineSlug } from "./disciplines";

/**
 * PROJECT ATLAS.
 *
 * Every entry here is a study PÉCLET has set itself, not commissioned work.
 * Nothing in this file describes a real client, a real site, a completed
 * building, a certification, or a measured result — and the `status` field is
 * surfaced on every card and every page so a reader can never mistake one for
 * the other.
 *
 * ADDING A PROJECT: copy an entry, change the slug, fill in the fourteen
 * case-study sections. Nothing else in the codebase needs to change — the
 * index page, the case-study page, the sitemap and the related-project links
 * all read from this array.
 */

export type ProjectStatus =
  | "Conceptual study"
  | "Demo project"
  | "Speculative";

export interface CaseSection {
  /** Anchor id, also used for the section index. */
  id: string;
  label: string;
  body: string[];
  /** Optional technical readouts — qualitative only until real work exists. */
  notes?: { term: string; value: string }[];
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  /** One line, editorial rather than descriptive. */
  subtitle: string;
  status: ProjectStatus;
  /** Climate zone in the NBC India classification. */
  climate: string;
  typology: string;
  /** Deliberately not a date — these are studies, not a track record. */
  stage: string;
  /** Which phenomena drive this study. */
  focus: DisciplineSlug[];
  summary: string;
  /** The fourteen-part case study. */
  sections: CaseSection[];
}

const DISCLAIMER_STAGE = "Internal study — ongoing";

export const projects: Project[] = [
  {
    slug: "composite-summer-section",
    index: "01",
    title: "Section Through a Composite Summer",
    subtitle:
      "What a housing envelope has to survive between April and July, and what it can stop trying to do.",
    status: "Conceptual study",
    climate: "Composite",
    typology: "Medium-density housing",
    stage: DISCLAIMER_STAGE,
    focus: ["thermal", "solar", "energy"],
    summary:
      "A composite climate asks an envelope to do two opposite jobs six months apart. This study takes a repeatable housing section and works out which decisions serve both seasons and which are simply a bet on one of them.",
    sections: [
      {
        id: "context",
        label: "Context",
        body: [
          "A generic medium-density housing block, four to six storeys, repeated units, load-bearing frame with infill walls. The kind of building that gets built thousands of times over and whose envelope is usually resolved by convention rather than by analysis.",
          "The study is deliberately typological. There is no site, no client and no programme beyond dwelling — the point is to isolate what the physics demands before anything else starts making claims on the section.",
        ],
      },
      {
        id: "climate",
        label: "Climate",
        body: [
          "Composite climates carry a hot dry season, a warm humid monsoon, and a genuinely cool winter. Under the National Building Code classification, a location is composite when it fails to sit in any single other category for more than six months of the year.",
          "That definition is the whole design problem in one sentence. An envelope tuned for May is working against itself in January, and an envelope tuned for comfort in January is a liability in May.",
        ],
        notes: [
          { term: "Classification", value: "Composite (NBC India)" },
          { term: "Dominant stress", value: "Seasonal reversal" },
          { term: "Secondary stress", value: "Monsoon humidity" },
        ],
      },
      {
        id: "problem",
        label: "Problem",
        body: [
          "The default section — plastered masonry, thin or absent insulation, unshaded windows sized for daylight alone — behaves as a thermal follower. Interior temperature tracks exterior temperature with a small lag and almost no damping.",
          "The consequence is not merely discomfort. It is that every occupant is eventually forced to buy their way out of the envelope with mechanical cooling, and the building's real energy demand is set years after handover by decisions made in a fortnight of detailing.",
        ],
      },
      {
        id: "strategy",
        label: "Design strategy",
        body: [
          "Sequence the decisions. Reduce the load the envelope has to carry before choosing what the envelope is made of, and choose what it is made of before sizing anything mechanical.",
          "In practice that means: shade first, because unshaded glass is the largest single load; then mass and insulation together, because in a composite climate they solve different seasons; then ventilation, because the cool hours are real and worth capturing; and only then, plant.",
        ],
      },
      {
        id: "envelope",
        label: "Envelope",
        body: [
          "The study tests a layered wall in which the insulation line sits outboard of the mass, so the mass is coupled to the interior rather than to the sun. A ventilated cavity behind the outer skin carries away the radiant load before it reaches the insulation.",
          "The junctions matter more than the field. A continuous insulation line broken at every floor slab is not an insulated building; it is an insulated wall with a heat exchanger at every level.",
        ],
      },
      {
        id: "thermal",
        label: "Thermal",
        body: [
          "The question is damping, not resistance alone. The section is assessed for how much of the daily exterior swing survives to the internal surface, and how far the peak is delayed.",
          "Where mass sits in the build-up decides whether it stores useful coolth overnight or simply re-radiates the afternoon into the room at nine in the evening.",
        ],
      },
      {
        id: "solar",
        label: "Solar",
        body: [
          "Each orientation is treated separately. South and west behave nothing alike: a south façade can be shaded by geometry alone, while a west façade in summer receives low-angle sun that no reasonable overhang will stop.",
          "The study works through fixed geometry first — depth, projection, fin spacing — and treats operable or applied shading as a fallback rather than a starting point.",
        ],
      },
      {
        id: "air",
        label: "Air",
        body: [
          "Composite climates offer a real prize: hours in the shoulder seasons and at night when outdoor air is worth bringing inside. Capturing them requires openings positioned for cross-flow, not merely openings that open.",
          "The study also separates airtightness from ventilation. Sealing the fabric is what makes the ventilation strategy controllable rather than accidental.",
        ],
      },
      {
        id: "moisture",
        label: "Moisture",
        body: [
          "Monsoon humidity, driving rain and a cool winter together mean the assembly must be able to dry — and must be able to dry in the direction that is actually available to it.",
          "Vapour-tight layers placed on the wrong side of the insulation turn a well-meant detail into a trap. The study checks the sequence of permeabilities, not just their presence.",
        ],
      },
      {
        id: "daylight",
        label: "Daylight",
        body: [
          "Daylight and solar control pull in opposite directions and are usually resolved by whichever consultant speaks last. The study treats aperture position and depth of plan as the primary tools, so that glazing area can stay modest.",
          "A smaller, higher, better-shaded opening frequently delivers more usable daylight further into a room than a larger one at eye level.",
        ],
      },
      {
        id: "energy",
        label: "Energy",
        body: [
          "All of the above resolves into a balance: fabric loss and gain, ventilation loss and gain, solar and internal gain, and whatever the systems must then supply.",
          "The study's interest is in which term dominates, and how that dominance shifts across the year — because that is what determines whether a given intervention is worth its cost or is simply visible.",
        ],
      },
      {
        id: "simulation",
        label: "Simulation",
        body: [
          "Modelling here is used to compare options against one another, not to produce a headline figure. Relative differences between variants under identical assumptions are robust; absolute predictions about an unbuilt, unoccupied, unsited building are not.",
          "Every variant is run on the same weather assumptions, the same internal gains and the same operating profile, so that the only thing changing is the design decision under test.",
        ],
      },
      {
        id: "performance",
        label: "Performance",
        body: [
          "No measured performance is claimed for this study. It has not been built, occupied or monitored, and any number presented as a result would be an invention.",
          "What the study does establish is a ranking: which decisions move the balance most, in which season, and at what point additional envelope investment stops repaying itself.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        body: [
          "A section, a set of junction principles, and an order of operations that can be carried into a real project and tested against a real climate file.",
          "The transferable finding is about sequence: in a composite climate, decisions taken in the wrong order produce buildings that are expensive in both seasons rather than comfortable in either.",
        ],
      },
    ],
  },
  {
    slug: "shaded-volume",
    index: "02",
    title: "The Shaded Volume",
    subtitle:
      "A hot, dry climate rewards geometry more than it rewards materials. This study takes that seriously.",
    status: "Conceptual study",
    climate: "Hot & dry",
    typology: "Institutional / workplace",
    stage: DISCLAIMER_STAGE,
    focus: ["solar", "daylight", "thermal"],
    summary:
      "In a hot dry climate the sun is the load and the night sky is the resource. This study tests how far form, shade and mass alone can carry a building before any mechanical system is asked to do anything.",
    sections: [
      {
        id: "context",
        label: "Context",
        body: [
          "A single institutional volume with a deep plan and a long working day. No site, no client — a form study, tested against the demands a hot dry climate makes of any building of this size.",
          "The typology is chosen because it concentrates the conflict: deep plans want daylight, and daylight in this climate arrives attached to a great deal of heat.",
        ],
      },
      {
        id: "climate",
        label: "Climate",
        body: [
          "Hot and dry: high mean monthly maximum temperatures with low relative humidity. The National Building Code classification places a location here when the mean monthly maximum exceeds 30 °C and relative humidity stays below roughly 55 per cent.",
          "The low humidity is not incidental — it is the design opportunity. Large diurnal swings and a clear night sky make nocturnal cooling genuinely available in a way it simply is not in a humid climate.",
        ],
        notes: [
          { term: "Classification", value: "Hot & dry (NBC India)" },
          { term: "Dominant stress", value: "Direct solar gain" },
          { term: "Available resource", value: "Diurnal swing, night sky" },
        ],
      },
      {
        id: "problem",
        label: "Problem",
        body: [
          "Buildings of this type are routinely delivered as glazed volumes with high-specification glass, on the argument that the glass will handle the climate. It will not: a coated unit still admits a substantial fraction of a very large incident load, and the load is very large indeed.",
          "The deeper problem is that solving solar gain at the glass rather than in front of it forfeits the two things this climate offers for free — shade and mass.",
        ],
      },
      {
        id: "strategy",
        label: "Design strategy",
        body: [
          "Shade the volume, not the window. A self-shading massing, a deep external screen or a shaded court removes load before it reaches any surface that has to be specified.",
          "Then use mass deliberately: heavy construction coupled to the interior, charged by night ventilation, discharged across the working day.",
        ],
      },
      {
        id: "envelope",
        label: "Envelope",
        body: [
          "A high-mass envelope behind an external shading layer, with modest, deliberately placed apertures. Insulation is present but is not the leading actor — in this climate, keeping the sun off the surface matters more than resisting conduction through it.",
          "Openings are treated as three separate requirements — light, view, air — which do not have to be met by the same hole.",
        ],
      },
      {
        id: "thermal",
        label: "Thermal",
        body: [
          "The study looks at surface temperatures as much as air temperatures. In a shaded, high-mass building, radiant conditions do most of the work of comfort, and a cool surface is worth several degrees of air temperature.",
          "Time lag through the assembly is tuned so that the peak arrives after the building is empty.",
        ],
      },
      {
        id: "solar",
        label: "Solar",
        body: [
          "Sun-path studies drive the massing rather than decorate it. Each façade is assessed for the hours it is actually exposed, and shading geometry is developed per orientation rather than applied uniformly.",
          "The west façade is treated as a separate problem with its own answer, because it always is.",
        ],
      },
      {
        id: "air",
        label: "Air",
        body: [
          "Night purge is the central mechanism: moving a large volume of cool night air across exposed mass, then closing the building against the day.",
          "This requires openings that can be secure, weathertight and open at three in the morning — a detailing problem as much as a physics one, and the study treats it as such.",
        ],
      },
      {
        id: "moisture",
        label: "Moisture",
        body: [
          "Low ambient humidity makes interstitial condensation a minor risk in this climate, which frees the assembly to be vapour-open and simple.",
          "The moisture question that does matter is driving rain during short intense events, and the durability of external surfaces under high ultraviolet exposure and large thermal movement.",
        ],
      },
      {
        id: "daylight",
        label: "Daylight",
        body: [
          "Deep plans and small apertures are a difficult combination, so daylight is brought in from above and from courts rather than only from the perimeter.",
          "Reflected and indirect light is preferred throughout: in this climate, direct sun admitted to a working plane is a glare source and a cooling load simultaneously.",
        ],
      },
      {
        id: "energy",
        label: "Energy",
        body: [
          "The balance here is dominated by solar gain and, once that is controlled, by internal gains and ventilation.",
          "The study's question is how far the passive measures carry the building, and what is left for a system to do — because a system sized for a shaded, massed building is a fundamentally different piece of equipment from one sized for a glass box.",
        ],
      },
      {
        id: "simulation",
        label: "Simulation",
        body: [
          "Shading geometry, mass distribution and night-ventilation rate are varied one at a time against a fixed baseline so that each contribution can be attributed.",
          "Comparative only. The study makes no claim about what this building would do on a particular site in a particular year.",
        ],
      },
      {
        id: "performance",
        label: "Performance",
        body: [
          "Nothing here has been built or measured. No performance figures, certifications or savings are claimed or implied.",
          "The output is a relative ranking of measures and the point at which each stops earning its place.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        body: [
          "A massing logic and a shading grammar that can be adapted to a real brief, plus a clear statement of what the strategy depends on — chiefly, a genuine diurnal swing and the ability to operate the building at night.",
          "Where those conditions do not hold, the study says so rather than pretending the strategy travels.",
        ],
      },
    ],
  },
  {
    slug: "monsoon-envelope",
    index: "03",
    title: "Monsoon Envelope",
    subtitle:
      "Warm, humid, and wet for months. The envelope that survives it is mostly about drying.",
    status: "Demo project",
    climate: "Warm & humid",
    typology: "Low-rise mixed use",
    stage: DISCLAIMER_STAGE,
    focus: ["moisture", "air", "daylight"],
    summary:
      "A demonstration of the case-study system applied to the hardest durability problem in Indian building physics: an envelope that must stay comfortable, ventilated and dry through a long monsoon.",
    sections: [
      {
        id: "context",
        label: "Context",
        body: [
          "A low-rise mixed-use building in a warm humid coastal setting, used as a demonstration of the case-study structure rather than as a design proposal.",
          "It exists to show how the fourteen sections work together on a project where moisture, not heat, is the governing phenomenon.",
        ],
      },
      {
        id: "climate",
        label: "Climate",
        body: [
          "Warm and humid: high mean monthly maximum temperatures with relative humidity above roughly 55 per cent under the National Building Code classification, and an extended monsoon with sustained driving rain.",
          "The small diurnal swing is the critical fact. Night cooling is largely unavailable, so strategies that depend on it — thermal mass charged overnight — do not transfer here.",
        ],
        notes: [
          { term: "Classification", value: "Warm & humid (NBC India)" },
          { term: "Dominant stress", value: "Sustained humidity" },
          { term: "Unavailable resource", value: "Night cooling" },
        ],
      },
      {
        id: "problem",
        label: "Problem",
        body: [
          "Envelopes designed for heat get built in climates governed by moisture. Sealed, insulated, vapour-tight assemblies borrowed from cold-climate practice fail here — not thermally, but by staying wet.",
          "The failure is slow and invisible until it is structural, which is exactly what makes it a building-physics problem rather than a maintenance one.",
        ],
      },
      {
        id: "strategy",
        label: "Design strategy",
        body: [
          "Shed water, then ventilate the assembly, then worry about heat. Deep overhangs, drained and ventilated cavities, and generous cross-ventilation do most of the work.",
          "Comfort is pursued through air movement rather than air temperature, because in this climate moving air is worth more than a cooler thermometer.",
        ],
      },
      {
        id: "envelope",
        label: "Envelope",
        body: [
          "A rainscreen principle throughout: an outer layer that sheds the bulk of the water, a drained and ventilated cavity behind it, and a robust vapour-open inner assembly that can dry inward and outward.",
          "Every horizontal surface, junction and penetration is treated as a water-management detail first.",
        ],
      },
      {
        id: "thermal",
        label: "Thermal",
        body: [
          "Insulation levels are modest by design. With a small diurnal swing and high humidity, the value of additional resistance falls away quickly while the risk of trapping moisture rises.",
          "Surface temperatures are checked against dew point rather than against comfort alone.",
        ],
      },
      {
        id: "solar",
        label: "Solar",
        body: [
          "Overhangs are sized for rain as much as for sun, which usually makes them deeper than a purely solar analysis would suggest.",
          "Diffuse sky radiation carries a large share of the load under monsoon cloud, so shading is assessed against the whole sky rather than the solar disc alone.",
        ],
      },
      {
        id: "air",
        label: "Air",
        body: [
          "Cross-ventilation is the primary comfort mechanism and is planned at the level of the section: inlet, path, outlet, and the pressure difference that drives them.",
          "Openings must work during rain, which means ventilation and weather protection are a single detail rather than two.",
        ],
      },
      {
        id: "moisture",
        label: "Moisture",
        body: [
          "This is the governing section. Vapour drive reverses seasonally and can reverse daily where interiors are cooled, so the assembly is designed to dry in both directions rather than to resist in one.",
          "Materials are selected for their behaviour when wet, not only for their behaviour when dry.",
        ],
      },
      {
        id: "daylight",
        label: "Daylight",
        body: [
          "Deep overhangs cut daylight as effectively as they cut rain, so apertures are placed high and interior surfaces kept light to push daylight further in.",
          "Overcast-sky conditions dominate for months, which changes both the availability and the distribution of light.",
        ],
      },
      {
        id: "energy",
        label: "Energy",
        body: [
          "Where cooling is provided, latent load — removing moisture from air — dominates sensible load. That reverses the usual system-sizing intuition and changes which efficiency measures matter.",
          "Reducing infiltration of humid air is worth more here than reducing conduction.",
        ],
      },
      {
        id: "simulation",
        label: "Simulation",
        body: [
          "Assembly moisture behaviour is examined by comparing build-up variants under identical assumed boundary conditions, looking at whether each can dry rather than at a predicted moisture content.",
          "Comparative and directional. No absolute prediction is offered.",
        ],
      },
      {
        id: "performance",
        label: "Performance",
        body: [
          "This is a demonstration entry. It has not been built, occupied or monitored, and no performance result, saving or certification is claimed.",
          "It exists to show the structure of a PÉCLET case study end to end.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        body: [
          "A set of envelope principles for a moisture-governed climate, and a worked example of how the fourteen sections hold together.",
          "The recurring conclusion: in this climate an assembly that cannot dry is a failure regardless of what its thermal calculation says.",
        ],
      },
    ],
  },
];

export const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

/** The fourteen-part structure, for the case-study section index. */
export const caseStructure = [
  "Context",
  "Climate",
  "Problem",
  "Design strategy",
  "Envelope",
  "Thermal",
  "Solar",
  "Air",
  "Moisture",
  "Daylight",
  "Energy",
  "Simulation",
  "Performance",
  "Outcome",
];
