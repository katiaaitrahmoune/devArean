// app/components/battle/PreBattleOverlay.tsx
//
// The show before the fight — driven entirely by props from the battle page,
// which derives them from the SERVER's timeline, so both players see it in sync:
//
//   "vs"    comic versus screen: names slam in on flame streaks, explosion + VS
//   "count" 3 … 2 … 1
//   "go"    START! (fades out to reveal the challenge)

import { memo, type CSSProperties } from "react"
import PixelText from "./PixelText"
import { LightningBolt, ShockRing, Sparks, SpeedLines, Starburst } from "./fx"
import type { BattlePlayer } from "../../../lib/battle-types"

const AVATAR_COLORS = ["#2bc7ce", "#ff6fa8", "#9b6bd9", "#ffc94d", "#6fd957", "#ff8a3d"]
export const avatarColor = (name: string) => {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

const outlineText: CSSProperties = {
  color: "#fff",
  textShadow:
    "3px 0 0 #14183b, -3px 0 0 #14183b, 0 3px 0 #14183b, 0 -3px 0 #14183b, 3px 3px 0 #14183b, -3px 3px 0 #14183b, 3px -3px 0 #14183b, -3px -3px 0 #14183b, 0 6px 0 #14183b",
}

function Plate({
  player,
  isMe,
  side,
  dimmed,
}: {
  player: BattlePlayer | null
  isMe: boolean
  side: "left" | "right"
  dimmed: boolean
}) {
  const left = side === "left"
  const name = player?.username ?? "???"
  return (
    <div
      data-fx
      // phones: fighters stack above/below the VS; desktop: left/right of it
      className={`absolute -translate-y-1/2 transition-all duration-500 w-[92vw] sm:w-[min(40vw,520px)] ${
        left ? "left-[4%] sm:left-[2%] top-[26%] sm:top-1/2" : "right-[4%] sm:right-[2%] top-[74%] sm:top-1/2"
      } ${dimmed ? "opacity-55 scale-[0.86]" : ""}`}
    >
      <div
        data-fx
        style={{ animation: `${left ? "fxFromLeft" : "fxFromRight"} 0.75s cubic-bezier(.2,.8,.25,1) ${left ? 0.1 : 0.35}s both` }}
      >
        {/* flame streak trailing the name plate */}
        <img
          data-fx
          src="/battle/flame.png"
          alt=""
          draggable={false}
          className="absolute top-1/2 w-[135%] max-w-none pointer-events-none select-none"
          style={{
            [left ? "left" : "right"]: "-30%",
            transform: `translateY(-50%) ${left ? "" : "scaleX(-1)"}`,
            opacity: 0.95,
            filter: left ? "none" : "hue-rotate(195deg) saturate(1.15)",
            animation: `${left ? "fxFlameL" : "fxFlameR"} 0.9s cubic-bezier(.2,.8,.25,1) ${left ? 0 : 0.25}s both`,
          }}
        />
        <div className={`relative flex items-center gap-4 ${left ? "" : "flex-row-reverse text-right"}`}>
          <div
            className="shrink-0 grid place-items-center font-extrabold text-white border-[5px] border-[#14183b] shadow-[6px_6px_0_#14183b]"
            style={{
              width: "clamp(64px, 11vw, 132px)",
              height: "clamp(64px, 11vw, 132px)",
              background: avatarColor(name),
              fontSize: "clamp(34px, 6vw, 72px)",
              textShadow: "3px 3px 0 rgba(20,24,59,.55)",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            {isMe && (
              <span className="inline-block mb-1 px-2.5 py-0.5 bg-[#ffd21f] border-[3px] border-[#14183b] font-extrabold text-[clamp(10px,1.3vw,14px)] text-[#14183b] shadow-[3px_3px_0_#14183b] -rotate-2">
                YOU
              </span>
            )}
            <div
              className="font-extrabold leading-[1.02] break-words"
              style={{ ...outlineText, fontSize: "clamp(28px, 4.4vw, 60px)" }}
            >
              {name}
            </div>
            <div
              className="mt-2 inline-block px-3 py-1 bg-[#14183b] text-white font-bold border-[3px] border-[#14183b]"
              style={{ fontSize: "clamp(11px, 1.4vw, 16px)", boxShadow: "3px 3px 0 rgba(20,24,59,.35)" }}
            >
              LV {player?.level ?? 1} · {player?.rank_title ?? "Rookie"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  phase: "vs" | "count" | "go"
  count: number | null
  left: BattlePlayer | null
  right: BattlePlayer | null
  leftIsMe: boolean
  rightIsMe: boolean
  challengeTitle: string
  difficulty: string
  topic: string | null
}

function PreBattleOverlay({
  phase,
  count,
  left,
  right,
  leftIsMe,
  rightIsMe,
  challengeTitle,
  difficulty,
  topic,
}: Props) {
  const counting = phase === "count"
  const going = phase === "go"

  return (
    <div
      className="fixed inset-0 z-[70] overflow-hidden select-none"
      style={{
        background: "#fff3c4",
        // the START! screen fades away to reveal the arena underneath
        animation: going ? "fxFadeOut 0.5s ease-in 1.1s both" : undefined,
      }}
      role="status"
      aria-live="assertive"
      aria-label={counting ? `Starting in ${count}` : going ? "Start!" : "Versus screen"}
    >
      {/* two coloured halves split by the bolt */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,#8fe8ec,#2bc7ce)", clipPath: "polygon(0 0, 57% 0, 43% 100%, 0 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,#ff9db0,#ff5d73)", clipPath: "polygon(57% 0, 100% 0, 100% 100%, 43% 100%)" }} />
      {/* halftone dots */}
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: "radial-gradient(#14183b 1.6px, transparent 1.8px)", backgroundSize: "14px 14px" }}
      />
      {/* manga speed lines */}
      <div className="absolute inset-0" data-fx style={{ animation: "fxLinesPulse 0.9s ease-in-out infinite" }}>
        <SpeedLines opacity={counting || going ? 1 : 0.9} />
      </div>

      {/* the scene shakes when VS lands */}
      <div className="absolute inset-0" data-fx style={{ animation: "fxShake 0.6s 0.95s both" }}>
        {/* lightning splitting the screen */}
        <LightningBolt
          className="absolute left-1/2 top-[-2%] h-[104%] w-[clamp(60px,8vw,120px)] -translate-x-1/2"
          style={{ animation: "fxFadeIn 0.15s 0.9s both, fxBolt 1.7s 1.05s infinite" } as CSSProperties}
        />

        <Plate player={left} isMe={leftIsMe} side="left" dimmed={counting || going} />
        <Plate player={right} isMe={rightIsMe} side="right" dimmed={counting || going} />

        {/* explosion + VS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div data-fx style={{ animation: "fxSlamIn 0.6s cubic-bezier(.2,.9,.3,1) 0.9s both" }}>
            <div className="relative grid place-items-center" style={{ width: "clamp(200px, 38vw, 420px)", aspectRatio: "1 / 1" }}>
              <div data-fx className="absolute inset-0" style={{ animation: "fxBurstPulse 1.2s ease-in-out 1.6s infinite" }}>
                <Starburst className="w-full h-full" />
              </div>
              <div className="relative">
                <PixelText text="VS" px={16} palette="fire" style={{ width: "clamp(110px, 26vw, 260px)" }} />
              </div>
            </div>
          </div>
          <ShockRing color="#ffffff" size={360} delay={0.9} />
          <ShockRing color="#ffd21f" size={360} delay={1.05} />
          <Sparks delay={0.9} radius={340} />
        </div>

        {/* what we're fighting over */}
        <div
          data-fx
          className="absolute bottom-[7%] left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
          style={{ animation: "fxRise 0.5s ease-out 1.5s both" }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#14183b] border-[4px] border-[#14183b] shadow-[5px_5px_0_rgba(20,24,59,.35)]">
            <span className="font-extrabold text-white text-[clamp(13px,1.8vw,22px)]">{challengeTitle}</span>
            <span
              className="font-bold text-[clamp(11px,1.3vw,15px)] px-2 py-0.5 text-[#14183b]"
              style={{ background: difficulty === "Hard" ? "#ff7a8a" : difficulty === "Medium" ? "#ffd21f" : "#94ec79" }}
            >
              {difficulty}
              {topic ? ` · ${topic}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* countdown 3 … 2 … 1 */}
      {counting && count !== null && (
        <div className="absolute inset-0 grid place-items-center" style={{ background: "rgba(20,24,59,0.58)", animation: "fxFadeIn .25s both" }}>
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2">
            <PixelText text="GET READY" px={6} palette="candy" />
          </div>
          {/* A MONOTONIC timing function only, please: fxCount ends on an invisible frame
              (opacity 0), so any easing whose progress races ahead of real time (several
              of this file's other curves do, e.g. cubic-bezier(.2,.8,.3,1)) makes the
              digit vanish almost immediately instead of holding for the full second. */}
          <div key={count} className="relative" data-fx style={{ animation: "fxCount 1s ease-out both" }}>
            <PixelText text={String(count)} px={26} palette="ice" style={{ width: "min(34vw, 260px)", filter: "drop-shadow(0 0 22px rgba(166,246,255,.95)) drop-shadow(0 0 6px #fff)" }} />
            <ShockRing key={`r${count}`} color="#a6f6ff" size={300} duration={0.8} />
          </div>
          <div key={`f${count}`} className="absolute inset-0 bg-white pointer-events-none" data-fx style={{ animation: "fxFlash .35s forwards", opacity: 0 }} />
        </div>
      )}

      {/* START! */}
      {going && (
        <div className="absolute inset-0 grid place-items-center" style={{ background: "rgba(20,24,59,0.35)" }}>
          <img
            data-fx
            src="/battle/flame.png"
            alt=""
            className="absolute top-1/2 left-0 w-[70vw] max-w-none pointer-events-none"
            style={{ transform: "translateY(-50%)", animation: "fxFlameL .5s ease-out both" }}
          />
          <img
            data-fx
            src="/battle/flame.png"
            alt=""
            className="absolute top-1/2 right-0 w-[70vw] max-w-none pointer-events-none"
            style={{ transform: "translateY(-50%) scaleX(-1)", filter: "hue-rotate(195deg)", animation: "fxFlameR .5s ease-out both" }}
          />
          <div className="relative" data-fx style={{ animation: "fxGo .55s cubic-bezier(.2,.9,.3,1) both" }}>
            <PixelText text="START!" px={20} palette="gold" style={{ width: "min(84vw, 760px)" }} />
            <div className="absolute left-1/2 top-1/2">
              <ShockRing color="#ffd21f" size={420} duration={1} />
              <Sparks radius={420} count={30} />
            </div>
          </div>
          <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2">
            <PixelText text="CODE!" px={6} palette="candy" />
          </div>
          <div className="absolute inset-0 bg-white pointer-events-none" data-fx style={{ animation: "fxFlash .5s forwards", opacity: 0 }} />
        </div>
      )}

      {/* impact flash when VS lands */}
      {phase === "vs" && (
        <div className="absolute inset-0 bg-white pointer-events-none" data-fx style={{ animation: "fxFlash .45s .9s forwards", opacity: 0 }} />
      )}
    </div>
  )
}

export default memo(PreBattleOverlay)
