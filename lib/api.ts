/**
 * lib/api.ts
 * ──────────────────────────────────────────────────────────────────
 * Reusable API client for the FastAPI backend.
 *
 * Backend URL — set NEXT_PUBLIC_API_URL in .env.local to override:
 *   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
 */

import type { FlashcardDeck, QuizItem, PlannerTask } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// ── Raw types (what the backend sends — snake_case) ────────────────

interface ApiSummary {
  total_study_hours: number;
  total_xp: number;
  quizzes_completed: number;
  average_quiz_score: number;
  current_streak: number;
}

interface ApiDayData {
  day: string;
  study_minutes: number;
  xp: number;
  quizzes_taken: number;
}

interface ApiSubjectStat {
  subject: string;
  mastery_pct: number;
  study_minutes: number;
  quizzes_completed: number;
  color_hex: string;
}

interface ApiActivityEntry {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  xp_gained: number;
  score?: number;
  created_at: string;
}

interface ApiAnalyticsResponse {
  summary: ApiSummary;
  weekly_data: ApiDayData[];
  subject_stats: ApiSubjectStat[];
  recent_activity: ApiActivityEntry[];
}

// ── Frontend types (camelCase — used in React components) ──────────

export interface AnalyticsSummary {
  totalStudyHours: number;
  totalXp: number;
  quizzesCompleted: number;
  averageQuizScore: number;
  currentStreak: number;
}

export interface ApiWeekDay {
  day: string;
  studyMinutes: number;
  xp: number;
  quizzesTaken: number;
}

export interface ApiSubject {
  subject: string;
  masteryPct: number;
  studyMinutes: number;
  quizzesCompleted: number;
  colorHex: string;
}

export interface ApiActivity {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  xpGained: number;
  score?: number;
  createdAt: string;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  weeklyData: ApiWeekDay[];
  subjectStats: ApiSubject[];
  recentActivity: ApiActivity[];
}

// ── Fetch helpers ──────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

// ── Flashcards ─────────────────────────────────────────────────────

interface ApiFlashcardDeck {
  id: string;
  title: string;
  subject: string;
  card_count: number;
  mastery_pct: number;
  last_studied_at: string | null;
  color_hex: string;
}

export async function fetchFlashcards(): Promise<FlashcardDeck[]> {
  const raw = await get<ApiFlashcardDeck[]>("/flashcards");
  return raw.map((d) => ({
    id: d.id,
    title: d.title,
    subject: d.subject,
    cardCount: d.card_count,
    masteryPct: d.mastery_pct,
    lastStudiedAt: d.last_studied_at ?? undefined,
    colorHex: d.color_hex,
  }));
}

// ── Flashcard deck with cards ──────────────────────────────────────

interface ApiFlashcardCard {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  mastery_pct: number;
  difficulty: string;
}

interface ApiFlashcardDeckWithCards extends ApiFlashcardDeck {
  cards: ApiFlashcardCard[];
}

export interface FlashcardCard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  masteryPct: number;
  difficulty: string;
}

export async function fetchFlashcardDeck(
  deckId: string,
): Promise<{ deck: FlashcardDeck; cards: FlashcardCard[] }> {
  const raw = await get<ApiFlashcardDeckWithCards>(`/flashcards/${deckId}`);
  return {
    deck: {
      id: raw.id,
      title: raw.title,
      subject: raw.subject,
      cardCount: raw.card_count,
      masteryPct: raw.mastery_pct,
      lastStudiedAt: raw.last_studied_at ?? undefined,
      colorHex: raw.color_hex,
    },
    cards: raw.cards.map((c) => ({
      id: c.id,
      deckId: c.deck_id,
      front: c.front,
      back: c.back,
      masteryPct: c.mastery_pct,
      difficulty: c.difficulty,
    })),
  };
}

// ── Quiz ───────────────────────────────────────────────────────────

interface ApiQuizItem {
  id: string;
  title: string;
  subject: string;
  question_count: number;
  duration_minutes: number;
  difficulty: string;
  completed_at: string | null;
  score: number | null;
  tags: string[];
}

interface ApiQuizQuestion {
  id: string;
  question: string;
  options: string[];
}

interface ApiPerQuestion {
  question_id: string;
  question: string;
  correct: boolean;
  your_answer: number | null;
  correct_answer: number;
  explanation: string;
}

interface ApiQuizSubmitResult {
  quiz_id: string;
  score_pct: number;
  correct_count: number;
  total_count: number;
  xp_earned: number;
  time_used_seconds: number | null;
  grade: string;
  per_question: ApiPerQuestion[];
}

