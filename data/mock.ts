import type {
  User, StatItem, DayData, ActivityEntry, AISuggestion,
  FlashcardDeck, QuizItem, SubjectStat, PlannerTask,
} from "@/types";

/* ─── User ─────────────────────────────────────────────────────────────── */

export const MOCK_USER: User = {
  id: "u_01",
  name: "Alex Rivera",
  email: "alex@student.edu",
  level: 14,
  xp: 3_240,
  xpToNextLevel: 5_000,
  streak: 12,
  totalStudyMinutes: 2_860,
  subjects: ["Mathematics", "Physics", "Computer Science", "Chemistry"],
  joinedAt: "2024-01-15T00:00:00Z",
};

/* ─── Dashboard stats ───────────────────────────────────────────────────── */

export const MOCK_STATS: StatItem[] = [
  {
    id: "streak",
    label: "Study Streak",
    value: "12 days",
    delta: 20,
    deltaLabel: "vs last week",
    icon: "Flame",
    accentClass: "text-orange-400",
    glowClass: "shadow-[0_0_20px_rgba(251,146,60,0.25)]",
  },
  {
    id: "xp",
    label: "Total XP",
    value: "3,240",
    delta: 15,
    deltaLabel: "this week",
    icon: "Zap",
    accentClass: "text-violet-400",
    glowClass: "shadow-[0_0_20px_rgba(167,139,250,0.25)]",
  },
  {
    id: "time",
    label: "Study Time",
    value: "4h 22m",
    delta: 8,
    deltaLabel: "today",
    icon: "Clock",
    accentClass: "text-cyan-400",
    glowClass: "shadow-[0_0_20px_rgba(34,211,238,0.25)]",
  },
  {
    id: "quiz",
    label: "Quiz Avg",
    value: "87%",
    delta: 5,
    deltaLabel: "all time",
    icon: "Target",
    accentClass: "text-emerald-400",
    glowClass: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
  },
];

/* ─── Weekly data ───────────────────────────────────────────────────────── */

export const MOCK_WEEKLY: DayData[] = [
  { day: "Mon", studyMinutes: 45,  xp: 320, quizzesTaken: 2 },
  { day: "Tue", studyMinutes: 90,  xp: 580, quizzesTaken: 4 },
  { day: "Wed", studyMinutes: 60,  xp: 410, quizzesTaken: 3 },
  { day: "Thu", studyMinutes: 125, xp: 760, quizzesTaken: 5 },
  { day: "Fri", studyMinutes: 75,  xp: 490, quizzesTaken: 3 },
  { day: "Sat", studyMinutes: 155, xp: 930, quizzesTaken: 6 },
  { day: "Sun", studyMinutes: 35,  xp: 210, quizzesTaken: 1 },
];

/* ─── Activity feed ─────────────────────────────────────────────────────── */

const ago = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

export const MOCK_ACTIVITY: ActivityEntry[] = [
  { id: "a1", type: "quiz",        title: "Calculus Derivatives",      subtitle: "Scored 92% · 15 questions",    xpGained: 180, score: 92, createdAt: ago(28) },
  { id: "a2", type: "flashcard",   title: "Quantum Mechanics Deck",    subtitle: "Reviewed 24 cards",            xpGained: 120,            createdAt: ago(110) },
  { id: "a3", type: "achievement", title: "7-Day Streak Unlocked",     subtitle: "Badge: Consistency Champion",  xpGained: 250,            createdAt: ago(290) },
  { id: "a4", type: "study",       title: "Organic Chemistry Notes",   subtitle: "Session · 45 minutes",        xpGained: 90,             createdAt: ago(1_450) },
  { id: "a5", type: "quiz",        title: "Newton's Laws",             subtitle: "Scored 78% · 10 questions",   xpGained: 140, score: 78, createdAt: ago(1_550) },
  { id: "a6", type: "flashcard",   title: "Linear Algebra Deck",       subtitle: "Reviewed 18 cards",           xpGained: 90,             createdAt: ago(2_900) },
];

/* ─── AI Suggestions ────────────────────────────────────────────────────── */

export const MOCK_SUGGESTIONS: AISuggestion[] = [
  {
    id: "s1",
    title: "Integration Techniques",
    rationale: "You scored 62% on u-substitution last session. A focused drill will close that gap.",
    subject: "Mathematics",
    difficulty: "medium",
    estimatedMinutes: 25,
    actionType: "quiz",
    matchPct: 94,
  },
  {
    id: "s2",
    title: "Thermodynamics Flashcards",
    rationale: "Spaced repetition indicates 16 cards are due today for optimal long-term retention.",
    subject: "Physics",
    difficulty: "hard",
    estimatedMinutes: 15,
    actionType: "flashcard",
    matchPct: 89,
  },
  {
    id: "s3",
    title: "Recursion & Tree Traversal",
    rationale: "Data structures score can jump 12+ points with this 30-min targeted session.",
    subject: "Computer Science",
    difficulty: "medium",
    estimatedMinutes: 30,
    actionType: "study",
    matchPct: 87,
  },
  {
    id: "s4",
    title: "Periodic Table Trends",
    rationale: "Quick 10-min drill on electronegativity & ionization before tomorrow's test.",
    subject: "Chemistry",
    difficulty: "easy",
    estimatedMinutes: 10,
    actionType: "quiz",
    matchPct: 91,
  },
];

