# Data Roadmap — Real Routes & Information

This is a tracking checklist for replacing the seeded **placeholder** content with
verified, real-world data. It builds on the data model documented in the
[Route Authoring Guide](./authoring-routes.md). Content is edited in
[`src/data/routes.js`](../src/data/routes.js).

> **Status:** Everything currently in the app is illustrative. Route alignments
> are dashed placeholders, figures are marked `TBD` / `placeholder: true`, and
> renderings use placeholder SVGs. This document tracks the work to make it real.

---

## How to use this checklist

- Tackle one route (or one community) per pull request so reviews stay small.
- When a data point is verified, replace the placeholder **and** cite the source
  in the PR description.
- Flip `alignmentPlaceholder: false` on a route only once its geometry is real.
- Remove `placeholder: true` from a fact once its value is verified.

---

## 1. Route geometry (alignments)

Replace the hand-drawn placeholder `alignment` arrays with real corridor geometry.

- **Sources:** ODOT Railway/GIS open data, OpenStreetMap rail ways, published
  corridor studies.
- [ ] Midwest Connect Rail Route — real alignment (Chicago–Columbus corridor)
- [ ] 3C&D Corridor — real alignment (or remove the concept stub)
- [ ] Set `alignmentPlaceholder: false` per route once verified

## 2. Midwest Connect — Marysville community

- [ ] Confirm/refine station siting and coordinates
- [ ] Real facts: daily boardings, walkshed population, park & ride, TOD figures
- [ ] Replace placeholder renderings with contributor artwork
- [ ] Replace existing-conditions placeholder photos
- [ ] Verify each point's `status` (`proposed` vs `concept`)

## 3. Midwest Connect — Dublin community

- [ ] Confirm/refine Bridge Street station siting and coordinates
- [ ] Real facts for station, Bridge Street District TOD, SR 161 grade separation
- [ ] Replace placeholder renderings/photos
- [ ] Verify each point's `status`

## 4. Additional communities (Midwest Connect)

Add real communities/localities along the corridor with their own points.

- [ ] Identify additional stops/localities to include
- [ ] Add each as a `community` with `id`, `name`, `county`, `blurb`
- [ ] Tag points with the matching `communityId`

## 5. Additional routes

- [ ] Decide which corridors to add (e.g. real 3C&D, Amtrak-proposed lines)
- [ ] Author each with real geometry, communities, and points
- [ ] Reconcile scope with related planning issues

## 6. Renderings & media

- [ ] Collect contributor renderings for each point of note
- [ ] Collect existing-conditions photos where useful
- [ ] Compress images before committing; write descriptive `alt` text
- [ ] Store under [`public/renderings/`](../public/renderings) and reference by path

## 7. Sourcing & credibility

- [ ] Add a data-sources note to the README for each real dataset used
- [ ] Ensure every fact traces to a citable source
- [ ] Keep `id` values stable once published (they appear in shared deep links)

---

## Data sources to draw from

- **ODOT** open railway / GIS data — corridor and infrastructure geometry
- **OpenStreetMap** — rail network geometry and base geography (ODbL)
- **AAO contributors** — renderings, local facts & figures
- Published corridor/feasibility studies (cite per figure)

---

## Definition of done for "real data"

- [ ] No `alignmentPlaceholder: true` remaining on shipped routes
- [ ] No `placeholder: true` facts on shipped points (or clearly labeled where data is genuinely pending)
- [ ] No placeholder SVGs left in shipped points
- [ ] README documents every real data source
- [ ] Coordinates and figures spot-checked against sources
