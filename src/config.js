// Central, non-secret configuration for Imagine Your Rail Line.
// Anything environment-specific or likely to change lives here so contributors
// have a single place to look.

export const SITE = {
  name: 'Imagine Your Rail Line',
  tagline: 'See what passenger rail could look like in your community.',
  url: 'https://vis.lab.allaboardohio.org',
  labUrl: 'https://lab.allaboardohio.org',
  orgUrl: 'https://allaboardohio.org',
  repoUrl: 'https://github.com/all-aboard-ohio/aao-lab-vis-tool',
}

// OpenStreetMap raster tiles — no API key required, so the tool stays fully
// static and free to host. Attribution is mandatory under the ODbL license.
export const BASEMAP = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19,
}

// Default map view. Individual routes can override this via `route.view`.
export const DEFAULT_VIEW = {
  center: [40.2389693, -83.3671869], // Marysville, OH proposed station
  zoom: 13,
}
