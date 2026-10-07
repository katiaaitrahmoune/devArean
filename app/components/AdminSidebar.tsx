"use client"

import { useState } from "react"

const NAV = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.2c2.3.4 4 2.4 4 4.8"/></svg>,
  },
  {
    label: "Challenges",
    href: "/admin/challenges",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    label: "Revenue",
    href: "/admin/revenue",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5-1.3 2.5-3 2.5-3 1.1-3 2.5 1.3 2.5 3 2.5 3-1.1 3-2.5"/></svg>,
  },
  {
    label: "Rooms",
    href: "/admin/rooms",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  },
]

export default function AdminSidebar({ active = "Dashboard" }: { active?: string }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* ── Sidebar fixe gauche ── */}
      <aside style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: collapsed ? 64 : 220,
        background: "white",
        borderRight: "3px solid #2d2150",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 16px 16px", borderBottom: "3px solid #2d2150", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(160deg,#ff8a3d,#ff6fa8)", border: "2.5px solid #2d2150", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#2d2150", lineHeight: 1 }}>DEV<span style={{ color: "#e8691b" }}>ARENA</span></div>
              <div style={{ fontWeight: 700, fontSize: 10, color: "#8a82ab", marginTop: 2, background: "#f3eeff", padding: "1px 6px", borderRadius: 6, display: "inline-block" }}>Admin</div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
          {NAV.map((item) => {
            const isActive = item.label === active
            return (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: collapsed ? "10px 13px" : "10px 12px",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "all 0.15s",
                  color: isActive ? "#2d2150" : "#8a82ab",
                  background: isActive ? "linear-gradient(160deg,#fff1d0,#fff8ec)" : "transparent",
                  border: isActive ? "2px solid #ffc94d" : "2px solid transparent",
                  boxShadow: isActive ? "0 3px 0 #e8a623" : "none",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ flexShrink: 0, color: isActive ? "#e8691b" : "#8a82ab" }}>{item.icon}</span>
                {!collapsed && item.label}
              </a>
            )
          })}
        </nav>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            margin: "12px 8px",
            padding: "10px",
            borderRadius: 14,
            border: "2px solid #2d2150",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            fontWeight: 700,
            fontSize: 12,
            color: "#5b5180",
            boxShadow: "0 3px 0 #8a82ab",
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed
              ? <><polyline points="9 18 15 12 9 6"/></>
              : <><polyline points="15 18 9 12 15 6"/></>
            }
          </svg>
          {!collapsed && "Collapse"}
        </button>

        {/* User pill bottom */}
        {!collapsed && (
          <div style={{ padding: "12px 12px 16px", borderTop: "2px dashed #e5dcc8", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(160deg,#ff8a3d,#ff6fa8)", border: "2px solid #2d2150", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v5c0 5-3.5 9.7-8 11C7.5 20.7 4 16 4 11V6l8-4z"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#2d2150" }}>admin</div>
                <div style={{ fontWeight: 600, fontSize: 10, color: "#8a82ab" }}>Super Admin</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Spacer pour pousser le contenu à droite de la sidebar ── */}
      <div style={{ width: collapsed ? 64 : 220, flexShrink: 0, transition: "width 0.2s ease" }} />
    </>
  )
}