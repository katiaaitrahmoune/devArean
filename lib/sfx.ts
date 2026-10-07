// lib/sfx.ts
// Synthesized 8-bit sound effects — no audio files to ship or license.
//
// Every sound is a pure function (ctx, out, startTime, arg) → schedules nodes on
// ANY BaseAudioContext, so the same code runs live and in an OfflineAudioContext
// (which is how I check each one actually produces audio).
//
// Browsers keep audio locked until the user interacts with the page. We unlock on
// the first click / key / tap anywhere; the battle page also shows a small
// "tap to enable sound" chip while it's still locked.

export type SfxName =
  | "join"     // opponent connected
  | "whoosh"   // panels sliding in
  | "vsHit"    // the VS slam
  | "tick"     // 3 / 2 / 1   (arg = the number)
  | "go"       // START!
  | "hit"      // you (or they) just passed tests → HP bar drops
  | "warn"     // last seconds
  | "ko"       // time's up / final blow
  | "victory"
  | "defeat"
  | "draw"
  | "submit"
  | "pass"
  | "fail"

type SoundFn = (ctx: BaseAudioContext, out: AudioNode, t: number, arg?: number) => void

// ── building blocks ──────────────────────────────────────────────────────────
type ToneOpts = {
  type?: OscillatorType
  freq: number
  freqEnd?: number
  at: number
  dur: number
  gain?: number
  attack?: number
}

function tone(ctx: BaseAudioContext, out: AudioNode, o: ToneOpts) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const peak = o.gain ?? 0.3
  const attack = o.attack ?? 0.006
  osc.type = o.type ?? "square"
  osc.frequency.setValueAtTime(o.freq, o.at)
  if (o.freqEnd && o.freqEnd !== o.freq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.freqEnd), o.at + o.dur)
  }
  g.gain.setValueAtTime(0.0001, o.at)
  g.gain.exponentialRampToValueAtTime(peak, o.at + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, o.at + o.dur)
  osc.connect(g).connect(out)
  osc.start(o.at)
  osc.stop(o.at + o.dur + 0.02)
}

type NoiseOpts = {
  at: number
  dur: number
  gain?: number
  filter?: BiquadFilterType
  freq?: number
  freqEnd?: number
  q?: number
  swell?: boolean // fade IN instead of out (whoosh)
}

function noise(ctx: BaseAudioContext, out: AudioNode, o: NoiseOpts) {
  const len = Math.max(1, Math.floor(ctx.sampleRate * o.dur))
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf

  const f = ctx.createBiquadFilter()
  f.type = o.filter ?? "lowpass"
  f.Q.value = o.q ?? 1
  f.frequency.setValueAtTime(o.freq ?? 1500, o.at)
  if (o.freqEnd) f.frequency.exponentialRampToValueAtTime(Math.max(20, o.freqEnd), o.at + o.dur)

  const g = ctx.createGain()
  const peak = o.gain ?? 0.3
  if (o.swell) {
    g.gain.setValueAtTime(0.0001, o.at)
    g.gain.exponentialRampToValueAtTime(peak, o.at + o.dur * 0.7)
    g.gain.exponentialRampToValueAtTime(0.0001, o.at + o.dur)
  } else {
    g.gain.setValueAtTime(peak, o.at)
    g.gain.exponentialRampToValueAtTime(0.0001, o.at + o.dur)
  }
  src.connect(f).connect(g).connect(out)
  src.start(o.at)
}

const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0,
  C6: 1046.5, E6: 1318.5, G6: 1568.0,
}