/* ─── Subject stats ─────────────────────────────────────────────────────── */

export const MOCK_SUBJECT_STATS: SubjectStat[] = [
  { subject: "Mathematics",     masteryPct: 72, studyMinutes: 840, quizzesCompleted: 14, colorHex: "#7c3aed" },
  { subject: "Physics",         masteryPct: 58, studyMinutes: 620, quizzesCompleted: 11, colorHex: "#2563eb" },
  { subject: "Computer Science",masteryPct: 84, studyMinutes: 960, quizzesCompleted: 18, colorHex: "#4f46e5" },
  { subject: "Chemistry",       masteryPct: 45, studyMinutes: 480, quizzesCompleted:  8, colorHex: "#0891b2" },
];

/* ─── Flashcard decks ───────────────────────────────────────────────────── */

export const MOCK_DECKS: FlashcardDeck[] = [
  { id: "d1", title: "Calculus Fundamentals",   subject: "Mathematics",     cardCount: 48, masteryPct: 72, lastStudiedAt: ago(60),    colorHex: "#7c3aed" },
  { id: "d2", title: "Quantum Mechanics",        subject: "Physics",         cardCount: 36, masteryPct: 58, lastStudiedAt: ago(120),   colorHex: "#2563eb" },
  { id: "d3", title: "Organic Reactions",        subject: "Chemistry",       cardCount: 62, masteryPct: 45, lastStudiedAt: ago(1_440), colorHex: "#0891b2" },
  { id: "d4", title: "Data Structures",          subject: "Computer Science",cardCount: 41, masteryPct: 81, lastStudiedAt: ago(2_880), colorHex: "#4f46e5" },
  { id: "d5", title: "Electromagnetic Fields",   subject: "Physics",         cardCount: 29, masteryPct: 33,                            colorHex: "#d97706" },
  { id: "d6", title: "Linear Algebra",           subject: "Mathematics",     cardCount: 55, masteryPct: 67, lastStudiedAt: ago(4_320), colorHex: "#db2777" },
];

/* ─── Quiz ──────────────────────────────────────────────────────────────── */

export const MOCK_QUIZZES: QuizItem[] = [
  { id: "q1", title: "Calculus Derivatives & Integrals", subject: "Mathematics",      questionCount: 15, durationMinutes: 20, difficulty: "medium", completedAt: ago(60),    score: 87, tags: ["calculus","derivatives"] },
  { id: "q2", title: "Quantum Mechanics Fundamentals",  subject: "Physics",           questionCount: 12, durationMinutes: 15, difficulty: "hard",                                        tags: ["quantum","wave function"] },
  { id: "q3", title: "Big-O Complexity Analysis",       subject: "Computer Science",  questionCount: 10, durationMinutes: 12, difficulty: "medium", completedAt: ago(2_880), score: 70, tags: ["algorithms","complexity"] },
  { id: "q4", title: "Organic Chemistry Reactions",     subject: "Chemistry",         questionCount: 18, durationMinutes: 25, difficulty: "hard",                                        tags: ["organic","mechanisms"] },
  { id: "q5", title: "Newton's Laws & Kinematics",      subject: "Physics",           questionCount: 10, durationMinutes: 10, difficulty: "easy",  completedAt: ago(4_320), score: 100, tags: ["mechanics","forces"] },
];

/* ─── Planner tasks ─────────────────────────────────────────────────────── */

const daysFromNow = (n: number) =>
  new Date(Date.now() + n * 86_400_000).toISOString();

export const MOCK_TASKS: PlannerTask[] = [
  { id: "t1", title: "Review Integration Techniques",     subject: "Mathematics",     type: "study",     priority: "high",   dueAt: daysFromNow(1), estimatedMinutes: 45, completed: false },
  { id: "t2", title: "Quantum Mechanics Flashcards",      subject: "Physics",         type: "flashcard", priority: "medium", dueAt: daysFromNow(1), estimatedMinutes: 20, completed: false },
  { id: "t3", title: "Big-O Notation Quiz",               subject: "Computer Science",type: "quiz",      priority: "medium", dueAt: daysFromNow(2), estimatedMinutes: 15, completed: true  },
  { id: "t4", title: "Organic Reactions Revision",        subject: "Chemistry",       type: "revision",  priority: "high",   dueAt: daysFromNow(3), estimatedMinutes: 60, completed: false },
  { id: "t5", title: "Linear Algebra Problem Set",        subject: "Mathematics",     type: "study",     priority: "low",    dueAt: daysFromNow(4), estimatedMinutes: 90, completed: false },
  { id: "t6", title: "Thermodynamics Study Session",      subject: "Physics",         type: "study",     priority: "medium", dueAt: daysFromNow(5), estimatedMinutes: 30, completed: false },
];
