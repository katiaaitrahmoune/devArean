<div align="center">

<!-- LOGO / BANNER -->

```
██████╗ ███████╗██╗   ██╗ █████╗ ██████╗ ███████╗███╗   ██╗ █████╗ 
██╔══██╗██╔════╝██║   ██║██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔══██╗
██║  ██║█████╗  ██║   ██║███████║██████╔╝█████╗  ██╔██╗ ██║███████║
██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══██║██╔══██╗██╔══╝  ██║╚██╗██║██╔══██║
██████╔╝███████╗ ╚████╔╝ ██║  ██║██║  ██║███████╗██║ ╚████║██║  ██║
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝
```

### ⚡ Code. Compete. Conquer. ⚡
**Real-time coding battles · AI code review · Live prize pools**

---

<!-- SHIELDS -->

![License](https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge&logo=opensourceinitiative&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-orange?style=for-the-badge&logo=statuspage&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4?style=for-the-badge&logo=github&logoColor=white)

---

<!-- TECH STACK BADGES -->

### 🛠️ Tech Stack

**Frontend**

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Database & Cache**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

**Payments & AI**

![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

</div>

## 📖 What is DevArena?

> Think **LeetCode** + **Codeforces**, but with live PvP rooms where you duel other devs in real time, stake into **prize pool bounties**, and get your code torn apart by an **AI Oracle** after every battle.

This is not just another coding platform. Every battle is **live**, every submission runs in a **Docker sandbox**, and every loss teaches you something through **streamed Gemini analysis**.

---

## 🎮 Screens & Features

### 🏠 Landing Page
Marketing homepage · Hero CTA · Feature grid · Live battle counter · Bounty preview

### 🔑 Auth
JWT login/register · Google OAuth · Refresh token rotation · Rate-limited endpoints

### 🗺️ Arena Map
Live room lobby · Socket.IO-powered status · Free & premium rooms · Quick match

### ⚔️ Battle Arena
```
┌─────────────────────────────────────────────┐
│  katia_dev ████████░░  VS  player2 ████░░░░ │
│              ⏱️  04:32  remaining            │
├──────────────────────┬──────────────────────┤
│  Monaco Code Editor  │  Problem Description  │
│  (VS Code in-browser)│  + Live test results  │
└──────────────────────┴──────────────────────┘
│  [⚡ Run]  [⚔️ Submit]  [🔥 Ask Oracle]  [✖ Forfeit]  │
```
- Real-time opponent progress via **Socket.IO rooms**
- Code execution in **isolated Docker containers** (via Judge0 API)
- Countdown timer synced across both clients

### 🧙 Hero Dashboard
Player stats · Gear slots · XP level · Language loadout · Activity heatmap (GitHub-style)

### 🏆 Leaderboard
- Global ranking sorted by XP with **Redis sorted sets** (`O(log n)`)
- Gold / Silver / Bronze podium for top 3
- Weekly · Monthly · All-Time filters

### 🤖 AI Oracle Review *(post-battle)*
```
📊 Your solution:   O(n) time  ·  O(n) space   ✅ Optimal
📊 Opponent:        O(n²) time                  ❌ Brute force

💬 Oracle: "Your hash map approach eliminates the nested loop.
            trade O(n) space for O(n) time — that's the key insight..."

🔒 Hint 1 (revealed) · 🔒 Hint 2 (10 XP) · 🔒 Hint 3 (10 XP)
```
Powered by **Gemini API** with streaming responses.

### 💎 Premium & Stripe Checkout
- Free tier · $9/mo Premium · Bounty room staking ($10–$100)
- **Stripe Webhooks** confirm funds before room opens
- Winner paid out automatically after battle

### ⚙️ Admin Dashboard *(admin role only)*
| Section | Description |
|---|---|
| 📋 Challenges | CRUD — create, edit, publish, draft challenges |
| 👥 Users | View all users · Ban / Unban · Role management |
| 💰 Revenue | Stripe revenue chart · Live webhook event log |
| ➕ New Challenge | Form with starter code, test cases, Docker config |

---

## 👥 User Roles

| Role | Access |
|---|---|
| `user` | Join free rooms · 1 Oracle hint per battle · Global leaderboard |
| `premium` | Bounty rooms · Unlimited Oracle · Gold rank frame |
| `admin` | Full platform management · Challenge CRUD · User moderation |

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 20
docker
postgresql
redis
```

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/devarena.git
cd devarena

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/devarena
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI
GEMINI_API_KEY=your_gemini_key

# Judge0 (code execution)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_judge0_key
```

### Run in Development

```bash
# Start the backend
npm run dev:server

# Start the frontend (separate terminal)
npm run dev:client

# Run with Docker Compose (recommended)
docker-compose up --build
```

---

## 🏗️ Architecture

```
devarena/
├── 📁 frontend/          # Next.js 15 App Router
│   ├── app/
│   │   ├── (auth)/       # Login · Register
│   │   ├── arena/        # Lobby · Room list
│   │   ├── battle/[id]/  # Live battle screen
│   │   ├── hero/         # Hero dashboard
│   │   ├── leaderboard/  # Global rankings
│   │   └── admin/        # Admin panel (protected)
│   └── components/
│       ├── MascotFox.tsx
│       ├── CodeEditor.tsx  # Monaco Editor wrapper
│       └── OraclePanel.tsx # Gemini streaming UI
│
├── 📁 backend/           # Node.js + Express
│   ├── routes/
│   │   ├── auth.js       # JWT · OAuth · refresh
│   │   ├── rooms.js      # CRUD rooms
│   │   ├── battles.js    # Submit · run tests
│   │   ├── leaderboard.js
│   │   └── stripe.js     # Checkout · webhooks
│   ├── sockets/
│   │   └── battleRoom.js # Socket.IO room logic
│   ├── services/
│   │   ├── docker.js     # Code sandbox runner
│   │   ├── gemini.js     # AI review streamer
│   │   └── judge0.js     # Judge0 API wrapper
│   └── middleware/
│       ├── auth.js       # JWT verify
│       ├── rateLimiter.js
│       └── adminOnly.js
│
├── 📁 docker/
│   ├── sandbox/          # Isolated code runner image
│   └── docker-compose.yml
│
└── 📁 database/
    └── schema.sql        # PostgreSQL tables
```

---

## ⚡ Key Technical Concepts

### 🐳 Docker Code Sandboxing
User-submitted code runs inside a **freshly-spun container** with:
- No network access
- CPU & memory limits
- Auto-killed after timeout
- Zero persistence between runs

### 🔌 Socket.IO Battle Rooms
```
player joins room → room:join event
opponent submits  → room:opponent_progress broadcast
timer ticks       → room:tick (server-driven, prevents cheating)
battle ends       → room:result + disconnect all
```

### 🔴 Redis Sorted Sets (Leaderboard)
```redis
ZADD leaderboard 9840 "katia_dev"
ZREVRANK leaderboard "katia_dev"   # → 0 (rank #1)
ZREVRANGE leaderboard 0 9          # → top 10
```

### 💳 Stripe Webhook Flow
```
user clicks "Stake & Join"
  → Stripe PaymentIntent created
  → user pays
  → webhook fires payment_intent.succeeded
  → server unlocks the bounty room
  → winner's payout triggered after battle
```

---

## 🗺️ Roadmap

- [x] Auth (JWT + Google OAuth)
- [x] Arena lobby with Socket.IO rooms
- [x] Live battle screen + Monaco editor
- [x] Docker sandboxed code execution
- [x] AI Oracle (Gemini streaming)
- [x] Leaderboard (Redis sorted sets)
- [x] Stripe checkout + webhooks
- [x] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] Team battles (2v2)
- [ ] Weekly tournament mode
- [ ] Discord bot integration
- [ ] Replay system

---

## 🤝 Contributing

```bash
# Fork → Clone → Branch
git checkout -b feat/my-feature

# Make changes, then
git commit -m "feat: add [feature name]"
git push origin feat/my-feature

# Open a Pull Request 🎉
```

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting PRs.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ⚡ by developers, for developers.**

*If this project helped you — drop a ⭐ on GitHub!*

![Visitors](https://img.shields.io/badge/visitors-1%2C204-brightgreen?style=for-the-badge)
![Stars](https://img.shields.io/badge/stars-⭐_give_one!-yellow?style=for-the-badge)
![Made with love](https://img.shields.io/badge/made_with-❤️_and_too_much_coffee-ff6b6b?style=for-the-badge)

</div>
