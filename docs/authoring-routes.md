# Authoring Routes, Communities & Points of Note

All map content for **Imagine Your Rail Line** lives in a single plain-data file:

> [`src/data/routes.js`](../src/data/routes.js)

You do **not** need to touch any UI code to add content. This guide explains the
data model and walks through adding a point, a community, and a whole route.

---

## The data model

Content is organized in three levels:

```
Route  (a corridor, e.g. "Midwest Connect Rail Route")
 └─ Community  (a city / locality, e.g. "Marysville", "Dublin")   ← optional
     └─ Location  (a point of note: station, TOD, grade separation, …)
```

- **Route** — a rail line with an alignment drawn on the map.
- **Community** *(optional)* — a locality within a route. Communities let a city
  council or legislator view and share just *their area's* content. A route with
  no `communities` simply shows a flat list of points.
- **Location** — a single point of note (marker + detail panel).

The UI adapts automatically to the data:

| If the data has… | The UI shows… |
|---|---|
| One route | That line, no line switcher |
| Two or more routes | A **line switcher** + an **"All lines" overview** |
| A route with `communities` | A **community filter** (chips) + grouped stop list |
| A route without `communities` | A flat list of points |

---

## Coordinates

Every coordinate is a `[latitude, longitude]` pair (Leaflet's order — latitude
first). To get one from Google Maps, right-click a spot and click the lat/lng at
the top of the menu to copy it, e.g. `40.2389693, -83.3671869`.

---

## 1. Add a point of note to an existing route

Add an object to that route's `locations` array:

```js
{
  id: 'marysville-depot',              // unique, kebab-case, stable (used in URLs)
  type: 'station',                     // see "Categories" below
  communityId: 'marysville',           // optional — omit if the route has no communities
  name: 'Marysville Depot',
  coordinates: [40.2389693, -83.3671869], // [lat, lng]
  status: 'proposed',                  // 'proposed' | 'concept'
  summary: 'One-line description shown on share cards and list items.',
  description: 'A longer paragraph shown in the detail panel.',
  facts: [
    { label: 'Est. daily boardings', value: 'TBD', placeholder: true },
    { label: 'Platform length', value: '2 tracks' },
  ],
  images: [
    {
      src: '/renderings/placeholder-rendering.svg', // put real files in public/renderings/
      alt: 'Descriptive alt text (required for accessibility).',
      caption: 'Caption shown under the image.',
      credit: 'AAO Data Lab',
    },
  ],
}
```

### Location fields

| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | Unique across the whole app, kebab-case. Appears in deep links — keep it stable. |
| `type` | ✅ | One of the category ids (see below). Sets the marker color/icon. |
| `communityId` | ➖ | Must match a `community.id` on the route. Omit for corridor-wide points or routes without communities. |
| `name` | ✅ | Title of the point. |
| `coordinates` | ✅ | `[lat, lng]`. |
| `status` | ➖ | `'proposed'` or `'concept'`. Defaults to a "Proposed" badge. |
| `summary` | ✅ | One sentence; used in the list and on share cards. |
| `description` | ✅ | Full paragraph for the detail panel. |
| `facts` | ➖ | Array of `{ label, value, placeholder? }`. Set `placeholder: true` for unverified figures (renders a "TBD" note). |
| `images` | ➖ | Array of `{ src, alt, caption?, credit? }`. First image is the panel thumbnail; all are viewable in the lightbox. |

---

## 2. Add a community to a route

Communities are optional. To group a route's content by locality, add a
`communities` array to the route and tag each location with a `communityId`:

```js
{
  id: 'midwest-connect',
  name: 'Midwest Connect Rail Route',
  // …
  communities: [
    {
      id: 'marysville',          // unique within the route; used in deep links
      name: 'Marysville',
      county: 'Union County',    // optional, shown next to the name
      blurb: 'A downtown station and walkable Uptown district for Union County.',
    },
    {
      id: 'dublin',
      name: 'Dublin',
      county: 'Franklin County',
      blurb: "A stop linking Dublin's Bridge Street District to the corridor.",
    },
  ],
  locations: [
    { id: 'marysville-station', communityId: 'marysville', /* … */ },
    { id: 'dublin-station',     communityId: 'dublin',     /* … */ },
  ],
}
```

### Community fields

| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | Unique within the route, kebab-case. Appears in deep links. |
| `name` | ✅ | Display name (e.g. "Marysville"). |
| `county` | ➖ | Shown beside the name in the filter and summary. |
| `blurb` | ➖ | One-line description shown when the community is selected. |

