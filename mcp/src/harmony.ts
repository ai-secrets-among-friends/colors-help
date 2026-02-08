import type { HSLColor } from './color.js'
import { hexToHsl, hslToHex } from './color.js'

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'

export interface HarmonyResult {
  type: HarmonyType
  label: string
  colors: string[]
}

function rotateHue(base: HSLColor, degrees: number): HSLColor {
  return { h: Math.round((base.h + degrees + 360) % 360), s: base.s, l: base.l }
}

function toHexes(base: HSLColor, offsets: number[]): string[] {
  return [hslToHex(base), ...offsets.map((d) => hslToHex(rotateHue(base, d)))]
}

export function getHarmonies(baseHex: string): HarmonyResult[] {
  const base = hexToHsl(baseHex)

  return [
    { type: 'complementary', label: 'Complementary', colors: toHexes(base, [180]) },
    { type: 'analogous', label: 'Analogous', colors: toHexes(base, [-30, 30]) },
    { type: 'triadic', label: 'Triadic', colors: toHexes(base, [120, 240]) },
    { type: 'split-complementary', label: 'Split Complementary', colors: toHexes(base, [150, 210]) },
    { type: 'tetradic', label: 'Tetradic', colors: toHexes(base, [90, 180, 270]) },
  ]
}