export interface QuizSubmitResult {
  quizId: string;
  scorePct: number;
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  timeUsedSeconds: number | null;
  grade: string;
  perQuestion: Array<{
    questionId: string;
    question: string;
    correct: boolean;
    yourAnswer: number | null;
    correctAnswer: number;
    explanation: string;
  }>;
}

export async function fetchQuizzes(): Promise<QuizItem[]> {
  const raw = await get<ApiQuizItem[]>("/quiz");
  return raw.map((q) => ({
    id: q.id,
    title: q.title,
    subject: q.subject,
    questionCount: q.question_count,
    durationMinutes: q.duration_minutes,
    difficulty: q.difficulty as QuizItem["difficulty"],
    completedAt: q.completed_at ?? undefined,
    score: q.score ?? undefined,
    tags: q.tags,
  }));
}

export async function fetchQuizQuestionIds(quizId: string): Promise<string[]> {
  const raw = await get<{ questions: ApiQuizQuestion[] }>(`/quiz/${quizId}`);
  return raw.questions.map((q) => q.id);
}

export async function submitQuiz(
  quizId: string,
  answers: Record<string, number>,
  timeUsedSeconds: number,
): Promise<QuizSubmitResult> {
  const res = await fetch(`${API_BASE}/quiz/${quizId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, time_used_seconds: timeUsedSeconds }),
  });
  if (!res.ok) throw new Error(`Quiz submit failed: ${res.status}`);
  const raw: ApiQuizSubmitResult = await res.json();
  return {
    quizId: raw.quiz_id,
    scorePct: raw.score_pct,
    correctCount: raw.correct_count,
    totalCount: raw.total_count,
    xpEarned: raw.xp_earned,
    timeUsedSeconds: raw.time_used_seconds,
    grade: raw.grade,
    perQuestion: raw.per_question.map((p) => ({
      questionId: p.question_id,
      question: p.question,
      correct: p.correct,
      yourAnswer: p.your_answer,
      correctAnswer: p.correct_answer,
      explanation: p.explanation,
    })),
  };
}

// ── Planner ────────────────────────────────────────────────────────

interface ApiPlannerTask {
  id: string;
  title: string;
  subject: string;
  type: string;
  priority: string;
  due_at: string;
  estimated_minutes: number;
  completed: boolean;
}

export async function fetchPlanner(): Promise<PlannerTask[]> {
  const raw = await get<ApiPlannerTask[]>("/planner");
  return raw.map((t) => ({
    id: t.id,
    title: t.title,
    subject: t.subject,
    type: t.type as PlannerTask["type"],
    priority: t.priority as PlannerTask["priority"],
    dueAt: t.due_at,
    estimatedMinutes: t.estimated_minutes,
    completed: t.completed,
  }));
}

export async function togglePlannerTask(
  taskId: string,
  completed: boolean,
): Promise<PlannerTask> {
  const res = await fetch(`${API_BASE}/planner/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error(`Planner update failed: ${res.status}`);
  const t: ApiPlannerTask = await res.json();
  return {
    id: t.id,
    title: t.title,
    subject: t.subject,
    type: t.type as PlannerTask["type"],
    priority: t.priority as PlannerTask["priority"],
    dueAt: t.due_at,
    estimatedMinutes: t.estimated_minutes,
    completed: t.completed,
  };
}

// ── Study generator ────────────────────────────────────────────────

interface ApiNoteSection { heading: string; body: string; }

interface ApiStudyResponse {
  session_type: string;
  topic: string;
  subject: string | null;
  xp_reward: number;
  estimated_minutes: number;
  notes: {
    title: string;
    sections: ApiNoteSection[];
    key_takeaways: string[];
    xp_reward: number;
  } | null;
  questions: Array<{
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }> | null;
  cards: Array<{ front: string; back: string }> | null;
}

export interface StudyResult {
  sessionType: string;
  topic: string;
  subject: string | null;
  xpReward: number;
  estimatedMinutes: number;
  notes: {
    title: string;
    sections: Array<{ heading: string; body: string }>;
    keyTakeaways: string[];
    xpReward: number;
  } | null;
  questions: Array<{
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }> | null;
  cards: Array<{ front: string; back: string }> | null;
}

export async function generateStudy(params: {
  topic?: string;
  subject?: string | null;
  flashcardCount: number;
  quizCount: number;
  file?: File | null;
}): Promise<StudyResult> {
  const form = new FormData();
  if (params.topic?.trim()) form.append("topic", params.topic.trim());
  if (params.subject)       form.append("subject", params.subject);
  form.append("flashcard_count", String(params.flashcardCount));
  form.append("quiz_count",      String(params.quizCount));
  if (params.file)          form.append("file", params.file);

  // Do NOT set Content-Type — browser sets multipart/form-data with boundary automatically
  const res = await fetch(`${API_BASE}/study/generate`, { method: "POST", body: form });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ?? `Study generate failed: ${res.status}`);
  }
  const raw: ApiStudyResponse = await res.json();
  return {
    sessionType: raw.session_type,
    topic:       raw.topic,
    subject:     raw.subject,
    xpReward:    raw.xp_reward,
    estimatedMinutes: raw.estimated_minutes,
    notes: raw.notes
      ? {
          title:        raw.notes.title,
          sections:     raw.notes.sections,
          keyTakeaways: raw.notes.key_takeaways,
          xpReward:     raw.notes.xp_reward,
        }
      : null,
    questions: raw.questions ?? null,
    cards:     raw.cards     ?? null,
  };
}

