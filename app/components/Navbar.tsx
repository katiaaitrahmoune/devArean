"use client"

import { useState } from "react"
import Link from "next/link"

const TABS = [
  { label: "Home", href: "/" },
  { label: "Enter", href: "/login" },
  { label: "Arena Map", href: "/lobby" },
  { label: "Battle", href: "/battle" },
  { label: "Hero", href: "/profile" },
  { label: "Rankings", href: "/leaderboard" },
]

export default function Navbar({ active = "Home" }: { active?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="max-w-[1180px] mx-auto px-5 pt-[18px]">
      <nav className="flex items-center justify-between px-[18px] py-3 bg-white border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)]">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-[38px] h-[38px] grid place-items-center bg-gradient-to-br from-[#ff8a3d] to-[#ff6fa8] border-[2.5px] border-[#2d2150] rounded-xl text-white">
            {/* path exact tiré du HTML source: M13 2L4 14h6l-1 8 9-12h-6l1-8z */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#2d2150] whitespace-nowrap">
            DEV<span className="text-[#e8691b]">ARENA</span>
          </span>
        </Link>

        {/* Tabs desktop — chaque tab actif a fond gold + bordure + shadow, comme .tabs button.active */}
        <div className="hidden lg:flex gap-1.5 flex-wrap">
          {TABS.map((tab) => {
            const isActive = tab.label === active
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`font-bold text-[12.5px] rounded-xl px-[13px] py-2 border-[2.5px] transition-colors ${
                  isActive
                    ? "text-[#2d2150] border-[#2d2150] bg-[#ffc94d] shadow-[0_3px_0_#e8a623]"
                    : "text-[#8a82ab] border-transparent hover:text-[#2d2150]"
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        {/* Burger — visible en dessous de lg maintenant, vu qu'on a 6 tabs */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2 shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={`block w-6 h-0.5 bg-[#2d2150] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#2d2150] transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#2d2150] transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="lg:hidden mt-2 bg-white border-[3px] border-[#2d2150] rounded-[20px] px-4 py-4 flex flex-col gap-1 shadow-[0_5px_0_rgba(45,33,80,0.12)]">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`font-bold px-4 py-3 rounded-xl ${tab.label === active ? "bg-[#fff8ec] text-[#2d2150]" : "text-[#5b5180] hover:bg-[#fff8ec]"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}