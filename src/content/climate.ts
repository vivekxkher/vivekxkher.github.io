/**
 * INDIA CLIMATE ATLAS.
 *
 * Zone definitions follow the National Building Code of India classification,
 * which sorts locations by mean monthly maximum temperature and mean monthly
 * relative humidity. Those thresholds are a published standard, not our
 * measurement, and are quoted as such.
 *
 * The design guidance below is general building-physics reasoning about each
 * zone. It is not project advice, and it makes no claim about any specific
 * building.
 *
 * City coordinates are approximate, to roughly a tenth of a degree — enough
 * to place a location on a national plot, not a survey.
 */

export type ZoneId =
  | "hot-dry"
  | "warm-humid"
  | "composite"
  | "moderate"
  | "cold";

export interface ClimateZone {
  id: ZoneId;
  index: string;
  name: string;
  /** The published NBC threshold. */
  criterion: string;
  /** The phenomenon that decides the design. */
  governs: string;
  /** What the climate offers that can be used. */
  resource: string;
  /** What it withholds. */
  absent: string;
  lede: string;
  body: string[];
  /** Ordered — the sequence in which decisions should be taken. */
  sequence: string[];
  /** Common mistakes in this zone. */
  pitfalls: string[];
  /** Accent hue offset for the plot, expressed as a CSS colour. */
  accent: string;
}

