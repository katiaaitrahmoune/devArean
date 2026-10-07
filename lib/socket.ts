// lib/socket.ts
// One Socket.IO connection per battle page, authenticated with the same access
// token as the REST API.

import { io, type Socket } from "socket.io-client"
import { getApiUrl, refreshAccessToken } from "./api"

export function createBattleSocket(): Socket {
  const socket = io(getApiUrl(), {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnectionDelay: 400,
    reconnectionDelayMax: 3000,
    // A function, so every (re)connect picks up the LATEST token from storage.
    auth: (cb) => cb({ token: localStorage.getItem("accessToken") ?? "" }),
  })

  // Access tokens live 15 min. If the handshake is refused because the token
  // expired, silently mint a new one from the refresh cookie and retry once.
  let refreshing = false
  socket.on("connect_error", async (err) => {
    if (refreshing) return
    if (err.message === "Token expired" || err.message === "Invalid token" || err.message === "No token provided") {
      refreshing = true
      const fresh = await refreshAccessToken()
      refreshing = false
      if (fresh) socket.connect()
      else if (typeof window !== "undefined") window.location.replace("/login")
    }
  })

  return socket
}
