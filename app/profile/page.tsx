"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"
import MascotFox from "../components/MascotFox"

// ── Heatmap — 26 semaines × 7 jours ─────────────────────────────────────────
// Generé côté client pour éviter erreur d'hydratation (Math.random)
function Heatmap() {
  const cells = Array.from({ length: 26 * 7 }, (_, i) => {
    const r = Math.random()
    if (r > 0.85) return "l4"
    if (r > 0.65) return "l3"
    if (r > 0.45) return "l2"
    if (r > 0.25) return "l1"
    return ""
  })
  const COLOR: Record<string, string> = {
    "":   "#ece3cf",
    "l1": "#cdeec0",
    "l2": "#a0e08a",
    "l3": "#73cc56",
    "l4": "#48b830",
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(26,1fr)", gap: "3px" }}>
      {cells.map((lvl, i) => (
        <span key={i} style={{ display: "block", aspectRatio: "1", background: COLOR[lvl], borderRadius: "3px" }} />
      ))}
    </div>
  )
}

// ── Stat plates ───────────────────────────────────────────────────────────────
const STATS = [
  { label: "Uptime",      num: "99.8%", cls: "health",  iconBg: "linear-gradient(160deg,#ff8c97,#ff5d6c)",  icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{color:"#fff"}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { label: "Solve Speed", num: "1,478", cls: "speed",   iconBg: "linear-gradient(160deg,#6fe6ec,#2bc7ce)",  icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M16 2l6 6-7 7-6-6z"/></svg> },
  { label: "Bug Resist",  num: "1,311", cls: "defense", iconBg: "linear-gradient(160deg,#7fc1f0,#378add)",  icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v5c0 5-3.5 9.7-8 11C7.5 20.7 4 16 4 11V6l8-4z"/></svg> },
  { label: "AI Power",    num: "1,350", cls: "ai",      iconBg: "linear-gradient(160deg,#c2a3f0,#9b6bd9)",  icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{color:"#fff"}}><path d="M12 2c2 3-1 4-1 7a3 3 0 106 0c0-1 0-2-1-3 2 1 4 4 4 7a8 8 0 11-16 0c0-4 3-6 5-8 1-1 2-2 3-3z"/></svg> },
]

// ── Gear left col (rank badges) ───────────────────────────────────────────────
const GEAR_LEFT = [
  { legendary: true,  rank: "3", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { legendary: false, rank: "1", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> },
  { legendary: false, rank: "1", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg> },
  { legendary: false, rank: "2", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v5c0 5-3.5 9.7-8 11C7.5 20.7 4 16 4 11V6l8-4z"/></svg> },
]

// ── Gear right col (pips) ─────────────────────────────────────────────────────
const GEAR_RIGHT = [
  { pips: [true,true,false],   icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6"/></svg> },
  { pips: [true,false,false],  icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2c2 3-1 4-1 7a3 3 0 106 0c0-1 0-2-1-3 2 1 4 4 4 7a8 8 0 11-16 0c0-4 3-6 5-8 1-1 2-2 3-3z"/></svg> },
  { pips: [true,true,true],    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5-1.3 2.5-3 2.5-3 1.1-3 2.5 1.3 2.5 3 2.5 3-1.1 3-2.5"/></svg> },
  { pips: [false,false,false], icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 3a7 7 0 00-7 7c0 2.4 1.2 4.5 3 5.7V18h2v2h4v-2h2v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 00-7-7zM9 14h1.5v2H9v-2zm4.5 0H15v2h-1.5v-2z"/></svg> },
]

const TABS = ["Languages", "Tool Belt", "Achievements", "Battle History", "Activity"]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Languages")

  return (
    <main className="relative min-h-screen">
      <Navbar active="Hero" />

      <div className="max-w-[1180px] mx-auto px-5 py-8">

        {/* ── hero-stat-bar — flex, gap 10px, margin-bottom 20px ── */}
        <div className="flex gap-[10px] flex-wrap mb-5">
          {STATS.map((s) => (
            <div key={s.label} className="flex-1 min-w-[120px] flex items-center gap-3 p-[14px] bg-white border-[3px] border-[#2d2150] rounded-[18px] shadow-[0_5px_0_rgba(45,33,80,0.12)]">
              {/* .si — 30x30, radius 10px */}
              <div className="w-[30px] h-[30px] rounded-[10px] grid place-items-center flex-shrink-0" style={{background: s.iconBg}}>
                {s.icon}
              </div>
              <div>
                <div className="font-extrabold text-[19px] leading-none text-[#2d2150]">{s.num}</div>
                <div className="font-bold text-[10.5px] uppercase text-[#8a82ab] mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── hero-main — grid 160px / 1fr / 160px ── */}
        <div className="grid grid-cols-[160px_1fr_160px] border-[3px] border-[#2d2150] rounded-[22px] overflow-hidden shadow-[0_5px_0_rgba(45,33,80,0.12)] min-h-[400px]" style={{background:"linear-gradient(160deg,#e3f8ea,#fff)"}}>

          {/* Gear col left — rank badges */}
          <div className="flex flex-col gap-[14px] p-[18px_14px]">
            {GEAR_LEFT.map((g, i) => (
              <div key={i} className={`relative w-full aspect-square grid place-items-center border-[2.5px] rounded-[14px] ${g.legendary ? "border-[#9b6bd9] bg-gradient-to-br from-[#f1e6fc] to-white text-[#7148b0]" : "border-[#2d2150] bg-white text-[#5b5180]"}`}>
                {g.icon}
                {/* .rank — absolute bottom-left, 21x21, gold */}
                <div className="absolute -bottom-[7px] -left-[7px] w-[21px] h-[21px] rounded-full grid place-items-center font-extrabold text-[10px] text-[#4a3304] border-2 border-[#2d2150] z-10" style={{background:"linear-gradient(160deg,#ffdb85,#ffc94d)"}}>
                  {g.rank}
                </div>
              </div>
            ))}
          </div>

          {/* Hero center */}
          <div className="flex flex-col items-center justify-end px-[10px] pb-4 pt-[18px] relative">
            <div className="w-[150px] h-[150px]">
              <MascotFox size={150} />
            </div>
            {/* .hero-name — font-display, 21px, 800 */}
            <div className="font-extrabold text-[21px] text-[#2d2150] mt-[6px] tracking-tight">KATIA_DEV</div>
            {/* .hero-title — 11.5px, uppercase, orange-dark */}
            <div className="font-bold text-[11.5px] uppercase text-[#e8691b] mt-1 tracking-wide">Algo Knight · Level 18</div>
            {/* .rating-box */}
            <div className="mt-[14px] text-center">
              <div className="font-bold text-[10.5px] uppercase text-[#8a82ab] tracking-wide">Rating</div>
              <div className="font-extrabold text-[28px] text-[#7148b0] leading-none">1,842</div>
            </div>
          </div>

          {/* Gear col right — pips */}
          <div className="flex flex-col gap-[14px] p-[18px_14px]">
            {GEAR_RIGHT.map((g, i) => (
              <div key={i} className="relative w-full aspect-square grid place-items-center border-[2.5px] border-[#2d2150] rounded-[14px] bg-white text-[#5b5180]">
                {g.icon}
                {/* .pips — absolute bottom 5px, centered */}
                <div className="absolute bottom-[5px] left-0 right-0 flex justify-center gap-[3px]">
                  {g.pips.map((on, j) => (
                    <span key={j} className="w-[5px] h-[5px] rounded-full block" style={{background: on ? "#e8a623" : "#e5dcc8"}} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── hero-tabs — attached to bottom of hero-main ── */}
        {/* border-top 3px, bg white, radius 0 0 17px 17px */}
        <div className="flex bg-white border-[3px] border-t-0 border-[#2d2150] rounded-[0_0_17px_17px] overflow-hidden -mt-px shadow-[0_5px_0_rgba(45,33,80,0.12)]">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-[13px] font-extrabold text-[11px] transition-colors
                ${i < TABS.length - 1 ? "border-r-2 border-[#ece3cf]" : ""}
                ${activeTab === tab ? "text-[#e8691b] bg-[#fff1d0]" : "text-[#8a82ab] hover:bg-[#fff8ec]"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── analytics-row — grid 3 cols ── */}
        <div className="grid grid-cols-3 gap-[14px] mt-5">
          {[
            { num: "42",   lbl: "Wins",     color: "#48b830" },
            { num: "87%",  lbl: "Win Rate", color: "#1a9aa1" },
            { num: "1.2k", lbl: "XP",       color: "#e8a623" },
          ].map((c) => (
            <div key={c.lbl} className="bg-white border-[3px] border-[#2d2150] rounded-[18px] shadow-[0_5px_0_rgba(45,33,80,0.12)] p-[18px] text-center">
              <div className="font-extrabold text-[27px] leading-none" style={{color: c.color}}>{c.num}</div>
              <div className="font-bold text-[11px] uppercase text-[#8a82ab] mt-1">{c.lbl}</div>
            </div>
          ))}
        </div>

        {/* ── heatmap-wrap ── */}
        <div className="bg-white border-[3px] border-[#2d2150] rounded-[18px] shadow-[0_5px_0_rgba(45,33,80,0.12)] p-5 mt-[18px]">
          <h3 className="font-extrabold text-[13px] text-[#5b5180] mb-[14px]">Activity — last 26 weeks</h3>
          <Heatmap />
        </div>

      </div>
    </main>
  )
}