// app/components/battle/ResultOverlay.tsx
"use client"

// The ending:  K.O.! slam (shake, flash, shockwaves)  →  winner reveal
//   win   → VICTORY  (gold rays, confetti, trophy)
//   loss  → GAME OVER (skull, drained health bar, blinking CONTINUE?)
//   draw  → DRAW
// If the page is opened AFTER the battle ended we skip straight to the reveal.

import { memo, useEffect, useState } from "react"
import PixelText from "./PixelText"
import { PixelBar, PixelSprite, BOLT, SKULL, TROPHY } from "./PixelHud"
import { Confetti, ShockRing, Sparks, SpeedLines } from "./fx"
import { avatarColor } from "./PreBattleOverlay"
import type { BattlePlayer, BattleResult, BattleResultPlayer } from "../../../lib/battle-types"

export const KO_MS = 2100

const REASON_TEXT: Record<BattleResult["reason"], string> = {
  solved: "First to pass every test takes the win!",
  both_submitted: "Both solutions locked in — the higher score wins.",
  time_up: "Time ran out — the higher score wins.",
  finished: "Battle finished.",
}

function ScoreCard({
  p,
  info,
  opponent,
  total,
  isWinner,
  isMe,
  delay,
}: {
  p: BattleResultPlayer
  info: BattlePlayer | null
  opponent: BattleResultPlayer | undefined
  total: number
  isWinner: boolean
  isMe: boolean
  delay: number
}) {
  const hp = Math.max(0, total - (opponent?.tests_passed ?? 0)) // their passing tests are damage dealt to you
  return (
    <div
      data-fx
      className={`relative w-[min(44vw,290px)] p-3.5 border-[4px] text-left ${
        isWinner ? "bg-[#fff6d6] border-[#ffc21a] shadow-[0_0_0_4px_#14183b,0_0_28px_rgba(255,210,31,.55)]" : "bg-white/95 border-[#14183b]"
      }`}
      style={{ animation: `fxRise .5s cubic-bezier(.2,.9,.3,1) ${delay}s both` }}
    >
      {isWinner && (
        <span className="absolute -top-3.5 left-3 px-2 py-0.5 bg-[#ffc21a] border-[3px] border-[#14183b] font-extrabold text-[11px] text-[#14183b] -rotate-2">
          WINNER
        </span>
      )}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className="w-9 h-9 grid place-items-center font-extrabold text-white border-[3px] border-[#14183b]"
          style={{ background: avatarColor(p.username) }}
        >
          {p.username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-[14px] text-[#14183b] truncate">
            {p.username}
            {isMe ? " (you)" : ""}
          </div>
          <div className="font-bold text-[10.5px] text-[#5b5180]">LV {info?.level ?? 1}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[10px] font-extrabold text-[#e8283f]">HP</span>
        <PixelBar segments={total} filled={hp} kind="hp" />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 font-mono font-bold text-[11.5px] text-[#14183b]">
        <span>
          {p.tests_passed}/{p.tests_total} tests
        </span>
        <span className="flex items-center gap-1 text-[#b06f00]">
          <PixelSprite sprite={BOLT} px={1.6} />+{p.xp_gain} XP
        </span>
      </div>
      {!p.submitted && <div className="mt-1 font-semibold text-[10.5px] text-[#8a82ab]">did not lock in a solution</div>}
    </div>
  )
}


/** Full-screen slam: shake, flash, shockwaves. Also used by the page for "TIME!". */
export function KoSlam({ text, subtitle }: { text: string; subtitle?: string }) {
  return (
    <div className="fixed inset-0 z-[80] overflow-hidden fx-shake-long" style={{ background: "#fff3c4" }} role="status" aria-live="assertive">
      <div className="absolute inset-0" data-fx style={{ animation: "fxLinesPulse .5s ease-in-out infinite" }}>
        <SpeedLines seed={19} inner={20} />
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div data-fx style={{ animation: "fxSlamIn .55s cubic-bezier(.2,.9,.3,1) both" }}>
          <PixelText text={text} px={24} palette="fire" style={{ width: "min(80vw, 640px)" }} />
        </div>
        <div className="absolute left-1/2 top-1/2">
          <ShockRing color="#ffffff" size={420} />
          <ShockRing color="#ff4d5e" size={420} delay={0.14} />
          <Sparks count={34} radius={460} />
        </div>
      </div>
      {subtitle && (
        <div className="absolute bottom-[12%] left-0 right-0 text-center">
          <span className="inline-block px-5 py-2 bg-[#14183b] font-extrabold text-[15px] text-white border-[3px] border-[#14183b] shadow-[4px_4px_0_rgba(20,24,59,.35)]">
            {subtitle}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-white pointer-events-none" data-fx style={{ animation: "fxFlash .6s forwards", opacity: 0 }} />
    </div>
  )
}

type Props = {
  result: BattleResult
  role: "player1" | "player2" | "spectator"
  meId: string | null
  p1: BattlePlayer | null
  p2: BattlePlayer | null
  totalTests: number
  animate: boolean
  onRematch: () => void
  rematching: boolean
  rematchError: string | null
}

function ResultOverlay({ result, role, meId, p1, p2, totalTests, animate, onRematch, rematching, rematchError }: Props) {
  const [stage, setStage] = useState<"ko" | "reveal">(animate ? "ko" : "reveal")

  useEffect(() => {
    if (!animate) return
    const t = setTimeout(() => setStage("reveal"), KO_MS)
    return () => clearTimeout(t)
  }, [animate])

  const isSpectator = role === "spectator"
  const outcome: "win" | "loss" | "draw" | "watch" = result.draw
    ? "draw"
    : isSpectator
      ? "watch"
      : result.winner_id === meId
        ? "win"
        : "loss"

  const winner = result.players.find((p) => p.user_id === result.winner_id)
  const infoFor = (id: string) => (p1?.id === id ? p1 : p2?.id === id ? p2 : null)
  // me first (if I'm playing), otherwise player 1 first
  const ordered = [...result.players].sort((a, b) =>
    a.user_id === meId ? -1 : b.user_id === meId ? 1 : a.user_id === p1?.id ? -1 : 1
  )

  // ── K.O. slam ──────────────────────────────────────────────────────────────
  if (stage === "ko") {
    return <KoSlam text={result.reason === "time_up" ? "TIME!" : "K.O.!"} />
  }

  // ── reveal ─────────────────────────────────────────────────────────────────
  const bg =
    outcome === "win"
      ? "radial-gradient(ellipse at 50% 35%, #2a2f6b 0%, #14183b 70%)"
      : outcome === "loss"
        ? "radial-gradient(ellipse at 50% 30%, #4a1020 0%, #14040a 75%)"
        : "radial-gradient(ellipse at 50% 35%, #2a3050 0%, #12162e 75%)"

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto" style={{ background: bg, animation: "fxFadeIn .4s both" }} role="dialog" aria-label="Battle result">
      {outcome === "win" && (
        <>
          <div
            data-fx
            className="absolute left-1/2 top-[30%] w-[160vmax] h-[160vmax] -ml-[80vmax] -mt-[80vmax] pointer-events-none"
            style={{
              background: "repeating-conic-gradient(from 0deg, rgba(255,210,31,.2) 0 7deg, transparent 7deg 14deg)",
              WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 62%)",
              maskImage: "radial-gradient(circle, #000 0%, transparent 62%)",
              animation: "fxRays 40s linear infinite",
            }}
          />
          <Confetti />
        </>
      )}
      {outcome === "loss" && <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 220px 40px rgba(0,0,0,.85)" }} />}

      <div className="relative min-h-full flex flex-col items-center justify-center gap-5 px-4 py-10 text-center">
        {/* hero sprite */}
        {outcome === "win" && (
          <div data-fx style={{ animation: "fxSlamIn .6s cubic-bezier(.2,.9,.3,1) both" }}>
            <div data-fx style={{ animation: "mascotBob 2s ease-in-out .7s infinite" }}>
              <PixelSprite sprite={TROPHY} px={9} />
            </div>
          </div>
        )}
        {outcome === "loss" && (
          <div data-fx style={{ animation: "fxSink .8s ease-out both" }}>
            <PixelSprite sprite={SKULL} px={9} />
          </div>
        )}

        {/* headline */}
        <div data-fx style={{ animation: `${outcome === "loss" ? "fxSink" : "fxSlamIn"} .75s cubic-bezier(.2,.9,.3,1) .12s both` }}>
          {outcome === "win" && <PixelText text="VICTORY" px={13} palette="gold" style={{ width: "min(86vw, 640px)" }} />}
          {outcome === "loss" && <PixelText text="GAME OVER" px={11} palette="gold" style={{ width: "min(88vw, 700px)" }} />}
          {outcome === "draw" && <PixelText text="DRAW" px={15} palette="steel" style={{ width: "min(70vw, 420px)" }} />}
          {outcome === "watch" && <PixelText text="WINNER" px={11} palette="gold" style={{ width: "min(80vw, 520px)" }} />}
        </div>

        {outcome === "watch" && winner && (
          <div data-fx className="font-extrabold text-[clamp(22px,4vw,36px)] text-white" style={{ animation: "fxRise .5s ease-out .4s both", textShadow: "3px 3px 0 #14183b" }}>
            {winner.username}
          </div>
        )}
        {outcome === "loss" && (
          <div data-fx className="fx-blink font-mono font-extrabold text-[15px] tracking-[0.25em] text-[#ffd21f]" style={{ animation: "fxFadeIn .4s .9s both" }}>
            CONTINUE?
          </div>
        )}

        <p data-fx className="max-w-[460px] font-bold text-[13.5px] text-white/80" style={{ animation: "fxFadeIn .5s .5s both" }}>
          {outcome === "draw" ? "Dead even — nobody blinked." : REASON_TEXT[result.reason]}
        </p>

        {/* scoreboard */}
        <div className="flex flex-wrap justify-center gap-5 mt-1">
          {ordered.map((p, i) => (
            <ScoreCard
              key={p.user_id}
              p={p}
              info={infoFor(p.user_id)}
              opponent={result.players.find((o) => o.user_id !== p.user_id)}
              total={totalTests}
              isWinner={!result.draw && p.user_id === result.winner_id}
              isMe={p.user_id === meId}
              delay={0.6 + i * 0.18}
            />
          ))}
        </div>

        {/* actions */}
        <div data-fx className="flex flex-wrap justify-center gap-3 mt-2" style={{ animation: "fxFadeIn .5s 1.1s both" }}>
          {!isSpectator && (
            <button
              onClick={onRematch}
              disabled={rematching}
              className="font-extrabold text-[13px] px-6 py-3 border-[3px] border-[#14183b] rounded-full bg-gradient-to-b from-[#94ec79] to-[#6fd957] text-[#13390a] shadow-[0_4px_0_#48b830] hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {rematching ? "Finding a match…" : outcome === "loss" ? "Continue — new match" : "Quick match again"}
            </button>
          )}
          <a href="/lobby" className="font-extrabold text-[13px] px-6 py-3 border-[3px] border-[#14183b] rounded-full bg-white text-[#2d2150] shadow-[0_4px_0_#8a82ab] hover:-translate-y-0.5 transition-all">
            Arena Map
          </a>
          <a href="/leaderboard" className="font-extrabold text-[13px] px-6 py-3 border-[3px] border-[#14183b] rounded-full bg-gradient-to-b from-[#5fe0e6] to-[#2bc7ce] text-[#08323a] shadow-[0_4px_0_#1a9aa1] hover:-translate-y-0.5 transition-all">
            Rankings
          </a>
        </div>
        {rematchError && <p className="font-bold text-[12.5px] text-[#ff9aa6]">{rematchError}</p>}
      </div>
    </div>
  )
}

export default memo(ResultOverlay)
