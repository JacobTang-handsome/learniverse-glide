export type Language = "Spanish" | "Catalan" | "Italian";
export type Level = "A0" | "A1" | "A2" | "B1";
export type Goal =
  | "Travel"
  | "Study Abroad"
  | "Daily Communication"
  | "Interest";
export type Topic = "Food" | "Campus" | "Travel" | "Music" | "History";
export type DailyMinutes = 15 | 30 | 60;

export type Profile = {
  email: string;
  language: Language;
  level: Level;
  goal: Goal;
  topics: Topic[];
  dailyMinutes: DailyMinutes;
};

const KEY = "llm.profile";

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}