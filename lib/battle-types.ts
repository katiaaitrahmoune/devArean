// lib/battle-types.ts
// Shapes of what the backend's Socket.IO layer sends (see backend src/services/battle.service.js).

import type { TestCase } from "./api"

export type BattlePhase = "waiting" | "intro" | "active" | "finished"

export type BattlePlayer = {
  id: string
  username: string
  level: number
  rank_title: string
}

export type BattleChallenge = {
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  topic: string | null
  description: string
  examples?: { input: string; output: string }[] | null
  constraints?: string | null
  tests_total: number
  // players only — spectators never receive these
  function_name?: string
  test_cases?: TestCase[]
}

export type BattleResultPlayer = {
  user_id: string
  username: string
  tests_passed: number
  tests_total: number
  submitted: boolean
  xp_gain: number
  outcome: "win" | "loss" | "draw"
}

export type BattleResult = {
  winner_id: string | null
  draw: boolean
  reason: "solved" | "both_submitted" | "time_up" | "finished"
  players: BattleResultPlayer[]
}

export type BattleSnapshot = {
  version: number
  serverNow: number
  role: "player1" | "player2" | "spectator"
  room: {
    id: string
    status: "waiting" | "live" | "done"
    is_premium: boolean
    prize_pool: number
    winner_id: string | null
    challenge_title: string
    difficulty: "Easy" | "Medium" | "Hard"
    topic: string | null
    tests_total: number
    player1: BattlePlayer | null
    player2: BattlePlayer | null
  }
  presence: Record<string, boolean | number> // userId → online, plus `spectators` count
  battle: {
    phase: BattlePhase
    introAt: number | null
    countAt: number | null
    goAt: number | null
    endsAt: number | null
    durationMs: number
    countFrom: number
    countStepMs: number
  }
  challenge: BattleChallenge | null
  progress: Record<string, { passed: number; total: number }>
  submitted: Record<string, true>
  result: BattleResult | null
}
