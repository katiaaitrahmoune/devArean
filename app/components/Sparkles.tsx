// app/components/Sparkles.tsx
// "use client" obligatoire car on utilise Math.random() côté client
// Si on le laisse côté serveur, les valeurs random seront différentes
// entre le serveur et le client → erreur d'hydratation React
"use client"

import { useEffect, useRef } from "react"

export default function Sparkles() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // On génère les 14 points exactement comme le JS original
    if (!ref.current) return
    for (let i = 0; i < 20; i++) {
      const s = document.createElement("div")
      s.style.cssText = `
        position: absolute;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #fff;
        opacity: 0.8;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation: sparkUp linear infinite;
        animation-duration: ${6 + Math.random() * 8}s;
        animation-delay: ${Math.random() * 10}s;
        pointer-events: none;
      `
      ref.current.appendChild(s)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  )
}