// ── Auth ───────────────────────────────────────────────────────────

interface ApiAuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    xp: number;
    streak: number;
  };
}

export interface AuthResult {
  token: string;
  user: { id: string; name: string; email: string; xp: number; streak: number };
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
    throw new Error(
      typeof err.detail === "string" ? err.detail : `Error ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const raw = await post<ApiAuthResponse>("/auth/login", { email, password });
  return raw;
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  const raw = await post<ApiAuthResponse>("/auth/signup", { name, email, password });
  return raw;
}

// ── Flashcard deck generation ──────────────────────────────────────

export interface GeneratedFlashcardDeck {
  deck: FlashcardDeck;
  cards: FlashcardCard[];
}

export async function generateFlashcardDeck(params: {
  deckName: string;
  subject: string | null;
  topic: string;
  flashcardCount: number;
}): Promise<GeneratedFlashcardDeck> {
  const res = await fetch(`${API_BASE}/flashcards/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deck_name:       params.deckName,
      subject:         params.subject,
      topic:           params.topic,
      flashcard_count: params.flashcardCount,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
    throw new Error(typeof err.detail === "string" ? err.detail : `Error ${res.status}`);
  }
  const raw = await res.json();
  return {
    deck: {
      id:            raw.deck.id,
      title:         raw.deck.title,
      subject:       raw.deck.subject,
      cardCount:     raw.deck.card_count,
      masteryPct:    raw.deck.mastery_pct,
      lastStudiedAt: raw.deck.last_studied_at ?? undefined,
      colorHex:      raw.deck.color_hex,
    },
    cards: raw.cards.map((c: {
      id: string; deck_id: string; front: string; back: string;
      mastery_pct: number; difficulty: string;
    }) => ({
      id:         c.id,
      deckId:     c.deck_id,
      front:      c.front,
      back:       c.back,
      masteryPct: c.mastery_pct,
      difficulty: c.difficulty,
    })),
  };
}

// ── Quiz generation ────────────────────────────────────────────────

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface GeneratedQuiz {
  quizItem: QuizItem;
  questions: GeneratedQuizQuestion[];
}

export async function generateQuiz(params: {
  topic: string;
  subject: string | null;
  questionCount: number;
  difficulty: string;
}): Promise<GeneratedQuiz> {
  const res = await fetch(`${API_BASE}/quiz/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic:          params.topic,
      subject:        params.subject,
      question_count: params.questionCount,
      difficulty:     params.difficulty,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
    throw new Error(typeof err.detail === "string" ? err.detail : `Error ${res.status}`);
  }
  const raw = await res.json();
  const q = raw.quiz;
  return {
    quizItem: {
      id:              q.id,
      title:           q.title,
      subject:         q.subject,
      questionCount:   q.question_count,
      durationMinutes: q.duration_minutes,
      difficulty:      q.difficulty,
      tags:            q.tags,
    },
    questions: q.questions,
  };
}

// ── Analytics ──────────────────────────────────────────────────────

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const raw = await get<ApiAnalyticsResponse>("/analytics");

  return {
    summary: {
      totalStudyHours: raw.summary.total_study_hours,
      totalXp: raw.summary.total_xp,
      quizzesCompleted: raw.summary.quizzes_completed,
      averageQuizScore: raw.summary.average_quiz_score,
      currentStreak: raw.summary.current_streak,
    },
    weeklyData: raw.weekly_data.map((d) => ({
      day: d.day,
      studyMinutes: d.study_minutes,
      xp: d.xp,
      quizzesTaken: d.quizzes_taken,
    })),
    subjectStats: raw.subject_stats.map((s) => ({
      subject: s.subject,
      masteryPct: s.mastery_pct,
      studyMinutes: s.study_minutes,
      quizzesCompleted: s.quizzes_completed,
      colorHex: s.color_hex,
    })),
    recentActivity: raw.recent_activity.map((a) => ({
      id: a.id,
      type: a.type,
      title: a.title,
      subtitle: a.subtitle,
      xpGained: a.xp_gained,
      score: a.score,
      createdAt: a.created_at,
    })),
  };
}
