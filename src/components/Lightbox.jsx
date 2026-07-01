import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Full-screen image viewer. Rendered through a portal to <body> so it is never
 * affected by the transformed/animated panel it is opened from.
 *
 * Keyboard: Escape closes; ArrowLeft/ArrowRight navigate.
 */
export default function Lightbox({ images, startIndex = 0, title, onClose }) {
  const [index, setIndex] = useState(startIndex)
  const closeRef = useRef(null)
  const image = images[index]
  const many = images.length > 1

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length)
      else if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image viewer`}
      className="fixed inset-0 z-[1300] flex flex-col bg-aao-dark-blue/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="min-w-0 truncate font-body text-sm text-aao-beige/85">{title}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex-none rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <X size={22} />
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {many && (
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:left-6"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        <figure className="flex max-h-full max-w-4xl flex-col items-center">
          <img
            src={image?.src}
            alt={image?.alt}
            className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
          />
          {(image?.caption || image?.credit) && (
            <figcaption className="mt-3 text-center font-body text-sm text-aao-beige/80">
              {image?.caption}
              {image?.credit && (
                <span className="block text-xs text-aao-beige/50">Image: {image.credit}</span>
              )}
            </figcaption>
          )}
        </figure>

        {many && (
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:right-6"
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>

      {many && (
        <div className="flex justify-center gap-1.5 pb-5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}
