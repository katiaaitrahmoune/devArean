// src/app.js
// Configure Express — middlewares, routes
// Séparé de server.js pour pouvoir importer app dans les tests sans démarrer le serveur

import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import rateLimit from "express-rate-limit"
import authRoutes from "./routes/auth.routes.js"

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV })
})

// 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal server error" })
})

export default app