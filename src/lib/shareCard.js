import { getCategory } from '../data/categories'
import { SITE } from '../config'

// ---------------------------------------------------------------------------
// Share-card generator
// ---------------------------------------------------------------------------
// Renders a branded PNG for a location entirely on a <canvas> — no server, no
// third-party service, no user data leaves the browser. Two presets:
//   - 'story' : 1080x1920 (Instagram/Facebook stories, TikTok)
//   - 'post'  : 1080x1080 (square feed posts)
//
// Everything is drawn with the AAO brand palette and fonts. Fonts are loaded
// from Google Fonts in index.html; we wait for them via document.fonts before
// drawing so text renders in Poppins/Montserrat rather than a fallback.
// ---------------------------------------------------------------------------

const PRESETS = {
  story: { w: 1080, h: 1920 },
  post: { w: 1080, h: 1080 },
}

const COLORS = {
  darkBlue: '#012345',
  darkRed: '#B72717',
  lightBlue: '#388CBB',
  beige: '#FBF3E3',
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

async function ensureFonts() {
  if (!document.fonts?.ready) return
  try {
    await Promise.all([
      document.fonts.load('800 96px Poppins'),
      document.fonts.load('600 40px Montserrat'),
      document.fonts.load('500 34px Montserrat'),
    ])
    await document.fonts.ready
  } catch {
    // Non-fatal — canvas will fall back to a system font.
  }
}

// The AAO Data Lab logo, loaded once and reused across cards. It's served from
// our own origin (public/), so drawing it to the canvas does not taint it.
const LOGO_SRC = '/AAOLAB_White_Logo.svg'
let logoPromise = null

function loadLogo() {
  if (!logoPromise) {
    logoPromise = new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null) // fall back to text branding
      img.src = LOGO_SRC
    })
  }
  return logoPromise
}

/**
 * Draw a share card for a location and return it as a Blob (PNG).
 * @param {object} location  a location object from routes.js
 * @param {object} route     the parent route object
 * @param {'story'|'post'} preset
 * @returns {Promise<Blob>}
 */
export async function renderShareCard(location, route, preset = 'story') {
  await ensureFonts()
  const logo = await loadLogo()

  const { w, h } = PRESETS[preset] ?? PRESETS.story
  const cat = getCategory(location.type)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = COLORS.darkBlue
  ctx.fillRect(0, 0, w, h)

  // Subtle diagonal band for texture
  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.fillStyle = COLORS.lightBlue
  ctx.translate(w, 0)
  ctx.rotate((28 * Math.PI) / 180)
  ctx.fillRect(-200, -200, w * 1.6, 260)
  ctx.restore()

  const pad = Math.round(w * 0.09)
  const contentW = w - pad * 2
  let y = preset === 'story' ? Math.round(h * 0.16) : pad + 40

  // Eyebrow: category chip
  const chipLabel = cat.label.toUpperCase()
  ctx.font = '600 34px Montserrat, sans-serif'
  const chipW = ctx.measureText(chipLabel).width + 56
  ctx.fillStyle = cat.color
  roundRect(ctx, pad, y, chipW, 62, 31)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.fillText(chipLabel, pad + 28, y + 33)
  ctx.textBaseline = 'alphabetic'
  y += 120

  // Location name (wrapped)
  ctx.fillStyle = COLORS.beige
  ctx.font = '800 96px Poppins, sans-serif'
  const nameLines = wrapText(ctx, location.name, contentW)
  for (const line of nameLines) {
    ctx.fillText(line, pad, y + 84)
    y += 108
  }
  y += 24

  // Summary
  ctx.fillStyle = 'rgba(251,243,227,0.85)'
  ctx.font = '500 40px Montserrat, sans-serif'
  const summaryLines = wrapText(ctx, location.summary, contentW).slice(0, 4)
  for (const line of summaryLines) {
    ctx.fillText(line, pad, y + 40)
    y += 56
  }
  y += 40

  // Divider
  ctx.strokeStyle = 'rgba(56,140,187,0.5)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(pad, y)
  ctx.lineTo(pad + contentW, y)
  ctx.stroke()
  y += 60

  // Up to three facts
  const facts = (location.facts ?? []).slice(0, 3)
  for (const fact of facts) {
    ctx.fillStyle = COLORS.lightBlue
    ctx.font = '600 30px Montserrat, sans-serif'
    ctx.fillText(fact.label.toUpperCase(), pad, y + 30)
    ctx.fillStyle = COLORS.beige
    ctx.font = '600 46px Montserrat, sans-serif'
    const valLines = wrapText(ctx, String(fact.value), contentW)
    let vy = y + 78
    for (const vl of valLines) {
      ctx.fillText(vl, pad, vy)
      vy += 54
    }
    y = vy + 24
  }

  // Footer / branding pinned to bottom
  const footY = h - pad - 40
  const logoH = 74
  let textX = pad + 96
  if (logo) {
    const logoW = logoH * (logo.width / logo.height)
    ctx.drawImage(logo, pad, footY - 12, logoW, logoH)
    textX = pad + logoW + 28
  } else {
    // Fallback branding if the logo asset fails to load.
    ctx.fillStyle = COLORS.darkRed
    roundRect(ctx, pad, footY - 8, 70, 70, 18)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = '800 40px Poppins, sans-serif'
    ctx.fillText('AAO', pad + 12, footY + 44)
  }

  ctx.fillStyle = COLORS.beige
  ctx.font = '800 44px Poppins, sans-serif'
  ctx.fillText(SITE.name, textX, footY + 22)
  ctx.fillStyle = 'rgba(251,243,227,0.7)'
  ctx.font = '500 30px Montserrat, sans-serif'
  ctx.fillText(`${route.name} · vis.lab.allaboardohio.org`, textX, footY + 62)

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'))
}

/** Trigger a browser download of a blob. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/**
 * Share via the Web Share API when available (mobile), otherwise download.
 * Returns 'shared' | 'downloaded'.
 */
export async function shareOrDownload(blob, location, preset) {
  const filename = `imagine-rail-${location.id}-${preset}.png`
  const file = new File([blob], filename, { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `${location.name} — Imagine Your Rail Line`,
        text: location.summary,
      })
      return 'shared'
    } catch (err) {
      // User cancelled or share failed — fall back to download.
      if (err?.name === 'AbortError') return 'shared'
    }
  }

  downloadBlob(blob, filename)
  return 'downloaded'
}
