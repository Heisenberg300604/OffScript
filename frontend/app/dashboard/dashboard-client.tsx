"use client";

import Link from "next/link";
import { Brain, Mic, RefreshCw, Search, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getHistory, type CompletedChallenge } from "@/lib/localProgress";

type Topic = {
  title: string;
  category: string;
  level: number;
  tags: string[];
};

const TOPICS_POOL: Topic[] = [
  {
    title: "Why do some abandoned places develop their own miniature ecosystems, and what does it teach us about resilience?",
    category: "Natural Phenomena",
    level: 2,
    tags: ["#Ecology", "#Resilience", "#Nature"]
  },
  {
    title: "What can the psychological design of a supermarket reveal about human decision-making?",
    category: "Behavioral Psychology",
    level: 1,
    tags: ["#Psychology", "#Design", "#Consumerism"]
  },
  {
    title: "Why are certain international borders perfectly straight while others follow completely illogical paths?",
    category: "Strange Geography",
    level: 2,
    tags: ["#Geography", "#History", "#Politics"]
  },
  {
    title: "What would happen to society if every city banned digital advertising for one month?",
    category: "Urban Planning",
    level: 2,
    tags: ["#Society", "#Advertising", "#Cities"]
  },
  {
    title: "Why do some languages have specific words that describe complex emotions English doesn't have?",
    category: "Linguistics",
    level: 2,
    tags: ["#Language", "#Culture", "#Emotion"]
  },
  {
    title: "Why did some ancient societies deliberately build cities around seemingly inconvenient locations?",
    category: "Unusual History",
    level: 3,
    tags: ["#History", "#Architecture", "#Civilization"]
  },
  {
    title: "What happens when a technology designed to save time actually creates more work?",
    category: "Technology",
    level: 2,
    tags: ["#Technology", "#Productivity", "#Paradox"]
  },
  {
    title: "Why do some animals evolve features that appear completely useless or even detrimental?",
    category: "Obscure Science",
    level: 3,
    tags: ["#Evolution", "#Biology", "#Nature"]
  },
  {
    title: "How could a modern city function if cars suddenly disappeared for 48 hours?",
    category: "Urban Planning",
    level: 1,
    tags: ["#Cities", "#Transportation", "#Future"]
  },
  {
    title: "Why do some ancient buildings have surprisingly advanced acoustic properties?",
    category: "Architecture",
    level: 3,
    tags: ["#Acoustics", "#History", "#Design"]
  },
  {
    title: "What unexpected consequences occurred when a government tried to eradicate a specific pest?",
    category: "Unusual History",
    level: 2,
    tags: ["#History", "#Ecology", "#UnintendedConsequences"]
  },
  {
    title: "How does the concept of time differ between cultures, and how does it shape their societies?",
    category: "Anthropology",
    level: 2,
    tags: ["#Time", "#Culture", "#Society"]
  },
  {
    title: "What are the most bizarre and unintended ways people have used everyday objects throughout history?",
    category: "Design",
    level: 1,
    tags: ["#Innovation", "#History", "#Objects"]
  },
  {
    title: "Why do certain mathematical anomalies appear repeatedly in nature?",
    category: "Obscure Science",
    level: 3,
    tags: ["#Math", "#Nature", "#Patterns"]
  }
];

