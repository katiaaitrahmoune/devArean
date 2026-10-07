"use client"

import { useState } from "react"
import AdminSidebar from "../../components/AdminSidebar"

const ALL_USERS = [
  { name: "katia_dev",       rank: "Gold",   rankBg: "linear-gradient(160deg,#ffdb85,#ffc94d)", battles: 148, xp: "9,840", active: true  },
  { name: "codemaster",      rank: "Silver", rankBg: "linear-gradient(160deg,#c0c0c0,#a8a8a8)", battles: 99,  xp: "8,210", active: true  },
  { name: "algo_queen",      rank: "Gold",   rankBg: "linear-gradient(160deg,#ffdb85,#ffc94d)", battles: 87,  xp: "7,550", active: true  },
  { name: "dev_hunter",      rank: "Silver", rankBg: "linear-gradient(160deg,#c0c0c0,#a8a8a8)", battles: 74,  xp: "6,900", active: true  },
  { name: "stack_overflower",rank: "Bronze", rankBg: "#fff8ec",                                  battles: 62,  xp: "6,410", active: true  },
  { name: "null_pointer",    rank: "Bronze", rankBg: "#fff8ec",                                  battles: 31,  xp: "2,100", active: false },
  { name: "byte_bishop",     rank: "Bronze", rankBg: "#fff8ec",                                  battles: 28,  xp: "1,890", active: true  },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  const filtered = ALL_USERS
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .filter(u => filter === "All" ? true : filter === "Active" ? u.active : !u.active)

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f3ea" }}>
      <AdminSidebar active="Users" />
      <main style={{ flex: 1, padding: "32px 28px", overflow: "auto" }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: "#2d2150", margin: 0 }}>Users</h1>
          <p style={{ fontWeight: 600, fontSize: 13, color: "#8a82ab", marginTop: 4 }}>{ALL_USERS.length} registered warriors</p>
        </div>

        {/* Search + filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontFamily: "inherit", fontSize: 12, padding: "9px 14px", border: "2.5px solid #2d2150", borderRadius: 12, background: "white", outline: "none", color: "#2d2150", flex: 1, minWidth: 200 }}
          />
          {["All","Active","Banned"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ fontWeight: 700, fontSize: 12, padding: "9px 16px", border: "2.5px solid #2d2150", borderRadius: 12, cursor: "pointer", background: filter === f ? "linear-gradient(160deg,#fff1d0,#fff8ec)" : "white", color: "#2d2150", boxShadow: filter === f ? "0 3px 0 #e8a623" : "0 3px 0 #8a82ab" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 10, padding: "10px 16px", borderBottom: "2px solid #e5dcc8", background: "#fff8ec" }}>
            {["USERNAME","RANK","BATTLES","XP","STATUS","ACTIONS"].map(h => (
              <span key={h} style={{ fontWeight: 700, fontSize: 11, color: "#8a82ab" }}>{h}</span>
            ))}
          </div>
          {/* Rows */}
          {filtered.map((u, i) => (
            <div key={u.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: 10, alignItems: "center", padding: "12px 16px", borderBottom: i < filtered.length - 1 ? "2px dashed #e5dcc8" : "none" }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#2d2150" }}>{u.name}</span>
              <span style={{ fontWeight: 700, fontSize: 10, padding: "3px 8px", background: u.rankBg, border: "2px solid #2d2150", borderRadius: 8, width: "fit-content" }}>{u.rank}</span>
              <span style={{ fontWeight: 600, fontSize: 13, color: "#2d2150" }}>{u.battles}</span>
              <span style={{ fontWeight: 600, fontSize: 12, color: "#e8691b", fontFamily: "monospace" }}>{u.xp}</span>
              <span style={{ fontWeight: 700, fontSize: 11, padding: "3px 8px", borderRadius: 8, width: "fit-content", background: u.active ? "#d4f7c9" : "#ffd9dc", border: `1.5px solid ${u.active ? "#48b830" : "#c0392b"}`, color: u.active ? "#48b830" : "#c0392b" }}>
                {u.active ? "Active" : "Banned"}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ fontSize: 10, padding: "4px 8px", border: "1.5px solid #2d2150", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#2d2150" }}>View</button>
                {u.active
                  ? <button style={{ fontSize: 10, padding: "4px 8px", border: "1.5px solid #c0392b", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#c0392b" }}>Ban</button>
                  : <button style={{ fontSize: 10, padding: "4px 8px", border: "1.5px solid #48b830", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#48b830" }}>Unban</button>
                }
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}