export const climateZones: ClimateZone[] = [
  {
    id: "hot-dry",
    index: "01",
    name: "Hot & Dry",
    criterion: "Mean monthly max above 30 °C · relative humidity below 55 %",
    governs: "Direct solar gain",
    resource: "Large diurnal swing · clear night sky",
    absent: "Ambient moisture",
    lede: "The sun is the load. The night is the resource. Everything follows from that pair.",
    body: [
      "Incident solar radiation on surfaces and through glass dominates every other term in the balance. Reducing it is worth more than any amount of added resistance behind it, because shade removes the load rather than delaying its arrival.",
      "The compensating gift is a large day-to-night temperature difference under a clear sky. Heavy construction coupled to the interior can be charged with cool night air and discharged across the working day — provided the building can actually be opened at night and closed by morning.",
      "Low humidity also simplifies the assembly. Interstitial condensation risk is modest, so build-ups can be vapour-open and straightforward, and attention moves to durability under high ultraviolet exposure and large thermal movement.",
    ],
    sequence: [
      "Shade the volume before shading the window",
      "Use mass, coupled to the interior, not to the sun",
      "Purge with night air; close the building by day",
      "Keep apertures modest and deliberately placed",
      "Add resistance where it still earns its place",
      "Size systems for what is left",
    ],
    pitfalls: [
      "Specifying high-performance glass instead of removing the load",
      "Placing mass outboard of the insulation, where it stores the afternoon",
      "A night-ventilation strategy the building cannot be operated to deliver",
    ],
    accent: "#c2703f",
  },
  {
    id: "warm-humid",
    index: "02",
    name: "Warm & Humid",
    criterion: "Mean monthly max above 30 °C · relative humidity above 55 %",
    governs: "Moisture",
    resource: "Reliable air movement · consistent daylight under cloud",
    absent: "Night cooling",
    lede: "Not a heat problem with humidity attached. A moisture problem that happens to be warm.",
    body: [
      "The diurnal swing is small and the air is wet, so the night-cooling strategy that carries a hot dry building is simply unavailable here. Comfort has to come from air movement rather than from a lower thermometer reading.",
      "Sustained humidity and long driving rain make drying capacity the governing property of the envelope. An assembly that resists moisture in one direction but cannot dry in either is a durability failure waiting for time to pass.",
      "Where cooling is provided, latent load — removing water from air — can dominate sensible load entirely. That reverses the usual ranking of efficiency measures: keeping humid air out matters more than keeping heat out.",
    ],
    sequence: [
      "Shed water — deep overhangs, drained and ventilated cavities",
      "Make every assembly able to dry, in both directions",
      "Plan cross-ventilation as a section: inlet, path, outlet",
      "Design openings that work during rain",
      "Keep insulation modest; avoid trapping moisture",
      "If cooling, treat latent load as the primary load",
    ],
    pitfalls: [
      "Importing a sealed, vapour-tight cold-climate build-up",
      "Sizing cooling on sensible load and under-sizing dehumidification",
      "Overhangs deep enough for rain that leave interiors dark",
    ],
    accent: "#3f8fa8",
  },
  {
    id: "composite",
    index: "03",
    name: "Composite",
    criterion:
      "Fits no single other category for more than six months of the year",
    governs: "Seasonal reversal",
    resource: "Genuine shoulder seasons · usable winter sun",
    absent: "A single correct answer",
    lede: "Two opposite briefs, six months apart, delivered by one envelope.",
    body: [
      "A composite climate carries a hot dry season, a warm humid monsoon and a real winter. The envelope that performs in May is working against itself in January, which is why so many buildings here are uncomfortable in both.",
      "The productive move is to identify which decisions serve both seasons — shading that admits low winter sun and rejects high summer sun, mass that damps in either direction, ventilation that can be opened and closed — and to treat the rest as a deliberate trade rather than an oversight.",
      "The shoulder seasons are the hidden opportunity. There are substantial hours each year when outdoor conditions are directly usable, and capturing them requires openings positioned for flow rather than openings that merely open.",
    ],
    sequence: [
      "Resolve shading per orientation, for both solstices",
      "Damp with mass; place the insulation line outboard of it",
      "Seal the fabric so ventilation becomes controllable",
      "Capture shoulder-season and night hours deliberately",
      "Check the monsoon can dry out of the assembly",
      "Size systems for the residual, season by season",
    ],
    pitfalls: [
      "Optimising for summer and producing an unheatable winter",
      "Insulation broken at every floor slab and called continuous",
      "Ignoring the monsoon because the analysis stopped at temperature",
    ],
    accent: "#8c7fb8",
  },
  {
    id: "moderate",
    index: "04",
    name: "Moderate",
    criterion: "Mean monthly max 25–30 °C · relative humidity below 75 %",
    governs: "Nothing, severely",
    resource: "Long comfortable periods · usable outdoor air most of the year",
    absent: "An excuse for complexity",
    lede: "The rarest condition: a climate that lets the building be simple, if you let it.",
    body: [
      "Moderate zones sit close to comfort for much of the year. The envelope is not fighting a large gradient in either direction, which means the leverage of heavy intervention is genuinely low.",
      "The design risk here is not under-performance but over-specification: sealed, mechanically conditioned buildings in a climate that would have supported natural ventilation for most of its hours, delivering worse comfort at higher cost.",
      "What still matters is solar control on the exposed orientations, glare, and making sure the building can actually be opened — because the strategy depends on occupants and controls, not on fabric.",
    ],
    sequence: [
      "Establish how many hours are directly comfortable",
      "Make natural ventilation genuinely operable",
      "Control glare and low-angle sun on exposed façades",
      "Keep the fabric simple and well built",
      "Provide mixed-mode capability rather than full conditioning",
      "Resist specifying complexity the climate does not require",
    ],
    pitfalls: [
      "Sealing and conditioning a building that did not need it",
      "Treating a mild mean as an absence of peak conditions",
      "Glazing generously because the temperature seems forgiving",
    ],
    accent: "#6f9464",
  },
  {
    id: "cold",
    index: "05",
    name: "Cold",
    criterion: "Mean monthly max below 25 °C",
    governs: "Fabric heat loss",
    resource: "Winter solar gain · low ambient humidity at altitude",
    absent: "Cooling demand of any consequence",
    lede: "The one Indian zone where the imported cold-climate playbook applies more or less as written.",
    body: [
      "Here conduction and infiltration genuinely do dominate. Resistance, continuity of the insulation line and airtightness lead the design, and the usual sequence of a heating-dominated climate holds.",
      "Altitude sharpens everything: thinner air, intense direct solar radiation, very large day-to-night swings, and a short but real overheating risk in sun-facing spaces even in cold months.",
      "Winter solar gain is a genuine asset and should be designed for rather than defended against — south-facing collection with the mass to hold it is the oldest and still the best move available.",
    ],
    sequence: [
      "Compact the form; reduce exposed surface",
      "Make the insulation line continuous and check every junction",
      "Seal the fabric, then ventilate deliberately",
      "Collect winter sun on the exposed orientation",
      "Provide mass to hold what is collected",
      "Check the assembly can dry despite the vapour drive",
    ],
    pitfalls: [
      "An insulation line broken at balconies, slabs and openings",
      "Assuming no overheating risk because the climate is cold",
      "Vapour control placed without regard to the drying direction",
    ],
    accent: "#7f93a8",
  },
];

export const zoneById = new Map(climateZones.map((z) => [z.id, z]));

export interface AtlasCity {
  name: string;
  lat: number;
  lon: number;
  zone: ZoneId;
}

/**
 * A constellation rather than a map. Each point is a real location at its
 * real coordinates — the outline of the country emerges from the data instead
 * of being drawn, which keeps the plot honest about what it knows.
 */
