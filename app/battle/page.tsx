"use client"

// Battle without a room id has nothing to render — real matches live at
// /battle/[roomId] (started from the Arena Map). Send people there instead.

import { useEffect } from "react"
import Navbar from "../components/Navbar"

export default function BattleIndexPage() {
  useEffect(() => {
    window.location.href = "/lobby"
  }, [])

  return (
    <main className="relative min-h-screen">
      <Navbar active="Battle" />
      <div className="max-w-[1180px] mx-auto px-5 py-16 text-center font-bold text-[#8a82ab]">
        Redirecting to the Arena Map…
      </div>
    </main>
  )
}
