export type CompletedChallenge = {
  id: string;
  topicTitle: string;
  topicCategory: string;
  completedAt: string; // ISO String
  durationSeconds: number;
};

const STORAGE_KEY = "offscript_completed_challenges";

export function saveChallenge(challenge: Omit<CompletedChallenge, "id" | "completedAt">): CompletedChallenge {
  const newChallenge: CompletedChallenge = {
    ...challenge,
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  };

  const history = getHistory();
  history.unshift(newChallenge); // Add to beginning

  // Keep last 100 for local storage limits
  const limitedHistory = history.slice(0, 100);
  
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
  }
  
  return newChallenge;
}

export function getHistory(): CompletedChallenge[] {
  if (typeof window === "undefined") return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as CompletedChallenge[];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
}

export function getStreak(): number {
  const history = getHistory();
  if (history.length === 0) return 0;

  // Group by unique dates (YYYY-MM-DD)
  const daysWithActivity = new Set(
    history.map((c) => new Date(c.completedAt).toISOString().split('T')[0])
  );

  let currentStreak = 0;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If there's no activity today or yesterday, streak is 0
  if (!daysWithActivity.has(todayStr) && !daysWithActivity.has(yesterdayStr)) {
    return 0;
  }

  // Calculate streak
  const checkDate = daysWithActivity.has(todayStr) ? new Date(today) : new Date(yesterday);
  
  while (true) {
    const checkStr = checkDate.toISOString().split('T')[0];
    if (daysWithActivity.has(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
}
