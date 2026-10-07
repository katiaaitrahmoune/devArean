// app/battle/[roomId]/page.tsx
"use client"

// The battle room. Everything here is driven by ONE Socket.IO connection:
//
//   waiting  → presence screen (who's connected?)
//   vs       → comic versus screen         ┐
//   count    → 3 … 2 … 1                   │ server timeline, both players in sync
//   go       → START!                      ┘
//   battle   → challenge revealed, timer running, HP bars react to passing tests
//   timeup   → "TIME!" while your code is auto-locked in
//   finished → K.O. → VICTORY / GAME OVER / DRAW
//
// The server sends ABSOLUTE timestamps; we render whatever the (offset-corrected)
// clock says, so a refresh mid-battle just picks the show back up where it is.

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Socket } from "socket.io-client"
import Navbar from "../../components/Navbar"
import MascotFox from "../../components/MascotFox"
import PixelText from "../../components/battle/PixelText"
import { PixelBar, PixelSprite, HEART, BOLT } from "../../components/battle/PixelHud"
import PreBattleOverlay, { avatarColor } from "../../components/battle/PreBattleOverlay"
import ResultOverlay, { KO_MS, KoSlam } from "../../components/battle/ResultOverlay"
import { roomsApi, ApiError, type TestCase } from "../../../lib/api"
import { createBattleSocket } from "../../../lib/socket"
import { sfx } from "../../../lib/sfx"
import type { BattlePlayer, BattleSnapshot } from "../../../lib/battle-types"

const GO_FLASH_MS = 1600 // how long the START! screen stays up after GO
// The full-screen "TIME!" slam only appears if scoring takes longer than this after
// the timer hits 0. Normally both players' auto-submits settle it within ~300ms, and
// the K.O. stage of the result screen shows "TIME!" instead (one clean slam).
const TIMEUP_SLAM_DELAY_MS = 700

// ── in-browser test runner (the player's own code, in their own tab) ─────────
type TestResult = { pass: boolean; error?: string }

function runTests(code: string, functionName: string, tests: TestCase[]): TestResult[] {
  let fn: unknown
  try {
    const factory = new Function(`${code}\nreturn typeof ${functionName} === "function" ? ${functionName} : null;`)
    fn = factory()
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not parse code"
    return tests.map(() => ({ pass: false, error: msg }))
  }
  if (typeof fn !== "function") {
    return tests.map(() => ({ pass: false, error: `Function "${functionName}" not found` }))
  }
  return tests.map((tc) => {
    try {
      const result = (fn as (...args: unknown[]) => unknown)(...tc.input)
      const pass = JSON.stringify(result) === JSON.stringify(tc.expected)
      return { pass, error: pass ? undefined : `Got ${JSON.stringify(result)}` }
    } catch (e) {
      return { pass: false, error: e instanceof Error ? e.message : "Runtime error" }
    }
  })
}

const DIFF_COLOR: Record<string, string> = {
  Easy: "text-[#48b830]",
  Medium: "text-[#e8a623]",
  Hard: "text-[#c0392b]",
}