export default function DashboardClient() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [spinningTopic, setSpinningTopic] = useState<Topic | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastCategory, setLastCategory] = useState<string | null>(null);
  const [history, setHistory] = useState<CompletedChallenge[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount and load history
  useEffect(() => {
    // Wrap in function to avoid react-hooks/set-state-in-effect
    const loadData = () => {
      setHistory(getHistory());
    };
    loadData();
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function generateTopic() {
    if (isSpinning) return;
    setIsSpinning(true);
    setTopic(null); // Clear actual topic to trigger entering state

    // Select the final topic, ensuring the category differs from the last one
    const availableTopics = TOPICS_POOL.filter(t => t.category !== lastCategory || TOPICS_POOL.length === 1);
    const finalTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    
    setLastCategory(finalTopic.category);

    let duration = 0;
    const maxDuration = 1400; // Total spin time ~1.4s
    let intervalTime = 40; // Start very fast
    
    const spin = () => {
      // Pick a random topic for the visual effect
      const randomVisualTopic = TOPICS_POOL[Math.floor(Math.random() * TOPICS_POOL.length)];
      setSpinningTopic(randomVisualTopic);
      
      duration += intervalTime;
      
      // Increase the interval time to create an exponential deceleration effect
      intervalTime = intervalTime * 1.18;
      
      if (duration < maxDuration) {
        timerRef.current = setTimeout(spin, intervalTime);
      } else {
        // Land on final topic
        setSpinningTopic(null);
        setTopic(finalTopic);
        setIsSpinning(false);
      }
    };
    
    // Start the spin
    spin();
  }

  const currentDisplayTopic = isSpinning ? spinningTopic : topic;

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center overflow-hidden px-5 py-16 md:ml-64 md:px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c0c1ff] opacity-20 blur-[120px]" />
      
      <div className="relative z-10 flex w-full max-w-[720px] flex-col items-center text-center" aria-live="polite">
        {(isSpinning || topic) ? (
          <div className="flex w-full flex-col gap-6 text-left">
            <div 
              className={`rounded-2xl border border-[#c7c4d7] bg-white p-7 shadow-xl shadow-black/5 md:p-10 min-h-[300px] flex flex-col transition-all duration-300 ${
                isSpinning ? "opacity-80 scale-[0.99] blur-[0.5px]" : "fade-in opacity-100 scale-100 shadow-2xl"
              }`}
            >
              {currentDisplayTopic && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-[#e1e3e4] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#464554]">
                      {currentDisplayTopic.category}
                    </span>
                    <span className="text-xs font-semibold text-[#006c49]">
                      Level {currentDisplayTopic.level}
                    </span>
                  </div>
                  
                  <h1 className="mt-8 text-3xl font-bold leading-tight md:text-5xl flex-1">
                    {currentDisplayTopic.title}
                  </h1>
                  
                  <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
                    {currentDisplayTopic.tags.map((tag) => (
                      <span key={tag} className="rounded bg-[#f3f4f5] px-2 py-1 text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className={`transition-opacity duration-300 ${isSpinning ? "opacity-0 pointer-events-none" : "opacity-100 fade-in flex flex-col gap-6"}`}>
              {!isSpinning && topic && (
                <>
                  <div className="flex items-start gap-4 rounded-xl border border-border bg-[#edeeef] p-4 text-left">
                    <div className="rounded-lg border border-border bg-white p-2 text-muted-foreground">
                      <Search size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#202524]">Need context? Search the web first.</h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        AI can outline a response, but Offscript is about building your own voice. Take 2 minutes to research the facts, form your perspective, and speak without a script.
                      </p>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/recording?topic=${encodeURIComponent(topic.title)}&category=${encodeURIComponent(topic.category)}`} 
                    className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#18201f] !text-[#f5f1e7] text-lg font-bold shadow-lg shadow-black/10 transition-all hover:bg-[#26302e] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b77b] active:scale-[0.99]"
                    style={{ color: "#f5f1e7" }}
                  >
                    <Mic size={22} className="!text-[#f5f1e7]" fill="currentColor" />
                    <span style={{ color: "#f5f1e7" }}>Start speaking challenge</span>
                  </Link>
                  
                  <button 
                    onClick={generateTopic} 
                    className="mx-auto flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline transition-colors"
                  >
                    <RefreshCw size={15} /> Not feeling this one? Generate another.
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 fade-in">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
              <Brain size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Ready for your daily challenge?</h1>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
                Sharpen your unscripted speaking skills. Generate a random, thought-provoking topic to practice speaking naturally.
              </p>
            </div>
            <button 
              onClick={generateTopic} 
              className="flex h-14 items-center gap-2 rounded-xl bg-primary px-10 text-lg font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#2f2ebe]"
            >
              <Sparkles size={20} /> Generate topic
            </button>
          </div>
        )}
      </div>

      {history.length > 0 && !topic && !isSpinning && (
        <div className="relative z-10 mt-20 w-full max-w-[720px] text-left fade-in">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#202524]">Recent challenges</h3>
            <span className="text-sm font-semibold text-muted-foreground">{history.length} completed</span>
          </div>
          <div className="flex flex-col gap-3">
            {history.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-[#e8f3ef] p-1.5 text-[#006c49]">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#202524]">{session.topicTitle}</h4>
                    <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                      <span className="rounded bg-[#f3f4f5] px-2 py-0.5">{session.topicCategory}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {Math.floor(session.durationSeconds / 60)}:{(session.durationSeconds % 60).toString().padStart(2, '0')}</span>
                      <span>{new Date(session.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
