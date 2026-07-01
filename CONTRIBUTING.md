# Contributing to Imagine Your Rail Line

Thanks for helping visualize passenger rail for Ohio communities! Please read the
[AAO Data Lab contributor guide](https://github.com/all-aboard-ohio/aao-lab-docs/blob/main/contributing.md)
and [requirements](https://github.com/all-aboard-ohio/aao-lab-docs/blob/main/requirements.md) first.

## Ways to contribute

You don't have to be a developer to help:

- **Add a location or route** — edit [`src/data/routes.js`](./src/data/routes.js). Each
  location needs a `type`, `[lat, lng]` coordinates, a `summary`, `description`,
  `facts`, and `images`. Copy an existing entry as a template, and see the
  [Route Authoring Guide](./docs/authoring-routes.md) for the full data model
  (routes, communities, and points of note).
- **Contribute renderings or photos** — add images to [`public/renderings/`](./public/renderings)
  and reference them from a location's `images` array. Please compress images
  (e.g. via [squoosh.app](https://squoosh.app)) and always include descriptive `alt` text.
- **Provide data** — replace `TBD` / `placeholder: true` facts with verified
  figures and cite the source in your pull request.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run lint     # must pass before opening a PR
npm run build    # production build
```

## Standards

- **Accessibility:** meet WCAG 2.1 AA. Every image needs meaningful `alt` text,
  interactive elements need visible focus and (for icon-only buttons) an
  `aria-label`, and color contrast must pass.
- **Branding:** use the AAO Tailwind color tokens (`aao-dark-blue`, etc.) and the
  Poppins/Montserrat fonts — never raw hex values in components. See the
  [style guide](https://github.com/all-aboard-ohio/aao-lab-docs/blob/main/style-guide.md).
- **No user data:** this tool collects no personal data and uses no analytics.
  Share cards are generated entirely in the browser.
- **Commits & PRs:** follow [Conventional Commits](https://www.conventionalcommits.org/).
  Never commit to `main` directly; open a pull request for review.

## Branch naming

`feature/short-description`, `fix/short-description`, or `data/location-name`.
