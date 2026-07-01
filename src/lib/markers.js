import L from 'leaflet'
import { getCategory } from '../data/categories'

// Minimal inline SVG glyphs (white) for each category, sized for the pin head.
// Kept as raw strings because Leaflet divIcons render HTML, not React nodes.
const GLYPHS = {
  station:
    '<rect x="6" y="4" width="12" height="13" rx="3"/><rect x="8.5" y="6.5" width="7" height="4" rx="1" fill="#012345"/><circle cx="9" cy="14" r="1.3" fill="#012345"/><circle cx="15" cy="14" r="1.3" fill="#012345"/><path d="M8 18l-1.5 2M16 18l1.5 2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
  tod:
    '<rect x="5" y="8" width="6" height="10" rx="1"/><rect x="12" y="4" width="7" height="14" rx="1"/><rect x="7" y="10" width="2" height="2" fill="#388CBB"/><rect x="7" y="13.5" width="2" height="2" fill="#388CBB"/><rect x="14" y="6.5" width="2" height="2" fill="#388CBB"/><rect x="14" y="10" width="2" height="2" fill="#388CBB"/><rect x="14" y="13.5" width="2" height="2" fill="#388CBB"/>',
  'grade-separation':
    '<path d="M3 16c4 0 4-7 9-7s5 7 9 7" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M3 18h18" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
  'track-improvement':
    '<path d="M8 3v16M16 3v16" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M6 7h12M6 11h12M6 15h12" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>',
  construction:
    '<path d="M12 4l8 15H4z" fill="#fff"/><rect x="10.6" y="9" width="2.8" height="5" rx="1" fill="#8a6d1f"/><circle cx="12" cy="16" r="1.3" fill="#8a6d1f"/>',
}

/**
 * Build a branded teardrop marker for a location.
 * @param {string} type category id from categories.js
 * @param {{ active?: boolean }} [opts]
 */
export function createMarkerIcon(type, { active = false } = {}) {
  const cat = getCategory(type)
  const glyph = GLYPHS[type] ?? GLYPHS.station
  const size = active ? 46 : 38
  const pulse = active
    ? `<span class="aao-pin__pulse" style="position:absolute;inset:0;border-radius:9999px;background:${cat.color};"></span>`
    : ''

  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;">
      ${pulse}
      <div style="
        position:relative;
        width:${size}px;height:${size}px;
        display:flex;align-items:center;justify-content:center;
        filter:drop-shadow(0 3px 4px rgba(1,35,69,.35));
      ">
        <svg viewBox="0 0 40 52" width="${size}" height="${size * 1.3}"
             style="position:absolute;top:0;left:0;">
          <path d="M20 51 C20 51 37 30 37 18 A17 17 0 1 0 3 18 C3 30 20 51 20 51 Z"
                fill="${cat.color}" stroke="#fff" stroke-width="2.5"/>
        </svg>
        <svg viewBox="0 0 24 24" width="${size * 0.5}" height="${size * 0.5}"
             fill="none" stroke="#fff" stroke-width="0"
             style="position:relative;transform:translateY(-${size * 0.12}px);">
          ${glyph}
        </svg>
      </div>
    </div>`

  const h = size * 1.3
  return L.divIcon({
    className: 'aao-marker',
    html,
    iconSize: [size, h],
    iconAnchor: [size / 2, h * 0.98],
    popupAnchor: [0, -h * 0.9],
  })
}
