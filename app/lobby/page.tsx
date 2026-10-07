// app/lobby/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../components/Navbar"
import MascotFox from "../components/MascotFox"
import { roomsApi, ApiError, type Room } from "../../lib/api"

const THREAT_STYLE: Record<string, string> = {
  Easy: "border-[#48b830] text-[#48b830] bg-[#eafce0]",
  Medium: "border-[#e8a623] text-[#e8a623] bg-[#fff3d6]",
  Hard: "border-[#c0392b] text-[#c0392b] bg-[#ffe3e6]",
}

// Derives the same visual treatment the old mock used, from real room data.
function roomAction(room: Room, myUserId: string | null) {
  if (room.status === "live") {
    // one of the two fighters? jump back into your own battle
    if (myUserId && (room.player1_id === myUserId || room.player2_id === myUserId)) {
      return { action: "enter", label: "Enter Battle" }
    }
    return { action: "spectate", label: "Spectate" }
  }
  // waiting
  if (room.player1_id === myUserId) {
    return { action: "create", label: "View Room" }
  }
  if (room.is_premium) {
    return { action: "stake", label: "Stake & Join" }
  }
  return { action: "join", label: "Join Room" }
}

const BTN_STYLE: Record<string, string> = {
  join:     "text-[#08323a] bg-gradient-to-b from-[#5fe0e6] to-[#2bc7ce] shadow-[0_4px_0_#1a9aa1]",
  stake:    "text-[#4a3304] bg-gradient-to-b from-[#ffdb85] to-[#ffc94d] shadow-[0_4px_0_#e8a623]",
  enter:    "text-[#13390a] bg-gradient-to-b from-[#94ec79] to-[#6fd957] shadow-[0_4px_0_#48b830]",
  spectate: "text-[#2d2150] bg-white shadow-[0_4px_0_#8a82ab]",
  create:   "text-[#2d2150] bg-white shadow-[0_4px_0_#8a82ab]",
}

