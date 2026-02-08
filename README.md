# ColorMind

Color palette generator and harmony analyzer with a dark cosmic theme.

Hit **spacebar** to generate palettes, lock the colors you like, and explore harmony relationships — all from a single page with an animated starfield background.

## Features

- **Palette Generation** — 5-color palettes using golden ratio hue distribution. Lock individual swatches to keep colors you like while regenerating the rest.
- **Harmony Analysis** — Pick a base color and see all 5 harmony types: complementary, analogous, triadic, split-complementary, and tetradic. Apply any harmony directly to the palette.
- **Save & Export** — Save palettes to localStorage with custom names. Export your entire collection as JSON.
- **WCAG Contrast** — Every swatch shows its contrast ratio against white. Text color auto-adapts for readability.
- **Copy Anywhere** — One-click copy for HEX and RGB values on any color.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |
| State | `useReducer` (palette) + `useState` (saved palettes) |
| Storage | localStorage — no backend |

No router, no Context API — single page with tabs and props-only state passing.

## Getting Started

```bash
git clone https://github.com/TungSeven30/colors-help.git
cd colors-help
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── lib/
│   ├── color.ts          # HSL/RGB/HEX conversion, WCAG contrast, palette generation
│   ├── harmony.ts        # 5 harmony type calculations
│   ├── storage.ts        # localStorage persistence + JSON export
│   └── utils.ts          # Tailwind class merging (cn)
├── hooks/
│   ├── use-palette.ts    # useReducer — generate, lock, set, load
│   └── use-saved-palettes.ts  # useState + localStorage sync
├── components/
│   ├── PaletteGenerator  # Main palette UI + spacebar shortcut
│   ├── ColorSwatch       # Individual color with lock/copy/contrast
│   ├── HarmonyAnalyzer   # Base color picker + harmony grid
│   ├── HarmonyGroup      # Single harmony type display
│   ├── SavedPalettes     # Saved palette grid + export
│   ├── PaletteCard       # Individual saved palette card
│   ├── StarfieldCanvas   # Animated canvas background
│   ├── CopyButton        # Reusable copy-to-clipboard
│   └── ui/               # shadcn/ui primitives
└── App.tsx               # Root — tabs + state wiring
```

## How It Works

**Palette generation** distributes hues using the golden ratio (0.618...) for visually pleasing spacing, with randomized saturation (55-85%) and lightness (45-70%). Locked colors are preserved across regenerations.

**Harmony calculations** apply standard hue offsets to a base color — 180 degrees for complementary, +/-30 degrees for analogous, etc.

**Contrast ratios** follow the WCAG formula with correct sRGB linearization (piecewise at the 0.03928 threshold). HSL values are rounded to integers at conversion boundaries to prevent floating-point drift.

## License

MIT
