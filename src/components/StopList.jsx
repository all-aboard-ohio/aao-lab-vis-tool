import { ArrowRight } from 'lucide-react'
import { getCategory } from '../data/categories'
import { groupByCommunity } from '../data/routes'
import CategoryIcon from './CategoryIcon'

function StopButton({ loc, index, active, onSelect }) {
  const cat = getCategory(loc.type)
  return (
    <button
      type="button"
      onClick={() => onSelect(loc.id)}
      aria-current={active ? 'true' : undefined}
      className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
        active
          ? 'border-aao-light-blue bg-aao-light-blue/10'
          : 'border-gray-100 bg-white hover:border-aao-light-blue/40 hover:bg-aao-beige/40'
      }`}
    >
      <span
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-white"
        style={{ backgroundColor: cat.color }}
      >
        <CategoryIcon type={loc.type} size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-sm font-bold text-aao-dark-blue">
          <span className="text-gray-400">{index + 1}.</span> {loc.name}
        </span>
        <span className="block truncate font-body text-xs text-gray-500">{cat.label}</span>
      </span>
      <ArrowRight
        size={16}
        className="flex-none text-gray-300 transition-colors group-hover:text-aao-light-blue"
        aria-hidden="true"
      />
    </button>
  )
}

/**
 * Accessible list of the points of note for the visible route(s). Doubles as
 * the required text alternative to the map for screen-reader and keyboard users.
 * Stops are grouped by line (when several are shown) and by community/locality
 * within a line (when that line defines communities).
 */
function StopGroups({ locations, selectedId, onSelect }) {
  return (
    <ol className="space-y-2">
      {locations.map((loc, i) => (
        <li key={loc.id}>
          <StopButton loc={loc} index={i} active={loc.id === selectedId} onSelect={onSelect} />
        </li>
      ))}
    </ol>
  )
}

function RouteStops({ route, selectedId, onSelect }) {
  const groups = groupByCommunity(route)
  // Flat list when the line has no community grouping (single group, no label).
  if (groups.length === 1 && !groups[0].community) {
    return <StopGroups locations={groups[0].locations} selectedId={selectedId} onSelect={onSelect} />
  }
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <section key={g.community?.id ?? 'corridor-wide'} aria-label={g.community?.name ?? 'Corridor-wide'}>
          <h4 className="mb-1.5 font-heading text-xs font-bold text-aao-dark-blue">
            {g.community?.name ?? 'Corridor-wide'}
            {g.community?.county && (
              <span className="ml-1 font-body font-medium text-gray-400">· {g.community.county}</span>
            )}
          </h4>
          <StopGroups locations={g.locations} selectedId={selectedId} onSelect={onSelect} />
        </section>
      ))}
    </div>
  )
}

export default function StopList({ routes, selectedId, onSelect }) {
  const multiRoute = routes.length > 1

  if (!multiRoute) {
    const route = routes[0]
    return (
      <nav aria-label={`Points of note along the ${route.name}`}>
        <RouteStops route={route} selectedId={selectedId} onSelect={onSelect} />
      </nav>
    )
  }

  return (
    <nav aria-label="Points of note across all proposed lines" className="space-y-4">
      {routes.map((route) => (
        <section key={route.id} aria-label={route.name}>
          <h3 className="mb-2 flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest text-aao-dark-red">
            <span
              className="h-2.5 w-2.5 flex-none rounded-full"
              style={{ backgroundColor: route.color }}
              aria-hidden="true"
            />
            {route.name}
          </h3>
          <RouteStops route={route} selectedId={selectedId} onSelect={onSelect} />
        </section>
      ))}
    </nav>
  )
}
