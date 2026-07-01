import { useEffect, useRef, useState } from 'react'
import { X, Share2, Download, Loader2, ImageDown } from 'lucide-react'
import { renderShareCard, shareOrDownload, downloadBlob } from '../lib/shareCard'

const FORMATS = [
  { id: 'story', label: 'Story', hint: '9:16 · Instagram / TikTok' },
  { id: 'post', label: 'Post', hint: '1:1 · Feed post' },
]

/**
 * Modal that previews and exports a branded share card for a location.
 * Fully client-side — no data leaves the browser.
 */
export default function ShareModal({ location, route, onClose }) {
  const [format, setFormat] = useState('story')
  // `preview.format` records which format the current image was rendered for.
  // Deriving `busy` from it avoids setting state synchronously inside the effect.
  const [preview, setPreview] = useState({ url: null, format: null })
  const [status, setStatus] = useState('')
  const blobRef = useRef(null)
  const closeRef = useRef(null)

  const busy = preview.format !== format
  const previewUrl = preview.url
  const shownFormat = preview.format ?? format

  // Regenerate the preview whenever the format changes.
  useEffect(() => {
    let cancelled = false
    let url
    renderShareCard(location, route, format).then((blob) => {
      if (cancelled || !blob) return
      blobRef.current = blob
      url = URL.createObjectURL(blob)
      setPreview({ url, format })
    })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [location, route, format])

  // Close on Escape; focus the close button on open.
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleShare() {
    if (!blobRef.current) return
    const result = await shareOrDownload(blobRef.current, location, format)
    setStatus(result === 'shared' ? 'Opening share sheet…' : 'Image downloaded to your device.')
  }

  function handleDownload() {
    if (!blobRef.current) return
    downloadBlob(blobRef.current, `imagine-rail-${location.id}-${format}.png`)
    setStatus('Image downloaded to your device.')
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-aao-dark-blue/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      onClick={onClose}
    >
      <div
        className="aao-panel-mobile max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 id="share-title" className="font-heading text-lg font-bold text-aao-dark-blue">
            Share this location
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-aao-dark-blue"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {/* Format toggle */}
          <div
            className="mb-4 inline-flex rounded-xl bg-aao-beige p-1"
            role="group"
            aria-label="Share format"
          >
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                aria-pressed={format === f.id}
                className={`rounded-lg px-4 py-2 font-body text-sm font-semibold transition-colors ${
                  format === f.id
                    ? 'bg-white text-aao-dark-blue shadow-sm'
                    : 'text-aao-dark-blue/60 hover:text-aao-dark-blue'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="relative mb-4 flex justify-center rounded-xl bg-aao-dark-blue/5 p-3">
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-aao-light-blue" size={28} aria-label="Generating preview" />
              </div>
            )}
            {previewUrl && (
              <img
                src={previewUrl}
                alt={`Preview of the ${shownFormat} share card for ${location.name}`}
                className={`max-h-[46vh] w-auto rounded-lg shadow-md transition-opacity ${
                  busy ? 'opacity-40' : 'opacity-100'
                }`}
                style={{ aspectRatio: shownFormat === 'story' ? '9 / 16' : '1 / 1' }}
              />
            )}
          </div>

          <p className="mb-4 text-center font-body text-xs text-gray-500">
            {FORMATS.find((f) => f.id === format)?.hint}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleShare}
              disabled={busy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-aao-dark-blue px-5 py-2.5 font-body font-semibold text-white transition-colors hover:bg-aao-light-blue disabled:opacity-50"
            >
              <Share2 size={18} /> Share
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={busy}
              aria-label="Download image"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-aao-dark-blue/15 px-4 py-2.5 font-body font-semibold text-aao-dark-blue transition-colors hover:bg-aao-beige disabled:opacity-50"
            >
              <Download size={18} />
            </button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-body text-xs text-gray-400" aria-live="polite">
            <ImageDown size={13} />
            {status || 'Generated on your device — nothing is uploaded.'}
          </p>
        </div>
      </div>
    </div>
  )
}
