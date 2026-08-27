"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Loader2,
  Mic,
  RefreshCw,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { generateTopicAction } from "@/app/actions/challenges";
import { Button } from "@/components/ui/button";
import {
  getMutedServerSnapshot,
  getMutedSnapshot,
  playLand,
  playTick,
  prefersReducedMotion,
  setMuted,
  subscribeMuted,
} from "@/lib/sfx";

type Topic = { id: string; prompt: string };

/* Reel timing — total spin lands near 2s, which is long enough to read as a
   deliberate draw without making a repeat generate feel slow. */
const FIRST_INTERVAL_MS = 45;
const DECELERATION = 1.17;
const SPIN_DURATION_MS = 2000;

export function TopicGenerator({ alreadyDoneToday }: { alreadyDoneToday: boolean }) {
  const router = useRouter();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [reelText, setReelText] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [starting, setStarting] = useState(false);

  // Read straight from the store — no effect, no hydration mismatch.
  const muted = useSyncExternalStore(
    subscribeMuted,
    getMutedSnapshot,
    getMutedServerSnapshot,
  );

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(!getMutedSnapshot());
  }, []);

  /** Flick through decoy prompts with an easing-out interval, then settle. */
  const spinTo = useCallback((finalTopic: Topic, reel: string[]) => {
    // Honour reduced-motion: no reel, no ticks, just the result.
    if (prefersReducedMotion() || reel.length === 0) {
      setTopic(finalTopic);
      setReelText(null);
      setSpinning(false);
      playLand();
      return;
    }

    setSpinning(true);
    setTopic(null);

    let elapsed = 0;
    let interval = FIRST_INTERVAL_MS;
    let index = Math.floor(Math.random() * reel.length);

    const step = () => {
      index = (index + 1) % reel.length;
      setReelText(reel[index]);

      const progress = Math.min(elapsed / SPIN_DURATION_MS, 1);
      playTick(progress);

      elapsed += interval;
      interval *= DECELERATION;

      if (elapsed < SPIN_DURATION_MS) {
        timerRef.current = window.setTimeout(step, interval);
      } else {
        // Settle on the real topic.
        setReelText(null);
        setTopic(finalTopic);
        setSpinning(false);
        playLand();
      }
    };

    step();
  }, []);

  const generate = useCallback(async () => {
    if (spinning || pending) return;
    setError(null);
    setPending(true);

    const result = await generateTopicAction(topic?.id);
    setPending(false);

    if (result.ok) {
      spinTo(result.data.topic, result.data.reel);
    } else {
      setError(result.error);
    }
  }, [spinning, pending, topic?.id, spinTo]);

  function start() {
    if (!topic) return;
    setStarting(true);
    // Only the id travels — the server re-reads the prompt when saving, so the
    // client can't claim it spoke about something it invented.
    router.push(`/recording?topicId=${encodeURIComponent(topic.id)}`);
  }

  const MuteToggle = (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={muted}
      aria-label={muted ? "Unmute generator sound" : "Mute generator sound"}
      title={muted ? "Sound off" : "Sound on"}
      className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
    </button>
  );

  /* ---------------------------------------------------------------- idle */
  if (!topic && !spinning) {
    return (
      <div className="relative rounded-2xl border border-border bg-card px-6 py-14 text-center">
        <div className="absolute right-3 top-3">{MuteToggle}</div>

        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary">
          <Sparkles size={26} className="text-foreground" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">
          {alreadyDoneToday ? "Go again?" : "Get a topic."}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {alreadyDoneToday
            ? "You've already logged today. Extra sessions still count toward your activity."
            : "You won't know what you're getting. Research it, form a view, then speak for two minutes."}
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          onClick={generate}
          disabled={pending}
          className="mt-8 h-12 rounded-xl px-8 text-base font-semibold"
        >
          {pending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="size-4" /> Generate topic
            </>
          )}
        </Button>
      </div>
    );
  }

  /* ------------------------------------------------------- spinning/result */
  return (
    <div className="flex flex-col gap-5">
      <div
        aria-live="polite"
        aria-busy={spinning}
        className={`topic-reel ${spinning ? "is-spinning" : "is-settled"}`}
      >
        <div className="topic-reel-head">
          <p className="topic-reel-label">
            {spinning ? "Drawing a topic…" : "Your topic"}
          </p>
          {MuteToggle}
        </div>

        <div className="topic-reel-window">
          <p key={reelText ?? topic?.id} className="topic-reel-text">
            {spinning ? reelText : topic?.prompt}
          </p>
        </div>

        {spinning && (
          <div className="topic-reel-bar">
            <i />
          </div>
        )}
      </div>

      {/* Supporting UI stays mounted but inert while the reel spins, so the
          card below doesn't jump once it settles. */}
      <div
        className={`flex flex-col gap-5 transition-opacity duration-300 ${
          spinning ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/50 p-4">
          <div className="mt-0.5 rounded-lg border border-border bg-card p-2 text-muted-foreground">
            <Search size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold">Research first — that&apos;s allowed.</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Read around it, form your own view, then speak in your own words. The
              explanation has to come from you.
            </p>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          onClick={start}
          disabled={starting || spinning}
          className="h-14 w-full rounded-xl text-base font-bold"
        >
          {starting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <Mic className="size-5" /> Start speaking challenge
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={generate}
          disabled={pending || spinning}
          className="mx-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline disabled:opacity-50"
        >
          {pending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          Not feeling this one? Generate another.
        </button>
      </div>
    </div>
  );
}
