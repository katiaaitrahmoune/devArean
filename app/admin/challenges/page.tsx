"use client"

import { useState } from "react"
import AdminSidebar from "../../components/AdminSidebar"

const CHALLENGES = [
  { id: 1, title: "Two Sum",                  diff: "Easy",   topic: "Arrays",   attempts: 842, solveRate: "78%" },
  { id: 2, title: "LRU Cache",                diff: "Medium", topic: "Design",   attempts: 431, solveRate: "44%" },
  { id: 3, title: "Median of Two Sorted",     diff: "Hard",   topic: "Binary Search", attempts: 198, solveRate: "21%" },
  { id: 4, title: "Valid Parentheses",        diff: "Easy",   topic: "Stack",    attempts: 621, solveRate: "82%" },
  { id: 5, title: "Word Break",               diff: "Medium", topic: "DP",       attempts: 312, solveRate: "38%" },
  { id: 6, title: "Trapping Rain Water",      diff: "Hard",   topic: "Arrays",   attempts: 145, solveRate: "18%" },
]

const DIFF_STYLE: Record<string, { bg: string; color: string }> = {
  Easy:   { bg: "linear-gradient(160deg,#94ec79,#6fd957)", color: "#13390a" },
  Medium: { bg: "linear-gradient(160deg,#ffdb85,#ffc94d)", color: "#4a3304" },
  Hard:   { bg: "linear-gradient(160deg,#ff95c1,#ff6fa8)", color: "#3a0a1f" },
}

export default function AdminChallengesPage() {
  const [filter, setFilter] = useState("All")

  const filtered = CHALLENGES.filter(c => filter === "All" ? true : c.diff === filter)

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f3ea" }}>
      <AdminSidebar active="Challenges" />
      <main style={{ flex: 1, padding: "32px 28px", overflow: "auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 22, color: "#2d2150", margin: 0 }}>Challenges</h1>
            <p style={{ fontWeight: 600, fontSize: 13, color: "#8a82ab", marginTop: 4 }}>{CHALLENGES.length} challenges in the arena</p>
          </div>
          <button style={{ fontWeight: 700, fontSize: 13, padding: "10px 20px", background: "linear-gradient(180deg,#94ec79,#6fd957)", border: "2.5px solid #2d2150", borderRadius: 14, color: "#13390a", cursor: "pointer", boxShadow: "0 4px 0 #48b830" }}>+ New Challenge</button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["All","Easy","Medium","Hard"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ fontWeight: 700, fontSize: 12, padding: "8px 16px", border: "2.5px solid #2d2150", borderRadius: 12, cursor: "pointer", background: filter === f ? DIFF_STYLE[f]?.bg || "linear-gradient(160deg,#fff1d0,#fff8ec)" : "white", color: filter === f ? (DIFF_STYLE[f]?.color || "#2d2150") : "#8a82ab", boxShadow: "0 3px 0 #8a82ab" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid of challenge cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {filtered.map((c) => {
            const ds = DIFF_STYLE[c.diff]
            return (
              <div key={c.id} style={{ background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)", padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 11, background: ds.bg, border: "2px solid #2d2150", padding: "2px 8px", borderRadius: 8, color: ds.color }}>{c.diff}</span>
                  <span style={{ fontWeight: 600, fontSize: 11, color: "#8a82ab", background: "#fff8ec", padding: "2px 8px", borderRadius: 8, border: "1.5px solid #e5dcc8" }}>{c.topic}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: "0 0 12px" }}>{c.title}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#2d2150" }}>{c.attempts}</div>
                    <div style={{ fontWeight: 600, fontSize: 10, color: "#8a82ab" }}>Attempts</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#48b830" }}>{c.solveRate}</div>
                    <div style={{ fontWeight: 600, fontSize: 10, color: "#8a82ab" }}>Solve rate</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, fontSize: 12, fontWeight: 700, padding: "8px", border: "2px solid #2d2150", borderRadius: 10, background: "white", cursor: "pointer", color: "#5b5180", boxShadow: "0 3px 0 #8a82ab" }}>Edit</button>
                  <button style={{ flex: 1, fontSize: 12, fontWeight: 700, padding: "8px", border: "2px solid #c0392b", borderRadius: 10, background: "white", cursor: "pointer", color: "#c0392b", boxShadow: "0 3px 0 #c0392b" }}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}