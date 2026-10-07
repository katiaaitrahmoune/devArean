"use client"

import { useState } from "react"
import AdminSidebar from "../components/AdminSidebar"

const KPIS = [
  { num: "1,284", label: "Total Users",   delta: "+12%", up: true,  iconBg: "linear-gradient(160deg,#ff95c1,#ff6fa8)", icon: "👥" },
  { num: "342",   label: "Battles Today", delta: "+8%",  up: true,  iconBg: "linear-gradient(160deg,#5fe0e6,#2bc7ce)", icon: "⚡" },
  { num: "$2,840",label: "Revenue (MTD)", delta: "+23%", up: true,  iconBg: "linear-gradient(160deg,#ffdb85,#ffc94d)", icon: "💰" },
  { num: "89",    label: "Active Rooms",  delta: "-3%",  up: false, iconBg: "linear-gradient(160deg,#a98cf5,#9b6bd9)", icon: "🔥" },
]

const BARS = [
  { day: "Mon", h: 45, bg: "linear-gradient(180deg,#5fe0e6,#2bc7ce)" },
  { day: "Tue", h: 62, bg: "linear-gradient(180deg,#5fe0e6,#2bc7ce)" },
  { day: "Wed", h: 50, bg: "linear-gradient(180deg,#5fe0e6,#2bc7ce)" },
  { day: "Thu", h: 88, bg: "linear-gradient(180deg,#ffdb85,#ffc94d)" },
  { day: "Fri", h: 70, bg: "linear-gradient(180deg,#5fe0e6,#2bc7ce)" },
  { day: "Sat", h: 95, bg: "linear-gradient(180deg,#ff95c1,#ff6fa8)" },
  { day: "Sun", h: 80, bg: "linear-gradient(180deg,#ff95c1,#ff6fa8)" },
]

const CHALLENGES = [
  { diff: "Easy",   bg: "linear-gradient(160deg,#94ec79,#6fd957)", color: "#13390a", title: "Two Sum"              },
  { diff: "Medium", bg: "linear-gradient(160deg,#ffdb85,#ffc94d)", color: "#4a3304", title: "LRU Cache"            },
  { diff: "Hard",   bg: "linear-gradient(160deg,#ff95c1,#ff6fa8)", color: "#3a0a1f", title: "Median of Two Sorted" },
]

const USERS = [
  { name: "katia_dev",    rank: "Gold",   rankBg: "linear-gradient(160deg,#ffdb85,#ffc94d)", battles: 148, active: true  },
  { name: "codemaster",   rank: "Silver", rankBg: "linear-gradient(160deg,#c0c0c0,#a8a8a8)", battles: 99,  active: true  },
  { name: "null_pointer", rank: "Bronze", rankBg: "#fff8ec",                                  battles: 31,  active: false },
]

export default function AdminPage() {
  const [search, setSearch] = useState("")
  const filtered = USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))

  return (
    // flex row — sidebar fixe à gauche + contenu à droite
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f3ea" }}>
      <AdminSidebar active="Dashboard" />

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: "32px 28px", overflow: "auto" }}>

        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: "#2d2150", margin: 0 }}>Dashboard</h1>
          <p style={{ fontWeight: 600, fontSize: 13, color: "#8a82ab", marginTop: 4 }}>Welcome back, admin. Here's what's happening today.</p>
        </div>

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
          {KPIS.map((k) => (
            <div key={k.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: k.iconBg, border: "2.5px solid #2d2150", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 18 }}>
                {k.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: "#2d2150", lineHeight: 1 }}>{k.num}</div>
                <div style={{ fontWeight: 600, fontSize: 12, color: "#8a82ab", marginTop: 2 }}>{k.label}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 11, padding: "3px 8px", borderRadius: 8, border: `2px solid ${k.up ? "#48b830" : "#c0392b"}`, background: k.up ? "#d4f7c9" : "#ffd9dc", color: k.up ? "#48b830" : "#c0392b", flexShrink: 0 }}>
                {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue + Challenges */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          <div style={{ padding: 20, background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: 0 }}>Revenue — last 7 days</h3>
              <span style={{ fontWeight: 700, fontSize: 11, padding: "4px 10px", background: "#e3f9fa", border: "2px solid #2d2150", borderRadius: 999, color: "#1a9aa1" }}>Stripe</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
              {BARS.map((b) => (
                <div key={b.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: `${b.h}%`, background: b.bg, borderRadius: "8px 8px 0 0", border: "2px solid #2d2150" }} />
                  </div>
                  <span style={{ fontSize: 9, color: "#8a82ab", fontWeight: 600 }}>{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 20, background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: 0 }}>Challenges</h3>
              <button style={{ fontWeight: 700, fontSize: 12, padding: "7px 14px", background: "linear-gradient(180deg,#94ec79,#6fd957)", border: "2.5px solid #2d2150", borderRadius: 12, color: "#13390a", cursor: "pointer", boxShadow: "0 3px 0 #48b830" }}>+ New</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CHALLENGES.map((c) => (
                <div key={c.title} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "white", border: "2px solid #2d2150", borderRadius: 12, boxShadow: "0 3px 0 rgba(45,33,80,0.1)" }}>
                  <span style={{ fontWeight: 700, fontSize: 11, background: c.bg, border: "2px solid #2d2150", padding: "2px 8px", borderRadius: 8, color: c.color, flexShrink: 0 }}>{c.diff}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#2d2150", flex: 1 }}>{c.title}</span>
                  <button style={{ fontSize: 10, padding: "4px 9px", border: "1.5px solid #2d2150", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#5b5180" }}>Edit</button>
                  <button style={{ fontSize: 10, padding: "4px 9px", border: "1.5px solid #c0392b", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#c0392b" }}>Del</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User management */}
        <div style={{ padding: 20, background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: 0 }}>User Management</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)}
                style={{ fontFamily: "inherit", fontSize: 12, padding: "7px 12px", border: "2px solid #2d2150", borderRadius: 10, background: "white", outline: "none", color: "#2d2150" }} />
              <button style={{ fontWeight: 700, fontSize: 12, padding: "7px 14px", border: "2px solid #2d2150", borderRadius: 10, background: "white", cursor: "pointer", boxShadow: "0 3px 0 #8a82ab", color: "#2d2150" }}>Filter</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 10, padding: "6px 12px" }}>
              {["USERNAME","RANK","BATTLES","STATUS","ACTIONS"].map(h => (
                <span key={h} style={{ fontWeight: 700, fontSize: 11, color: "#8a82ab" }}>{h}</span>
              ))}
            </div>
            {filtered.map((u) => (
              <div key={u.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 10, alignItems: "center", padding: "10px 12px", background: "white", border: "2px solid #2d2150", borderRadius: 12, boxShadow: "0 3px 0 rgba(45,33,80,0.08)" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#2d2150" }}>{u.name}</span>
                <span style={{ fontWeight: 700, fontSize: 10, padding: "3px 8px", background: u.rankBg, border: "2px solid #2d2150", borderRadius: 8, width: "fit-content" }}>{u.rank}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#2d2150" }}>{u.battles}</span>
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
        </div>

      </main>
    </div>
  )
}