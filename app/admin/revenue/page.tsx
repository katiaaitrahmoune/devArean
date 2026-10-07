"use client"

import AdminSidebar from "../../components/AdminSidebar"

const BARS_MONTH = [
  { label: "Jan", h: 40, bg: "linear-gradient(180deg,#5fe0e6,#2bc7ce)" },
  { label: "Feb", h: 55, bg: "linear-gradient(180deg,#5fe0e6,#2bc7ce)" },
  { label: "Mar", h: 48, bg: "linear-gradient(180deg,#5fe0e6,#2bc7ce)" },
  { label: "Apr", h: 70, bg: "linear-gradient(180deg,#5fe0e6,#2bc7ce)" },
  { label: "May", h: 62, bg: "linear-gradient(180deg,#ffdb85,#ffc94d)" },
  { label: "Jun", h: 85, bg: "linear-gradient(180deg,#ffdb85,#ffc94d)" },
  { label: "Jul", h: 95, bg: "linear-gradient(180deg,#ff95c1,#ff6fa8)" },
]

const TRANSACTIONS = [
  { user: "katia_dev",   amount: "$50", type: "Bounty Room",  date: "Jul 6", status: "paid"   },
  { user: "codemaster",  amount: "$9",  type: "Premium Sub",  date: "Jul 6", status: "paid"   },
  { user: "algo_queen",  amount: "$50", type: "Bounty Room",  date: "Jul 5", status: "paid"   },
  { user: "dev_hunter",  amount: "$9",  type: "Premium Sub",  date: "Jul 5", status: "paid"   },
  { user: "byte_bishop", amount: "$50", type: "Bounty Room",  date: "Jul 4", status: "refund" },
]

export default function AdminRevenuePage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f3ea" }}>
      <AdminSidebar active="Revenue" />
      <main style={{ flex: 1, padding: "32px 28px", overflow: "auto" }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: "#2d2150", margin: 0 }}>Revenue</h1>
          <p style={{ fontWeight: 600, fontSize: 13, color: "#8a82ab", marginTop: 4 }}>Powered by Stripe — live data when backend is ready</p>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
          {[
            { label: "Total Revenue",  num: "$28,400", color: "#48b830",  bg: "linear-gradient(160deg,#94ec79,#6fd957)"  },
            { label: "This Month",     num: "$2,840",  color: "#1a9aa1",  bg: "linear-gradient(160deg,#5fe0e6,#2bc7ce)"  },
            { label: "Avg per Battle", num: "$4.20",   color: "#e8a623",  bg: "linear-gradient(160deg,#ffdb85,#ffc94d)"  },
          ].map(k => (
            <div key={k.label} style={{ padding: "20px 22px", background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
              <div style={{ fontWeight: 800, fontSize: 28, color: k.color, lineHeight: 1 }}>{k.num}</div>
              <div style={{ fontWeight: 600, fontSize: 12, color: "#8a82ab", marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Chart + transactions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Monthly chart */}
          <div style={{ padding: 20, background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: 0 }}>Monthly Revenue</h3>
              <span style={{ fontWeight: 700, fontSize: 11, padding: "4px 10px", background: "#e3f9fa", border: "2px solid #2d2150", borderRadius: 999, color: "#1a9aa1" }}>Stripe</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
              {BARS_MONTH.map(b => (
                <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: `${b.h}%`, background: b.bg, borderRadius: "8px 8px 0 0", border: "2px solid #2d2150" }} />
                  </div>
                  <span style={{ fontSize: 9, color: "#8a82ab", fontWeight: 600 }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div style={{ padding: 20, background: "white", border: "3px solid #2d2150", borderRadius: 20, boxShadow: "0 5px 0 rgba(45,33,80,0.12)" }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: "#2d2150", margin: "0 0 14px" }}>Recent Transactions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TRANSACTIONS.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "2px solid #2d2150", borderRadius: 12, boxShadow: "0 3px 0 rgba(45,33,80,0.08)", background: "white" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#2d2150" }}>{t.user}</div>
                    <div style={{ fontWeight: 600, fontSize: 11, color: "#8a82ab" }}>{t.type} · {t.date}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: t.status === "refund" ? "#c0392b" : "#48b830" }}>{t.status === "refund" ? "-" : "+"}{t.amount}</div>
                  <span style={{ fontWeight: 700, fontSize: 10, padding: "3px 8px", borderRadius: 8, background: t.status === "refund" ? "#ffd9dc" : "#d4f7c9", border: `1.5px solid ${t.status === "refund" ? "#c0392b" : "#48b830"}`, color: t.status === "refund" ? "#c0392b" : "#48b830" }}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}