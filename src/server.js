// src/server.js
// Point d'entrée — importe app et démarre le serveur
import app from "./app.js"

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 DevArena backend running on port ${PORT}`)
})