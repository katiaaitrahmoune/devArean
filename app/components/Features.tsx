const FEATURES = [
  {
    title: "Live Battle Rooms",
    desc: "Socket-driven duels where every test pass, timer tick, and opponent move updates the instant it happens.",
    color: "#2bc7ce", // teal
    bg: "#e3f9fa",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
      </svg>
    ),
  },
  {
    title: "AI Oracle Review",
    desc: "After every match, the Oracle reads your solution, names its complexity, and hints at the path to optimal.",
    color: "#9b6bd9", // purple
    bg: "#f1e6fc",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c2 3-1 4-1 7a3 3 0 106 0c0-1 0-2-1-3 2 1 4 4 4 7a8 8 0 11-16 0c0-4 3-6 5-8 1-1 2-2 3-3z" />
      </svg>
    ),
  },
  {
    title: "Global Rankings",
    desc: "Climb a living leaderboard, earn rank titles, and build a battle history players can scout before they queue.",
    color: "#e8691b", // orange
    bg: "#ffe9d8",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4h10v5a5 5 0 01-10 0V4z" />
        <path d="M7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3M9 21h6M11 16v3M13 16v3" />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section className="max-w-[1180px] mx-auto px-5 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-[#fff8ec] border-[3px] border-[#2d2150] rounded-[20px] p-5 shadow-[0_5px_0_rgba(45,33,80,0.12)]"
          >
            <div
              className="w-10 h-10 rounded-xl grid place-items-center mb-3"
              style={{ backgroundColor: f.bg, color: f.color }}
            >
              {f.icon}
            </div>
            <h3 className="font-extrabold text-base text-[#2d2150] mb-1.5">{f.title}</h3>
            <p className="text-sm text-[#5b5180] leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}