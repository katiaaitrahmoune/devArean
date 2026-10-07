// app/components/MascotFox.tsx
// Composant SVG pur — pas d'interactivité, pas de "use client" nécessaire.
// Toutes les animations sont en CSS pur (classes définies dans globals.css)

export default function MascotFox({ size = 130 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className="mascot-bob"
    >
      {/* Queue */}
      <g className="mascot-tail">
        <path
          d="M92 86c14 2 20 14 13 24-6 8-19 6-21-5"
          fill="#ff8a3d"
          stroke="#2d2150"
          strokeWidth="3"
        />
      </g>

      {/* Corps */}
      <ellipse cx="60" cy="78" rx="34" ry="26" fill="#fff" stroke="#2d2150" strokeWidth="3" />

      {/* Oreille gauche */}
      <g className="mascot-ear">
        <path d="M28 44 L20 14 L46 36 Z" fill="#ff8a3d" stroke="#2d2150" strokeWidth="3" />
      </g>
      {/* Oreille droite (délai différent pour effet naturel) */}
      <g className="mascot-ear" style={{ animationDelay: "0.3s" }}>
        <path d="M92 44 L100 14 L74 36 Z" fill="#ff8a3d" stroke="#2d2150" strokeWidth="3" />
      </g>

      {/* Tête */}
      <circle cx="60" cy="50" r="32" fill="#fff" stroke="#2d2150" strokeWidth="3" />
      <path d="M34 44c0-12 12-20 26-20s26 8 26 20" fill="#ff8a3d" />
      <circle cx="40" cy="36" r="10" fill="#ff8a3d" />
      <circle cx="80" cy="36" r="10" fill="#ff8a3d" />
      <circle cx="60" cy="50" r="32" fill="none" stroke="#2d2150" strokeWidth="3" />

      {/* Yeux (qui clignent) */}
      <circle className="mascot-eye" cx="48" cy="50" r="4.5" fill="#2d2150" />
      <circle className="mascot-eye2" cx="72" cy="50" r="4.5" fill="#2d2150" />

      {/* Joues roses */}
      <circle cx="42" cy="58" r="5" fill="#ff95c1" opacity="0.7" />
      <circle cx="78" cy="58" r="5" fill="#ff95c1" opacity="0.7" />

      {/* Bouche */}
      <ellipse cx="60" cy="62" rx="5" ry="3.5" fill="#2d2150" />
    </svg>
  )
}