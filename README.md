# Imagine Your Rail Line

> Explore proposed passenger rail in your community — follow the route, tap stations and points of note, and see what your town could look like with rail.

An interactive, mobile-friendly map for visualizing proposed passenger rail routes in Ohio. Users can follow a line, click callouts for stations, transit-oriented development, grade separations and track improvements, read the facts and figures, and export a branded card to share on social media.

Built as part of the [AAO Data Lab](https://lab.allaboardohio.org/) — open-source tools for passenger rail and connected mobility advocacy. It addresses [aao-lab-planning #9](https://github.com/all-aboard-ohio/aao-lab-planning/issues/9).

## Live Site

🔗 [vis.lab.allaboardohio.org](https://vis.lab.allaboardohio.org/)

## Features

- **Follow a route** on mobile or desktop with a fast, light map (OpenStreetMap — no API key required).
- **Points of note** — branded callouts for stations, transit-oriented development, grade separations, track improvements, and new construction.
- **Interactive detail panel** — tap any location for renderings, a description, and facts & figures of impact.
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

All map content lives in plain data files, so you don't need to touch UI code to
contribute a location.

- **Routes and locations:** [`src/data/routes.js`](./src/data/routes.js)
  - Add a location to a route's `locations` array with a `type`, `[lat, lng]`
    coordinates, `summary`, `description`, `facts`, and `images`.
  - Add a whole new route by appending another object to the `routes` array.
    A **line switcher** and an **"All lines" overview** (every route drawn on the
    map at once) appear automatically as soon as a second route exists.
- **Categories (marker colors & icons):** [`src/data/categories.js`](./src/data/categories.js)
- **Renderings & photos:** drop image files in [`public/renderings/`](./public/renderings)
  and reference them from a location's `images` array. Placeholder SVGs are used
  until real artwork is supplied.

> **Data status:** Marysville, OH is the first seed location. The route alignment
> is an illustrative placeholder (dashed on the map), and figures marked `TBD` /
> `placeholder: true` are awaiting verified sources. Renderings currently point at
> placeholder artwork.

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
