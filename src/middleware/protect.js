// src/middleware/protect.js
// Middleware d'authentification
// Fonctionne exactement comme dans ZeroWaste
// Vérifie le JWT dans le header Authorization: Bearer <token>
// Si valide → attache req.user et passe au prochain middleware
// Si invalide → 401 Unauthorized

import { verifyAccessToken } from "../utils/jwt.js"
import { query } from "../config/db.js"

export const protect = async (req, res, next) => {
  try {
    // Récupère le token depuis le header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    // Vérifie et décode le token
    // verifyAccessToken lance une erreur si le token est invalide ou expiré
    const decoded = verifyAccessToken(token)

    // Vérifie que l'user existe toujours en DB
    const { rows } = await query(
      "SELECT id, username, email, role, xp, level, wins, losses, rank_title, is_banned FROM users WHERE id = $1",
      [decoded.id]
    )

    if (!rows[0]) {
      return res.status(401).json({ error: "User no longer exists" })
    }

    if (rows[0].is_banned) {
      return res.status(403).json({ error: "Account banned" })
    }

    // Attache l'user à la requête pour les controllers
    req.user = rows[0]
    next()

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" })
    }
    return res.status(401).json({ error: "Invalid token" })
  }
}

// restrictTo — vérifie le rôle
// Usage: router.delete("/user/:id", protect, restrictTo("admin"), deleteUser)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(" or ")}`
      })
    }
    next()
  }
}