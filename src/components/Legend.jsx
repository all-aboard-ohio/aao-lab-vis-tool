import { useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import { CATEGORIES, CATEGORY_ORDER } from '../data/categories'
import CategoryIcon from './CategoryIcon'

/**
 * Map legend explaining the marker categories. Collapsible so it stays out of
 * the way on small screens.
 */
export default function Legend({ categoriesInUse }) {
  const [open, setOpen] = useState(false)
  const shown = CATEGORY_ORDER.filter((id) => categoriesInUse.has(id))

  return (
    <div className="pointer-events-auto rounded-2xl border border-black/5 bg-white/95 shadow-md backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 font-body text-sm font-semibold text-aao-dark-blue"
      >
        <Info size={16} className="text-aao-light-blue" aria-hidden="true" />
        Legend
        <ChevronDown
          size={16}
          className={`ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul className="space-y-2 px-4 pb-4">
          {shown.map((id) => {
            const cat = CATEGORIES[id]
            return (
              <li key={id} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon type={id} size={13} />
                </span>
                <span className="font-body text-xs leading-snug text-gray-600">
                  <span className="font-semibold text-aao-dark-blue">{cat.label}</span>
                  <br />
                  {cat.description}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
