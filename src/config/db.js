// src/config/db.js
// Pool de connexions PostgreSQL
// Un pool = plusieurs connexions réutilisables → plus performant qu'une seule connexion
// pg.Pool gère ça automatiquement

import pg from "pg"
import dotenv from "dotenv"

dotenv.config()
const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Neon PostgreSQL requiert SSL
    // rejectUnauthorized: false = accepte le certificat self-signed de Neon
    rejectUnauthorized: false,
  },
})

// Test de connexion au démarrage
pool.connect((err, client, release) => {
 if (err) {
  console.error("❌ Database connection error:")
  console.error(err)
} else {
    console.log("✅ Database connected")
    release()
  }
})

// query() = la fonction qu'on utilisera partout pour faire des requêtes SQL
// Exemple : await query("SELECT * FROM users WHERE id = $1", [userId])
export const query = (text, params) => pool.query(text, params)

export default pool