import { useEffect, useMemo, useState } from 'react'
import { List, X, TrainFront, ChevronDown, Link2, Check } from 'lucide-react'
import { routes, getRoute, getCommunity } from './data/routes'
import RouteMap from './components/RouteMap'
import StopList from './components/StopList'
import CommunityFilter from './components/CommunityFilter'
import Legend from './components/Legend'
import LocationPanel from './components/LocationPanel'
import ShareModal from './components/ShareModal'
import { SITE } from './config'
import './index.css'

// Whether the tool has more than one line to switch between. Drives the switcher
// and "All lines" overview, which appear automatically once a second route is
// added to routes.js.
const MULTI = routes.length > 1

// ---------------------------------------------------------------------------
// Deep linking via the URL hash (works on static GitHub Pages, no router dep).
//   #/line/<routeId>                 -> a specific line
//   #/line/<routeId>/area/<areaId>   -> a community/locality within a line
//   #/line/<routeId>/<itemId>        -> a specific point within a line
//   (empty / #/)                     -> the "All lines" overview
// ---------------------------------------------------------------------------
function parseHash(hash) {
  const parts = (hash || '').replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'line' && parts[1]) {
    if (parts[2] === 'area' && parts[3]) {
      return { routeId: parts[1], communityId: parts[3], locationId: null }
    }
    return { routeId: parts[1], communityId: null, locationId: parts[2] || null }
  }
  return { routeId: null, communityId: null, locationId: null }
}

function buildHash(activeRouteId, selectedRoute, selectedId, activeCommunityId) {
  if (selectedId && selectedRoute) return `#/line/${selectedRoute.id}/${selectedId}`
  if (activeRouteId && activeCommunityId) return `#/line/${activeRouteId}/area/${activeCommunityId}`
  if (activeRouteId) return `#/line/${activeRouteId}`
  return '#/'
}

// Resolve a parsed hash to valid ids, dropping anything unknown. An item link
// implies its own community context so a shared point opens "their area".
function resolveDeepLink({ routeId, communityId, locationId }) {
  const route = routeId ? routes.find((r) => r.id === routeId) : null
  if (!route) return { routeId: null, communityId: null, locationId: null }
  const loc = locationId ? route.locations.find((l) => l.id === locationId) : null
  const validCommunity =
    communityId && route.communities?.some((c) => c.id === communityId) ? communityId : null
  return {
    routeId: route.id,
    communityId: loc?.communityId ?? validCommunity,
    locationId: loc ? loc.id : null,
  }
}

