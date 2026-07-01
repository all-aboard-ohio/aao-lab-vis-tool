# Imagine Your Rail Line

> Explore proposed passenger rail in your community — follow the route, tap stations and points of note, and see what your town could look like with rail.

An interactive, mobile-friendly map for visualizing proposed passenger rail routes in Ohio. Users can follow a line, click callouts for stations, transit-oriented development, grade separations and track improvements, read the facts and figures, and export a branded card to share on social media.

Built as part of the [AAO Data Lab](https://lab.allaboardohio.org/) — open-source tools for passenger rail and connected mobility advocacy. It addresses [aao-lab-planning #9](https://github.com/all-aboard-ohio/aao-lab-planning/issues/9).

## Live Site

🔗 [vis.lab.allaboardohio.org](https://vis.lab.allaboardohio.org/)

## Features

- **Follow a route** on mobile or desktop with a fast, light map (OpenStreetMap — no API key required).
- **Points of note** — branded callouts for stations, transit-oriented development, grade separations, track improvements, and new construction.
- **Interactive detail panel** — tap any location for renderings, a description, and facts & figures of impact. Click a rendering to open it full-screen in a lightbox.
- **Shareable deep links** — the URL updates as you browse (`#/line/<routeId>` for a line, `#/line/<routeId>/<itemId>` for a specific point), so any view can be linked, bookmarked, or shared.
- **Share to social media** — generate a branded story (9:16) or post (1:1) card and share or download it. Everything is generated in the browser; no user data is collected or uploaded.
- **Accessible** — keyboard navigable, screen-reader friendly (the stop list is a text alternative to the map), and built to WCAG 2.1 AA.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/all-aboard-ohio/aao-lab-vis-tool.git
cd aao-lab-vis-tool
npm install
cp .env.example .env.local   # optional — the app runs with no secrets
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Environment Variables

This tool requires **no secrets** to run. The map uses keyless OpenStreetMap tiles. See [.env.example](./.env.example) for optional variables (e.g. a premium basemap token) if you extend the tool.

## Adding Routes & Locations

All map content lives in one plain-data file, so you don't need to touch UI code
to contribute. See the **[Route Authoring Guide](./docs/authoring-routes.md)** for
the full data model and field reference. In short:

- **Routes and locations:** [`src/data/routes.js`](./src/data/routes.js) — add a
  point to a route's `locations` array (`type`, `[lat, lng]` coordinates,
  `summary`, `description`, `facts`, `images`), or append a whole new route to the
  `routes` array. The **line switcher** and **"All lines" overview** appear
  automatically once a second route exists.
- **Communities:** a route may define a `communities` array (e.g. Marysville,
  Dublin along Midwest Connect); tag locations with a `communityId` so a council
  or legislator can view and deep-link to just *their area's* content.
- **Categories (marker colors & icons):** [`src/data/categories.js`](./src/data/categories.js)
- **Renderings & photos:** drop image files in [`public/renderings/`](./public/renderings)
  and reference them from a location's `images` array. Placeholder SVGs are used
  until real artwork is supplied.

> **Data status:** Marysville, OH is the first seed community (on the Midwest
> Connect line). Route alignments are illustrative placeholders (dashed on the
> map) and figures marked `TBD` / `placeholder: true` await verified sources.

## Deployment

This project deploys automatically to GitHub Pages via GitHub Actions on every
push to `main` (see [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)).
The custom subdomain is configured via [`public/CNAME`](./public/CNAME).

## Data Sources

- **OpenStreetMap** — base map tiles and geography (© OpenStreetMap contributors, ODbL).
- **ODOT Railway Data** — rail corridor and infrastructure data (to be integrated).
- **AAO Contributors** — renderings, graphics, and local facts & figures.

## Tech Stack

React 19 · Vite · Tailwind CSS · Leaflet / react-leaflet · lucide-react. See the
[AAO tool stack](https://github.com/all-aboard-ohio/aao-lab-docs/blob/main/tool-stack.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and the
[AAO Data Lab contributor guide](https://github.com/all-aboard-ohio/aao-lab-docs/blob/main/contributing.md).
Join `#dev-general` on [Slack](https://join.slack.com/t/lab-allaboardohio/shared_invite/zt-3x7cyvl53-0IQMjvljmA64iNCZvhaP1w) to introduce yourself and ask questions.

## License

MIT
