// app/login/page.tsx
// "use client" obligatoire — formulaire avec useState pour gérer les inputs
// et le toggle login/register
"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"
import MascotFox from "../components/MascotFox"

// ── Icônes SVG inline (tirées du HTML source) ────────────────────────────────
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#1a9aa1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v5c0 5-3.5 9.7-8 11C7.5 20.7 4 16 4 11V6l8-4z" />
    </svg>
  )
}
function IconGem() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#1a9aa1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#1a9aa1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16 14.2c2.3.4 4 2.4 4 4.8" />
    </svg>
  )
}
function IconGoogle() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  // isLogin = true → affiche login, false → affiche register
  const [isLogin, setIsLogin] = useState(true)

  // Valeurs des inputs — on les gardera pour le fetch() backend plus tard
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  // handleSubmit — pour l'instant juste un console.log
  // Quand on branchera le backend, on fera un fetch() ici
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // empêche le reload de page
    console.log("Submit →", { email, password, username, isLogin })
    // TODO: fetch("/api/auth/login", { method: "POST", body: ... })
  }

  return (
    <main className="relative min-h-screen">
      <Navbar active={isLogin ? "Enter" : "Enter"} />

      {/* Conteneur centré — max-width comme le reste du site */}
      <div className="max-w-[1180px] mx-auto px-5 py-8">

        {/* .panel.auth-wrap — grid 2 colonnes, border 3px, radius 20px, shadow */}
        <div className="bg-[#fff8ec] border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_1.1fr] min-h-[500px]">

          {/* ── AUTH SIDE (gauche) ── */}
          {/* background: linear-gradient(160deg,#bdeaf6,#e8f8ec) */}
          {/* border-right: 3px solid var(--ink) */}
          <div className="relative flex flex-col justify-center px-9 py-[46px] bg-gradient-to-br from-[#bdeaf6] to-[#e8f8ec] border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#2d2150]">

            <h2 className="font-extrabold text-[27px] leading-[1.25] text-[#2d2150] mb-3">
              Your rank<br />awaits inside.
            </h2>

            <p className="text-[#5b5180] text-[14px] leading-[1.6] font-semibold max-w-[280px]">
              Sign in to resume your streak, rejoin a live room, or check on a bounty you&apos;ve staked into.
            </p>

            {/* .crest-list — 3 bullet points avec icône teal */}
            <ul className="mt-[26px] flex flex-col gap-[11px] text-[12.5px] text-[#5b5180] font-bold">
              <li className="flex items-center gap-2">
                <IconShield /> JWT-secured session
              </li>
              <li className="flex items-center gap-2">
                <IconGem /> Google sign-in supported
              </li>
              <li className="flex items-center gap-2">
                <IconUsers /> 1,204 warriors active now
              </li>
            </ul>

            {/* Mascot — position absolute en bas à droite du panel */}
            <div className="absolute right-2.5 bottom-0 w-[140px] h-[140px]">
              <MascotFox size={140} />
            </div>
          </div>

          {/* ── AUTH FORM (droite) ── */}
          {/* padding: 46px */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center px-[46px] py-[46px]"
          >
            {/* Eyebrow + titre */}
            <span className="font-bold text-xs tracking-[0.04em] uppercase text-[#7148b0] mb-1">
              {isLogin ? "Welcome back" : "Join the arena"}
            </span>
            <h2 className="font-extrabold text-[23px] text-[#2d2150] mb-[22px]">
              {isLogin ? "Sign in to DevArena" : "Create your hero"}
            </h2>

            {/* Champ Username — seulement sur register */}
            {!isLogin && (
              <div className="mb-[15px]">
                <label className="block text-xs font-bold text-[#5b5180] mb-1.5 tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="your_handle"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-[14px] py-[13px] bg-white border-[2.5px] border-[#2d2150] rounded-xl text-[#2d2150] text-[14px] font-semibold outline-none focus:border-[#1a9aa1] transition-colors"
                />
              </div>
            )}

            {/* Champ Email */}
            <div className="mb-[15px]">
              <label className="block text-xs font-bold text-[#5b5180] mb-1.5 tracking-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-[14px] py-[13px] bg-white border-[2.5px] border-[#2d2150] rounded-xl text-[#2d2150] text-[14px] font-semibold outline-none focus:border-[#1a9aa1] transition-colors"
              />
            </div>

            {/* Champ Password */}
            <div className="mb-[15px]">
              <label className="block text-xs font-bold text-[#5b5180] mb-1.5 tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-[14px] py-[13px] bg-white border-[2.5px] border-[#2d2150] rounded-xl text-[#2d2150] text-[14px] font-semibold outline-none focus:border-[#1a9aa1] transition-colors"
              />
            </div>

            {/* Bouton submit principal — .btn.btn-teal width:100% */}
            <button
              type="submit"
              className="w-full font-bold text-sm text-[#08323a] px-6 py-3 mt-1.5 bg-gradient-to-b from-[#5fe0e6] to-[#2bc7ce] border-[3px] border-[#2d2150] rounded-2xl shadow-[0_5px_0_#1a9aa1] hover:-translate-y-px active:translate-y-1 active:shadow-[0_1px_0_#1a9aa1] transition-all"
            >
              {isLogin ? "Enter the Arena" : "Create Account"}
            </button>

            {/* .or-rule — séparateur avec lignes */}
            <div className="flex items-center gap-3 my-[18px] text-[11px] font-bold uppercase text-[#8a82ab]">
              <span className="flex-1 h-[2px] bg-[#8a82ab] opacity-30 rounded" />
              or continue with
              <span className="flex-1 h-[2px] bg-[#8a82ab] opacity-30 rounded" />
            </div>

            {/* Bouton Google — .btn.btn-ghost width:100% */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 font-bold text-sm text-[#2d2150] px-6 py-3 bg-white border-[3px] border-[#2d2150] rounded-2xl shadow-[0_5px_0_#8a82ab] hover:-translate-y-px active:translate-y-1 active:shadow-[0_1px_0_#8a82ab] transition-all"
            >
              <IconGoogle />
              Google
            </button>

            {/* .auth-toggle — switch login ↔ register */}
            <p className="mt-5 text-center text-[13px] text-[#5b5180] font-semibold">
              {isLogin ? "New here? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#e0467f] font-extrabold hover:underline"
              >
                {isLogin ? "Create your hero" : "Sign in"}
              </button>
            </p>

          </form>
        </div>
      </div>
    </main>
  )
}