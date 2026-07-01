// app/lobby/page.tsx
"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"
import MascotFox from "../components/MascotFox"

const ROOMS = [
  { title: "Arrays & Hashing",    diff: "Easy",   diffType: "easy", players: "2/2 joined", price: "Free",       action: "spectate", label: "Spectate",     premium: false },
  { title: "Dynamic Programming", diff: "Medium", diffType: "mid",  players: "1/2 joined", price: "Free",       action: "join",     label: "Join Room",    premium: false },
  { title: "Graph Theory",        diff: "Hard",   diffType: "high", players: "0/2",        price: "$50 Bounty", action: "stake",    label: "Stake & Join", premium: true  },
  { title: "Binary Search",       diff: "Easy",   diffType: "easy", players: "Waiting",    price: "Free",       action: "create",   label: "Create Room",  premium: false },
]

const THREAT_STYLE: Record<string, string> = {
  easy: "border-[#48b830] text-[#48b830] bg-[#eafce0]",
  mid:  "border-[#e8a623] text-[#e8a623] bg-[#fff3d6]",
  high: "border-[#c0392b] text-[#c0392b] bg-[#ffe3e6]",
}

const BTN_STYLE: Record<string, string> = {
  join:     "text-[#08323a] bg-gradient-to-b from-[#5fe0e6] to-[#2bc7ce] shadow-[0_4px_0_#1a9aa1]",
  stake:    "text-[#4a3304] bg-gradient-to-b from-[#ffdb85] to-[#ffc94d] shadow-[0_4px_0_#e8a623]",
  spectate: "text-[#2d2150] bg-white shadow-[0_4px_0_#8a82ab]",
  create:   "text-[#2d2150] bg-white shadow-[0_4px_0_#8a82ab]",
}

export default function LobbyPage() {
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
            15 / 30
            <div className="w-[90px] h-[10px] bg-white border-2 border-[#2d2150] rounded-full overflow-hidden relative">
              <div className="absolute inset-[1px] w-[30%] bg-gradient-to-r from-[#6fe6ec] to-[#2bc7ce] rounded-full" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#e3f8ea] to-[#fff8ec] border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] px-[22px] py-[26px] relative">
          <div className="flex justify-between items-baseline flex-wrap gap-2 mb-4">
            <h2 className="font-extrabold text-[17px] text-[#2d2150]">Live Rooms</h2>
            <span className="font-mono font-semibold text-[11.5px] text-[#8a82ab]">refreshes via Socket.IO</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {ROOMS.map((room) => (
              <div key={room.title} className={`flex flex-col gap-[10px] p-[17px] border-[3px] rounded-[18px] shadow-[0_4px_0_rgba(45,33,80,0.1)] ${room.premium ? "border-[#e8a623] bg-gradient-to-br from-[#fff1cf] to-[#fff8ec]" : "border-[#2d2150] bg-white"}`}>
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-[16px] text-[#2d2150]">{room.title}</h3>
                  <span className={`font-bold text-[11px] px-[9px] py-1 border-2 rounded-full ${THREAT_STYLE[room.diffType]}`}>{room.diff}</span>
                </div>
                <div className="flex justify-between items-center text-[12.5px] text-[#5b5180] font-bold">
                  <span>{room.premium ? room.price : room.players}</span>
                  <span>{room.premium ? room.players : room.price}</span>
                </div>
                <button className={`font-bold text-[12px] px-4 py-[9px] border-[2.5px] border-[#2d2150] rounded-xl self-start transition-all hover:-translate-y-px ${BTN_STYLE[room.action]}`}>{room.label}</button>
              </div>
            ))}
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
          <a href="/battle" className="flex items-center gap-[7px] px-[18px] py-[11px] border-[2.5px] border-[#2d2150] rounded-full font-extrabold text-[12px] bg-gradient-to-br from-[#94ec79] to-[#6fd957] text-[#13390a] shadow-[0_3px_0_#48b830] hover:-translate-y-px transition-all">Quick Match</a>
        </div>

      </div>
    </main>
  )
}