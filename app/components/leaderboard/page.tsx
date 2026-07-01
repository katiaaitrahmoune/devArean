// app/leaderboard/page.tsx
// Page statique — données mockées.
// Quand le backend sera prêt, on remplacera MOCK_ROWS par un fetch("/api/leaderboard")
// Pas de "use client" — aucun état, rendu côté serveur = plus rapide

import Navbar from "../components/Navbar"

// ── Données mockées ──────────────────────────────────────────────────────────
// Plus tard : const data = await fetch("/api/leaderboard").then(r => r.json())
const PODIUM = [
  { rank: 2, name: "codemaster", xp: "8,210 XP", type: "silver" },
  { rank: 1, name: "katia_dev",  xp: "9,840 XP", type: "gold"   },
  { rank: 3, name: "algo_queen", xp: "7,550 XP", type: "bronze" },
]

const ROWS = [
  { rank: 4, name: "dev_hunter",      lang: "Go",     xp: "6,900" },
  { rank: 5, name: "stack_overflower",lang: "Python",  xp: "6,410" },
  { rank: 6, name: "recursion_witch", lang: "Rust",    xp: "6,055" },
  { rank: 7, name: "null_pointer",    lang: "C++",     xp: "5,820" },
  { rank: 8, name: "byte_bishop",     lang: "JS",      xp: "5,490" },
]

// ── Medal styles par type ─────────────────────────────────────────────────────
const MEDAL: Record<string, { medal: string; card: string; text: string; pt: string }> = {
  gold:   { medal: "bg-gradient-to-br from-[#ffe9a8] to-[#ffc94d] text-[#4a3304]", card: "border-[#e8a623]", text: "#4a3304", pt: "pt-[26px]" },
  silver: { medal: "bg-gradient-to-br from-[#eef1f7] to-[#c3cad9] text-[#1a1f2c]", card: "border-[#2d2150]", text: "#1a1f2c", pt: "" },
  bronze: { medal: "bg-gradient-to-br from-[#e8b888] to-[#bd824f] text-[#3a1f08]", card: "border-[#2d2150]", text: "#3a1f08", pt: "" },
}

export default function LeaderboardPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar active="Rankings" />

      <div className="max-w-[1180px] mx-auto px-5 py-8">

        {/* ── Filtres Weekly / Monthly / All-Time ── */}
        {/* .lb-filters — flex, gap:8px, margin-bottom:18px */}
        <div className="flex gap-2 mb-[18px]">
          {["Weekly", "Monthly", "All-Time"].map((label) => (
            <button
              key={label}
              className={`px-4 py-2 font-extrabold text-[11.5px] border-[2.5px] rounded-full transition-colors
                ${label === "Weekly"
                  ? "text-[#e8691b] border-[#ff8a3d] bg-[#fff1d0]"
                  : "text-[#8a82ab] border-[#2d2150] bg-white hover:bg-[#fff8ec]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Podium ── */}
        {/* .podium — grid 3 cols, gold au centre + plus haut (padding-top:26px) */}
        {/* Mobile : 1 colonne */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr_1fr] gap-3 mb-[18px] items-end">
          {PODIUM.map((p) => {
            const m = MEDAL[p.type]
            return (
              <div
                key={p.name}
                className={`bg-white border-[3px] ${m.card} rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] px-[14px] pb-[18px] text-center ${m.pt}`}
              >
                {/* .medal — 40x40, border-radius:50%, font-size:15px */}
                <div className={`w-10 h-10 rounded-full ${m.medal} border-[2.5px] border-[#2d2150] grid place-items-center mx-auto mb-[10px] font-extrabold text-[15px]`}>
                  {p.rank}
                </div>
                {/* .nm — font-display, 14px, bold */}
                <div className="font-extrabold text-[14px] text-[#2d2150] mb-1">{p.name}</div>
                {/* .xp — font-mono, 12px, orange-dark */}
                <div className="font-mono text-[12px] font-bold text-[#e8691b]">{p.xp}</div>
              </div>
            )
          })}
        </div>

        {/* ── Rows 4–8 ── */}
        {/* .panel.white — bg white, border 3px, radius 20px, shadow */}
        <div className="bg-white border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] overflow-hidden">
          {ROWS.map((row, i) => (
            <div
              key={row.rank}
              // .lb-row — grid 3 cols (36px 1fr auto), gap:14px, padding:13px 16px
              // border-bottom: 2px dashed #e5dcc8 sauf le dernier
              // hover: background:#fff1d0
              className={`grid grid-cols-[36px_1fr_auto] items-center gap-[14px] px-4 py-[13px] hover:bg-[#fff1d0] transition-colors
                ${i < ROWS.length - 1 ? "border-b-2 border-dashed border-[#e5dcc8]" : ""}`}
            >
              {/* .rk — font-display, 13px, ink-faint */}
              <span className="font-extrabold text-[13px] text-[#8a82ab]">{row.rank}</span>

              {/* .nm + .lang-tag */}
              <span className="font-extrabold text-[13px] text-[#2d2150]">
                {row.name}
                <span className="font-mono text-[10.5px] text-[#8a82ab] ml-2">{row.lang}</span>
              </span>

              {/* .xp — font-mono, orange-dark */}
              <span className="font-mono font-bold text-[13px] text-[#e8691b]">{row.xp}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}