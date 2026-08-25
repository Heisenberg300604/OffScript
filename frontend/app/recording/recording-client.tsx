"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, CircleStop, X, Home, Play, Download, Settings2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { saveChallenge } from "@/lib/localProgress";

export default function RecordingClient() {
  const searchParams = useSearchParams();
  const topicTitle = searchParams.get("topic") || "Why do some abandoned places develop their own miniature ecosystems?";
  const topicCategory = searchParams.get("category") || "Practice Session";
  
  const [seconds, setSeconds] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [selectedAudioId, setSelectedAudioId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const complete = seconds >= 120;
  
  // Timer effect
  useEffect(() => {
    if (!hasStarted || sessionSaved) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.min(value + 1, 120)), 1000);
    return () => window.clearInterval(timer);
  }, [hasStarted, sessionSaved]);

  // Camera effect
  useEffect(() => {
    async function setupCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        const constraints = {
          video: selectedVideoId ? { deviceId: { exact: selectedVideoId } } : true,
          audio: selectedAudioId ? { deviceId: { exact: selectedAudioId } } : true,
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Get devices for dropdowns
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        setDevices(allDevices);
        
        if (!selectedVideoId) {
          const defaultVideo = allDevices.find(d => d.kind === 'videoinput');
          if (defaultVideo) setSelectedVideoId(defaultVideo.deviceId);
        }
        if (!selectedAudioId) {
          const defaultAudio = allDevices.find(d => d.kind === 'audioinput');
          if (defaultAudio) setSelectedAudioId(defaultAudio.deviceId);
        }
        setCameraError(false);
      } catch (err) {
        console.warn("Camera access denied or unavailable", err);
        setCameraError(true);
      }
    }
    
    setupCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedVideoId, selectedAudioId]);

  function startChallenge() {
    setHasStarted(true);
    if (streamRef.current) {
      try {
        const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
        };
        
        mediaRecorder.start();
      } catch (e) {
        console.error("MediaRecorder setup failed", e);
      }
    }
  }

  function handleFinish() {
    if (!complete && seconds < 1) return; // Allow finishing early for testing/cancel
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    saveChallenge({
      topicTitle,
      topicCategory,
      durationSeconds: seconds,
    });
    setSessionSaved(true);
  }
  
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remaining = String(seconds % 60).padStart(2, "0");
  const progress = (seconds / 120) * 282.7;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div className="w-full max-w-[720px] text-center">
        <span className="rounded-full bg-[#efe7d9] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#18201f]">
          Unscripted Speaking Challenge
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl text-[#202524]">
          {topicTitle}
        </h1>
        
        {sessionSaved ? (
          <div className="relative mt-16 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="flex size-24 items-center justify-center rounded-full bg-[#e8f3ef] text-[#006c49] shadow-sm">
              <Check size={48} strokeWidth={3} />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-[#202524]">Challenge Complete</h2>
            <p className="mt-3 max-w-sm text-center text-muted-foreground">
              Great job practicing your unscripted communication. Your session has been saved to your local history.
            </p>
            
            <div className="mt-10 flex flex-col items-center gap-4">
              {videoUrl && (
                <a 
                  href={videoUrl}
                  download={`offscript-${new Date().toISOString().split('T')[0]}.webm`}
                  className="flex h-12 w-64 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-white shadow-lg transition hover:bg-[#2f2ebe]"
                >
                  <Download size={18} /> Download Video
                </a>
              )}
              <Link 
                href="/dashboard" 
                className="flex h-12 w-64 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 font-bold text-[#202524] shadow-sm transition hover:bg-gray-50"
              >
                <Home size={18} /> Return to Dashboard
              </Link>
            </div>
          </div>
        ) : !hasStarted ? (
          <div className="relative mt-16 flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl shadow-black/5">
              <div className="mb-6 flex items-center gap-2 text-[#202524]">
                <Settings2 size={20} />
                <h3 className="text-lg font-bold">Device Setup</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Camera</label>
                  <select 
                    className="rounded-lg border border-border bg-[#f3f4f5] p-3 text-sm font-semibold text-[#202524] outline-none focus:ring-2 focus:ring-primary"
                    value={selectedVideoId}
                    onChange={(e) => setSelectedVideoId(e.target.value)}
                    disabled={cameraError}
                  >
                    {cameraError && <option>Camera unavailable</option>}
                    {devices.filter(d => d.kind === 'videoinput').map(d => (
                      <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0,5)}`}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Microphone</label>
                  <select 
                    className="rounded-lg border border-border bg-[#f3f4f5] p-3 text-sm font-semibold text-[#202524] outline-none focus:ring-2 focus:ring-primary"
                    value={selectedAudioId}
                    onChange={(e) => setSelectedAudioId(e.target.value)}
                    disabled={cameraError}
                  >
                    {cameraError && <option>Microphone unavailable</option>}
                    {devices.filter(d => d.kind === 'audioinput').map(d => (
                      <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone ${d.deviceId.slice(0,5)}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <button 
              onClick={startChallenge}
              className="mt-10 flex h-14 w-64 items-center justify-center gap-2 rounded-xl bg-[#18201f] text-lg font-bold text-[#f5f1e7] shadow-lg transition-all hover:bg-[#283230] hover:shadow-xl active:scale-95"
            >
              <Play size={20} fill="currentColor" /> Start Challenge
            </button>
            
            <Link 
              href="/dashboard" 
              className="mt-4 flex h-12 w-64 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-muted-foreground transition hover:text-[#202524]"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="relative mt-20 flex flex-col items-center">
            <div className="absolute -top-14 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
              <span className={`size-3 rounded-full ${complete ? "bg-[#00885d]" : "bg-[#ef4444] animate-pulse"}`} />
              {complete ? "Minimum target reached" : "Live Challenge"}
            </div>
            
            <div className="relative size-64">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e1e3e4" strokeWidth="4" />
                <circle 
                  className="transition-all duration-1000 ease-linear" 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke={complete ? "#006c49" : "#d8b77b"} 
                  strokeDasharray="282.7" 
                  strokeDashoffset={282.7 - progress} 
                  strokeLinecap="round" 
                  strokeWidth="4" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-mono text-5xl font-bold tabular-nums ${complete ? "text-[#006c49]" : "text-[#202524]"}`}>
                  {minutes}:{remaining}
                </span>
                <span className="mt-2 max-w-[170px] text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {complete ? "Target met. Continue as long as you like." : "Target: 2:00"}
                </span>
              </div>
            </div>
          </div>
        )}

        {!sessionSaved && hasStarted && (
          <div className="relative mt-16 flex w-full flex-col items-center gap-3">
            <p className={`absolute -top-12 rounded-lg bg-[#202524] px-4 py-2 text-xs text-[#f5f1e7] transition-opacity ${complete ? "opacity-0" : "opacity-90"}`}>
              Keep speaking for {Math.max(0, 120 - seconds)} more seconds without stopping.
            </p>
            
            <button 
              onClick={handleFinish}
              disabled={!complete}
              className={`flex h-14 w-52 items-center justify-center gap-2 rounded-xl text-lg font-bold transition ${
                complete 
                  ? "bg-[#18201f] text-[#f5f1e7] shadow-lg hover:bg-[#283230]" 
                  : "bg-[#e1e3e4] text-muted-foreground pointer-events-none opacity-50"
              }`}
            >
              <Check size={20} /> Finish challenge
            </button>
            
            <Link 
              href="/dashboard" 
              className="flex h-12 w-52 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-[#464554] transition hover:bg-[#edeeef]"
            >
              <X size={18} /> Cancel session
            </Link>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 hidden w-48 overflow-hidden rounded-xl border border-border bg-white p-3 shadow-lg md:block z-50">
        <div className="relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-[#f4f1e9] border border-dashed border-[#c7c4d7]">
          {cameraError ? (
            <div className="flex flex-col items-center justify-center p-4 text-center text-xs font-semibold text-[#18201f]">
              <span>Camera &amp; Audio Blocked</span>
              <span className="mt-2 text-[10px] font-normal text-muted-foreground">Practice mode active</span>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 size-full object-cover rounded-lg transform -scale-x-100" 
            />
          )}
          {!cameraError && (
            <div className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-sm">
              LIVE
            </div>
          )}
        </div>
      </div>

      <CircleStop className="fixed left-6 top-6 text-muted-foreground opacity-40" size={24} />
    </main>
  );
}
