// ---------------------------------------------------------------------------
// ROUTE + LOCATION DATA
// ---------------------------------------------------------------------------
// This is the single source of truth for what the map renders. It is authored
// as plain data so non-developers (data analysts, researchers) can contribute
// locations without touching UI code.
//
// STATUS: SEED DATA. Marysville, OH is the first location. The route alignment
// below is an ILLUSTRATIVE PLACEHOLDER, not a surveyed corridor, and every
// figure marked `placeholder: true` is awaiting a verified source. Renderings
// point at placeholder SVGs in /public/renderings until AAO contributors supply
// real artwork.
//
// To add a location:
//   1. Add an entry to the route's `locations` array.
//   2. Give it a `type` from src/data/categories.js.
//   3. Provide coordinates as [latitude, longitude].
//   4. Drop rendering images in /public/renderings and reference them.
//
// Coordinates are [lat, lng] to match Leaflet's convention.
// ---------------------------------------------------------------------------

/** @typedef {'station'|'tod'|'grade-separation'|'track-improvement'|'construction'} LocationType */

const PLACEHOLDER_RENDERING = '/renderings/placeholder-rendering.svg'
const PLACEHOLDER_EXISTING = '/renderings/placeholder-existing.svg'

export const routes = [
  {
    id: 'marysville',
    name: 'Marysville Line',
    region: 'Union County',
    color: '#012345',
    status: 'proposed',
    // Short blurb shown in the route picker and share cards.
    summary:
      'A proposed passenger rail connection linking Marysville to the greater Columbus region.',
    // Map framing when this route is selected.
    view: {
      center: [40.2389693, -83.3671869],
      zoom: 13,
    },
    // Illustrative alignment through Marysville (PLACEHOLDER — follows the
    // approximate existing freight corridor, roughly NW to SE).
    alignmentPlaceholder: true,
    alignment: [
      [40.2612, -83.3905],
      [40.2531, -83.3812],
      [40.2456, -83.3742],
      [40.2389693, -83.3671869],
      [40.2321, -83.3598],
      [40.2246, -83.3489],
      [40.2178, -83.3372],
    ],
    locations: [
      {
        id: 'marysville-station',
        type: 'station',
        name: 'Marysville Station',
        coordinates: [40.2389693, -83.3671869],
        status: 'proposed',
        summary:
          'A proposed downtown station bringing passenger rail within walking distance of Uptown Marysville.',
        description:
          'The proposed Marysville Station would anchor passenger service in the heart of the city, steps from Uptown shops and civic buildings. A station here reconnects Marysville to the regional rail network for the first time in generations, offering a car-free option to reach jobs, healthcare, and events across the corridor.',
        facts: [
          { label: 'Station type', value: 'Downtown infill platform', placeholder: true },
          { label: 'Est. daily boardings', value: 'TBD', placeholder: true },
          { label: 'Walkshed (½ mile)', value: 'TBD residents', placeholder: true },
          { label: 'Park & ride spaces', value: 'TBD', placeholder: true },
        ],
        images: [
          {
            src: PLACEHOLDER_RENDERING,
            alt: 'Placeholder rendering of the proposed Marysville Station. Artwork coming soon.',
            caption: 'Proposed Marysville Station — rendering coming soon',
            credit: 'AAO Data Lab',
          },
          {
            src: PLACEHOLDER_EXISTING,
            alt: 'Placeholder photo of the existing site at the proposed Marysville Station location.',
            caption: 'Existing conditions — photo coming soon',
            credit: 'AAO Data Lab',
          },
        ],
      },
      {
        id: 'marysville-uptown-tod',
        type: 'tod',
        name: 'Uptown Marysville District',
        coordinates: [40.2365, -83.3663],
        status: 'concept',
        summary:
          'Walkable housing and small business growth clustered around the new station.',
        description:
          'The blocks surrounding the station are a natural fit for transit-oriented development: a mix of apartments, storefronts, and public space that puts more people within a short walk of the platform. Compact growth here supports local businesses and gives the line the ridership it needs to thrive.',
        facts: [
          { label: 'Focus', value: 'Mixed-use, walkable', placeholder: true },
          { label: 'New homes potential', value: 'TBD units', placeholder: true },
          { label: 'Ground-floor retail', value: 'TBD sq ft', placeholder: true },
        ],
        images: [
          {
            src: PLACEHOLDER_RENDERING,
            alt: 'Placeholder rendering of transit-oriented development in Uptown Marysville. Artwork coming soon.',
            caption: 'Uptown district concept — rendering coming soon',
            credit: 'AAO Data Lab',
          },
        ],
      },
      {
        id: 'marysville-us36-grade-separation',
        type: 'grade-separation',
        name: 'US 36 Grade Separation',
        coordinates: [40.2452, -83.3735],
        status: 'proposed',
        summary:
          'A proposed overpass separating the rail line from US 36 to eliminate crossing delays.',
        description:
          'Separating the rail line from busy US 36 removes a potential conflict point, keeping both trains and road traffic moving safely. Grade separations like this improve reliability for the whole line and reduce noise from crossing signals in the surrounding neighborhood.',
        facts: [
          { label: 'Structure', value: 'Road-over-rail overpass', placeholder: true },
          { label: 'Crossing delay removed', value: 'TBD', placeholder: true },
          { label: 'Safety benefit', value: 'Eliminates at-grade conflict', placeholder: true },
        ],
        images: [
          {
            src: PLACEHOLDER_RENDERING,
            alt: 'Placeholder rendering of the US 36 grade separation. Artwork coming soon.',
            caption: 'US 36 grade separation — rendering coming soon',
            credit: 'AAO Data Lab',
          },
        ],
      },
      {
        id: 'marysville-scioto-track',
        type: 'track-improvement',
        name: 'Scioto Corridor Track Upgrade',
        coordinates: [40.2321, -83.3598],
        status: 'proposed',
        summary:
          'Rebuilt and realigned track along the Scioto corridor for faster, smoother service.',
        description:
          'Upgrading the existing track through the Scioto corridor allows trains to run faster and more smoothly while improving safety. Modern rail, ties, and signaling here are a foundation the rest of the line depends on.',
        facts: [
          { label: 'Scope', value: 'Rebuilt track & signaling', placeholder: true },
          { label: 'Target speed', value: 'TBD mph', placeholder: true },
          { label: 'Length', value: 'TBD miles', placeholder: true },
        ],
        images: [
          {
            src: PLACEHOLDER_RENDERING,
            alt: 'Placeholder rendering of the Scioto corridor track upgrade. Artwork coming soon.',
            caption: 'Scioto corridor track upgrade — rendering coming soon',
            credit: 'AAO Data Lab',
          },
        ],
      },
      {
        id: 'marysville-pedestrian-crossing',
        type: 'construction',
        name: 'Fifth Street Pedestrian Crossing',
        coordinates: [40.2402, -83.3689],
        status: 'concept',
        summary:
          'A new protected pedestrian crossing linking neighborhoods to the station platform.',
        description:
          'A dedicated, protected pedestrian crossing makes it safe and easy to reach the station on foot from surrounding neighborhoods. Small pieces of infrastructure like this are what make a station genuinely walkable for everyone.',
        facts: [
          { label: 'Type', value: 'Protected pedestrian crossing', placeholder: true },
          { label: 'Connects', value: 'Neighborhoods ↔ platform', placeholder: true },
          { label: 'Accessibility', value: 'ADA-compliant (planned)', placeholder: true },
        ],
        images: [
          {
            src: PLACEHOLDER_RENDERING,
            alt: 'Placeholder rendering of the Fifth Street pedestrian crossing. Artwork coming soon.',
            caption: 'Fifth Street crossing — rendering coming soon',
            credit: 'AAO Data Lab',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // SECOND ROUTE — CONCEPT STUB (placeholder)
  // Included to demonstrate the multi-line switcher and "All lines" overview.
  // Replace or remove once real corridor data is authored. All coordinates and
  // figures here are illustrative placeholders.
  // -------------------------------------------------------------------------
  {
    id: '3cd-corridor',
    name: '3C&D Corridor',
    region: 'Columbus · Delaware · Marion',
    color: '#B72717',
    status: 'concept',
    summary:
      'A concept sketch of the flagship 3C&D corridor heading north from Columbus. Data coming soon.',
    view: {
      center: [40.2987, -83.068],
      zoom: 10,
    },
    alignmentPlaceholder: true,
    alignment: [
      [39.9713, -82.9988],
      [40.0764, -83.0402],
      [40.2987, -83.068],
      [40.4501, -83.09],
      [40.5887, -83.1286],
    ],
    locations: [
      {
        id: '3cd-columbus-station',
        type: 'station',
        name: 'Columbus Downtown Station',
        coordinates: [39.9713, -82.9988],
        status: 'concept',
        summary:
          'A proposed downtown Columbus station anchoring the southern end of the corridor.',
        description:
          'A downtown Columbus station would connect Ohio’s largest city to the statewide network, linking hundreds of thousands of residents and workers to intercity rail for the first time in decades. This is a concept placeholder awaiting verified planning data.',
        facts: [
          { label: 'Station type', value: 'Downtown terminal', placeholder: true },
          { label: 'Metro population served', value: 'TBD', placeholder: true },
        ],
        images: [
          {
            src: PLACEHOLDER_RENDERING,
            alt: 'Placeholder rendering of the proposed Columbus Downtown Station. Artwork coming soon.',
            caption: 'Columbus Downtown Station — rendering coming soon',
            credit: 'AAO Data Lab',
          },
        ],
      },
      {
        id: '3cd-delaware-station',
        type: 'station',
        name: 'Delaware Station',
        coordinates: [40.2987, -83.068],
        status: 'concept',
        summary: 'A proposed stop serving fast-growing Delaware County.',
        description:
          'A station in Delaware would give one of Ohio’s fastest-growing counties a car-free connection to Columbus and points north. This is a concept placeholder awaiting verified planning data.',
        facts: [
          { label: 'Station type', value: 'Suburban stop', placeholder: true },
          { label: 'County growth', value: 'TBD', placeholder: true },
        ],
        images: [
          {
            src: PLACEHOLDER_RENDERING,
            alt: 'Placeholder rendering of the proposed Delaware Station. Artwork coming soon.',
            caption: 'Delaware Station — rendering coming soon',
            credit: 'AAO Data Lab',
          },
        ],
      },
      {
        id: '3cd-marion-tod',
        type: 'tod',
        name: 'Marion Downtown District',
        coordinates: [40.5887, -83.1286],
        status: 'concept',
        summary: 'Transit-oriented revitalization anchored on a restored Marion depot.',
        description:
          'Rail service could anchor downtown revitalization in Marion, pairing a restored depot with walkable housing and small business growth. This is a concept placeholder awaiting verified planning data.',
        facts: [
          { label: 'Focus', value: 'Depot-anchored revival', placeholder: true },
          { label: 'New homes potential', value: 'TBD units', placeholder: true },
        ],
        images: [
          {
            src: PLACEHOLDER_RENDERING,
            alt: 'Placeholder rendering of transit-oriented development in downtown Marion. Artwork coming soon.',
            caption: 'Marion downtown district — rendering coming soon',
            credit: 'AAO Data Lab',
          },
        ],
      },
    ],
  },
]

// Flattened helper: every location across all routes, tagged with its route id.
export const allLocations = routes.flatMap((route) =>
  route.locations.map((loc) => ({ ...loc, routeId: route.id, routeName: route.name })),
)

export function getRoute(routeId) {
  return routes.find((r) => r.id === routeId) ?? routes[0]
}

export function getLocation(routeId, locationId) {
  const route = getRoute(routeId)
  return route?.locations.find((l) => l.id === locationId)
}