// ── the sounds ───────────────────────────────────────────────────────────────
export const SOUNDS: Record<SfxName, SoundFn> = {
  join(ctx, out, t) {
    tone(ctx, out, { freq: 660, at: t, dur: 0.09, gain: 0.22 })
    tone(ctx, out, { freq: 990, at: t + 0.09, dur: 0.14, gain: 0.22 })
  },

  whoosh(ctx, out, t) {
    noise(ctx, out, { at: t, dur: 0.55, gain: 0.7, filter: "bandpass", freq: 300, freqEnd: 3800, q: 0.9, swell: true })
  },

  vsHit(ctx, out, t) {
    tone(ctx, out, { type: "sine", freq: 150, freqEnd: 38, at: t, dur: 0.65, gain: 0.7 })       // sub boom
    noise(ctx, out, { at: t, dur: 0.4, gain: 0.55, filter: "lowpass", freq: 3200, freqEnd: 180 }) // crash
    tone(ctx, out, { type: "square", freq: 220, freqEnd: 90, at: t, dur: 0.3, gain: 0.3 })        // crunch
    tone(ctx, out, { type: "square", freq: NOTE.C5, at: t + 0.02, dur: 0.5, gain: 0.12 })         // stab
    tone(ctx, out, { type: "square", freq: NOTE.G5, at: t + 0.02, dur: 0.5, gain: 0.1 })
  },

  tick(ctx, out, t, n = 3) {
    const f = n >= 3 ? NOTE.A4 : n === 2 ? NOTE.C5 : NOTE.E5
    tone(ctx, out, { freq: f, at: t, dur: 0.16, gain: 0.32 })
    tone(ctx, out, { type: "sine", freq: 110, freqEnd: 60, at: t, dur: 0.18, gain: 0.5 })
  },

  go(ctx, out, t) {
    ;[NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f, i) =>
      tone(ctx, out, { freq: f, at: t + i * 0.065, dur: 0.1, gain: 0.26 })
    )
    const chordAt = t + 0.26
    ;[NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f) => {
      tone(ctx, out, { type: "square", freq: f, at: chordAt, dur: 0.75, gain: 0.13 })
      tone(ctx, out, { type: "triangle", freq: f / 2, at: chordAt, dur: 0.75, gain: 0.2 })
    })
    noise(ctx, out, { at: t, dur: 0.6, gain: 0.35, filter: "highpass", freq: 3000, freqEnd: 800 })
    tone(ctx, out, { type: "sine", freq: 130, freqEnd: 45, at: t, dur: 0.5, gain: 0.55 })
  },

  hit(ctx, out, t) {
    noise(ctx, out, { at: t, dur: 0.18, gain: 0.5, filter: "bandpass", freq: 1600, freqEnd: 250, q: 1.4 })
    tone(ctx, out, { type: "square", freq: 320, freqEnd: 70, at: t, dur: 0.18, gain: 0.3 })
    tone(ctx, out, { type: "sine", freq: 120, freqEnd: 50, at: t, dur: 0.2, gain: 0.5 })
  },

  warn(ctx, out, t) {
    tone(ctx, out, { freq: 880, at: t, dur: 0.07, gain: 0.22 })
    tone(ctx, out, { freq: 880, at: t + 0.12, dur: 0.07, gain: 0.22 })
  },

  ko(ctx, out, t) {
    tone(ctx, out, { type: "sine", freq: 95, freqEnd: 28, at: t, dur: 1.2, gain: 0.6 })
    noise(ctx, out, { at: t, dur: 1.0, gain: 0.4, filter: "lowpass", freq: 4200, freqEnd: 90 })
    tone(ctx, out, { type: "sawtooth", freq: 330, freqEnd: 60, at: t, dur: 0.55, gain: 0.18 })
    tone(ctx, out, { type: "square", freq: NOTE.G4, at: t + 0.05, dur: 0.6, gain: 0.14 })
    tone(ctx, out, { type: "square", freq: NOTE.C5, at: t + 0.05, dur: 0.6, gain: 0.14 })
  },

  victory(ctx, out, t) {
    const seq = [NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6]
    seq.forEach((f, i) => {
      tone(ctx, out, { freq: f, at: t + i * 0.11, dur: 0.13, gain: 0.26 })
      tone(ctx, out, { type: "triangle", freq: f / 2, at: t + i * 0.11, dur: 0.13, gain: 0.25 })
    })
    const end = t + seq.length * 0.11
    ;[NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.E6].forEach((f) =>
      tone(ctx, out, { type: "square", freq: f, at: end, dur: 1.1, gain: 0.11 })
    )
    tone(ctx, out, { type: "triangle", freq: NOTE.C4, at: end, dur: 1.1, gain: 0.35 })
    // sparkle
    ;[NOTE.G6, NOTE.E6, NOTE.G6, NOTE.C6].forEach((f, i) =>
      tone(ctx, out, { type: "sine", freq: f, at: end + 0.25 + i * 0.09, dur: 0.12, gain: 0.12 })
    )
  },

  defeat(ctx, out, t) {
    ;[NOTE.G4, 349.23, 311.13, 261.63, 196.0].forEach((f, i) => {
      tone(ctx, out, { type: "triangle", freq: f, freqEnd: f * 0.96, at: t + i * 0.24, dur: 0.26, gain: 0.32 })
      tone(ctx, out, { type: "square", freq: f / 2, at: t + i * 0.24, dur: 0.24, gain: 0.08 })
    })
    tone(ctx, out, { type: "sawtooth", freq: 98, freqEnd: 55, at: t + 1.2, dur: 0.9, gain: 0.25 })
  },

  draw(ctx, out, t) {
    ;[NOTE.A4, NOTE.A4, NOTE.E4].forEach((f, i) =>
      tone(ctx, out, { type: "square", freq: f, at: t + i * 0.22, dur: 0.2, gain: 0.2 })
    )
    tone(ctx, out, { type: "triangle", freq: NOTE.D4, at: t + 0.66, dur: 0.6, gain: 0.25 })
  },

  submit(ctx, out, t) {
    tone(ctx, out, { type: "sine", freq: 500, freqEnd: 1400, at: t, dur: 0.16, gain: 0.3 })
    tone(ctx, out, { freq: NOTE.C6, at: t + 0.14, dur: 0.12, gain: 0.16 })
  },

  pass(ctx, out, t) {
    tone(ctx, out, { freq: NOTE.E5, at: t, dur: 0.07, gain: 0.2 })
    tone(ctx, out, { freq: NOTE.C6, at: t + 0.07, dur: 0.14, gain: 0.2 })
  },

  fail(ctx, out, t) {
    tone(ctx, out, { type: "sawtooth", freq: 150, freqEnd: 90, at: t, dur: 0.22, gain: 0.22 })
  },
}

