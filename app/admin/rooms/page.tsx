"use client"

import AdminSidebar from "../../components/AdminSidebar"

const ROOMS = [
  { id: "room_001", title: "Arrays & Hashing",    diff: "Easy",   players: "2/2", status: "live",    prize: "Free",  duration: "12:34" },
  { id: "room_002", title: "Dynamic Programming", diff: "Medium", players: "1/2", status: "waiting", prize: "Free",  duration: "—"     },
  { id: "room_003", title: "Graph Theory",        diff: "Hard",   players: "2/2", status: "live",    prize: "$50",   duration: "04:12" },
  { id: "room_004", title: "Binary Search",       diff: "Easy",   players: "0/2", status: "empty",   prize: "Free",  duration: "—"     },
  { id: "room_005", title: "Sliding Window",      diff: "Medium", players: "2/2", status: "done",    prize: "$20",   duration: "Done"  },
]

const DIFF_STYLE: Record<string, { bg: string; color: string }> = {
  Easy:   { bg: "linear-gradient(160deg,#94ec79,#6fd957)", color: "#13390a" },
  Medium: { bg: "linear-gradient(160deg,#ffdb85,#ffc94d)", color: "#4a3304" },
  Hard:   { bg: "linear-gradient(160deg,#ff95c1,#ff6fa8)", color: "#3a0a1f" },
}

const STATUS_STYLE: Record<string, { bg: string; border: string; color: string }> = {
  live:    { bg: "#d4f7c9", border: "#48b830",  color: "#48b830"  },
  waiting: { bg: "#fff3d6", border: "#e8a623",  color: "#e8a623"  },
  empty:   { bg: "#f0eeff", border: "#9b6bd9",  color: "#7148b0"  },
  done:    { bg: "#f0f0f0", border: "#8a82ab",  color: "#8a82ab"  },
}

export default function AdminRoomsPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f3ea" }}>
      <AdminSidebar active="Rooms" />
      <main style={{ flex: 1, padding: "32px 28px", overflow: "auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 22, color: "#2d2150", margin: 0 }}>Live Rooms</h1>
            <p style={{ fontWeight: 600, fontSize: 13, color: "#8a82ab", marginTop: 4 }}>Real-time when Socket.IO is connected</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#48b830", display: "inline-block", boxShadow: "0 0 0 3px rgba(72,184,48,.25)" }} />
            <span style={{ fontWeight: 700, fontSize: 12, color: "#48b830" }}>2 rooms live</span>
          </div>
        </div>

        {/* Stat pills */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Live",    count: 2, color: "#48b830",  bg: "#d4f7c9"  },
            { label: "Waiting", count: 1, color: "#e8a623",  bg: "#fff3d6"  },
            { label: "Empty",   count: 1, color: "#7148b0",  bg: "#f0eeff"  },
            { label: "Done",    count: 1, color: "#8a82ab",  bg: "#f0f0f0"  },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: s.bg, border: `2px solid ${s.color}`, borderRadius: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: s.color }}>{s.count}</span>
              <span style={{ fontWeight: 600, fontSize: 12, color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Rooms table */}
        <div style={{ background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 10, padding: "10px 16px", borderBottom: "2px solid #e5dcc8", background: "#fff8ec" }}>
            {["ROOM","DIFF","PLAYERS","STATUS","PRIZE","ACTIONS"].map(h => (
              <span key={h} style={{ fontWeight: 700, fontSize: 11, color: "#8a82ab" }}>{h}</span>
            ))}
          </div>
          {ROOMS.map((r, i) => {
            const ds = DIFF_STYLE[r.diff]
            const ss = STATUS_STYLE[r.status]
            return (
              <div key={r.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 10, alignItems: "center", padding: "12px 16px", borderBottom: i < ROOMS.length - 1 ? "2px dashed #e5dcc8" : "none" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#2d2150" }}>{r.title}</div>
                  <div style={{ fontWeight: 600, fontSize: 10, color: "#8a82ab", marginTop: 2 }}>{r.duration}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 10, padding: "2px 8px", background: ds.bg, border: "2px solid #2d2150", borderRadius: 8, color: ds.color, width: "fit-content" }}>{r.diff}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#2d2150" }}>{r.players}</span>
                <span style={{ fontWeight: 700, fontSize: 11, padding: "3px 8px", borderRadius: 8, width: "fit-content", background: ss.bg, border: `1.5px solid ${ss.border}`, color: ss.color }}>{r.status}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: r.prize !== "Free" ? "#e8a623" : "#8a82ab" }}>{r.prize}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ fontSize: 10, padding: "4px 8px", border: "1.5px solid #2d2150", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#2d2150" }}>View</button>
                  <button style={{ fontSize: 10, padding: "4px 8px", border: "1.5px solid #c0392b", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#c0392b" }}>Kill</button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}