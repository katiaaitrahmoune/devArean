"use client"

import { useState } from "react"
import AdminSidebar from "../../components/AdminSidebar"

export default function AdminSettingsPage() {
  const [xpPerWin,    setXpPerWin]    = useState("120")
  const [xpPerLoss,   setXpPerLoss]   = useState("20")
  const [bountyFee,   setBountyFee]   = useState("10")
  const [aiHintCost,  setAiHintCost]  = useState("20")
  const [maintenance, setMaintenance] = useState(false)
  const [aiEnabled,   setAiEnabled]   = useState(true)
  const [stripeMode,  setStripeMode]  = useState("test")

  const Field = ({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#5b5180", marginBottom: 6 }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "10px 14px", border: "2.5px solid #2d2150", borderRadius: 12, background: "white", outline: "none", color: "#2d2150", width: "100%", boxSizing: "border-box" }}
      />
      {hint && <p style={{ fontWeight: 600, fontSize: 11, color: "#8a82ab", marginTop: 4 }}>{hint}</p>}
    </div>
  )

  const Toggle = ({ label, value, onChange, desc }: { label: string; value: boolean; onChange: (v: boolean) => void; desc?: string }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "white", border: "2px solid #2d2150", borderRadius: 14, boxShadow: "0 3px 0 rgba(45,33,80,0.08)", marginBottom: 10 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#2d2150" }}>{label}</div>
        {desc && <div style={{ fontWeight: 600, fontSize: 11, color: "#8a82ab", marginTop: 2 }}>{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{ width: 46, height: 26, borderRadius: 13, border: "2px solid #2d2150", background: value ? "linear-gradient(160deg,#5fe0e6,#2bc7ce)" : "#e5dcc8", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
      >
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", border: "2px solid #2d2150", position: "absolute", top: 2, left: value ? 22 : 2, transition: "left 0.2s" }} />
      </button>
    </div>
  )

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f3ea" }}>
      <AdminSidebar active="Settings" />
      <main style={{ flex: 1, padding: "32px 28px", overflow: "auto" }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: "#2d2150", margin: 0 }}>Settings</h1>
          <p style={{ fontWeight: 600, fontSize: 13, color: "#8a82ab", marginTop: 4 }}>Platform configuration — changes apply immediately</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* XP settings */}
          <div style={{ padding: 20, background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: "0 0 16px" }}>XP & Rewards</h3>
            <Field label="XP per Win"        value={xpPerWin}   onChange={setXpPerWin}   hint="Awarded to the winner after each battle" />
            <Field label="XP per Loss"       value={xpPerLoss}  onChange={setXpPerLoss}  hint="Consolation XP for the loser" />
            <Field label="AI Hint Cost (XP)" value={aiHintCost} onChange={setAiHintCost} hint="XP deducted when player asks the Oracle" />
            <button style={{ fontWeight: 700, fontSize: 13, padding: "10px 20px", background: "linear-gradient(180deg,#5fe0e6,#2bc7ce)", border: "2.5px solid #2d2150", borderRadius: 14, color: "#08323a", cursor: "pointer", boxShadow: "0 4px 0 #1a9aa1", width: "100%" }}>
              Save XP Settings
            </button>
          </div>

          {/* Stripe settings */}
          <div style={{ padding: 20, background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: "0 0 16px" }}>Stripe & Payments</h3>
            <Field label="Platform Fee (%)" value={bountyFee} onChange={setBountyFee} hint="% taken from each bounty room prize pool" />

            {/* Mode toggle */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#5b5180", marginBottom: 6 }}>Stripe Mode</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["test","live"].map(m => (
                  <button key={m} onClick={() => setStripeMode(m)} style={{ flex: 1, fontWeight: 700, fontSize: 12, padding: "9px", border: "2.5px solid #2d2150", borderRadius: 12, cursor: "pointer", background: stripeMode === m ? (m === "live" ? "linear-gradient(160deg,#94ec79,#6fd957)" : "linear-gradient(160deg,#ffdb85,#ffc94d)") : "white", color: stripeMode === m ? (m === "live" ? "#13390a" : "#4a3304") : "#8a82ab", boxShadow: "0 3px 0 #8a82ab" }}>
                    {m === "test" ? "🧪 Test" : "🚀 Live"}
                  </button>
                ))}
              </div>
              <p style={{ fontWeight: 600, fontSize: 11, color: "#c0392b", marginTop: 6 }}>{stripeMode === "live" ? "⚠️ Real payments enabled" : "Using Stripe test keys — no real charges"}</p>
            </div>

            <button style={{ fontWeight: 700, fontSize: 13, padding: "10px 20px", background: "linear-gradient(180deg,#ffdb85,#ffc94d)", border: "2.5px solid #2d2150", borderRadius: 14, color: "#4a3304", cursor: "pointer", boxShadow: "0 4px 0 #e8a623", width: "100%" }}>
              Save Payment Settings
            </button>
          </div>

          {/* Platform toggles */}
          <div style={{ padding: 20, background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)", gridColumn: "1 / -1" }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: "0 0 14px" }}>Platform Toggles</h3>
            <Toggle label="Maintenance Mode"  value={maintenance} onChange={setMaintenance} desc="Blocks all user access and shows maintenance page" />
            <Toggle label="AI Oracle Enabled" value={aiEnabled}   onChange={setAiEnabled}   desc="Enables Gemini API post-battle code review" />
          </div>
        </div>
      </main>
    </div>
  )
}