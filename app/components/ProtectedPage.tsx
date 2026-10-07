// app/components/ProtectedPage.tsx
"use client"

// Client-side auth guard for pages that need a logged-in user.
//
// Why not Next.js middleware? The refresh-token cookie is set by the BACKEND's
// domain. The frontend's middleware can only see cookies for the frontend's own
// domain, so as soon as the two are on different hosts it can never see the
// cookie and bounces every user back to /login — and combined with the login
// page's "already logged in -> /lobby" redirect, that becomes an infinite loop.
//
// The real security boundary is the API (`protect` middleware on the backend
// rejects any request without a valid token). This guard is just for UX.

import { useEffect, useState } from "react"

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setAllowed(true)
    } else {
      // replace() so the Back button doesn't bounce the user straight back here
      window.location.replace("/login")
    }
  }, [])

  if (!allowed) {
    return (
      <main className="min-h-screen grid place-items-center">
        <p className="font-bold text-[#8a82ab]">Loading…</p>
      </main>
    )
  }

  return <>{children}</>
}

export default ProtectedPage
