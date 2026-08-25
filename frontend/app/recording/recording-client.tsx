"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, CircleStop, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function RecordingClient() {
  const searchParams = useSearchParams();
  const topicTitle = searchParams.get("topic") || "Why do some abandoned places develop their own miniature ecosystems?";
  
  const [seconds, setSeconds] = useState(0);
  const complete = seconds >= 120;
  
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => Math.min(value + 1, 120)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  
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

        <div className="relative mt-16 flex w-full flex-col items-center gap-3">
          <p className={`absolute -top-12 rounded-lg bg-[#202524] px-4 py-2 text-xs text-[#f5f1e7] transition-opacity ${complete ? "opacity-0" : "opacity-90"}`}>
            Keep speaking for {Math.max(0, 120 - seconds)} more seconds without stopping.
          </p>
          
          <Link 
            href="/dashboard"
            className={`flex h-14 w-52 items-center justify-center gap-2 rounded-xl text-lg font-bold transition ${
              complete 
                ? "bg-[#18201f] text-[#f5f1e7] shadow-lg hover:bg-[#283230]" 
                : "bg-[#e1e3e4] text-muted-foreground pointer-events-none opacity-50"
            }`}
          >
            <Check size={20} /> Finish challenge
          </Link>
          
          <Link 
            href="/dashboard" 
            className="flex h-12 w-52 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-[#464554] transition hover:bg-[#edeeef]"
          >
            <X size={18} /> Cancel session
          </Link>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 hidden w-48 overflow-hidden rounded-xl border border-border bg-white p-3 shadow-lg md:block">
        <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-lg bg-[#f4f1e9] p-4 text-center text-xs font-semibold text-[#18201f] border border-dashed border-[#c7c4d7]">
          <span>Camera &amp; Audio Stream</span>
          <span className="mt-2 text-[10px] font-normal text-muted-foreground">Practice mode active</span>
        </div>
      </div>

      <CircleStop className="fixed left-6 top-6 text-muted-foreground opacity-40" size={24} />
    </main>
  );
}
