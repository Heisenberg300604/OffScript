/**
 * Tiny synthesised sound effects for the topic generator.
 *
 * Sounds are generated with the Web Audio API rather than shipped as audio
 * files: no network request, no asset to cache, a few hundred bytes of code,
 * and the pitch can track the reel's deceleration.
 *
 * Browsers block audio until a user gesture, so the context is created lazily
 * on the first play() — which only ever happens from a click.
 */

const MUTE_KEY = "offscript_sfx_muted";

let ctx: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }

  // Autoplay policies suspend the context until a gesture resumes it.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    // Private mode / blocked storage — default to audible.
    return false;
  }
}

/* -------------------------------------------------------------------------
   useSyncExternalStore plumbing

   The mute preference lives in localStorage, which doesn't exist during SSR.
   Exposing it as an external store lets components read it without a
   set-state-in-effect dance and without a hydration mismatch: the server
   snapshot is always "audible", and React re-reads on the client.
   ------------------------------------------------------------------------- */

const listeners = new Set<() => void>();

export function subscribeMuted(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Returns a boolean primitive, so React can compare snapshots safely. */
export function getMutedSnapshot(): boolean {
  return isMuted();
}

export function getMutedServerSnapshot(): boolean {
  return false;
}

export function setMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    // Preference simply won't persist; not worth surfacing.
  }
  listeners.forEach((listener) => listener());
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One reel click. `progress` (0 → 1) walks the pitch up as the reel slows,
 * which is what makes a slot machine feel like it is settling.
 */
export function playTick(progress = 0): void {
  if (isMuted()) return;
  const audio = audioContext();
  if (!audio) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(320 + progress * 260, now);

  // Very short percussive envelope, kept quiet so it never grates.
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

/** Two-note resolve when the reel lands on the final topic. */
export function playLand(): void {
  if (isMuted()) return;
  const audio = audioContext();
  if (!audio) return;

  const now = audio.currentTime;
  // A perfect fifth reads as "settled" without sounding like a game show.
  [
    { freq: 587.33, at: 0, dur: 0.5 }, // D5
    { freq: 880.0, at: 0.09, dur: 0.55 }, // A5
  ].forEach(({ freq, at, dur }) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + at);

    gain.gain.setValueAtTime(0.0001, now + at);
    gain.gain.exponentialRampToValueAtTime(0.13, now + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + at + dur);

    osc.connect(gain).connect(audio.destination);
    osc.start(now + at);
    osc.stop(now + at + dur + 0.02);
  });
}
