import { useEffect, useRef, useState } from 'react'
import { X, Share2, ChevronLeft, ChevronRight, MapPin, Maximize2 } from 'lucide-react'
import { getCategory } from '../data/categories'
import CategoryIcon from './CategoryIcon'
import Lightbox from './Lightbox'

function StatusBadge({ status }) {
  const map = {
    proposed: { label: 'Proposed', cls: 'bg-aao-light-blue/15 text-aao-light-blue' },
    concept: { label: 'Concept', cls: 'bg-aao-dark-red/10 text-aao-dark-red' },
  }
  const s = map[status] ?? map.proposed
  return (
    <span className={`rounded-full px-2.5 py-1 font-body text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  )
}

/**
 * Slide-in detail panel for a selected location. Renders as a right-hand side
 * panel on desktop and a bottom sheet on mobile. Behaves as a modal dialog with
 * keyboard support and focus management.
 */
export default function LocationPanel({ location, route, onClose, onShare }) {
  const cat = getCategory(location.type)
  const [imgIndex, setImgIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [shownId, setShownId] = useState(location.id)
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  // The panel stays mounted while you switch between locations (so it doesn't
  // re-animate on every click). Reset gallery state during render when the
  // location changes — the React-sanctioned alternative to a reset effect.
  if (shownId !== location.id) {
    setShownId(location.id)
    setImgIndex(0)
    setLightboxOpen(false)
  }

  // Move focus into the panel on open.
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const images = location.images ?? []
  const image = images[imgIndex]
  const anyPlaceholder = location.facts?.some((f) => f.placeholder)

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="loc-title"
      className="aao-panel-mobile md:aao-panel-desktop pointer-events-auto flex max-h-[75vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl md:max-h-none md:h-full md:w-[400px] md:rounded-none md:rounded-l-2xl"
    >
      {/* Image gallery */}
      <div className="relative flex-none bg-aao-dark-blue/5">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`View image larger: ${image?.alt ?? location.name}`}
          className="group block w-full cursor-zoom-in"
        >
          <img
            src={image?.src}
            alt={image?.alt}
            className="h-48 w-full object-cover md:h-56"
            loading="lazy"
          />
          <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-aao-dark-blue/70 px-2 py-1 font-body text-[11px] font-semibold text-white opacity-90 transition-opacity group-hover:opacity-100">
            <Maximize2 size={12} /> Expand
          </span>
        </button>

        {/* Category chip */}
        <span
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-semibold text-white shadow-sm"
          style={{ backgroundColor: cat.color }}
        >
          <CategoryIcon type={location.type} size={14} />
          {cat.label}
        </span>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close location details"
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-aao-dark-blue shadow-sm hover:bg-white"
        >
          <X size={18} />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-aao-dark-blue shadow hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setImgIndex((i) => (i + 1) % images.length)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-aao-dark-blue shadow hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === imgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {image?.caption && (
          <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-aao-dark-blue/80 to-transparent px-4 pb-2 pt-6 font-body text-xs text-white/90">
            {image.caption}
          </p>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="mb-2 flex items-center gap-2">
          <StatusBadge status={location.status} />
          <span className="inline-flex items-center gap-1 font-body text-xs text-gray-400">
            <MapPin size={12} /> {route.name}
          </span>
        </div>

        <h2 id="loc-title" className="font-heading text-2xl font-extrabold text-aao-dark-blue">
          {location.name}
        </h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-gray-600">
          {location.description}
        </p>

        {/* Facts */}
        {location.facts?.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-widest text-aao-dark-red">
              By the numbers
            </h3>
            <dl className="grid grid-cols-2 gap-3">
              {location.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-gray-100 bg-aao-beige/50 p-3"
                >
                  <dt className="font-body text-xs font-semibold text-gray-500">{fact.label}</dt>
                  <dd className="mt-0.5 font-heading text-base font-bold text-aao-dark-blue">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            {anyPlaceholder && (
              <p className="mt-2 font-body text-xs italic text-gray-400">
                Figures marked TBD are placeholders awaiting verified data sources.
              </p>
            )}
          </div>
        )}

        {image?.credit && (
          <p className="mt-4 font-body text-xs text-gray-400">Image: {image.credit}</p>
        )}
      </div>

      {/* Sticky share action */}
      <div className="flex-none border-t border-gray-100 p-4">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-aao-dark-red px-5 py-2.5 font-body font-semibold text-white transition-colors hover:bg-red-700"
        >
          <Share2 size={18} /> Share this location
        </button>
      </div>

      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          startIndex={imgIndex}
          title={location.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
