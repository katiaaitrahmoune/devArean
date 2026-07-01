"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"
import MascotFox from "../components/MascotFox"

const TESTS = [
  { label: "Test 1 — basic pair",      status: "pass"    },
  { label: "Test 2 — negative values", status: "pass"    },
  { label: "Test 3 — duplicates",      status: "pass"    },
  { label: "Test 4 — large input",     status: "fail"    },
  { label: "Test 5 — no match",        status: "pending" },
]

const ABILITIES = [
  { id: "run",       label: "Run Tests",        cost: "No cost",      iconBg: "linear-gradient(160deg,#6fe6ec,#2bc7ce)" },
  { id: "submit",    label: "Submit Solution",  cost: "Locks attempt",iconBg: "linear-gradient(160deg,#94ec79,#6fd957)" },
  { id: "hint",      label: "Ask the Oracle",   cost: "20 XP",        iconBg: "linear-gradient(160deg,#c2a3f0,#9b6bd9)" },
  { id: "surrender", label: "Forfeit Round",    cost: "Rank loss",    iconBg: "linear-gradient(160deg,#ff8c97,#ff5d6c)" },
]

function IconBolt() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>
}
function IconCheck() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function IconFlame() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2c2 3-1 4-1 7a3 3 0 106 0c0-1 0-2-1-3 2 1 4 4 4 7a8 8 0 11-16 0c0-4 3-6 5-8 1-1 2-2 3-3z"/></svg>
}
function IconX() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function IconShield() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#1a9aa1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v5c0 5-3.5 9.7-8 11C7.5 20.7 4 16 4 11V6l8-4z"/></svg>
}
function IconSkull() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="#e0467f"><path d="M12 3a7 7 0 00-7 7c0 2.4 1.2 4.5 3 5.7V18h2v2h4v-2h2v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 00-7-7zM9 14h1.5v2H9v-2zm4.5 0H15v2h-1.5v-2z"/></svg>
}
function IconSmallCheck() {
  return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function IconSmallX() {
  return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function IconGem() {
  return <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6"/></svg>
}
function IconClock() {
  return <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
}
function IconSword() {
  return <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M16 2l6 6-7 7-6-6z"/></svg>
}

const ABILITY_ICONS: Record<string, JSX.Element> = {
  run: <IconBolt />, submit: <IconCheck />, hint: <IconFlame />, surrender: <IconX />,
}
const COST_ICONS: Record<string, JSX.Element> = {
  run: <IconClock />, submit: <IconSword />, hint: <IconGem />, surrender: <IconSkull />,
}

export default function BattlePage() {
  const [activeTab, setActiveTab] = useState("Description")

  return (
    <>
      <style>{`
        @keyframes lungeR {
          0%,60%,100% { transform: translateX(0) scaleX(-1) rotate(0deg); }
          75% { transform: translateX(-18px) scaleX(-1) rotate(-8deg); }
        }
        @keyframes lungeL {
          0%,60%,100% { transform: translateX(0) rotate(0deg); }
          75% { transform: translateX(18px) rotate(8deg); }
        }
        @keyframes shimmerMove { 0%{left:-60%} 100%{left:140%} }
        .lunge-left  { animation: lungeL 2.4s ease-in-out infinite; }
        .lunge-right { animation: lungeR 2.4s ease-in-out infinite; }
        .shimmer { position: relative; overflow: hidden; }
        .shimmer::after {
          content:''; position:absolute; top:0; left:-60%; width:40%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);
          animation: shimmerMove 2.2s linear infinite;
        }
      `}</style>

      <main className="relative min-h-screen">
        <Navbar active="Battle" />

        <div className="max-w-[1180px] mx-auto px-5 py-8">

          {/* battle-frame */}
          <div className="bg-white border-[3px] border-[#2d2150] rounded-[22px] shadow-[0_5px_0_rgba(45,33,80,0.12)] overflow-hidden">

            {/* battle-hud */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 border-b-[3px] border-[#2d2150]" style={{background:"linear-gradient(160deg,#e3f8ea,#fff)"}}>

              {/* hp-block left */}
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-2 font-extrabold text-[13px] text-[#2d2150]">
                  <IconShield /> katia_dev
                </div>
                <div className="w-full h-[13px] bg-white border-2 border-[#2d2150] rounded-[10px] relative overflow-hidden">
                  <div className="absolute inset-[1px] w-[60%] rounded-[8px]" style={{background:"linear-gradient(90deg,#6fe6ec,#2bc7ce)"}} />
                </div>
                <span className="font-mono font-semibold text-[11px] text-[#8a82ab]">3 / 5 tests passed</span>
              </div>

              {/* timer-block */}
              <div className="text-center">
                <div className="font-extrabold text-[30px] text-[#e8691b] tracking-[.02em] animate-pulse" style={{fontFamily:"var(--font-baloo, sans-serif)"}}>
                  04:32
                </div>
                <div className="font-bold text-[10.5px] uppercase text-[#8a82ab] tracking-wide">Round ends</div>
              </div>

              {/* hp-block right */}
              <div className="flex flex-col gap-[6px] items-end">
                <div className="flex flex-row-reverse items-center gap-2 font-extrabold text-[13px] text-[#2d2150]">
                  <IconSkull /> player2
                </div>
                <div className="w-full h-[13px] bg-white border-2 border-[#2d2150] rounded-[10px] relative overflow-hidden">
                  <div className="absolute inset-[1px] left-auto right-[1px] w-[35%] rounded-[8px]" style={{background:"linear-gradient(90deg,#ff6fa8,#ff95c1)"}} />
                </div>
                <span className="font-mono font-semibold text-[11px] text-[#8a82ab]">2 / 5 tests passed</span>
              </div>
            </div>

            {/* fighters-row */}
            <div className="flex justify-between items-center px-[30px] pt-2">
              <div className="lunge-left w-[80px] h-[80px]"><MascotFox size={80} /></div>
              <div className="lunge-right w-[80px] h-[80px]" style={{filter:"hue-rotate(150deg)"}}><MascotFox size={80} /></div>
            </div>

            {/* battle-main */}
            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] border-b-[3px] border-[#2d2150]">

              {/* editor */}
              <div className="bg-[#1c2333] border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#2d2150] min-h-[300px]">
                <div className="flex justify-between items-center px-4 py-[9px] border-b border-[#34405c] font-mono text-[11.5px] text-[#9aa6c4]">
                  <span className="text-[#2bc7ce]">JavaScript</span>
                  <span>main.js</span>
                </div>
                <div className="px-[18px] py-4 font-mono text-[13px] leading-[1.7] text-[#dbe2f5]">
                  {[
                    <><span className="text-[#5c6680] mr-4 select-none">1</span><span className="text-[#c9a3ff]">function</span>{" "}<span className="text-[#7fe3ea]">twoSum</span><span>(nums, target) {"{"}</span></>,
                    <><span className="text-[#5c6680] mr-4 select-none">2</span><span>&nbsp;&nbsp;</span><span className="text-[#c9a3ff]">const</span><span> seen = </span><span className="text-[#c9a3ff]">new</span><span> Map();</span></>,
                    <><span className="text-[#5c6680] mr-4 select-none">3</span><span>&nbsp;&nbsp;</span><span className="text-[#c9a3ff]">for</span><span> (</span><span className="text-[#c9a3ff]">let</span><span> i = </span><span className="text-[#ffd479]">0</span><span>; i &lt; nums.length; i++) {"{"}</span></>,
                    <><span className="text-[#5c6680] mr-4 select-none">4</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#c9a3ff]">const</span><span> need = target - nums[i];</span></>,
                    <><span className="text-[#5c6680] mr-4 select-none">5</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="text-[#c9a3ff]">if</span><span> (seen.has(need)) </span><span className="text-[#c9a3ff]">return</span><span> [seen.get(need), i];</span></>,
                    <><span className="text-[#5c6680] mr-4 select-none">6</span><span>&nbsp;&nbsp;&nbsp;&nbsp;seen.set(nums[i], i);</span></>,
                    <><span className="text-[#5c6680] mr-4 select-none">7</span><span>&nbsp;&nbsp;{"}"}</span></>,
                    <><span className="text-[#5c6680] mr-4 select-none">8</span><span>&nbsp;&nbsp;</span><span className="text-[#5c6680]">{"// O(n) — single pass"}</span></>,
                    <><span className="text-[#5c6680] mr-4 select-none">9</span><span>{"}"}</span></>,
                  ].map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>

              {/* problem-pane */}
              <div className="bg-white px-5 py-[18px]">
                {/* ptabs */}
                <div className="flex gap-[18px] mb-4 border-b-2 border-[#8a82ab]/30">
                  {["Description", "Tests", "Opponent"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`font-extrabold text-[12px] pb-[10px] border-b-[3px] transition-colors ${activeTab === tab ? "text-[#e8691b] border-[#ff8a3d]" : "text-[#8a82ab] border-transparent"}`}>
                      {tab}
                    </button>
                  ))}
                </div>
                <h3 className="font-extrabold text-[16px] text-[#2d2150] mb-[10px]">Two Sum</h3>
                <p className="text-[13px] text-[#5b5180] leading-[1.6] font-semibold mb-4">
                  Given an array of integers and a target, return the indices of the two numbers that add up to target. Assume exactly one solution exists.
                </p>
                {/* divider-rune */}
                <div className="h-[3px] rounded-[3px] my-4 opacity-35" style={{background:"repeating-linear-gradient(90deg,#8a82ab 0 8px,transparent 8px 16px)"}} />
                {/* test rows */}
                {TESTS.map((t, i) => (
                  <div key={t.label} className={`flex justify-between items-center py-[9px] font-bold text-[12.5px] text-[#2d2150] ${i < TESTS.length - 1 ? "border-b-2 border-dashed border-[#e5dcc8]" : ""}`}>
                    <span>{t.label}</span>
                    {t.status === "pass"    && <span className="flex items-center gap-1 text-[#48b830]"><IconSmallCheck /> Passed</span>}
                    {t.status === "fail"    && <span className="flex items-center gap-1 text-[#e23a4c]"><IconSmallX /> Failed</span>}
                    {t.status === "pending" && <span className="text-[#8a82ab]">Pending</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* ability-row */}
            <div className="flex gap-3 px-5 py-[18px] bg-[#fff8ec] flex-wrap">
              {ABILITIES.map((ab) => (
                <button key={ab.id} className={`flex-1 min-w-[130px] flex flex-col gap-2 p-[14px] bg-white border-[2.5px] border-[#2d2150] rounded-[16px] shadow-[0_4px_0_#8a82ab] hover:-translate-y-0.5 transition-all text-left cursor-pointer ${ab.id === "run" ? "shimmer" : ""}`}>
                  <div className="w-[28px] h-[28px] rounded-[10px] grid place-items-center text-white" style={{background: ab.iconBg}}>
                    {ABILITY_ICONS[ab.id]}
                  </div>
                  <h4 className="font-extrabold text-[12.5px] text-[#2d2150]">{ab.label}</h4>
                  <span className="flex items-center gap-[5px] font-mono text-[11px] text-[#8a82ab] font-semibold mt-auto">
                    {COST_ICONS[ab.id]} {ab.cost}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </main>
    </>
  )
}