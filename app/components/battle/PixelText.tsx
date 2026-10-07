// app/components/battle/PixelText.tsx
"use client"

// Chunky arcade lettering drawn as SVG rectangles — banded gradient fill, thick
// outline and a hard drop shadow, like the GAME OVER / VS references. Resolution
// independent (no image files) and it scales with `px`.

import { memo, useMemo, type CSSProperties } from "react"

// 5×7 bitmap font. "#" = pixel.
const F = (rows: string) => rows.split("/")
const FONT: Record<string, string[]> = {
  A: F(".###./#...#/#...#/#####/#...#/#...#/#...#"),
  B: F("####./#...#/#...#/####./#...#/#...#/####."),
  C: F(".###./#...#/#..../#..../#..../#...#/.###."),
  D: F("####./#...#/#...#/#...#/#...#/#...#/####."),
  E: F("#####/#..../#..../####./#..../#..../#####"),
  F: F("#####/#..../#..../####./#..../#..../#...."),
  G: F(".###./#...#/#..../#.###/#...#/#...#/.###."),
  H: F("#...#/#...#/#...#/#####/#...#/#...#/#...#"),
  I: F(".###./..#../..#../..#../..#../..#../.###."),
  J: F("..###/...#./...#./...#./...#./#..#./.##.."),
  K: F("#...#/#..#./#.#../##.../#.#../#..#./#...#"),
  L: F("#..../#..../#..../#..../#..../#..../#####"),
  M: F("#...#/##.##/#.#.#/#.#.#/#...#/#...#/#...#"),
  N: F("#...#/##..#/#.#.#/#..##/#...#/#...#/#...#"),
  O: F(".###./#...#/#...#/#...#/#...#/#...#/.###."),
  P: F("####./#...#/#...#/####./#..../#..../#...."),
  Q: F(".###./#...#/#...#/#...#/#.#.#/#..#./.##.#"),
  R: F("####./#...#/#...#/####./#.#../#..#./#...#"),
  S: F(".####/#..../#..../.###./....#/....#/####."),
  T: F("#####/..#../..#../..#../..#../..#../..#.."),
  U: F("#...#/#...#/#...#/#...#/#...#/#...#/.###."),
  V: F("#...#/#...#/#...#/#...#/#...#/.#.#./..#.."),
  W: F("#...#/#...#/#...#/#.#.#/#.#.#/##.##/#...#"),
  X: F("#...#/#...#/.#.#./..#../.#.#./#...#/#...#"),
  Y: F("#...#/#...#/.#.#./..#../..#../..#../..#.."),
  Z: F("#####/....#/...#./..#../.#.../#..../#####"),
  "0": F(".###./#...#/#..##/#.#.#/##..#/#...#/.###."),
  "1": F("..#../.##../..#../..#../..#../..#../.###."),
  "2": F(".###./#...#/....#/...#./..#../.#.../#####"),
  "3": F(".###./#...#/....#/..##./....#/#...#/.###."),
  "4": F("...#./..##./.#.#./#..#./#####/...#./...#."),
  "5": F("#####/#..../####./....#/....#/#...#/.###."),
  "6": F(".###./#..../#..../####./#...#/#...#/.###."),
  "7": F("#####/....#/...#./..#../.#.../.#.../.#..."),
  "8": F(".###./#...#/#...#/.###./#...#/#...#/.###."),
  "9": F(".###./#...#/#...#/.####/....#/....#/.###."),
  "!": F("..#../..#../..#../..#../..#../...../..#.."),
  "?": F(".###./#...#/....#/...#./..#../...../..#.."),
  ".": F("...../...../...../...../...../...../..#.."),
  ":": F("...../..#../...../...../...../..#../....."),
  "-": F("...../...../...../#####/...../...../....."),
  "/": F("....#/....#/...#./..#../.#.../#..../#...."),
  "'": F("..#../..#../...../...../...../...../....."),
}

export type PixelPalette = keyof typeof PALETTES

// stops = top → bottom colour bands of the letter fill
export const PALETTES = {
  // GAME OVER / VICTORY — yellow→orange on navy
  gold: { stops: ["#fff36b", "#ffd21f", "#ffb000", "#ff8a00", "#f0560a"], outline: "#14183b", shadow: "#070a20" },
  // the pixel VS — hot orange/yellow inside a red outline
  fire: { stops: ["#fff08a", "#ffd34d", "#ffa62b", "#ff7a1f"], outline: "#e63946", shadow: "#7d1220" },
  // cool cyan for countdown / wins
  ice: { stops: ["#f2ffff", "#a6f6ff", "#3fd7e3", "#1a9aa1"], outline: "#12285e", shadow: "#08122f" },
  // defeat / draw
  steel: { stops: ["#f4f4f8", "#c9ccd8", "#8e93a8", "#5a5f78"], outline: "#14183b", shadow: "#070a20" },
  // hot pink accents
  candy: { stops: ["#fff0f6", "#ffb3d1", "#ff6fa8", "#e0467f"], outline: "#2d2150", shadow: "#150c2e" },
} as const

