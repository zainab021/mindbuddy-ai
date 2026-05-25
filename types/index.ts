/* ─── Domain types ─────────────────────────────────────────────────────── */

export type Difficulty = "easy" | "medium" | "hard";
export type ActivityType = "quiz" | "flashcard" | "study" | "achievement" | "streak";
export type TaskType = "quiz" | "flashcard" | "study" | "revision";
export type Priority = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalStudyMinutes: number;
  subjects: string[];
  joinedAt: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  icon: string;
  accentClass: string;
  glowClass: string;
}

export interface DayData {
  day: string;
  studyMinutes: number;
  xp: number;
  quizzesTaken: number;
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  xpGained: number;
  score?: number;
  createdAt: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  rationale: string;
  subject: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  actionType: "quiz" | "flashcard" | "study";
  matchPct: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  cardCount: number;
  masteryPct: number;
  lastStudiedAt?: string;
  colorHex: string;
}

export interface QuizItem {
  id: string;
  title: string;
  subject: string;
  questionCount: number;
  durationMinutes: number;
  difficulty: Difficulty;
  completedAt?: string;
  score?: number;
  tags: string[];
}

export interface SubjectStat {
  subject: string;
  masteryPct: number;
  studyMinutes: number;
  quizzesCompleted: number;
  colorHex: string;
}

export interface PlannerTask {
  id: string;
  title: string;
  subject: string;
  type: TaskType;
  priority: Priority;
  dueAt: string;
  estimatedMinutes: number;
  completed: boolean;
}
