// lib/api.ts
// Single source of truth for talking to the DevArena backend.
// Every request goes through here — no more hardcoded URLs scattered across pages.

// IMPORTANT: this must NOT throw at import time. This file is imported by the
// Navbar and the login page, so a top-level throw takes down every page (no nav
// bar, no login form — just "This page couldn't load").
//
// In development we fall back to the local backend so a missing .env.local
// doesn't break anything. In production we refuse to guess and report a clear
// error from the request itself instead.
const DEFAULT_DEV_API_URL = "http://localhost:4000"

export function getApiUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV !== "production" ? DEFAULT_DEV_API_URL : "")

  if (!url) {
    throw new ApiError(
      "NEXT_PUBLIC_API_URL is not set. Add it to your environment (see .env.local.example).",
      0
    )
  }
  return url.replace(/\/+$/, "") // strip trailing slash
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  // accessToken is short-lived and kept in memory/localStorage on the client,
  // NOT the refreshToken — that one is httpOnly and the browser sends it automatically.
  accessToken?: string | null
  // internal — prevents infinite refresh loops, not meant to be passed by callers
  _isRetry?: boolean
}

// Access tokens expire after 15 min (see src/utils/jwt.js on the backend).
// The refreshToken is an httpOnly cookie the browser already sends automatically,
// so we just need to hit /api/auth/refresh to mint a new access token from it.
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${getApiUrl()}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
    if (!res.ok) return null
    const data = (await res.json()) as RefreshResponse
    localStorage.setItem("accessToken", data.accessToken)
    return data.accessToken
  } catch {
    return null
  }
}

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, accessToken, _isRetry = false } = options

  let res: Response
  try {
    res = await fetch(`${getApiUrl()}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      // Required so the browser sends/receives the httpOnly refreshToken cookie.
      // Without this, login "succeeds" but the cookie never round-trips and
      // every protected route silently breaks.
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err instanceof ApiError) throw err
    // fetch() itself rejected: backend down, wrong URL, or blocked by CORS.
    throw new ApiError(
      "Cannot reach the server. Is the backend running on " + getApiUrl() + "?",
      0
    )
  }

  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    // some endpoints (e.g. 204s) may not return a body
  }

  // Access token expired or invalid — try once to refresh it silently and
  // replay the original request before giving up. Only for calls that were
  // actually using a token (unauthenticated 401s, e.g. bad login, pass through).
  if (res.status === 401 && accessToken && !_isRetry) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      return apiFetch<T>(path, { method, body, accessToken: newToken, _isRetry: true })
    }
    // Refresh also failed (refresh token expired/revoked too) — force a clean login.
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userId")
    // Don't reload /login while we're already on it (would just flash the page).
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.replace("/login")
    }
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error || `Request failed (${res.status})`
    throw new ApiError(message, res.status)
  }

  return data as T
}

// ── Types ──────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string
  username: string
  email: string
  role: string
  xp: number
  level: number
  rank_title: string
}

type AuthResponse = {
  message: string
  accessToken: string
  user: AuthUser
}

type RefreshResponse = {
  accessToken: string
}

export type TestCase = { input: unknown[]; expected: unknown }

export type Room = {
  id: string
  status: "waiting" | "live" | "done"
  is_premium: boolean
  prize_pool: number
  winner_id?: string | null
  started_at: string | null
  ended_at: string | null
  created_at: string
  challenge_id: string
  challenge_title: string
  challenge_description?: string
  difficulty: "Easy" | "Medium" | "Hard"
  topic: string | null
  function_name?: string
  examples?: { input: string; output: string }[]
  constraints?: string
  test_cases?: TestCase[]
  player1_id: string | null
  player1_username: string | null
  player2_id: string | null
  player2_username: string | null
}

export type Submission = {
  user_id: string
  tests_passed: number
  tests_total: number
  submitted_at: string
}

// ── Auth endpoints ────────────────────────────────────────────────────────

export const authApi = {
  register: (username: string, email: string, password: string) =>
    apiFetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: { username, email, password },
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  // Called with no accessToken — relies on the httpOnly refreshToken cookie.
  refresh: () => apiFetch<RefreshResponse>("/api/auth/refresh", { method: "POST" }),

  logout: () => apiFetch<{ message: string }>("/api/auth/logout", { method: "POST" }),

  me: (accessToken: string) =>
    apiFetch<{ user: AuthUser }>("/api/auth/me", { accessToken }),
}

// ── Rooms endpoints ───────────────────────────────────────────────────────

export const roomsApi = {
  list: (accessToken: string) =>
    apiFetch<{ rooms: Room[] }>("/api/rooms", { accessToken }),

  get: (id: string, accessToken: string) =>
    apiFetch<{ room: Room; submissions: Submission[] }>(`/api/rooms/${id}`, { accessToken }),

  create: (
    body: { challenge_id: string; is_premium?: boolean; prize_pool?: number },
    accessToken: string
  ) =>
    apiFetch<{ message: string; room: Room }>("/api/rooms", {
      method: "POST",
      body,
      accessToken,
    }),

  // Resume your open room, join a waiting one, or open a new one — whichever applies.
  quickMatch: (accessToken: string) =>
    apiFetch<{ message: string; matched: boolean; room: { id: string } }>(
      "/api/rooms/quickmatch",
      { method: "POST", accessToken }
    ),

  join: (id: string, accessToken: string) =>
    apiFetch<{ message: string; room: Room }>(`/api/rooms/${id}/join`, {
      method: "POST",
      accessToken,
    }),

  submit: (
    id: string,
    body: { code: string; language?: string; tests_passed: number; tests_total: number },
    accessToken: string
  ) =>
    apiFetch<{ message: string; finished: boolean; winner_id?: string | null; draw?: boolean }>(
      `/api/rooms/${id}/submit`,
      { method: "POST", body, accessToken }
    ),
}