type Cell = [number, number]
const key = (x: number, y: number) => `${x},${y}`

// glyph → cells at 2× scale, then "bolded" (grown 1px right & down) so strokes read chunky
function glyphCells(ch: string): Cell[] {
  const rows = FONT[ch] ?? FONT["?"]
  const set = new Set<string>()
  const out: Cell[] = []
  const add = (x: number, y: number) => {
    const k = key(x, y)
    if (!set.has(k)) {
      set.add(k)
      out.push([x, y])
    }
  }
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "#") continue
      for (let dx = 0; dx < 2; dx++) {
        for (let dy = 0; dy < 2; dy++) {
          const bx = x * 2 + dx
          const by = y * 2 + dy
          add(bx, by)
          add(bx + 1, by)
          add(bx, by + 1)
          add(bx + 1, by + 1)
        }
      }
    }
  })
  return out
}

const GLYPH_W = 11 // 5*2 + 1
const GLYPH_H = 15 // 7*2 + 1

function runs(cells: Set<string>): { x: number; y: number; w: number }[] {
  const byRow = new Map<number, number[]>()
  cells.forEach((k) => {
    const [x, y] = k.split(",").map(Number)
    if (!byRow.has(y)) byRow.set(y, [])
    byRow.get(y)!.push(x)
  })
  const out: { x: number; y: number; w: number }[] = []
  byRow.forEach((xs, y) => {
    xs.sort((a, b) => a - b)
    let start = xs[0]
    let prev = xs[0]
    for (let i = 1; i <= xs.length; i++) {
      if (xs[i] !== prev + 1) {
        out.push({ x: start, y, w: prev - start + 1 })
        start = xs[i]
      }
      prev = xs[i]
    }
  })
  return out
}

function layout(text: string, gap: number) {
  const fill = new Set<string>()
  let cursor = 0
  for (const raw of text.toUpperCase()) {
    if (raw === " ") {
      cursor += 6
      continue
    }
    for (const [x, y] of glyphCells(raw)) fill.add(key(cursor + x, y))
    cursor += GLYPH_W + gap
  }
  return { fill, width: Math.max(0, cursor - gap) }
}

function dilate(src: Set<string>, r: number) {
  const out = new Set<string>()
  src.forEach((k) => {
    const [x, y] = k.split(",").map(Number)
    for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) out.add(key(x + dx, y + dy))
  })
  return out
}

type Props = {
  text: string
  /** size of one pixel in CSS px */
  px?: number
  palette?: PixelPalette
  gap?: number
  outline?: number
  shadow?: number
  className?: string
  style?: CSSProperties
}

function PixelText({
  text,
  px = 6,
  palette = "gold",
  gap = 3,
  outline = 2,
  shadow = 3,
  className,
  style,
}: Props) {
  const pal = PALETTES[palette]

  // the layout is the expensive part — only recompute when the text/shape changes
  const { width, fillRuns, outlineRuns, shadowRuns } = useMemo(() => {
    const { fill, width } = layout(text, gap)
    const outlineSet = dilate(fill, outline)
    const shadowSet = new Set<string>()
    outlineSet.forEach((k) => {
      const [x, y] = k.split(",").map(Number)
      shadowSet.add(key(x, y + shadow))
    })
    return { width, fillRuns: runs(fill), outlineRuns: runs(outlineSet), shadowRuns: runs(shadowSet) }
  }, [text, gap, outline, shadow])

  const pad = outline
  const vbW = width + pad * 2
  const vbH = GLYPH_H + pad * 2 + shadow

  const bandFor = (y: number) => {
    const i = Math.min(pal.stops.length - 1, Math.floor((y / GLYPH_H) * pal.stops.length))
    return pal.stops[Math.max(0, i)]
  }

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${vbW} ${vbH}`}
      width={vbW * px}
      height={vbH * px}
      className={className}
      style={{ maxWidth: "100%", height: "auto", display: "block", ...style }}
      shapeRendering="crispEdges"
      role="img"
      aria-label={text}
    >
      <g fill={pal.shadow}>
        {shadowRuns.map((r, i) => (
          <rect key={`s${i}`} x={r.x} y={r.y} width={r.w} height={1} />
        ))}
      </g>
      <g fill={pal.outline}>
        {outlineRuns.map((r, i) => (
          <rect key={`o${i}`} x={r.x} y={r.y} width={r.w} height={1} />
        ))}
      </g>
      <g>
        {fillRuns.map((r, i) => (
          <rect key={`f${i}`} x={r.x} y={r.y} width={r.w} height={1} fill={bandFor(r.y)} />
        ))}
      </g>
    </svg>
  )
}

export default memo(PixelText)