Any location whose `communityId` doesn't match a declared community (or has none)
is grouped under **"Corridor-wide"**.

---

## 3. Add a whole new route

Append another object to the top-level `routes` array:

```js
export const routes = [
  { id: 'midwest-connect', /* … */ },
  {
    id: 'my-new-line',                 // unique, kebab-case (used in URLs)
    name: 'My New Line',
    region: 'Cityville–Townsburg corridor',
    color: '#012345',                  // AAO brand hex for the route line
    status: 'proposed',
    summary: 'One-line description of the corridor.',
    communities: [ /* optional — see above */ ],
    view: { center: [40.17, -83.24], zoom: 11 }, // initial map framing
    alignmentPlaceholder: true,        // true = dashed line + "illustrative" badge
    alignment: [                       // the line geometry, [lat, lng] points
      [40.2612, -83.3905],
      [40.2389693, -83.3671869],
      [40.0997, -83.1266],
    ],
    locations: [ /* points of note */ ],
  },
]
```

### Route fields

| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | Unique, kebab-case. Appears in deep links — keep it stable. |
| `name` | ✅ | Line name shown in the switcher and headings. |
| `region` | ➖ | Subtitle (e.g. "Chicago–Columbus corridor"). |
| `color` | ➖ | Hex color for the drawn line. Use an [AAO brand color](https://github.com/all-aboard-ohio/aao-lab-docs/blob/main/style-guide.md). |
| `status` | ➖ | `'proposed'` or `'concept'`. |
| `summary` | ✅ | Shown in the line's summary panel. |
| `communities` | ➖ | See section 2. Omit for an ungrouped line. |
| `view` | ➖ | `{ center: [lat, lng], zoom }` initial framing. The map also auto-fits to the alignment. |
| `alignmentPlaceholder` | ➖ | `true` draws the line dashed and shows the "illustrative preview" badge. Set `false`/omit once the geometry is verified. |
| `alignment` | ✅ | Array of `[lat, lng]` points forming the line, ordered end to end. |
| `locations` | ✅ | Array of points of note (see section 1). |

---

## Categories

`type` on each location must be one of these ids (defined in
[`src/data/categories.js`](../src/data/categories.js)). Each sets the marker
color, icon, and legend entry:

| `type` | Label | Use for |
|---|---|---|
| `station` | Station | Passenger rail stations / platforms |
| `tod` | Transit-Oriented Development | Walkable housing, retail, jobs near a station |
| `grade-separation` | Grade Separation | Overpasses / underpasses removing road-rail conflicts |
| `track-improvement` | Track Improvement | Upgraded, doubled, or realigned track |
| `construction` | New Construction | New bridges, crossings, or structures |

To add a new category, add an entry to `CATEGORIES` in `categories.js` (id,
label, `color`, and a [lucide](https://lucide.dev) `icon` name) and register the
icon in [`src/components/CategoryIcon.jsx`](../src/components/CategoryIcon.jsx).

---

## Images & renderings

- Put image files in [`public/renderings/`](../public/renderings) and reference
  them by absolute path, e.g. `src: '/renderings/marysville-station.jpg'`.
- Until real artwork exists, use the shared placeholders:
  - `/renderings/placeholder-rendering.svg` — "rendering coming soon"
  - `/renderings/placeholder-existing.svg` — "existing conditions photo coming soon"
- Every image **must** have descriptive `alt` text. Compress photos before
  committing (e.g. [squoosh.app](https://squoosh.app)).

---

## Placeholder data convention

This project is seeded with placeholders. Mark anything unverified so it renders
honestly and is easy to find later:

- On **facts**, set `placeholder: true` and use `'TBD'` for the value.
- On a **route**, set `alignmentPlaceholder: true` until the geometry is real.
- Use `status: 'concept'` for early-stage ideas vs. `'proposed'`.

---

## Deep links (sharing)

The URL updates as you browse, so any view can be linked or bookmarked:

| URL | Opens |
|---|---|
| `#/` | The "All lines" overview |
| `#/line/<routeId>` | A specific line |
| `#/line/<routeId>/area/<communityId>` | Just that community's content |
| `#/line/<routeId>/<itemId>` | A specific point (opens its detail panel) |

The ids in these links come straight from your `id` fields — another reason to
keep them stable once published.

---

## Before you commit

Run these from the project root and make sure both pass:

```bash
npm run lint
npm run build
```

Then open a pull request. See [CONTRIBUTING.md](../CONTRIBUTING.md) for
conventions.