export default function App() {
  const initial = resolveDeepLink(parseHash(window.location.hash))

  // null = "All lines" overview; otherwise a specific route id.
  const [activeRouteId, setActiveRouteId] = useState(
    () => initial.routeId ?? (MULTI ? null : routes[0].id),
  )
  const [activeCommunityId, setActiveCommunityId] = useState(() => initial.communityId)
  const [selectedId, setSelectedId] = useState(() => initial.locationId)
  const [panelOpen, setPanelOpen] = useState(false) // mobile stop-list drawer
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  const activeRoute = activeRouteId ? getRoute(activeRouteId) : null
  const activeCommunity =
    activeRoute && activeCommunityId ? getCommunity(activeRoute, activeCommunityId) : null
  const overview = MULTI && !activeRouteId

  const visibleRoutes = useMemo(
    () => (activeRouteId ? routes.filter((r) => r.id === activeRouteId) : routes),
    [activeRouteId],
  )

  // Routes as drawn on the map + stop list. When a community is chosen, its
  // line's points are filtered down to just that community's items.
  const displayRoutes = useMemo(() => {
    if (!activeRouteId || !activeCommunityId) return visibleRoutes
    return visibleRoutes.map((r) =>
      r.id === activeRouteId
        ? { ...r, locations: r.locations.filter((l) => l.communityId === activeCommunityId) }
        : r,
    )
  }, [visibleRoutes, activeRouteId, activeCommunityId])

  // Map framing: a focused community frames just its points.
  const framePoints = useMemo(() => {
    if (activeRoute && activeCommunityId) {
      return activeRoute.locations
        .filter((l) => l.communityId === activeCommunityId)
        .map((l) => l.coordinates)
    }
    return null
  }, [activeRoute, activeCommunityId])
  const frameKey = activeCommunityId
    ? `c:${activeRouteId}:${activeCommunityId}`
    : activeRouteId
      ? `r:${activeRouteId}`
      : 'all'

  const selected = useMemo(
    () => routes.flatMap((r) => r.locations).find((l) => l.id === selectedId) ?? null,
    [selectedId],
  )
  const selectedRoute = useMemo(
    () => (selectedId ? routes.find((r) => r.locations.some((l) => l.id === selectedId)) : null),
    [selectedId],
  )
  const categoriesInUse = useMemo(
    () => new Set(displayRoutes.flatMap((r) => r.locations.map((l) => l.type))),
    [displayRoutes],
  )
  const anyPlaceholder = visibleRoutes.some((r) => r.alignmentPlaceholder)

  // Keep the URL in sync with the current view (shareable deep link). We use
  // replaceState so this does not fire `hashchange` (no feedback loop) and does
  // not flood browser history as the user clicks around.
  useEffect(() => {
    const desired = buildHash(activeRouteId, selectedRoute, selectedId, activeCommunityId)
    const current = window.location.hash || '#/'
    if (current !== desired) {
      window.history.replaceState(null, '', desired)
    }
  }, [activeRouteId, selectedRoute, selectedId, activeCommunityId])

  // Respond to genuine external navigation (back/forward, edited/bookmarked URL).
  useEffect(() => {
    function onHashChange() {
      const link = resolveDeepLink(parseHash(window.location.hash))
      setActiveRouteId(link.routeId ?? (MULTI ? null : routes[0].id))
      setActiveCommunityId(link.communityId)
      setSelectedId(link.locationId)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function handleSelect(id) {
    setSelectedId(id)
    setPanelOpen(false)
  }

  function handleRouteChange(value) {
    setActiveRouteId(value === 'all' ? null : value)
    setActiveCommunityId(null)
    setSelectedId(null)
  }

  function handleCommunityChange(cid) {
    setActiveCommunityId(cid)
    setSelectedId(null)
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently ignore.
    }
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
          <RouteMap
            routes={displayRoutes}
            selectedId={selectedId}
            onSelect={handleSelect}
            framePoints={framePoints}
            frameKey={frameKey}
          />
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

            {/* Line switcher — appears automatically once more than one line exists.
                Choosing "All lines" closes out of any specific line. */}
            {MULTI && (
              <div className="border-t border-gray-100 px-4 py-3">
                <label
                  htmlFor="line-select"
                  className="mb-1 block font-body text-xs font-semibold uppercase tracking-widest text-aao-dark-red"
                >
                  Rail line
                </label>
                <div className="relative">
                  <select
                    id="line-select"
                    value={activeRouteId ?? 'all'}
                    onChange={(e) => handleRouteChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-aao-dark-blue/15 bg-white py-2 pl-3 pr-9 font-body text-sm font-semibold text-aao-dark-blue"
                  >
                    <option value="all">All lines ({routes.length})</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-aao-dark-blue/60"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}

            {/* Community filter — appears when the active line groups content by
                locality (e.g. Marysville vs. Dublin along Midwest Connect). */}
            {activeRoute?.communities?.length > 0 && (
              <CommunityFilter
                route={activeRoute}
                activeCommunityId={activeCommunityId}
                onChange={handleCommunityChange}
              />
            )}

            {/* Summary — adapts to overview / a whole line / a single community */}
            <div className="border-t border-gray-100 px-4 py-3">
              {overview ? (
                <>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-aao-dark-red">
                    Ohio · {routes.length} lines
                  </p>
                  <p className="mt-1 font-body text-sm leading-snug text-gray-600">
                    Every proposed line is shown below. Pick a line above, or tap any point on the
                    map to explore it.
                  </p>
                </>
              ) : activeCommunity ? (
                <>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-aao-dark-red">
                    {activeCommunity.county ?? activeRoute.name}
                  </p>
                  <p className="mt-1 font-body text-sm leading-snug text-gray-600">
                    {activeCommunity.blurb}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-aao-dark-blue px-3 py-1.5 font-body text-xs font-semibold text-white transition-colors hover:bg-aao-light-blue"
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> Link copied
                      </>
                    ) : (
                      <>
                        <Link2 size={14} /> Copy link to {activeCommunity.name} content
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <p className="font-body text-xs font-semibold uppercase tracking-widest text-aao-dark-red">
                    {visibleRoutes[0].region}
                  </p>
                  <p className="mt-1 font-body text-sm leading-snug text-gray-600">
                    {visibleRoutes[0].summary}
                  </p>
                </>
              )}
            </div>

            {/* Stop list — always visible on desktop, toggle on mobile */}
            <div className={`${panelOpen ? 'block' : 'hidden'} md:block`}>
              <div className="max-h-[42vh] overflow-y-auto border-t border-gray-100 p-3 md:max-h-[calc(100vh-24rem)]">
                <StopList routes={displayRoutes} selectedId={selectedId} onSelect={handleSelect} />
              </div>
            </div>
          </div>
        </aside>

        {/* --- Bottom-left: legend --- */}
        <div className="pointer-events-none absolute bottom-4 left-3 z-[1000] w-[min(88vw,300px)]">
          <Legend categoriesInUse={categoriesInUse} />
        </div>

        {/* --- Placeholder-data notice --- */}
        {anyPlaceholder && (
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
              location={selected}
              route={selectedRoute}
              onClose={() => setSelectedId(null)}
              onShare={() => setSharing(true)}
            />
          </div>
        )}

        {/* --- Share modal --- */}
        {sharing && selected && (
          <ShareModal location={selected} route={selectedRoute} onClose={() => setSharing(false)} />
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
