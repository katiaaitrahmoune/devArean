// app/components/battle/PixelHud.tsx
"use client"

// Pixel-art HUD pieces in the style of the heart / lightning bars reference:
// segmented bars in a blue frame, plus small sprites drawn from bitmaps.

import { useEffect, useRef, useState, type CSSProperties } from "react"

// ── sprites ──────────────────────────────────────────────────────────────────
export type SpriteDef = { rows: string[]; palette: Record<string, string> }

export const HEART: SpriteDef = {
  rows: [
    "..dddd..dddd..",
    ".dRRRRddRRRRd.",
    "dRWWRRRRRRRRRd",
    "dRWRRRRRRRRRRd",
    "dRRRRRRRRRRRRd",
    ".dRRRRRRRRRRd.",
    "..dRrRRRRRrd..",
    "...dRrrrrRd...",
    "....dRrrRd....",
    ".....dRRd.....",
    "......dd......",
  ],
  palette: { d: "#6e0b16", R: "#e8283f", r: "#b3121f", W: "#ff9aa8" },
}

export const BOLT: SpriteDef = {
  rows: [
    "......dddd..",
    ".....dYWYYd.",
    "....dYWYYd..",
    "...dYWYYd...",
    "..dYWYYd....",
    ".dYWYYYYYdd.",
    "dYYYYYYYYYYd",
    ".ddddYYYYYd.",
    ".....dYYYd..",
    "....dYYYd...",
    "...dYYYd....",
    "..dYYYd.....",
    "..dYYd......",
    ".dYd........",
    ".dd.........",
  ],
  palette: { d: "#7a4300", Y: "#ffc21a", W: "#fff7b0" },
}

export const TROPHY: SpriteDef = {
  rows: [
    "..dddddddddddd..",
    ".dYYWYYYYYYYYYd.",
    "dYdYWYYYYYYYYdYd",
    "dYdYWYYYYYYYYdYd",
    "dYdYYYYYYYYYYdYd",
    ".ddYYYYYYYYYYdd.",
    "..dYYYYYYYYYYd..",
    "...dYYYYYYYYd...",
    "....dYYYYYYd....",
    ".....dYYYYd.....",
    "......dYYd......",
    "......dYYd......",
    ".....dYYYYd.....",
    "....dOOOOOOd....",
    "....dddddddd....",
  ],
  palette: { d: "#7a4300", Y: "#ffc21a", W: "#fff7b0", O: "#e08a00" },
}

export const SKULL: SpriteDef = {
  rows: [
    "..dddddddd..",
    ".dWWWWWWWWd.",
    "dWWWWWWWWWWd",
    "dWWkkWWkkWWd",
    "dWWkkWWkkWWd",
    "dWWWWddWWWWd",
    ".dWWWWWWWWd.",
    "..dWWWWWWd..",
    "..dWdWdWdWd.",
    "..dddddddd..",
  ],
  palette: { d: "#14183b", W: "#e9ecf5", k: "#14183b" },
}

export function PixelSprite({
  sprite,
  px = 4,
  className,
  style,
}: {
  sprite: SpriteDef
  px?: number
  className?: string
  style?: CSSProperties
}) {
  const h = sprite.rows.length
  const w = sprite.rows[0].length
  const rects: React.ReactNode[] = []
  sprite.rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const c = row[x]
      if (c === ".") {
        x++
        continue
      }
      let run = 1
      while (x + run < row.length && row[x + run] === c) run++
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={sprite.palette[c] ?? "#f0f"} />)
      x += run
    }
  })
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * px}
      height={h * px}
      className={className}
      style={{ display: "block", ...style }}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  )
}

// ── segmented bar ────────────────────────────────────────────────────────────
type BarKind = "hp" | "energy"

const KINDS: Record<BarKind, { inner: string; empty: string; light: string; main: string; dark: string; edge: string }> = {
  hp: { inner: "#4d0a14", empty: "#2c0509", light: "#ff8598", main: "#e8283f", dark: "#b3121f", edge: "#ff1a1a" },
  energy: { inner: "#4a2705", empty: "#2b1503", light: "#ffe873", main: "#f3b90a", dark: "#c98400", edge: "#9a5f00" },
}
const FRAME = { outer: "#0a5f96", hi: "#8fd0f2", mid: "#2f8fc9" }

const BAR_W = 132
const BAR_H = 24
const BORDER = 3
const PAD = 3
const GAP = 2

export function PixelBar({
  segments,
  filled,
  kind = "hp",
  flip = false,
  className,
  style,
}: {
  segments: number
  /** how many segments are lit */
  filled: number
  kind?: BarKind
  /** fill from the right (for the right-hand player) */
  flip?: boolean
  className?: string
  style?: CSSProperties
}) {
  const n = Math.max(1, segments)
  const lit = Math.min(n, Math.max(0, Math.round(filled)))
  const c = KINDS[kind]

  // shake + flash whenever the bar loses a segment
  const prev = useRef(lit)
  const [hit, setHit] = useState(0)
  useEffect(() => {
    if (lit < prev.current) {
      setHit((h) => h + 1)
      const t = setTimeout(() => setHit(0), 520)
      prev.current = lit
      return () => clearTimeout(t)
    }
    prev.current = lit
  }, [lit])

  const innerX = BORDER + PAD
  const innerW = BAR_W - innerX * 2
  const segH = BAR_H - innerX * 2
  const segW = (innerW - (n - 1) * GAP) / n

  return (
    <svg
      key={hit ? "hit" : "idle"}
      viewBox={`0 0 ${BAR_W} ${BAR_H}`}
      className={`${className ?? ""} ${hit ? "fx-bar-hit" : ""}`}
      style={{ display: "block", width: "100%", height: "auto", ...style }}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`${lit} of ${n}`}
    >
      {/* frame with clipped corners */}
      <rect x={2} y={0} width={BAR_W - 4} height={BAR_H} fill={FRAME.outer} />
      <rect x={0} y={2} width={BAR_W} height={BAR_H - 4} fill={FRAME.outer} />
      <rect x={3} y={1} width={BAR_W - 6} height={2} fill={FRAME.hi} />
      <rect x={1} y={3} width={2} height={BAR_H - 6} fill={FRAME.hi} />
      <rect x={3} y={BAR_H - 3} width={BAR_W - 6} height={2} fill={FRAME.mid} />
      <rect x={BORDER} y={BORDER} width={BAR_W - BORDER * 2} height={BAR_H - BORDER * 2} fill={c.inner} />

      {Array.from({ length: n }, (_, i) => {
        const x = innerX + i * (segW + GAP)
        const isLit = flip ? i >= n - lit : i < lit
        if (!isLit) {
          return (
            <g key={i}>
              <rect x={x} y={innerX} width={segW} height={segH} fill={c.empty} />
              <rect x={x} y={innerX} width={segW} height={1} fill="#000" opacity={0.35} />
            </g>
          )
        }
        return (
          <g key={i}>
            <rect x={x} y={innerX} width={segW} height={segH} fill={c.main} />
            <rect x={x} y={innerX} width={segW} height={3} fill={c.light} />
            <rect x={x} y={innerX + segH - 5} width={segW} height={3} fill={c.dark} />
            <rect x={x} y={innerX + segH - 2} width={segW} height={2} fill={c.edge} />
          </g>
        )
      })}
    </svg>
  )
}
