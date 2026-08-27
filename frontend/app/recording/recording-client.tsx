"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Download, Loader2, Play, Settings2, X, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  attachVideoUrlAction,
  completeChallengeAction,
} from "@/app/actions/challenges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MINIMUM_DURATION_SECONDS } from "@/lib/validation";

const RING_CIRCUMFERENCE = 282.7;

export default function RecordingClient({
  topicId,
  topicPrompt,
}: {
  topicId: string;
  topicPrompt: string;
}) {
  const router = useRouter();

  const [seconds, setSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [selectedAudioId, setSelectedAudioId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  /**
   * README: "minimum 2 minutes". The timer keeps counting past the threshold —
   * `complete` only unlocks finishing, it never stops the clock.
   */
  const complete = seconds >= MINIMUM_DURATION_SECONDS;
  const saved = challengeId !== null;

  useEffect(() => {
    if (!hasStarted || saved) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [hasStarted, saved]);

  useEffect(() => {
    let cancelled = false;

    async function setupCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: selectedVideoId ? { deviceId: { exact: selectedVideoId } } : true,
          audio: selectedAudioId ? { deviceId: { exact: selectedAudioId } } : true,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) return;
        setDevices(allDevices);

        if (!selectedVideoId) {
          const defaultVideo = allDevices.find((d) => d.kind === "videoinput");
          if (defaultVideo) setSelectedVideoId(defaultVideo.deviceId);
        }
        if (!selectedAudioId) {
          const defaultAudio = allDevices.find((d) => d.kind === "audioinput");
          if (defaultAudio) setSelectedAudioId(defaultAudio.deviceId);
        }
        setCameraError(false);
      } catch (error) {
        console.warn("Camera access denied or unavailable", error);
        if (!cancelled) setCameraError(true);
      }
    }

    setupCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedVideoId, selectedAudioId]);

  function startChallenge() {
    setHasStarted(true);
    if (!streamRef.current) return;

    try {
      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : undefined,
      });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoUrl(URL.createObjectURL(blob));
      };

      recorder.start();
    } catch (error) {
      console.error("MediaRecorder setup failed", error);
    }
  }

  async function handleFinish() {
    if (!complete || saving) return;

    setSaving(true);
    setSaveError(null);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());

    const result = await completeChallengeAction({ topicId, durationSeconds: seconds });

    if (result.ok) {
      setChallengeId(result.data.challengeId);
    } else {
      setSaveError(result.error);
    }
    setSaving(false);
  }

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  const ringProgress =
    Math.min(seconds / MINIMUM_DURATION_SECONDS, 1) * RING_CIRCUMFERENCE;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-[720px] text-center">
        <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
          Unscripted speaking challenge
        </span>
        <h1 className="mt-5 text-2xl font-bold leading-snug md:text-4xl">
          {topicPrompt}
        </h1>

        {challengeId !== null ? (
          <CompletionPanel
            challengeId={challengeId}
            recordingUrl={videoUrl}
            seconds={seconds}
            onDone={() => router.push("/dashboard")}
          />
        ) : !hasStarted ? (
          <div className="mt-14 flex flex-col items-center">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-left">
              <div className="mb-5 flex items-center gap-2">
                <Settings2 size={18} />
                <h2 className="font-bold">Device setup</h2>
              </div>

              <div className="flex flex-col gap-4">
                <DeviceSelect
                  label="Camera"
                  value={selectedVideoId}
                  disabled={cameraError}
                  placeholder="Camera unavailable"
                  options={devices.filter((d) => d.kind === "videoinput")}
                  onChange={setSelectedVideoId}
                />
                <DeviceSelect
                  label="Microphone"
                  value={selectedAudioId}
                  disabled={cameraError}
                  placeholder="Microphone unavailable"
                  options={devices.filter((d) => d.kind === "audioinput")}
                  onChange={setSelectedAudioId}
                />
              </div>

              {cameraError && (
                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  No camera or mic access. You can still run the challenge and
                  speak — nothing will be recorded.
                </p>
              )}
            </div>

            <Button
              onClick={startChallenge}
              className="mt-8 h-14 w-64 rounded-xl text-base font-bold"
            >
              <Play className="size-5" /> Start challenge
            </Button>
            <Link
              href="/dashboard"
              className="mt-3 py-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span
                className={`size-2.5 rounded-full ${
                  complete ? "bg-[#00885d]" : "animate-pulse bg-destructive"
                }`}
              />
              {complete ? "Minimum reached — keep going" : "Live challenge"}
            </div>

            <div className="relative mt-8 size-60">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(32,37,36,0.10)"
                  strokeWidth="4"
                />
                <circle
                  className="transition-all duration-1000 ease-linear"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={complete ? "#00885d" : "#d8b77b"}
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_CIRCUMFERENCE - ringProgress}
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`font-mono text-5xl font-bold tabular-nums ${
                    complete ? "text-[#00885d]" : ""
                  }`}
                >
                  {minutes}:{remainder}
                </span>
                <span className="mt-2 max-w-[170px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {complete ? "Minimum met" : "Minimum 2:00"}
                </span>
              </div>
            </div>

            {!complete && (
              <p className="mt-8 rounded-lg bg-foreground px-4 py-2 text-xs text-background">
                Keep speaking for {MINIMUM_DURATION_SECONDS - seconds} more seconds.
              </p>
            )}

            {saveError && (
              <p role="alert" className="mt-6 text-sm text-destructive">
                {saveError}
              </p>
            )}

            <Button
              onClick={handleFinish}
              disabled={!complete || saving}
              className="mt-8 h-14 w-56 rounded-xl text-base font-bold"
            >
              {saving ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <Check className="size-5" /> Finish challenge
                </>
              )}
            </Button>

            <Link
              href="/dashboard"
              className="mt-3 inline-flex items-center gap-1.5 py-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <X size={15} /> Cancel session
            </Link>
          </div>
        )}
      </div>

      {!saved && (
        <div className="fixed bottom-6 right-6 z-50 hidden w-44 rounded-xl border border-border bg-card p-3 md:block">
          <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted">
            {cameraError ? (
              <span className="px-3 text-center text-[11px] font-semibold leading-4">
                Camera off
                <span className="mt-1 block font-normal text-muted-foreground">
                  Practice mode
                </span>
              </span>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 size-full -scale-x-100 object-cover"
                />
                <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  LIVE
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function DeviceSelect({
  label,
  value,
  options,
  disabled,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: MediaDeviceInfo[];
  disabled: boolean;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        className="h-11 rounded-lg border border-border bg-muted px-3 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {disabled && <option>{placeholder}</option>}
        {options.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `${label} ${device.deviceId.slice(0, 5)}`}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Post-completion step. The challenge is already saved at this point — the
 * YouTube link is strictly optional and attached separately.
 */
function CompletionPanel({
  challengeId,
  recordingUrl,
  seconds,
  onDone,
}: {
  challengeId: string;
  recordingUrl: string | null;
  seconds: number;
  onDone: () => void;
}) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  async function attach() {
    setStatus("saving");
    setError(null);
    const result = await attachVideoUrlAction({ challengeId, videoUrl: url });
    if (result.ok) {
      setStatus("saved");
    } else {
      setError(result.error);
      setStatus("idle");
    }
  }

  const spoken = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="mt-14 flex flex-col items-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
        <Check size={40} strokeWidth={3} className="text-foreground" />
      </div>
      <h2 className="mt-6 text-2xl font-bold">Challenge complete</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        You spoke for {spoken}. Saved to your history.
      </p>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 text-left">
        <div className="flex items-center gap-2">
          <Video size={18} />
          <h3 className="font-bold">Archive it (optional)</h3>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Upload your recording to YouTube as <strong>Unlisted</strong>, then paste
          the link here to keep it with this challenge.
        </p>

        {status === "saved" ? (
          <p className="mt-4 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-semibold">
            Link saved.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="h-11 flex-1 rounded-xl bg-background px-3"
              />
              <Button
                onClick={attach}
                disabled={!url.trim() || status === "saving"}
                className="h-11 rounded-xl px-4"
              >
                {status === "saving" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        {recordingUrl && (
          <a
            href={recordingUrl}
            download={`offscript-${new Date().toISOString().split("T")[0]}.webm`}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card font-semibold transition hover:bg-muted"
          >
            <Download size={17} /> Download recording
          </a>
        )}
        <Button onClick={onDone} className="h-12 rounded-xl font-semibold">
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