// ── the live engine ──────────────────────────────────────────────────────────
const MUTE_KEY = "devarena:muted"

class SfxEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private muted = false
  private listeners = new Set<() => void>()
  private hooked = false

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.muted = localStorage.getItem(MUTE_KEY) === "1"
      } catch {
        /* storage may be unavailable */
      }
    }
  }

  /** Create/resume the AudioContext. Must run inside a user gesture the first time. */
  unlock() {
    if (typeof window === "undefined") return
    try {
      if (!this.ctx) {
        const Ctor: typeof AudioContext | undefined =
          window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!Ctor) return
        this.ctx = new Ctor()
        const comp = this.ctx.createDynamicsCompressor() // keeps stacked sounds from clipping
        this.master = this.ctx.createGain()
        this.master.gain.value = 0.6
        this.master.connect(comp).connect(this.ctx.destination)
        this.ctx.onstatechange = () => this.emit()
      }
      if (this.ctx.state === "suspended") void this.ctx.resume().then(() => this.emit())
      this.emit()
    } catch {
      /* audio is a bonus — never break the page */
    }
  }

  /** Unlock on the first interaction anywhere on the page. */
  hookGestures() {
    if (this.hooked || typeof window === "undefined") return
    this.hooked = true
    const handler = () => this.unlock()
    for (const ev of ["pointerdown", "keydown", "touchstart"] as const) {
      window.addEventListener(ev, handler, { passive: true })
    }
  }

  get unlocked() {
    return this.ctx?.state === "running"
  }

  get isMuted() {
    return this.muted
  }

  setMuted(m: boolean) {
    this.muted = m
    try {
      localStorage.setItem(MUTE_KEY, m ? "1" : "0")
    } catch {
      /* ignore */
    }
    this.emit()
  }

  play(name: SfxName, arg?: number) {
    if (this.muted || !this.ctx || !this.master || this.ctx.state !== "running") return
    try {
      SOUNDS[name](this.ctx, this.master, this.ctx.currentTime + 0.01, arg)
    } catch {
      /* ignore */
    }
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private emit() {
    this.listeners.forEach((fn) => fn())
  }
}

export const sfx = new SfxEngine()