// Renders `backtick` spans from challenge descriptions as inline code.
function renderInline(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      <code key={i} className="font-mono text-[12px] px-1 py-px bg-[#f4f0e4] border border-[#e5dcc8] rounded text-[#2d2150]">
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

type View = "loading" | "waiting" | "pre" | "vs" | "count" | "go" | "battle" | "timeup" | "finished"

// ═════════════════════════════════════════════════════════════════════════════
export default function BattleRoomPage() {
  const params = useParams()
  const roomId = params.roomId as string
  // key → switching rooms (rematch) remounts with fresh state
  return <BattleRoom key={roomId} roomId={roomId} />
}

function BattleRoom({ roomId }: { roomId: string }) {
  const router = useRouter()

  const [snap, setSnap] = useState<BattleSnapshot | null>(null)
  const [conn, setConn] = useState<"connecting" | "online" | "offline">("connecting")
  const [fatal, setFatal] = useState<string | null>(null)
  const [clock, setClock] = useState(() => Date.now()) // server-time estimate
  const [meId, setMeId] = useState<string | null>(null)

  const [code, setCode] = useState("")
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [soundLocked, setSoundLocked] = useState(true)
  const [muted, setMuted] = useState(false)
  const [shake, setShake] = useState(false)

  const [rematching, setRematching] = useState(false)
  const [rematchError, setRematchError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const socketRef = useRef<Socket | null>(null)
  const offset = useRef(0)
  const lastVersion = useRef(0)
  const seededCode = useRef(false)
  const autoSubmitted = useRef(false)
  const firstSnapshot = useRef(true)
  const koDecided = useRef(false)
  const battleRef = useRef<BattleSnapshot["battle"] | null>(null)
  // Play the K.O. slam only if the fight ends in front of us — not on a revisit,
  // and not when the "TIME!" slam already covered it.
  const [koAnimate, setKoAnimate] = useState(false)

  // ── sound wiring ───────────────────────────────────────────────────────────
  useEffect(() => {
    setMeId(localStorage.getItem("userId"))
    sfx.hookGestures()
    // Coming from the lobby via client-side navigation, the browser still remembers
    // the click that brought us here — so audio can start right away. On a cold
    // page load this just leaves the context suspended until the first gesture.
    sfx.unlock()
    const sync = () => {
      setSoundLocked(!sfx.unlocked)
      setMuted(sfx.isMuted)
    }
    sync()
    return sfx.subscribe(sync)
  }, [])

  // ── the socket ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) return
    const socket = createBattleSocket()
    socketRef.current = socket

    socket.on("connect", () => {
      setConn("online")
      lastVersion.current = 0
      socket.emit("room:join", { roomId }, (res: { ok: boolean; error?: string }) => {
        if (!res?.ok) setFatal(res?.error ?? "Could not join this room")
      })
    })
    socket.on("disconnect", () => setConn("offline"))
    socket.io.on("reconnect_attempt", () => setConn("connecting"))

    socket.on("room:state", (s: BattleSnapshot) => {
      if (s.version < lastVersion.current) return // stale, out of order
      lastVersion.current = s.version
      offset.current = s.serverNow - Date.now()
      if (s.battle.phase === "finished" && !koDecided.current) {
        koDecided.current = true
        const prev = battleRef.current
        const timeUpAlreadyShown = prev?.endsAt != null && Date.now() + offset.current >= prev.endsAt + TIMEUP_SLAM_DELAY_MS + 900
        setKoAnimate(!firstSnapshot.current && !timeUpAlreadyShown)
      }
      firstSnapshot.current = false
      battleRef.current = s.battle
      setSnap(s)
    })
    socket.on("battle:progress", (e: { userId: string; passed: number; total: number }) =>
      setSnap((prev) => (prev ? { ...prev, progress: { ...prev.progress, [e.userId]: { passed: e.passed, total: e.total } } } : prev))
    )
    socket.on("battle:submitted", (e: { userId: string }) =>
      setSnap((prev) => (prev ? { ...prev, submitted: { ...prev.submitted, [e.userId]: true } } : prev))
    )

    socket.connect()
    return () => {
      socket.emit("room:leave")
      socket.disconnect()
      socketRef.current = null
    }
  }, [roomId])

  // ── server-adjusted clock ──────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setClock(Date.now() + offset.current), 100)
    return () => clearInterval(id)
  }, [])

  // ── derived state ──────────────────────────────────────────────────────────
  const role = snap?.role
  const isPlayer = role === "player1" || role === "player2"
  const room = snap?.room ?? null
  const me: BattlePlayer | null = room ? (role === "player1" ? room.player1 : role === "player2" ? room.player2 : null) : null
  const opp: BattlePlayer | null = room ? (role === "player1" ? room.player2 : role === "player2" ? room.player1 : null) : null
  const left = isPlayer ? me : room?.player1 ?? null
  const right = isPlayer ? opp : room?.player2 ?? null
  const myId = me?.id ?? meId
  const b = snap?.battle ?? null
  const challenge = snap?.challenge ?? null
  const total = room?.tests_total ?? 0

  const view: View = useMemo(() => {
    if (!snap || !b) return "loading"
    if (b.phase === "waiting") return "waiting"
    if (b.phase === "finished") return "finished"
    if (b.introAt === null || b.countAt === null || b.goAt === null || b.endsAt === null) return "waiting"
    if (clock < b.introAt) return "pre"
    if (clock < b.countAt) return "vs"
    if (clock < b.goAt) return "count"
    if (b.phase === "intro") return "go" // server's GO is a few ms behind
    if (clock < b.goAt + GO_FLASH_MS) return "go"
    if (clock >= b.endsAt + TIMEUP_SLAM_DELAY_MS) return "timeup"
    return "battle"
  }, [snap, b, clock])

  const count =
    view === "count" && b && b.countAt !== null
      ? Math.max(1, b.countFrom - Math.floor((clock - b.countAt) / b.countStepMs))
      : null

  const timeLeftMs =
    b && b.goAt !== null && b.endsAt !== null ? (clock < b.goAt ? b.durationMs : Math.max(0, b.endsAt - clock)) : b?.durationMs ?? 0
  const timeIsUp = Boolean(b && b.phase === "active" && b.endsAt !== null && clock >= b.endsAt)
  const secLeft = Math.ceil(timeLeftMs / 1000)
  const lowTime = view === "battle" && secLeft <= 10

  const passedOf = (id: string | undefined | null) => (id ? snap?.progress[id]?.passed ?? 0 : 0)
  // your HP = tests in the challenge minus the ones your opponent has already passed
  const hpOf = (_id: string | undefined | null, otherId: string | undefined | null) => Math.max(0, total - passedOf(otherId))
  const mySubmitted = Boolean(myId && snap?.submitted[myId])
  const oppSubmitted = Boolean(opp && snap?.submitted[opp.id])
  const oppOnline = Boolean(opp && snap?.presence[opp.id] === true)
  const spectators = typeof snap?.presence.spectators === "number" ? snap.presence.spectators : 0

  const result = snap?.result ?? null
  const outcome: "win" | "loss" | "draw" | "watch" | null = !result
    ? null
    : result.draw
      ? "draw"
      : !isPlayer
        ? "watch"
        : result.winner_id === myId
          ? "win"
          : "loss"

  // ── seed the editor once the challenge arrives (restore a draft after refresh) ──
  useEffect(() => {
    if (seededCode.current || !challenge?.function_name || !isPlayer) return
    seededCode.current = true
    let draft: string | null = null
    try {
      draft = localStorage.getItem(`devarena:code:${roomId}`)
    } catch {
      /* ignore */
    }
    setCode(draft ?? `function ${challenge.function_name}(/* params */) {\n  // your code here\n}\n`)
  }, [challenge, isPlayer, roomId])

  useEffect(() => {
    if (!seededCode.current || !code) return
    try {
      localStorage.setItem(`devarena:code:${roomId}`, code)
    } catch {
      /* ignore */
    }
  }, [code, roomId])

  // ── sound + impact cues ────────────────────────────────────────────────────
  const prevView = useRef<View>("loading")
  useEffect(() => {
    const prev = prevView.current
    prevView.current = view
    if (view === prev) return
    const timers: ReturnType<typeof setTimeout>[] = []
    if (view === "vs") {
      sfx.play("whoosh")
      timers.push(setTimeout(() => sfx.play("vsHit"), 900))
    }
    if (view === "go") sfx.play("go")
    if (view === "timeup") sfx.play("ko")
    return () => timers.forEach(clearTimeout)
  }, [view])

  useEffect(() => {
    if (view === "count" && count) sfx.play("tick", count)
  }, [view, count])

  useEffect(() => {
    if (view === "battle" && secLeft > 0 && secLeft <= 10) sfx.play("warn")
  }, [secLeft, view])

  const oppWasOnline = useRef(false)
  useEffect(() => {
    if (oppOnline && !oppWasOnline.current && (view === "waiting" || view === "pre")) sfx.play("join")
    oppWasOnline.current = oppOnline
  }, [oppOnline, view])

  const totalProgress = snap ? Object.values(snap.progress).reduce((a, p) => a + p.passed, 0) : 0
  const prevProgress = useRef(0)
  useEffect(() => {
    if (totalProgress > prevProgress.current && view === "battle") {
      sfx.play("hit")
      setShake(true)
      const t = setTimeout(() => setShake(false), 560)
      prevProgress.current = totalProgress
      return () => clearTimeout(t)
    }
    prevProgress.current = totalProgress
  }, [totalProgress, view])

  useEffect(() => {
    if (view !== "finished" || !outcome) return
    const reveal = () => sfx.play(outcome === "win" ? "victory" : outcome === "loss" ? "defeat" : "draw")
    if (!koAnimate) {
      reveal() // revisit, or the "TIME!" slam already played its sound
      return
    }
    sfx.play("ko")
    const t = setTimeout(reveal, KO_MS)
    return () => clearTimeout(t)
  }, [view, outcome, koAnimate])

  // ── actions ────────────────────────────────────────────────────────────────
  const runNow = useCallback((): TestResult[] | null => {
    if (!challenge?.test_cases || !challenge.function_name) return null
    const r = runTests(code, challenge.function_name, challenge.test_cases)
    setResults(r)
    return r
  }, [challenge, code])

  function handleRun() {
    if (!challenge?.test_cases) return
    setRunning(true)
    setResults(null)
    setTimeout(() => {
      const r = runNow()
      setRunning(false)
      if (!r) return
      const passed = r.filter((x) => x.pass).length
      socketRef.current?.emit("battle:progress", { passed }) // drives the HP bars
      sfx.play(passed > 0 ? "pass" : "fail")
    }, 220)
  }

  const submit = useCallback(
    async (auto: boolean) => {
      if (submitting || mySubmitted) return
      const token = localStorage.getItem("accessToken")
      if (!token || !challenge?.test_cases) return
      setSubmitting(true)
      setSubmitError(null)
      try {
        const r = runNow() ?? []
        const passed = r.filter((x) => x.pass).length
        await roomsApi.submit(roomId, { code, language: "javascript", tests_passed: passed, tests_total: challenge.test_cases.length }, token)
        if (!auto) sfx.play("submit")
      } catch (err) {
        // "Time is up" / "already finished" after an auto-submit isn't worth showing
        if (!auto) setSubmitError(err instanceof ApiError ? err.message : "Could not submit")
      } finally {
        setSubmitting(false)
      }
    },
    [submitting, mySubmitted, challenge, roomId, code, runNow]
  )

  // time's up → lock in whatever the player has
  useEffect(() => {
    if (timeIsUp && isPlayer && !mySubmitted && !autoSubmitted.current) {
      autoSubmitted.current = true
      void submit(true)
    }
  }, [timeIsUp, isPlayer, mySubmitted, submit])

  async function handleRematch() {
    const token = localStorage.getItem("accessToken")
    if (!token) return
    setRematching(true)
    setRematchError(null)
    try {
      const { room: next } = await roomsApi.quickMatch(token)
      router.push(`/battle/${next.id}`)
    } catch (err) {
      setRematchError(err instanceof ApiError ? err.message : "Could not start a new match")
      setRematching(false)
    }
  }

  async function handleJoinSeat() {
    const token = localStorage.getItem("accessToken")
    if (!token) return
    setJoining(true)
    setJoinError(null)
    try {
      await roomsApi.join(roomId, token) // the server then re-broadcasts our new role
    } catch (err) {
      setJoinError(err instanceof ApiError ? err.message : "Could not join")
    } finally {
      setJoining(false)
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard may be blocked */
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────
  const showArena = view === "vs" || view === "count" || view === "go" || view === "battle" || view === "timeup" || view === "finished"

  return (
    <main className={`relative min-h-screen ${shake ? "fx-shake" : ""}`}>
      <Navbar active="Battle" />

      {/* sound chip */}
      <button
        onClick={() => (soundLocked ? sfx.unlock() : sfx.setMuted(!muted))}
        className={`fixed right-4 bottom-4 z-[90] px-3.5 py-2 rounded-full border-[2.5px] border-[#2d2150] font-extrabold text-[12px] shadow-[0_3px_0_#8a82ab] ${
          soundLocked && !muted ? "bg-[#ffd21f] text-[#14183b]" : "bg-white text-[#5b5180]"
        }`}
        style={soundLocked && !muted ? { animation: "fxPulseChip 1.2s ease-in-out infinite" } : undefined}
        aria-label="Toggle sound"
      >
        {soundLocked && !muted ? "🔊 Tap to enable sound" : muted ? "🔇 Sound off" : "🔊 Sound on"}
      </button>

      {conn !== "online" && snap && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[95] px-4 py-2 rounded-full bg-[#ffe3e6] border-2 border-[#c0392b] text-[#c0392b] font-bold text-[12px]">
          {conn === "connecting" ? "Reconnecting…" : "Connection lost — retrying…"}
        </div>
      )}

      {fatal ? (
        <div className="max-w-[1180px] mx-auto px-5 py-16 text-center">
          <p className="font-bold text-[#c0392b] mb-4">{fatal}</p>
          <a href="/lobby" className="font-extrabold text-[12px] px-5 py-3 border-[2.5px] border-[#2d2150] rounded-full bg-white text-[#5b5180] shadow-[0_3px_0_#8a82ab]">
            Back to Arena Map
          </a>
        </div>
      ) : !snap || !room ? (
        <div className="max-w-[1180px] mx-auto px-5 py-16 text-center font-bold text-[#8a82ab]">
          {conn === "offline" ? "Cannot reach the server…" : "Entering the arena…"}
        </div>
      ) : !showArena ? (
        <WaitingRoom snap={snap} view={view} onJoin={handleJoinSeat} joining={joining} joinError={joinError} onCopy={copyLink} copied={copied} />
      ) : (
        <Arena
          snap={snap}
          view={view}
          left={left}
          right={right}
          leftIsMe={isPlayer && left?.id === myId}
          timeLeftMs={timeLeftMs}
          lowTime={lowTime}
          timeIsUp={timeIsUp}
          passedOf={passedOf}
          hpOf={hpOf}
          isPlayer={isPlayer}
          code={code}
          setCode={setCode}
          results={results}
          running={running}
          submitting={submitting}
          mySubmitted={mySubmitted}
          oppSubmitted={oppSubmitted}
          oppOnline={oppOnline}
          spectators={spectators}
          submitError={submitError}
          onRun={handleRun}
          onSubmit={() => submit(false)}
        />
      )}

      {/* the show */}
      {(view === "vs" || view === "count" || view === "go") && room && (
        <PreBattleOverlay
          phase={view}
          count={count}
          left={left}
          right={right}
          leftIsMe={isPlayer && left?.id === myId}
          rightIsMe={isPlayer && right?.id === myId}
          challengeTitle={room.challenge_title}
          difficulty={room.difficulty}
          topic={room.topic}
        />
      )}
      {view === "timeup" && <KoSlam text="TIME!" subtitle={isPlayer ? "Locking in your code…" : "Waiting for the final scores…"} />}
      {view === "finished" && result && role && (
        <ResultOverlay
          result={result}
          role={role}
          meId={myId}
          p1={room?.player1 ?? null}
          p2={room?.player2 ?? null}
          totalTests={total}
          animate={koAnimate}
          onRematch={handleRematch}
          rematching={rematching}
          rematchError={rematchError}
        />
      )}
    </main>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Waiting room — who's connected?
// ═════════════════════════════════════════════════════════════════════════════
function Seat({ player, online, empty }: { player: BattlePlayer | null; online: boolean; empty?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2.5 w-[min(34vw,200px)]">
      {player ? (
        <div
          className={`w-[86px] h-[86px] grid place-items-center font-extrabold text-[38px] text-white border-[4px] border-[#14183b] shadow-[5px_5px_0_#14183b] transition-all duration-500 ${
            online ? "" : "grayscale opacity-60"
          }`}
          style={{ background: avatarColor(player.username), textShadow: "2px 2px 0 rgba(20,24,59,.5)" }}
        >
          {player.username.charAt(0).toUpperCase()}
        </div>
      ) : (
        <div className="w-[86px] h-[86px] grid place-items-center font-extrabold text-[34px] text-[#8a82ab] border-[4px] border-dashed border-[#8a82ab] bg-white/40">?</div>
      )}
      <div className="font-extrabold text-[15px] text-[#2d2150] text-center break-words max-w-full">{player?.username ?? "Open seat"}</div>
      <span
        className={`px-3 py-1 rounded-full border-2 font-extrabold text-[11px] ${
          empty
            ? "border-[#8a82ab] text-[#8a82ab] bg-white/60 border-dashed"
            : online
              ? "border-[#48b830] text-[#2f8a1c] bg-[#eafce0]"
              : "border-[#8a82ab] text-[#8a82ab] bg-white"
        }`}
      >
        {empty ? "waiting for a challenger" : online ? "● ONLINE" : "○ not connected"}
      </span>
    </div>
  )
}

function WaitingRoom({
  snap,
  view,
  onJoin,
  joining,
  joinError,
  onCopy,
  copied,
}: {
  snap: BattleSnapshot
  view: View
  onJoin: () => void
  joining: boolean
  joinError: string | null
  onCopy: () => void
  copied: boolean
}) {
  const { room, role, presence } = snap
  const p1On = room.player1 ? presence[room.player1.id] === true : false
  const p2On = room.player2 ? presence[room.player2.id] === true : false
  const bothReady = p1On && p2On
  const noOpponent = !room.player2
  const spectating = role === "spectator"
  const missing = !bothReady && room.player2 ? (role === "player1" ? room.player2 : role === "player2" ? room.player1 : !p1On ? room.player1 : room.player2) : null

  const headline = bothReady ? "Both fighters connected!" : noOpponent ? "Waiting for an opponent…" : `Waiting for ${missing?.username ?? "your opponent"} to connect…`

  return (
    <div className="max-w-[820px] mx-auto px-5 py-10">
      <div className="bg-white border-[3px] border-[#2d2150] rounded-[22px] shadow-[0_5px_0_rgba(45,33,80,0.12)] px-6 py-8 text-center overflow-hidden relative">
        <h2 className="font-extrabold text-[21px] text-[#2d2150] mb-1">{headline}</h2>
        <p className="text-[13px] font-semibold text-[#5b5180] mb-6">
          {room.challenge_title} · <span className={DIFF_COLOR[room.difficulty]}>{room.difficulty}</span>
          {room.topic ? ` · ${room.topic}` : ""}
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-8 mb-6">
          <Seat player={room.player1} online={p1On} />
          <div className="relative shrink-0">
            {noOpponent && (
              <>
                <span data-fx className="absolute left-1/2 top-1/2 w-24 h-24 -ml-12 -mt-12 rounded-full border-4 border-[#2bc7ce]" style={{ animation: "fxRadar 1.8s ease-out infinite" }} />
                <span data-fx className="absolute left-1/2 top-1/2 w-24 h-24 -ml-12 -mt-12 rounded-full border-4 border-[#2bc7ce]" style={{ animation: "fxRadar 1.8s ease-out .9s infinite" }} />
              </>
            )}
            <div className="relative">
              <PixelText text="VS" px={5} palette="fire" style={{ width: "clamp(46px, 11vw, 100px)" }} />
            </div>
          </div>
          <Seat player={room.player2} online={p2On} empty={noOpponent} />
        </div>

        {noOpponent && (
          <div className="w-[96px] h-[96px] mx-auto mb-4">
            <MascotFox size={96} />
          </div>
        )}
        {view === "pre" && <p className="font-extrabold text-[14px] text-[#1a9aa1] mb-4">Get ready…</p>}
        {!noOpponent && !bothReady && !spectating && (
          <p className="text-[12.5px] font-semibold text-[#8a82ab] mb-4">The battle starts the moment you&apos;re both online.</p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {spectating && noOpponent && (
            <button
              onClick={onJoin}
              disabled={joining}
              className="font-extrabold text-[12.5px] px-5 py-3 border-[2.5px] border-[#2d2150] rounded-full bg-gradient-to-b from-[#5fe0e6] to-[#2bc7ce] text-[#08323a] shadow-[0_3px_0_#1a9aa1] disabled:opacity-60"
            >
              {joining ? "Joining…" : "Take the open seat"}
            </button>
          )}
          {noOpponent && !spectating && (
            <button onClick={onCopy} className="font-extrabold text-[12.5px] px-5 py-3 border-[2.5px] border-[#2d2150] rounded-full bg-[#fff8ec] text-[#5b5180] shadow-[0_3px_0_#8a82ab]">
              {copied ? "Link copied ✓" : "Copy room link"}
            </button>
          )}
          <a href="/lobby" className="font-extrabold text-[12.5px] px-5 py-3 border-[2.5px] border-[#2d2150] rounded-full bg-white text-[#5b5180] shadow-[0_3px_0_#8a82ab]">
            Back to Arena Map
          </a>
        </div>
        {joinError && <p className="mt-3 font-bold text-[12.5px] text-[#c0392b]">{joinError}</p>}
        {spectating && !noOpponent && <p className="mt-4 text-[12px] font-bold text-[#8a82ab]">You&apos;re spectating this room.</p>}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// The arena
// ═════════════════════════════════════════════════════════════════════════════
type ArenaProps = {
  snap: BattleSnapshot
  view: View
  left: BattlePlayer | null
  right: BattlePlayer | null
  leftIsMe: boolean
  timeLeftMs: number
  lowTime: boolean
  timeIsUp: boolean
  passedOf: (id: string | undefined | null) => number
  hpOf: (id: string | undefined | null, otherId: string | undefined | null) => number
  isPlayer: boolean
  code: string
  setCode: (c: string) => void
  results: TestResult[] | null
  running: boolean
  submitting: boolean
  mySubmitted: boolean
  oppSubmitted: boolean
  oppOnline: boolean
  spectators: number
  submitError: string | null
  onRun: () => void
  onSubmit: () => void
}

function FighterHud({
  player,
  isMe,
  hp,
  total,
  flip,
  online,
  submitted,
}: {
  player: BattlePlayer | null
  isMe: boolean
  hp: number
  total: number
  flip: boolean
  online: boolean
  submitted: boolean
}) {
  const name = player?.username ?? "…"
  return (
    <div className={`min-w-0 flex flex-col gap-1.5 ${flip ? "items-end text-right" : "items-start"}`}>
      <div className={`flex items-center gap-2 min-w-0 max-w-full ${flip ? "flex-row-reverse" : ""}`}>
        <div className="shrink-0 w-7 h-7 grid place-items-center font-extrabold text-[13px] text-white border-[2.5px] border-white/90" style={{ background: avatarColor(name) }}>
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="font-extrabold text-[13px] text-white truncate">
          {name}
          {isMe ? " (you)" : ""}
        </span>
        {!online && <span className="shrink-0 px-1.5 py-0.5 text-[9.5px] font-extrabold bg-[#ff4d5e] text-white">OFFLINE</span>}
        {submitted && <span className="shrink-0 px-1.5 py-0.5 text-[9.5px] font-extrabold bg-[#94ec79] text-[#13390a]">LOCKED IN</span>}
      </div>
      <div className={`flex items-center gap-2 w-full max-w-[300px] ${flip ? "flex-row-reverse" : ""}`}>
        <PixelSprite sprite={HEART} px={2.4} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <PixelBar segments={Math.max(1, total)} filled={hp} kind="hp" flip={flip} />
        </div>
      </div>
    </div>
  )
}

function Arena(p: ArenaProps) {
  const { snap, view } = p
  const { room, challenge } = snap
  const total = room.tests_total
  const battleOn = view === "battle" || view === "timeup" || view === "finished" || view === "go"
  const locked = p.mySubmitted || p.timeIsUp || view === "timeup" || view === "finished"
  const leftId = p.left?.id
  const rightId = p.right?.id
  const durationMs = snap.battle.durationMs
  const energy = Math.max(0, Math.min(10, Math.ceil((p.timeLeftMs / durationMs) * 10)))
  const allPassed = p.results ? p.results.length > 0 && p.results.every((r) => r.pass) : false

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-5 py-6">
      <div className="bg-white border-[3px] border-[#2d2150] rounded-[22px] shadow-[0_5px_0_rgba(45,33,80,0.12)] overflow-hidden">
        {/* HUD */}
        <div className="px-4 sm:px-5 py-3.5 border-b-[3px] border-[#2d2150]" style={{ background: "linear-gradient(180deg,#1c2050,#14183b)" }}>
          <div className="grid grid-cols-2 sm:grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-3 sm:gap-6">
            <FighterHud
              player={p.left}
              isMe={p.leftIsMe}
              hp={p.hpOf(leftId, rightId)}
              total={total}
              flip={false}
              online={leftId ? snap.presence[leftId] === true : false}
              submitted={leftId ? Boolean(snap.submitted[leftId]) : false}
            />
            <div className="col-span-2 sm:col-span-1 order-first sm:order-none justify-self-center flex flex-col items-center gap-1.5 w-[clamp(150px,22vw,190px)]">
              <div className={p.lowTime ? "fx-low-time" : ""}>
                <PixelText text={fmt(p.timeLeftMs)} px={4} palette={p.lowTime ? "fire" : "gold"} />
              </div>
              <div className="flex items-center gap-1.5 w-full">
                <PixelSprite sprite={BOLT} px={1.8} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <PixelBar segments={10} filled={energy} kind="energy" />
                </div>
              </div>
            </div>
            <FighterHud
              player={p.right}
              isMe={!p.leftIsMe && p.isPlayer}
              hp={p.hpOf(rightId, leftId)}
              total={total}
              flip
              online={rightId ? snap.presence[rightId] === true : false}
              submitted={rightId ? Boolean(snap.submitted[rightId]) : false}
            />
          </div>
          {!p.isPlayer && (
            <div className="mt-2 text-center font-bold text-[11px] text-[#9aa6c4]">
              👀 Spectating{p.spectators > 1 ? ` · ${p.spectators} watching` : ""} · scores: {p.passedOf(leftId)}/{total} vs {p.passedOf(rightId)}/{total}
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 ${p.isPlayer ? "md:grid-cols-[1.3fr_1fr]" : ""} border-b-[3px] border-[#2d2150]`}>
          {/* Editor (players only) */}
          {p.isPlayer && (
            <div className="bg-[#1c2333] border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#2d2150] min-h-[340px]">
              <div className="flex justify-between items-center px-4 py-[9px] border-b border-[#34405c] font-mono text-[11.5px] text-[#9aa6c4]">
                <span className="text-[#2bc7ce]">JavaScript</span>
                <span>main.js{p.mySubmitted ? " · locked 🔒" : ""}</span>
              </div>
              {battleOn && challenge ? (
                <textarea
                  value={p.code}
                  onChange={(e) => p.setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault()
                      const el = e.currentTarget
                      const s = el.selectionStart
                      const next = p.code.slice(0, s) + "  " + p.code.slice(el.selectionEnd)
                      p.setCode(next)
                      requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2))
                    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                      e.preventDefault()
                      p.onRun()
                    }
                  }}
                  spellCheck={false}
                  disabled={locked}
                  aria-label="Code editor"
                  className="w-full h-[300px] bg-transparent px-[18px] py-4 font-mono text-[13px] leading-[1.7] text-[#dbe2f5] outline-none resize-none disabled:opacity-60"
                />
              ) : (
                <div className="h-[300px] grid place-items-center font-mono text-[13px] text-[#9aa6c4]">{"// editor unlocks on START"}</div>
              )}
            </div>
          )}

          {/* Problem pane */}
          <div className="bg-white px-5 py-[18px]">
            {challenge ? (
              <div data-fx style={{ animation: "fxRise .5s ease-out both" }}>
                <h3 className="font-extrabold text-[16px] text-[#2d2150] mb-1">{challenge.title}</h3>
                <span className={`font-bold text-[11px] ${DIFF_COLOR[challenge.difficulty]}`}>
                  {challenge.difficulty}
                  {challenge.topic ? ` · ${challenge.topic}` : ""}
                </span>
                <p className="text-[13px] text-[#5b5180] leading-[1.6] font-semibold mt-3 mb-3 whitespace-pre-wrap">{renderInline(challenge.description)}</p>

                {challenge.examples && challenge.examples.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {challenge.examples.map((ex, i) => (
                      <div key={i} className="font-mono text-[11.5px] px-2.5 py-1.5 bg-[#f4f0e4] border-2 border-[#e5dcc8] text-[#2d2150]">
                        <span className="text-[#8a82ab]">in</span> {ex.input} <span className="text-[#8a82ab]">→</span> {ex.output}
                      </div>
                    ))}
                  </div>
                )}
                {challenge.constraints && <p className="text-[11.5px] font-semibold text-[#8a82ab] mb-3">{challenge.constraints}</p>}

                <div className="h-[3px] rounded-[3px] my-4 opacity-35" style={{ background: "repeating-linear-gradient(90deg,#8a82ab 0 8px,transparent 8px 16px)" }} />

                {p.isPlayer ? (
                  p.results ? (
                    p.results.map((r, i) => (
                      <div key={i} className={`flex justify-between items-center py-[9px] font-bold text-[12.5px] text-[#2d2150] ${i < p.results!.length - 1 ? "border-b-2 border-dashed border-[#e5dcc8]" : ""}`}>
                        <span>Test {i + 1}</span>
                        {r.pass ? (
                          <span className="text-[#48b830]">Passed</span>
                        ) : (
                          <span className="text-[#e23a4c]" title={r.error}>
                            Failed{r.error ? ` · ${r.error.slice(0, 26)}` : ""}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] text-[#8a82ab] font-semibold">
                      Run your code to see test results — every test you pass damages your opponent&apos;s HP bar.
                    </p>
                  )
                ) : (
                  <p className="text-[12px] text-[#8a82ab] font-semibold">Spectators can read the problem — the code stays private.</p>
                )}
              </div>
            ) : (
              <p className="text-[13px] font-bold text-[#8a82ab]">Loading the challenge…</p>
            )}
          </div>
        </div>

        {/* actions */}
        {p.isPlayer && (
          <>
            <div className="flex gap-3 px-5 py-[18px] bg-[#fff8ec] flex-wrap">
              <button
                onClick={p.onRun}
                disabled={p.running || locked || !challenge || view === "go"}
                className="flex-1 min-w-[130px] p-[14px] bg-white border-[2.5px] border-[#2d2150] rounded-[16px] shadow-[0_4px_0_#8a82ab] hover:-translate-y-0.5 transition-all text-left font-extrabold text-[12.5px] text-[#2d2150] disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {p.running ? "Running…" : "Run Tests"} <span className="font-mono font-semibold text-[10.5px] text-[#8a82ab] ml-1">Ctrl+Enter</span>
              </button>
              <button
                onClick={p.onSubmit}
                disabled={p.submitting || locked || !challenge || view === "go"}
                className={`flex-1 min-w-[130px] p-[14px] bg-gradient-to-b from-[#94ec79] to-[#6fd957] border-[2.5px] border-[#2d2150] rounded-[16px] shadow-[0_4px_0_#48b830] hover:-translate-y-0.5 transition-all text-left font-extrabold text-[12.5px] text-[#13390a] disabled:opacity-60 disabled:hover:translate-y-0 ${
                  allPassed && !locked ? "ring-4 ring-[#ffd21f]" : ""
                }`}
                style={allPassed && !locked ? { animation: "fxPulseChip 0.9s ease-in-out 3" } : undefined}
              >
                {p.mySubmitted ? "Locked in ✓" : p.submitting ? "Locking in…" : allPassed ? "All tests pass — lock it in & win!" : "Lock in solution"}
              </button>
            </div>

            {p.submitError && (
              <div className="mx-5 mb-5 px-4 py-3 rounded-xl border-2 border-[#c0392b] bg-[#ffe3e6] text-[#c0392b] font-bold text-[13px]">{p.submitError}</div>
            )}
            {p.mySubmitted && view !== "finished" && !p.oppSubmitted && (
              <div className="mx-5 mb-5 px-4 py-3 rounded-xl border-2 border-[#1a9aa1] bg-[#e3f9fa] text-[#1a9aa1] font-bold text-[13px]">
                Locked in. Waiting for your opponent — or the timer — to decide it…
              </div>
            )}
            {!p.oppOnline && view === "battle" && (
              <div className="mx-5 mb-5 px-4 py-3 rounded-xl border-2 border-[#e8a623] bg-[#fff3d6] text-[#a87410] font-bold text-[13px]">
                Your opponent lost connection. The clock is still running.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
