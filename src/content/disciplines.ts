/**
 * The six transport phenomena PÉCLET works with. Each one drives a live
 * visualisation; `altText` is the accessible equivalent of that visualisation
 * and must describe what it shows, not that it exists.
 */

export type DisciplineSlug =
  | "thermal"
  | "solar"
  | "air"
  | "moisture"
  | "daylight"
  | "energy";

export interface Discipline {
  slug: DisciplineSlug;
  index: string;
  title: string;
  /** The physical quantity being tracked. */
  quantity: string;
  /** Dominant transport mechanism — the Péclet framing. */
  transport: string;
  /** Symbol and unit, shown as a technical readout. */
  unit: string;
  lede: string;
  body: string[];
  /** What we ask of a building in this domain. */
  questions: string[];
  /** How the question gets answered. */
  methods: string[];
  /** Accessible description of the interactive visualisation. */
  altText: string;
  /** One-line instruction for how to drive the visualisation. */
  interaction: string;
}

export const disciplines: Discipline[] = [
  {
    slug: "thermal",
    index: "01",
    title: "Thermal",
    quantity: "Temperature",
    transport: "Conduction · Convection · Radiation",
    unit: "θ — °C · U — W/m²K",
    lede: "Heat does not respect drawings. It moves through whatever you build, at a rate the assembly decides.",
    body: [
      "Every envelope is a resistance network. Layers of cladding, cavity, insulation, structure and finish each slow heat by a different amount, and the weakest continuous path — not the average — sets what the building actually loses.",
      "Thermal bridging, thermal mass and the daily swing between inside and outside decide whether a room is comfortable at four in the afternoon or merely compliant on paper. We work in the difference between those two things.",
    ],
    questions: [
      "Where does the insulation line actually run, and where does it break?",
      "How much heat crosses the envelope on the worst day of the year?",
      "Does the mass in this building help, or does it store the wrong thing?",
      "What is the surface temperature a person is standing next to?",
    ],
    methods: [
      "Steady-state and dynamic envelope assessment",
      "Thermal bridge analysis at junctions",
      "Surface temperature and comfort mapping",
      "Assembly build-up development with the design team",
    ],
    altText:
      "A cross-section through a wall assembly, drawn as five vertical layers from exterior cladding through a ventilated cavity, insulation, structure and interior finish. Particles carrying heat cross the section from the warm side to the cool side, slowing markedly inside the insulation layer and accelerating through the cavity. A temperature gradient runs across the section, warm on the exposed face and cool on the protected face.",
    interaction:
      "Move the pointer across the section to change where heat enters. Drag to raise or lower the exterior temperature.",
  },
  {
    slug: "solar",
    index: "02",
    title: "Solar",
    quantity: "Irradiance",
    transport: "Shortwave radiation",
    unit: "G — W/m² · SHGC — 0…1",
    lede: "The sun is the largest thermal event in the life of a building, and it arrives on a schedule you can calculate.",
    body: [
      "Solar gain is neither good nor bad. In January it is the cheapest heating a building will ever receive; in May it is the load that sizes the plant. The geometry of the year decides which one you get.",
      "Orientation, shading depth, glazing ratio and glass specification are a single connected decision. We work them together, early, while they are still cheap to change.",
    ],
    questions: [
      "When does each façade actually see the sun, and for how long?",
      "What does the overhang do in June that it does not do in December?",
      "Is glare being solved, or simply moved to another room?",
      "Which façade is sizing the cooling plant?",
    ],
    methods: [
      "Annual sun-path and shading studies",
      "Façade-by-facade irradiance assessment",
      "Shading device geometry development",
      "Glazing specification and glazing ratio testing",
    ],
    altText:
      "A simple building mass on a ground plane, seen in three dimensions. The sun travels along an arc overhead, and the building casts a shadow that lengthens, rotates and shortens as the sun moves. Façades brighten as they come into direct sun and fall dark as they pass into shade, with a readout of solar altitude and azimuth.",
    interaction:
      "Drag horizontally to move through the day. Drag vertically to move through the year.",
  },
  {
    slug: "air",
    index: "03",
    title: "Air",
    quantity: "Pressure and flow",
    transport: "Advection",
    unit: "u — m/s · ACH — 1/h",
    lede: "Air is the fastest way to move energy into or out of a building, and the hardest to draw.",
    body: [
      "Wind pressure, stack effect and mechanical supply compete at every opening. The result decides whether a space is ventilated or merely leaky — the two look identical on a plan and behave nothing alike.",
      "Airtightness is not the opposite of ventilation. It is what makes ventilation controllable. We separate the two deliberately: seal the fabric, then choose where the air goes.",
    ],
    questions: [
      "Where does air enter, and where does it leave?",
      "Does cross-ventilation exist here, or only in the render?",
      "What happens to the flow path when the wind turns?",
      "Is infiltration doing the job the ventilation strategy claims to do?",
    ],
    methods: [
      "Natural ventilation strategy development",
      "Airtightness line definition and continuity checking",
      "Flow-path and pressure-regime assessment",
      "Mixed-mode and seasonal operation logic",
    ],
    altText:
      "Streams of particles flow across a building form from one side to the other. The flow separates at the windward face, accelerates around the corners, and forms a slow recirculating wake on the leeward side. Some particles pass through openings in the form and cross the interior. Particle brightness indicates local speed.",
    interaction:
      "Drag to change the wind direction. The flow field re-forms around the building.",
  },
  {
    slug: "moisture",
    index: "04",
    title: "Moisture",
    quantity: "Vapour pressure",
    transport: "Diffusion · Capillarity",
    unit: "p — Pa · RH — %",
    lede: "Moisture moves slowly, invisibly, and it is the failure mode that outlives everyone on the project.",
    body: [
      "Water vapour diffuses through materials along a pressure gradient. Somewhere inside the assembly the temperature falls low enough for that vapour to condense — and where that plane sits, relative to the layers, is a design decision whether or not anyone made it deliberately.",
      "Vapour control, drying capacity and material selection are one problem. An assembly that cannot dry in at least one direction is a liability regardless of its U-value.",
    ],
    questions: [
      "Where does the dew point fall inside this assembly, in winter?",
      "Can this build-up dry, and in which direction?",
      "Is the vapour control layer continuous, or is it a drawing convention?",
      "What does this detail look like after fifteen monsoons?",
    ],
    methods: [
      "Interstitial condensation assessment",
      "Vapour control strategy and layer sequencing",
      "Material permeability and drying-capacity review",
      "Junction and interface risk review",
    ],
    altText:
      "A magnified cross-section through a porous material, shown as a dense field of pores. Vapour particles perform a slow random walk from the high-humidity side toward the low-humidity side, drifting rather than streaming. A dew-point plane runs through the section; particles crossing it slow, settle and accumulate as condensate. Moving the plane changes where accumulation occurs.",
    interaction:
      "Drag to change interior humidity. Watch where the condensation plane settles inside the build-up.",
  },
  {
    slug: "daylight",
    index: "05",
    title: "Daylight",
    quantity: "Illuminance",
    transport: "Visible radiation",
    unit: "E — lux · DF — %",
    lede: "Daylight is the only building service that is free, variable, and impossible to retrofit.",
    body: [
      "An aperture does four things at once: it admits light, admits heat, offers a view and loses energy. Sizing it for any one of those in isolation produces a building that fails at the other three.",
      "Depth of plan, ceiling height, surface reflectance and aperture position matter more than glazing area. A smaller, better-placed opening usually beats a larger one.",
    ],
    questions: [
      "How far into this plan does useful daylight actually reach?",
      "What is the contrast between the brightest and darkest part of the room?",
      "Is the electric lighting ever switched off during the day?",
      "Does this window give light, view and glare in the proportions intended?",
    ],
    methods: [
      "Daylight availability and distribution studies",
      "Aperture position, proportion and depth testing",
      "Glare and contrast assessment",
      "Surface reflectance and interior finish guidance",
    ],
    altText:
      "The interior of a room seen in section, with a single aperture in one wall. Light enters through the opening, forms a bright pool on the floor near the window, and falls away steeply toward the back of the room. Changing the aperture size and the sun angle changes the depth and evenness of the lit zone, with an illuminance falloff curve drawn along the floor.",
    interaction:
      "Drag to move the sun. Use the aperture control to change the size of the opening.",
  },
  {
    slug: "energy",
    index: "06",
    title: "Energy",
    quantity: "Demand",
    transport: "Balance",
    unit: "Q — kWh/m²a",
    lede: "Energy is not a discipline of its own. It is the arithmetic left over once the other five have been decided.",
    body: [
      "Fabric loss, ventilation loss, solar gain, internal gain and system efficiency form a single balance. Improving one term while ignoring the others moves the number without improving the building.",
      "The order matters: reduce demand through form and fabric, then meet what remains efficiently. Reversing that order buys equipment to solve a geometry problem.",
    ],
    questions: [
      "Which term in the balance actually dominates here?",
      "What is the cheapest kilowatt-hour — the one never demanded?",
      "Is the system sized for the building, or for the drawing of it?",
      "Where does this design stop improving and start costing?",
    ],
    methods: [
      "Whole-building energy balance modelling",
      "Demand-reduction sequencing before system selection",
      "Parametric option testing across fabric and services",
      "Performance-target setting with the design team",
    ],
    altText:
      "An energy balance drawn as flowing ribbons. Gains enter from the left as solar and internal heat; losses leave to the right through fabric, ventilation and system inefficiency. Ribbon thickness is proportional to the size of each term, and the ribbons re-proportion themselves as the balance changes. A residual demand figure sits at the centre.",
    interaction:
      "Adjust the measures on the left. The balance re-proportions and the residual demand updates.",
  },
];

export const disciplineBySlug = new Map(disciplines.map((d) => [d.slug, d]));
