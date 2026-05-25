export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  Mathematics: {
    bg: "bg-violet-500/15",
    text: "text-violet-300",
    border: "border-violet-500/25",
    hex: "#7c3aed",
  },
  Physics: {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/25",
    hex: "#2563eb",
  },
  Chemistry: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
    border: "border-cyan-500/25",
    hex: "#0891b2",
  },
  Biology: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "border-emerald-500/25",
    hex: "#059669",
  },
  "Computer Science": {
    bg: "bg-indigo-500/15",
    text: "text-indigo-300",
    border: "border-indigo-500/25",
    hex: "#4f46e5",
  },
  History: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/25",
    hex: "#d97706",
  },
  English: {
    bg: "bg-pink-500/15",
    text: "text-pink-300",
    border: "border-pink-500/25",
    hex: "#db2777",
  },
};

export const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", bg: "bg-emerald-500/12", text: "text-emerald-400", border: "border-emerald-500/25" },
  medium: { label: "Medium", bg: "bg-amber-500/12", text: "text-amber-400", border: "border-amber-500/25" },
  hard: { label: "Hard", bg: "bg-rose-500/12", text: "text-rose-400", border: "border-rose-500/25" },
} as const;
