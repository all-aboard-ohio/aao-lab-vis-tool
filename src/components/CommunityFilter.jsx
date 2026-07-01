import { MapPin } from 'lucide-react'

/**
 * Chip selector for choosing a community/locality within a route (e.g. viewing
 * just "Marysville" vs "Dublin" content along the Midwest Connect line). The
 * first chip clears the filter and shows the whole line.
 */
export default function CommunityFilter({ route, activeCommunityId, onChange }) {
  const communities = route.communities ?? []
  if (communities.length === 0) return null

  return (
    <div className="border-t border-gray-100 px-4 py-3">
      <p className="mb-2 font-body text-xs font-semibold uppercase tracking-widest text-aao-dark-red">
        Community
      </p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by community">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-pressed={!activeCommunityId}
          className={`rounded-full px-3 py-1.5 font-body text-xs font-semibold transition-colors ${
            !activeCommunityId
              ? 'bg-aao-dark-blue text-white'
              : 'bg-aao-beige text-aao-dark-blue hover:bg-aao-beige/70'
          }`}
        >
          Whole line
        </button>
        {communities.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            aria-pressed={activeCommunityId === c.id}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-body text-xs font-semibold transition-colors ${
              activeCommunityId === c.id
                ? 'bg-aao-dark-blue text-white'
                : 'bg-aao-beige text-aao-dark-blue hover:bg-aao-beige/70'
            }`}
          >
            <MapPin size={12} aria-hidden="true" />
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
