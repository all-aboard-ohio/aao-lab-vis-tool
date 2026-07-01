import { ArrowRight } from 'lucide-react'
import { getCategory } from '../data/categories'
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
 * When more than one line is shown ("All lines" overview), stops are grouped
 * under a heading per line.
 */
export default function StopList({ routes, selectedId, onSelect }) {
  const grouped = routes.length > 1

  if (!grouped) {
    const route = routes[0]
    return (
      <nav aria-label={`Points of note along the ${route.name}`}>
        <ol className="space-y-2">
          {route.locations.map((loc, i) => (
            <li key={loc.id}>
              <StopButton loc={loc} index={i} active={loc.id === selectedId} onSelect={onSelect} />
            </li>
          ))}
        </ol>
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
          <ol className="space-y-2">
            {route.locations.map((loc, i) => (
              <li key={loc.id}>
                <StopButton loc={loc} index={i} active={loc.id === selectedId} onSelect={onSelect} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </nav>
  )
}
