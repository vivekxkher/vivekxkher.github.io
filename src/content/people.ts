/**
 * PEOPLE.
 *
 * Same content rule as everything else: nothing here is embellished. Each
 * field states only what the person actually holds or has actually done.
 *
 * Credentials in particular are checkable — CPHD is issued by the Passive
 * House Institute and is either held or not — so this file records them
 * plainly rather than dressed up. No awards, project counts, client names,
 * performance figures or superlatives belong in here unless they are true and
 * verifiable.
 *
 * The certification and the New York practice below are confirmed by the
 * founder as held and worked. Keep the wording exact — "Certified Passive
 * House Designer" is the Institute's own term — and add years, firms or
 * project names only when there is a specific, checkable fact to state.
 */

export interface Person {
  name: string;
  role: string;
  /** One line, plain. */
  standfirst: string;
  bio: string[];
  /** Only genuine, checkable credentials. */
  credentials: { term: string; value: string }[];
}

export const founder: Person = {
  name: "Vivek Kher",
  role: "Founder & Climate Designer",
  standfirst:
    "Building physics, and the conviction that a building’s behaviour is decided long before anyone specifies a system.",
  bio: [
    "Vivek Kher is a climate designer and the founder of PÉCLET. His work focuses on how early decisions about orientation, openings and the building envelope shape a building’s performance.",
    "He is a Certified Passive House Designer, and practised in New York on Passive House projects before establishing the studio. That work is where the practice’s bias comes from — reduce demand through form and fabric first, verify with a consistent calculation, and do not let a system specification paper over a geometry problem.",
    "The interest now is in what that discipline becomes when it is re-derived for Indian climates rather than imported wholesale. The method travels. The targets, and the resources each climate offers, do not.",
  ],
  credentials: [
    {
      term: "Certification",
      value: "Certified Passive House Designer (CPHD)",
    },
    {
      term: "Practice",
      value: "Passive House projects, New York",
    },
    {
      term: "Focus",
      value: "Building physics · Climate design · Envelope performance",
    },
  ],
};
