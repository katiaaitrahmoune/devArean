// app/components/battle/fx.tsx
// Visual effect primitives for the versus / KO / result screens.
// All randomness is seeded so server and client render identical markup.

import type { CSSProperties } from "react"

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Manga speed lines radiating from the centre (the comic "VS" reference). */
export function SpeedLines({
  color = "#1c1a3a",
  count = 110,
  inner = 32,
  opacity = 0.9,
  seed = 7,
  className,
  style,
}: {
  color?: string
  count?: number
  inner?: number
  opacity?: number
  seed?: number
  className?: string
  style?: CSSProperties
}) {
  const rand = rng(seed)
  const R1 = 170
  const polys: string[] = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.05
    const r0 = inner + rand() * 30
    const w = (0.5 + rand() * 2.4) / R1 * (rand() > 0.85 ? 2.2 : 1)
    const p = (r: number, ang: number) => `${(r * Math.cos(ang)).toFixed(2)},${(r * Math.sin(ang)).toFixed(2)}`
    polys.push(`${p(r0, a)} ${p(R1, a - w)} ${p(R1, a + w)}`)
  }
  return (
    <svg
      viewBox="-100 -100 200 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      aria-hidden="true"
    >
      <g fill={color} opacity={opacity}>
        {polys.map((pts, i) => (
          <polygon key={i} points={pts} />
        ))}
      </g>
    </svg>
  )
}

/** The comic explosion behind the VS. */
export function Starburst({ className, style, seed = 3 }: { className?: string; style?: CSSProperties; seed?: number }) {
  const rand = rng(seed)
  const N = 16
  const pts = (rOut: number, rIn: number, jitter: number) =>
    Array.from({ length: N * 2 }, (_, i) => {
      const a = (i / (N * 2)) * Math.PI * 2 - Math.PI / 2
      const r = i % 2 === 0 ? rOut - rand() * jitter : rIn + rand() * jitter * 0.6
      return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`
    }).join(" ")
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <polygon points={pts(49, 33, 7)} fill="#14183b" transform="translate(2 3)" />
      <polygon points={pts(48, 32, 7)} fill="#14183b" />
      <polygon points={pts(45, 30, 7)} fill="#ff9d1f" />
      <polygon points={pts(37, 25, 5)} fill="#ffd21f" />
    </svg>
  )
}

/** Vertical comic lightning bolt splitting the screen. */
export function LightningBolt({ className, style }: { className?: string; style?: CSSProperties }) {
  const d = "M62 0 L34 118 L58 122 L24 250 L52 254 L30 400 L84 206 L58 202 L92 96 L70 92 L98 0 Z"
  return (
    <svg viewBox="0 0 120 400" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path d={d} fill="#14183b" transform="translate(4 3)" stroke="#14183b" strokeWidth={9} strokeLinejoin="miter" />
      <path d={d} fill="#ffd21f" stroke="#14183b" strokeWidth={5} strokeLinejoin="miter" />
      <path d="M66 10 L44 112 L64 116 L40 214" fill="none" stroke="#fff7b0" strokeWidth={4} strokeLinecap="square" />
    </svg>
  )
}

/** Little pixel squares bursting outwards. Mount it to fire it. */
export function Sparks({
  count = 22,
  colors = ["#ffd21f", "#ff8a00", "#ffffff", "#ff4d5e"],
  radius = 300,
  size = 12,
  seed = 11,
  delay = 0,
}: {
  count?: number
  colors?: string[]
  radius?: number
  size?: number
  seed?: number
  delay?: number
}) {
  const rand = rng(seed)
  return (
    <div className="absolute left-1/2 top-1/2 w-0 h-0 pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const a = rand() * Math.PI * 2
        const d = radius * (0.35 + rand() * 0.65)
        const s = Math.round(size * (0.5 + rand()))
        const style = {
          width: s,
          height: s,
          marginLeft: -s / 2,
          marginTop: -s / 2,
          background: colors[i % colors.length],
          "--dx": `${(Math.cos(a) * d).toFixed(0)}px`,
          "--dy": `${(Math.sin(a) * d).toFixed(0)}px`,
          "--rot": `${Math.round(rand() * 540 - 270)}deg`,
          opacity: 0,
          animation: `fxSpark ${0.7 + rand() * 0.6}s cubic-bezier(.15,.7,.3,1) ${delay + rand() * 0.12}s forwards`,
        } as CSSProperties
        return <span key={i} data-fx className="absolute block" style={style} />
      })}
    </div>
  )
}

/** Expanding shockwave ring. */
export function ShockRing({
  color = "#ffffff",
  size = 320,
  delay = 0,
  duration = 0.9,
}: {
  color?: string
  size?: number
  delay?: number
  duration?: number
}) {
  return (
    <span
      data-fx
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 rounded-full border-solid pointer-events-none"
      style={{
        width: size,
        height: size,
        borderColor: color,
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0.15)",
        animation: `fxRing ${duration}s cubic-bezier(.1,.6,.3,1) ${delay}s forwards`,
      }}
    />
  )
}

/** Falling confetti for the winner. */
export function Confetti({ count = 60, seed = 5 }: { count?: number; seed?: number }) {
  const rand = rng(seed)
  const colors = ["#ffd21f", "#ff6fa8", "#2bc7ce", "#94ec79", "#ff8a3d", "#9b6bd9", "#ffffff"]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const w = 8 + Math.round(rand() * 10)
        const style = {
          left: `${(rand() * 100).toFixed(1)}%`,
          top: 0,
          width: w,
          height: Math.round(w * (0.6 + rand() * 0.9)),
          background: colors[i % colors.length],
          "--drift": `${Math.round(rand() * 160 - 80)}px`,
          "--spin": `${Math.round(360 + rand() * 720)}deg`,
          animation: `fxConfetti ${3.2 + rand() * 2.8}s linear ${(rand() * 4).toFixed(2)}s infinite`,
        } as CSSProperties
        return <span key={i} data-fx className="absolute block" style={style} />
      })}
    </div>
  )
}
