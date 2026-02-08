export interface HSLColor {
  h: number
  s: number
  l: number
}

export interface RGBColor {
  r: number
  g: number
  b: number
}

/** All three representations of a color */
export interface ColorInfo {
  hex: string
  rgb: string
  hsl: string
}

// ── Conversions ──────────────────────────────────────────────

export function hslToRgb({ h, s, l }: HSLColor): RGBColor {
  const sn = s / 100
  const ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ln - c / 2

  let r1 = 0, g1 = 0, b1 = 0
  if (h < 60) [r1, g1, b1] = [c, x, 0]
  else if (h < 120) [r1, g1, b1] = [x, c, 0]
  else if (h < 180) [r1, g1, b1] = [0, c, x]
  else if (h < 240) [r1, g1, b1] = [0, x, c]
  else if (h < 300) [r1, g1, b1] = [x, 0, c]
  else [r1, g1, b1] = [c, 0, x]

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  }
}

export function rgbToHsl({ r, g, b }: RGBColor): HSLColor {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  const l = (max + min) / 2

  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) }

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60
  else if (max === gn) h = ((bn - rn) / d + 2) * 60
  else h = ((rn - gn) / d + 4) * 60

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function rgbToHex({ r, g, b }: RGBColor): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function hexToRgb(hex: string): RGBColor {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

export function hslToHex(hsl: HSLColor): string {
  return rgbToHex(hslToRgb(hsl))
}

export function hexToHsl(hex: string): HSLColor {
  return rgbToHsl(hexToRgb(hex))
}

export function formatRgb({ r, g, b }: RGBColor): string {
  return `rgb(${r}, ${g}, ${b})`
}

export function formatHsl({ h, s, l }: HSLColor): string {
  return `hsl(${h}, ${s}%, ${l}%)`
}

// ── Flexible input parsing ───────────────────────────────────

/**
 * Parse any reasonable color format into a normalized hex string.
 * Accepts: #RRGGBB, #RGB, RRGGBB, rgb(r,g,b), hsl(h,s%,l%)
 */
export function parseColor(input: string): string {
  const s = input.trim()

  // HEX: #RRGGBB, #RGB, RRGGBB, RGB
  const hexMatch = s.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    return `#${hex.toLowerCase()}`
  }

  // RGB: rgb(108, 92, 231)
  const rgbMatch = s.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i)
  if (rgbMatch) {
    const r = Math.min(255, +rgbMatch[1])
    const g = Math.min(255, +rgbMatch[2])
    const b = Math.min(255, +rgbMatch[3])
    return rgbToHex({ r, g, b })
  }

  // HSL: hsl(249, 75%, 63%)
  const hslMatch = s.match(/^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/i)
  if (hslMatch) {
    const h = Math.min(360, +hslMatch[1])
    const sVal = Math.min(100, +hslMatch[2])
    const l = Math.min(100, +hslMatch[3])
    return hslToHex({ h, s: sVal, l })
  }

  throw new Error(
    `Cannot parse "${input}". Accepted formats: #6C5CE7, 6C5CE7, #6CE, rgb(108,92,231), hsl(249,75%,63%)`
  )
}

// ── Color info helper ────────────────────────────────────────

/** Returns hex, rgb, and hsl representations of a color */
export function colorInfo(hex: string): ColorInfo {
  const rgb = hexToRgb(hex)
  const hsl = hexToHsl(hex)
  return { hex, rgb: formatRgb(rgb), hsl: formatHsl(hsl) }
}

// ── WCAG contrast ────────────────────────────────────────────

export function relativeLuminance({ r, g, b }: RGBColor): number {
  const linearize = (c: number) => {
    const srgb = c / 255
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

export function contrastRatio(a: RGBColor, b: RGBColor): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

export interface ContrastResult {
  ratio: string
  aa_normal: boolean
  aa_large: boolean
  aaa_normal: boolean
  aaa_large: boolean
}

export function checkContrast(hex1: string, hex2: string): ContrastResult {
  const ratio = contrastRatio(hexToRgb(hex1), hexToRgb(hex2))
  return {
    ratio: ratio.toFixed(2),
    aa_normal: ratio >= 4.5,
    aa_large: ratio >= 3,
    aaa_normal: ratio >= 7,
    aaa_large: ratio >= 4.5,
  }
}

export function textColorForBackground(hex: string): string {
  const rgb = hexToRgb(hex)
  const white: RGBColor = { r: 255, g: 255, b: 255 }
  const black: RGBColor = { r: 0, g: 0, b: 0 }
  return contrastRatio(rgb, white) > contrastRatio(rgb, black) ? '#ffffff' : '#000000'
}

// ── Palette generation ───────────────────────────────────────

const GOLDEN_RATIO_CONJUGATE = 0.618033988749895

export function generatePalette(
  count: number,
  locked: Record<string, string>,
): string[] {
  let hue = Math.random() * 360

  return Array.from({ length: count }, (_, i) => {
    const key = String(i)
    if (locked[key]) return locked[key]

    hue = (hue + 360 * GOLDEN_RATIO_CONJUGATE) % 360
    const s = Math.round(55 + Math.random() * 30)
    const l = Math.round(45 + Math.random() * 25)
    return hslToHex({ h: Math.round(hue), s, l })
  })
}
