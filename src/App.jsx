import { useMemo, useState } from 'react'
import { List, X, TrainFront } from 'lucide-react'
import { routes, getRoute } from './data/routes'
import RouteMap from './components/RouteMap'
import StopList from './components/StopList'
import Legend from './components/Legend'
import LocationPanel from './components/LocationPanel'
import ShareModal from './components/ShareModal'
import { SITE } from './config'
import './index.css'

export default function App() {
  // Single route today; kept as state so adding a route picker is a one-liner.
  const [routeId] = useState(routes[0].id)
  const [selectedId, setSelectedId] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false) // mobile stop-list drawer
  const [sharing, setSharing] = useState(false)

  const route = getRoute(routeId)
  const selected = route.locations.find((l) => l.id === selectedId) ?? null
  const categoriesInUse = useMemo(
    () => new Set(route.locations.map((l) => l.type)),
    [route],
  )

  function handleSelect(id) {
    setSelectedId(id)
    setPanelOpen(false)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden font-body">
      {/* Required AAO shared components -- do not remove */}
      <aao-site-header mode="compact" dev-url="https://lab.allaboardohio.org"></aao-site-header>
      <aao-notification
        config-url="https://raw.githubusercontent.com/all-aboard-ohio/aao-lab-components/main/banner.json"
      ></aao-notification>

      <main className="relative flex-1 overflow-hidden" aria-label="Interactive route map">
        {/* Map fills the whole area */}
        <div className="absolute inset-0">
          <RouteMap route={route} selectedId={selectedId} onSelect={handleSelect} />
        </div>

        {/* --- Top-left: title + stop browser --- */}
        <aside className="pointer-events-none absolute left-3 top-3 z-[1000] flex w-[min(92vw,360px)] flex-col gap-3">
          <div className="pointer-events-auto overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-lg backdrop-blur">
            <div className="flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-aao-dark-blue text-white">
                <TrainFront size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="font-heading text-lg font-extrabold leading-tight text-aao-dark-blue">
                  {SITE.name}
                </h1>
                <p className="mt-0.5 font-body text-xs leading-snug text-gray-500">
                  {SITE.tagline}
                </p>
              </div>
              {/* Mobile toggle for the stop list */}
              <button
                type="button"
                onClick={() => setPanelOpen((v) => !v)}
                aria-expanded={panelOpen}
                aria-label={panelOpen ? 'Hide points of note' : 'Show points of note'}
                className="flex-none rounded-lg p-2 text-aao-dark-blue hover:bg-aao-beige md:hidden"
              >
                {panelOpen ? <X size={20} /> : <List size={20} />}
              </button>
            </div>

            {/* Route summary */}
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-aao-dark-red">
                {route.region}
              </p>
              <p className="mt-1 font-body text-sm leading-snug text-gray-600">{route.summary}</p>
            </div>

            {/* Stop list — always visible on desktop, toggle on mobile */}
            <div className={`${panelOpen ? 'block' : 'hidden'} md:block`}>
              <div className="max-h-[42vh] overflow-y-auto border-t border-gray-100 p-3 md:max-h-[calc(100vh-22rem)]">
                <StopList route={route} selectedId={selectedId} onSelect={handleSelect} />
              </div>
            </div>
          </div>
        </aside>

        {/* --- Bottom-left: legend --- */}
        <div className="pointer-events-none absolute bottom-4 left-3 z-[1000] w-[min(88vw,300px)]">
          <Legend categoriesInUse={categoriesInUse} />
        </div>

        {/* --- Placeholder-data notice --- */}
        {route.alignmentPlaceholder && (
          <div className="pointer-events-none absolute left-1/2 top-3 z-[900] -translate-x-1/2">
            <span className="pointer-events-auto rounded-full bg-aao-dark-blue/90 px-3 py-1.5 font-body text-xs font-semibold text-aao-beige shadow-md">
              Illustrative preview · alignment &amp; figures are placeholders
            </span>
          </div>
        )}

        {/* --- Location detail panel (right on desktop, bottom sheet on mobile) --- */}
        {selected && (
          <div className="absolute inset-x-0 bottom-0 z-[1100] md:inset-y-0 md:left-auto md:right-0 md:w-[400px]">
            <LocationPanel
              key={selected.id}
              location={selected}
              route={route}
              onClose={() => setSelectedId(null)}
              onShare={() => setSharing(true)}
            />
          </div>
        )}

        {/* --- Share modal --- */}
        {sharing && selected && (
          <ShareModal location={selected} route={route} onClose={() => setSharing(false)} />
        )}
      </main>

      {/* Screen-reader-only heading structure + attribution footer */}
      <footer className="flex-none bg-aao-dark-blue px-4 py-2 text-center font-body text-xs text-aao-beige/80">
        Part of{' '}
        <a href={SITE.labUrl} className="underline hover:text-white">
          AAO Data Lab
        </a>{' '}
        ·{' '}
        <a href={SITE.orgUrl} className="underline hover:text-white">
          All Aboard Ohio
        </a>{' '}
        · Basemap © OpenStreetMap contributors
      </footer>
    </div>
  )
}
