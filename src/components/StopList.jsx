import { ArrowRight } from 'lucide-react'
import { getCategory } from '../data/categories'
import CategoryIcon from './CategoryIcon'

/**
 * Accessible, ordered list of the points of note along a route. Doubles as the
 * required text alternative to the map for screen-reader and keyboard users.
 */
export default function StopList({ route, selectedId, onSelect }) {
  return (
    <nav aria-label={`Points of note along the ${route.name}`}>
      <ol className="space-y-2">
        {route.locations.map((loc, i) => {
          const cat = getCategory(loc.type)
          const active = loc.id === selectedId
          return (
            <li key={loc.id}>
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
                    <span className="text-gray-400">{i + 1}.</span> {loc.name}
                  </span>
                  <span className="block truncate font-body text-xs text-gray-500">
                    {cat.label}
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  className="flex-none text-gray-300 transition-colors group-hover:text-aao-light-blue"
                  aria-hidden="true"
                />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