export const atlasCities: AtlasCity[] = [
  { name: "Leh", lat: 34.15, lon: 77.58, zone: "cold" },
  { name: "Kargil", lat: 34.56, lon: 76.13, zone: "cold" },
  { name: "Srinagar", lat: 34.08, lon: 74.8, zone: "cold" },
  { name: "Manali", lat: 32.24, lon: 77.19, zone: "cold" },
  { name: "Shimla", lat: 31.1, lon: 77.17, zone: "cold" },
  { name: "Gangtok", lat: 27.33, lon: 88.61, zone: "cold" },
  { name: "Darjeeling", lat: 27.04, lon: 88.26, zone: "cold" },

  { name: "Amritsar", lat: 31.63, lon: 74.87, zone: "composite" },
  { name: "Chandigarh", lat: 30.73, lon: 76.78, zone: "composite" },
  { name: "Dehradun", lat: 30.32, lon: 78.03, zone: "composite" },
  { name: "Delhi", lat: 28.61, lon: 77.21, zone: "composite" },
  { name: "Jaipur", lat: 26.91, lon: 75.79, zone: "composite" },
  { name: "Lucknow", lat: 26.85, lon: 80.95, zone: "composite" },
  { name: "Kanpur", lat: 26.45, lon: 80.33, zone: "composite" },
  { name: "Gwalior", lat: 26.22, lon: 78.18, zone: "composite" },
  { name: "Prayagraj", lat: 25.44, lon: 81.85, zone: "composite" },
  { name: "Varanasi", lat: 25.32, lon: 82.97, zone: "composite" },
  { name: "Patna", lat: 25.59, lon: 85.14, zone: "composite" },
  { name: "Bhopal", lat: 23.26, lon: 77.41, zone: "composite" },
  { name: "Indore", lat: 22.72, lon: 75.86, zone: "composite" },
  { name: "Ranchi", lat: 23.34, lon: 85.31, zone: "composite" },
  { name: "Nagpur", lat: 21.15, lon: 79.09, zone: "composite" },
  { name: "Raipur", lat: 21.25, lon: 81.63, zone: "composite" },
  { name: "Hyderabad", lat: 17.39, lon: 78.49, zone: "composite" },

  { name: "Bikaner", lat: 28.02, lon: 73.31, zone: "hot-dry" },
  { name: "Jaisalmer", lat: 26.92, lon: 70.92, zone: "hot-dry" },
  { name: "Jodhpur", lat: 26.24, lon: 73.02, zone: "hot-dry" },
  { name: "Bhuj", lat: 23.24, lon: 69.67, zone: "hot-dry" },
  { name: "Dwarka", lat: 22.24, lon: 68.97, zone: "hot-dry" },
  { name: "Ahmedabad", lat: 23.02, lon: 72.57, zone: "hot-dry" },
  { name: "Rajkot", lat: 22.3, lon: 70.8, zone: "hot-dry" },

  { name: "Guwahati", lat: 26.14, lon: 91.74, zone: "warm-humid" },
  { name: "Agartala", lat: 23.83, lon: 91.28, zone: "warm-humid" },
  { name: "Kolkata", lat: 22.57, lon: 88.36, zone: "warm-humid" },
  { name: "Bhubaneswar", lat: 20.3, lon: 85.82, zone: "warm-humid" },
  { name: "Surat", lat: 21.17, lon: 72.83, zone: "warm-humid" },
  { name: "Mumbai", lat: 19.08, lon: 72.88, zone: "warm-humid" },
  { name: "Visakhapatnam", lat: 17.69, lon: 83.22, zone: "warm-humid" },
  { name: "Panaji", lat: 15.5, lon: 73.83, zone: "warm-humid" },
  { name: "Chennai", lat: 13.08, lon: 80.27, zone: "warm-humid" },
  { name: "Mangaluru", lat: 12.91, lon: 74.86, zone: "warm-humid" },
  { name: "Madurai", lat: 9.93, lon: 78.12, zone: "warm-humid" },
  { name: "Kochi", lat: 9.93, lon: 76.27, zone: "warm-humid" },
  { name: "Thiruvananthapuram", lat: 8.52, lon: 76.94, zone: "warm-humid" },
  { name: "Kanyakumari", lat: 8.08, lon: 77.54, zone: "warm-humid" },
  { name: "Port Blair", lat: 11.62, lon: 92.73, zone: "warm-humid" },

  { name: "Nashik", lat: 20.0, lon: 73.79, zone: "moderate" },
  { name: "Pune", lat: 18.52, lon: 73.86, zone: "moderate" },
  { name: "Bengaluru", lat: 12.97, lon: 77.59, zone: "moderate" },
  { name: "Coimbatore", lat: 11.02, lon: 76.96, zone: "moderate" },
];

/** Plot bounds, with a little margin beyond the extreme points. */
export const atlasBounds = {
  latMin: 6.5,
  latMax: 36.5,
  lonMin: 67.5,
  lonMax: 95.0,
};

/**
 * Equirectangular projection with a cosine correction at the mid-latitude, so
 * the constellation keeps roughly the right proportions.
 */
export function projectCity(
  city: { lat: number; lon: number },
  width: number,
  height: number,
) {
  const { latMin, latMax, lonMin, lonMax } = atlasBounds;
  const midLat = ((latMin + latMax) / 2) * (Math.PI / 180);
  const k = Math.cos(midLat);

  const spanLon = (lonMax - lonMin) * k;
  const spanLat = latMax - latMin;

  // Fit the larger span and centre the other.
  const scale = Math.min(width / spanLon, height / spanLat);
  const offsetX = (width - spanLon * scale) / 2;
  const offsetY = (height - spanLat * scale) / 2;

  return {
    x: offsetX + (city.lon - lonMin) * k * scale,
    y: offsetY + (latMax - city.lat) * scale,
  };
}