export default function LobbyPage() {
  const router = useRouter()
  const [matching, setMatching] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const [myUserId, setMyUserId] = useState<string | null>(null)

  async function loadRooms() {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) return // ProtectedPage/Navbar already handle redirect to /login

    try {
      setError(null)
      const data = await roomsApi.list(accessToken)
      setRooms(data.rooms)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load rooms")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMyUserId(localStorage.getItem("userId"))
    loadRooms()
    // Simple polling until Socket.IO is wired up — refreshes room list every 5s.
    const interval = setInterval(loadRooms, 5000)
    return () => clearInterval(interval)
  }, [])

  async function handleJoin(room: Room) {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) return

    const { action } = roomAction(room, myUserId)

    // Spectating, resuming your own battle, or opening a room you already
    // created — no join call needed, just go to the battle screen. (router.push
    // keeps the page alive, so the browser remembers your click → sound works.)
    if (action === "spectate" || action === "create" || action === "enter") {
      router.push(`/battle/${room.id}`)
      return
    }

    setJoiningId(room.id)
    try {
      await roomsApi.join(room.id, accessToken)
      router.push(`/battle/${room.id}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not join room")
      setJoiningId(null)
    }
  }

  // Resume your open room, join someone who's waiting, or open a new room.
  async function handleQuickMatch() {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) return
    setMatching(true)
    setError(null)
    try {
      const { room } = await roomsApi.quickMatch(accessToken)
      router.push(`/battle/${room.id}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start a match")
      setMatching(false)
    }
  }

  return (
    <main className="relative min-h-screen">
      <Navbar active="Arena Map" />
      <div className="max-w-[1180px] mx-auto px-5 py-8">

        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 px-[6px] pr-[14px] py-[6px] bg-white border-[2.5px] border-[#2d2150] rounded-full shadow-[0_3px_0_#8a82ab]">
              <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#ffdb85] to-[#ffc94d] border-2 border-[#2d2150] grid place-items-center font-extrabold text-[12px] text-[#4a3304]">18</div>
              <span className="font-bold text-[12px] text-[#5b5180]">Algo Knight</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff8ec] border-2 border-[#2d2150] rounded-full font-bold text-[12px] shadow-[0_3px_0_#8a82ab]">99,999</div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e3f9fa] border-2 border-[#2d2150] rounded-full font-bold text-[12px] shadow-[0_3px_0_#8a82ab]">999</div>
          </div>
          <div className="flex items-center gap-2 font-mono font-bold text-[13px] text-[#1a9aa1]">
            {rooms.length} rooms
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#e3f8ea] to-[#fff8ec] border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] px-[22px] py-[26px] relative">
          <div className="flex justify-between items-baseline flex-wrap gap-2 mb-4">
            <h2 className="font-extrabold text-[17px] text-[#2d2150]">Live Rooms</h2>
            <span className="font-mono font-semibold text-[11.5px] text-[#8a82ab]">
              {loading ? "loading…" : "refreshes every 5s"}
            </span>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl border-2 border-[#c0392b] bg-[#ffe3e6] text-[#c0392b] font-bold text-[13px]">
              {error}
            </div>
          )}

          {!loading && rooms.length === 0 && !error && (
            <div className="text-center py-10 text-[#8a82ab] font-bold text-[13px]">
              No rooms open right now — hit Quick Match to open one and wait for a challenger.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {rooms.map((room) => {
              const { action, label } = roomAction(room, myUserId)
              const players = room.player2_username
                ? `${room.player1_username} vs ${room.player2_username}`
                : `${room.player1_username} · waiting`

              return (
                <div key={room.id} className={`flex flex-col gap-[10px] p-[17px] border-[3px] rounded-[18px] shadow-[0_4px_0_rgba(45,33,80,0.1)] ${room.is_premium ? "border-[#e8a623] bg-gradient-to-br from-[#fff1cf] to-[#fff8ec]" : "border-[#2d2150] bg-white"}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-[16px] text-[#2d2150]">{room.challenge_title}</h3>
                    <span className={`font-bold text-[11px] px-[9px] py-1 border-2 rounded-full ${THREAT_STYLE[room.difficulty]}`}>{room.difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px] text-[#5b5180] font-bold">
                    <span>{players}</span>
                    <span>{room.is_premium ? `$${room.prize_pool} Bounty` : "Free"}</span>
                  </div>
                  <button
                    onClick={() => handleJoin(room)}
                    disabled={joiningId === room.id}
                    className={`font-bold text-[12px] px-4 py-[9px] border-[2.5px] border-[#2d2150] rounded-xl self-start transition-all hover:-translate-y-px disabled:hover:translate-y-0 disabled:opacity-70 ${BTN_STYLE[action]}`}
                  >
                    {joiningId === room.id ? "Joining…" : label}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="relative h-[80px] mt-1.5 overflow-hidden">
  <div className="absolute top-0 animate-[walkAcross_9s_linear_infinite]">
    <MascotFox size={110} />
  </div>

          </div>
        </div>

        <div className="flex justify-center gap-2.5 mt-5 flex-wrap">
          <a href="/challenges" className="flex items-center gap-[7px] px-[18px] py-[11px] border-[2.5px] border-[#2d2150] rounded-full font-extrabold text-[12px] bg-white text-[#5b5180] shadow-[0_3px_0_#8a82ab] hover:-translate-y-px transition-all">Challenges</a>
          <a href="/leaderboard" className="flex items-center gap-[7px] px-[18px] py-[11px] border-[2.5px] border-[#2d2150] rounded-full font-extrabold text-[12px] bg-white text-[#5b5180] shadow-[0_3px_0_#8a82ab] hover:-translate-y-px transition-all">Rankings</a>
          <a href="/profile" className="flex items-center gap-[7px] px-[18px] py-[11px] border-[2.5px] border-[#2d2150] rounded-full font-extrabold text-[12px] bg-white text-[#5b5180] shadow-[0_3px_0_#8a82ab] hover:-translate-y-px transition-all">Hero</a>
          <button
            onClick={handleQuickMatch}
            disabled={matching}
            className="flex items-center gap-[7px] px-[18px] py-[11px] border-[2.5px] border-[#2d2150] rounded-full font-extrabold text-[12px] bg-gradient-to-br from-[#94ec79] to-[#6fd957] text-[#13390a] shadow-[0_3px_0_#48b830] hover:-translate-y-px transition-all disabled:opacity-70"
          >
            {matching ? "Finding a match…" : "Quick Match"}
          </button>
        </div>

      </div>
    </main>
  )
}