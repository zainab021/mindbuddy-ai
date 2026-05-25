"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleHelp, Clock, Trophy, ArrowRight, Plus, CheckCircle2,
  XCircle, ChevronRight, RotateCcw, Timer, Star, AlertCircle,
  Sparkles, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { fetchQuizzes, generateQuiz, type GeneratedQuizQuestion } from "@/lib/api";
import { DIFFICULTY_CONFIG, SUBJECT_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { QuizItem } from "@/types";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type QuizPhase = "list" | "active" | "results";
type QuizQ = GeneratedQuizQuestion;

/* ─── Local question bank (fallback for mock quizzes) ───────────────────── */
const QUIZ_BANK: Record<string, QuizQ[]> = {
  Mathematics: [
    { question: "What is ∫2x dx?",                          options: ["x²","x² + C","2x²","2x² + C"],                                    answer: 1, explanation: "Power rule: ∫2x dx = 2·(x²/2) + C = x² + C." },
    { question: "Derivative of sin(x)?",                    options: ["cos(x)","-cos(x)","sin(x)","-sin(x)"],                              answer: 0, explanation: "d/dx[sin(x)] = cos(x) — proven via the limit definition." },
    { question: "What is the Chain Rule?",                   options: ["d(f+g)=f′+g′","d(fg)=f′g+fg′","d(f(g(x)))=f′(g(x))·g′(x)","d(f/g)=(f′g-fg′)/g²"], answer: 2, explanation: "Chain rule: d/dx[f(g(x))] = f′(g(x)) · g′(x)." },
    { question: "If f(x) = x³, what is f′(x)?",             options: ["x²","3x","3x²","x⁴/4"],                                           answer: 2, explanation: "Power rule: d/dx[xⁿ] = n·xⁿ⁻¹, so f′(x) = 3x²." },
    { question: "lim(x→0) sin(x)/x = ?",                   options: ["0","∞","1","undefined"],                                            answer: 2, explanation: "Famous limit: lim(x→0) sin(x)/x = 1 (L'Hôpital or squeeze theorem)." },
  ],
  Physics: [
    { question: "Newton's Second Law states:",               options: ["F=mv","F=ma","E=mc²","p=mv"],                                      answer: 1, explanation: "F = ma: Net force equals mass times acceleration." },
    { question: "SI unit of force?",                        options: ["Joule","Watt","Newton","Pascal"],                                    answer: 2, explanation: "Force is measured in Newtons (N = kg·m/s²)." },
    { question: "Kinetic energy formula?",                  options: ["mgh","½mv²","Fd","mv"],                                             answer: 1, explanation: "KE = ½mv² where m = mass and v = velocity." },
    { question: "Speed of light in vacuum?",                options: ["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","3×10¹² m/s"],               answer: 1, explanation: "c ≈ 3×10⁸ m/s (299,792,458 m/s exactly)." },
    { question: "Ohm's Law?",                               options: ["V=IR","P=IV","F=qE","E=hf"],                                        answer: 0, explanation: "V = IR: Voltage = Current × Resistance." },
  ],
  "Computer Science": [
    { question: "O(1) time complexity means:",              options: ["One operation","Constant time","One second","Logarithmic"],          answer: 1, explanation: "O(1) = constant time — independent of input size (e.g. array indexing)." },
    { question: "Binary search requires data to be:",       options: ["Random","Sorted","Linked","Hashed"],                                 answer: 1, explanation: "Binary search requires sorted data to split the search space in half." },
    { question: "Worst-case time for QuickSort?",           options: ["O(n)","O(n log n)","O(n²)","O(log n)"],                             answer: 2, explanation: "O(n²) occurs when the pivot is always min or max — e.g. already-sorted input." },
    { question: "LIFO describes which structure?",          options: ["Queue","Tree","Stack","Heap"],                                       answer: 2, explanation: "Stack uses Last In, First Out (LIFO) ordering." },
    { question: "DFS stands for?",                          options: ["Data Flow System","Depth-First Search","Direct File Storage","Dynamic Function Set"], answer: 1, explanation: "DFS = Depth-First Search, a graph traversal algorithm." },
  ],
  Chemistry: [
    { question: "Ideal Gas Law?",                           options: ["PV=nRT","E=mc²","F=ma","H=U+PV"],                                   answer: 0, explanation: "PV = nRT: Pressure × Volume = moles × gas constant × Temperature." },
    { question: "Atomic number is the count of:",           options: ["Neutrons","Protons","Protons+neutrons","Electrons"],                  answer: 1, explanation: "Atomic number = proton count, defining the element." },
    { question: "pH of pure water?",                       options: ["0","7","14","1"],                                                     answer: 1, explanation: "Pure water has pH = 7 — the neutral point." },
    { question: "Avogadro's number ≈",                     options: ["6.02×10²³","6.02×10¹⁶","3.14×10²³","1.38×10²³"],                   answer: 0, explanation: "Avogadro's number ≈ 6.022×10²³ particles per mole." },
    { question: "Which bond involves electron sharing?",    options: ["Ionic","Covalent","Metallic","Hydrogen"],                            answer: 1, explanation: "Covalent bonds form by sharing electron pairs between atoms." },
  ],
};

const getQuestions = (subject: string): QuizQ[] => QUIZ_BANK[subject] ?? QUIZ_BANK.Mathematics;

const SUBJECTS   = ["Mathematics", "Physics", "Computer Science", "Chemistry", "Biology", "History"];
const Q_OPTIONS  = [5, 8, 10, 15];
const DIFFS      = ["easy", "medium", "hard"] as const;
const QZ_OPTIONS = [5, 8, 10, 15];

/* ─── Score badge ────────────────────────────────────────────────────────── */
function ScoreBadge({ score }: { score: number }) {
  const variant = score >= 85 ? "emerald" : score >= 70 ? "amber" : "rose";
  return <Badge variant={variant}>{score}%</Badge>;
}

/* ─── Generate Quiz Modal ────────────────────────────────────────────────── */
function GenerateQuizModal({
  onClose,
  onGenerated,
}: {
  onClose: () => void;
  onGenerated: (quiz: QuizItem, questions: QuizQ[]) => void;
}) {
  const [topic,      setTopic]      = useState("");
  const [subject,    setSubject]    = useState("");
  const [qCount,     setQCount]     = useState(5);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const canGenerate = topic.trim().length > 0;

  const generate = async () => {
    if (!canGenerate || loading) return;
    setError(null);
    setLoading(true);
    try {
      const { quizItem, questions } = await generateQuiz({
        topic:         topic.trim(),
        subject:       subject || null,
        questionCount: qCount,
        difficulty,
      });
      onGenerated(quizItem, questions);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 p-6 space-y-5 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Sparkles size={14} className="text-violet-400" />
            </div>
            <p className="text-[15px] font-semibold text-foreground">Generate AI Quiz</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Topic */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground">Topic</p>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Operating Systems, Photosynthesis…"
            disabled={loading}
          />
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground">Subject (optional)</p>
          <div className="flex flex-wrap gap-1.5">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={loading}
                onClick={() => setSubject(s === subject ? "" : s)}
                className={cn(
                  "text-[11px] px-3 py-1 rounded-full border transition-all",
                  subject === s
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground">Number of questions</p>
          <div className="flex gap-2">
            {QZ_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                disabled={loading}
                onClick={() => setQCount(n)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[13px] font-medium border transition-all",
                  qCount === n
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground">Difficulty</p>
          <div className="flex gap-2">
            {DIFFS.map((d) => (
              <button
                key={d}
                type="button"
                disabled={loading}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[12px] font-medium border capitalize transition-all",
                  difficulty === d
                    ? d === "easy"   ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : d === "medium" ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    :                  "bg-rose-500/20 border-rose-500/40 text-rose-300"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button className="flex-1 gap-2" onClick={generate} disabled={!canGenerate || loading}>
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={13} />
                Generate
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Quiz list item ─────────────────────────────────────────────────────── */
function QuizRow({ quiz, index, onStart }: { quiz: QuizItem; index: number; onStart: (q: QuizItem) => void }) {
  const diff = DIFFICULTY_CONFIG[quiz.difficulty];
  const subj = SUBJECT_COLORS[quiz.subject];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="hover:border-violet-500/20 transition-all group">
        <CardContent className="py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/12 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
            <CircleHelp size={18} className="text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[14px] font-semibold text-foreground">{quiz.title}</span>
              <span className={cn("tag", diff.bg, diff.text, diff.border)}>{diff.label}</span>
              {quiz.score !== undefined && <ScoreBadge score={quiz.score} />}
              {quiz.completedAt && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <CheckCircle2 size={10} />Completed
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {subj && <span className={cn("tag", subj.bg, subj.text, subj.border)}>{quiz.subject}</span>}
              <span>{quiz.questionCount} questions</span>
              <span className="flex items-center gap-1"><Clock size={10} />{quiz.durationMinutes} min</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={() => onStart(quiz)}
          >
            {quiz.completedAt ? "Retry" : "Start"}
            <ArrowRight size={12} />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Active quiz ────────────────────────────────────────────────────────── */
function ActiveQuiz({
  quiz,
  questions: propQuestions,
  onFinish,
}: {
  quiz: QuizItem;
  questions?: QuizQ[];
  onFinish: (answers: Record<number, number>, timeUsed: number) => void;
}) {
  const questions  = propQuestions ?? getQuestions(quiz.subject);
  const totalTime  = quiz.durationMinutes * 60;

  const [currentQ,  setCurrentQ]  = useState(0);
  const [answers,   setAnswers]   = useState<Record<number, number>>({});
  const [selected,  setSelected]  = useState<number | null>(null);
  const [timeLeft,  setTimeLeft]  = useState(totalTime);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) onFinish(answers, totalTime);
  }, [timeLeft, answers, totalTime, onFinish]);

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  const timerUrgent  = timeLeft < 30;
  const timerWarning = timeLeft < 60 && !timerUrgent;
  const progressPct  = (currentQ / questions.length) * 100;

  const selectAnswer = (optIdx: number) => {
    if (selected !== null || advancing) return;
    setSelected(optIdx);
    const newAnswers = { ...answers, [currentQ]: optIdx };
    setAnswers(newAnswers);
    setAdvancing(true);
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setAdvancing(false);
      } else {
        onFinish(newAnswers, totalTime - timeLeft);
      }
    }, 1200);
  };

  const q       = questions[currentQ];
  const correct = selected !== null ? selected === q.answer : null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-foreground truncate max-w-xs">{quiz.title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Question {currentQ + 1} of {questions.length}
          </p>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[13px] font-semibold transition-colors",
          timerUrgent  ? "bg-rose-500/15 border-rose-500/30 text-rose-400" :
          timerWarning ? "bg-amber-500/15 border-amber-500/30 text-amber-400" :
          "glass border-white/10 text-foreground",
        )}>
          <Timer size={13} />{mins}:{secs}
        </div>
      </div>

      <Progress value={progressPct} size="xs" color="violet" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-4"
        >
          <div className="glass-card rounded-2xl p-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-3">
              Question {currentQ + 1}
            </p>
            <p className="text-[17px] font-semibold text-foreground leading-snug">{q.question}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {q.options.map((opt, oi) => {
              let cls = "border-white/8 text-muted-foreground hover:border-violet-500/30 hover:text-foreground hover:bg-violet-500/5 cursor-pointer";
              if (selected !== null) {
                if (oi === q.answer)        cls = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 cursor-default";
                else if (oi === selected)   cls = "border-rose-500/40 bg-rose-500/10 text-rose-300 cursor-default";
                else                        cls = "border-white/5 text-muted-foreground/30 cursor-default";
              }
              return (
                <motion.button
                  key={oi}
                  whileHover={selected === null ? { scale: 1.01 } : {}}
                  whileTap={selected === null ? { scale: 0.99 } : {}}
                  onClick={() => selectAnswer(oi)}
                  disabled={selected !== null}
                  className={cn("flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border text-[13px] transition-all", cls)}
                >
                  {selected !== null && oi === q.answer && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />}
                  {selected !== null && oi === selected && oi !== q.answer && <XCircle size={14} className="text-rose-400 flex-shrink-0" />}
                  {(selected === null || (oi !== q.answer && oi !== selected)) && (
                    <span className={cn(
                      "w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center flex-shrink-0",
                      selected !== null ? "border-white/10 text-muted-foreground/30" : "border-white/20 text-muted-foreground",
                    )}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                  )}
                  {opt}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-2.5 px-4 py-3 rounded-xl border text-[12px]",
                  correct ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-300" : "bg-rose-500/8 border-rose-500/20 text-rose-300",
                )}
              >
                {correct ? <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" /> : <XCircle size={14} className="flex-shrink-0 mt-0.5" />}
                <span>{q.explanation}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Results screen ─────────────────────────────────────────────────────── */
function QuizResults({
  quiz,
  questions: propQuestions,
  answers,
  timeUsed,
  onRetry,
  onBack,
}: {
  quiz: QuizItem;
  questions?: QuizQ[];
  answers: Record<number, number>;
  timeUsed: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const questions = propQuestions ?? getQuestions(quiz.subject);
  const correct   = Object.entries(answers).filter(([qi, opt]) => questions[+qi]?.answer === opt).length;
  const total     = questions.length;
  const score     = Math.round((correct / total) * 100);
  const xp        = Math.round(score * 1.8);
  const grade     = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  const mins    = Math.floor(timeUsed / 60);
  const secs    = timeUsed % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto space-y-6"
    >
      <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12),transparent_70%)]" />
        <div className="relative">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl font-black",
            score >= 80 ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400" :
            score >= 60 ? "bg-amber-500/15 border border-amber-500/25 text-amber-400" :
            "bg-rose-500/15 border border-rose-500/25 text-rose-400",
          )}>
            {grade}
          </div>
          <p className="text-3xl font-black text-foreground tabular-nums">{score}%</p>
          <p className="text-[13px] text-muted-foreground mt-1">{correct} of {total} correct</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "XP Earned", value: `+${xp}`,      icon: Star,  cls: "text-violet-400" },
          { label: "Time Used", value: timeStr,         icon: Timer, cls: "text-cyan-400"   },
          { label: "Score",     value: `${correct}/${total}`, icon: Trophy, cls: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-3 text-center">
            <s.icon size={15} className={cn("mx-auto mb-1.5", s.cls)} />
            <p className="text-[14px] font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="section-title mb-2">Question Review</p>
        {questions.map((q, i) => {
          const chosen    = answers[i];
          const isCorrect = chosen === q.answer;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border text-[12px]",
                isCorrect ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5",
              )}
            >
              {isCorrect
                ? <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                : <XCircle     size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
              }
              <div className="flex-1 min-w-0">
                <p className="text-foreground/90 font-medium truncate">{q.question}</p>
                {!isCorrect && (
                  <p className="text-emerald-400/80 text-[11px] mt-0.5">✓ {q.options[q.answer]}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2" onClick={onRetry}>
          <RotateCcw size={13} /> Retry
        </Button>
        <Button className="flex-1 gap-2" onClick={onBack}>
          <ChevronRight size={13} /> Done
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function QuizPage() {
  const [quizzes,    setQuizzes]    = useState<QuizItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showModal,  setShowModal]  = useState(false);

  const [phase,               setPhase]               = useState<QuizPhase>("list");
  const [activeQuiz,          setActiveQuiz]          = useState<QuizItem | null>(null);
  const [activeQuestions,     setActiveQuestions]     = useState<QuizQ[] | undefined>(undefined);
  const [quizAnswers,         setQuizAnswers]         = useState<Record<number, number>>({});
  const [timeUsed,            setTimeUsed]            = useState(0);

  useEffect(() => {
    fetchQuizzes()
      .then(setQuizzes)
      .catch((err: unknown) =>
        setFetchError(err instanceof Error ? err.message : "Failed to load quizzes"),
      )
      .finally(() => setLoading(false));
  }, []);

  const completed  = quizzes.filter((q) => q.completedAt);
  const inProgress = quizzes.filter((q) => !q.completedAt);

  const startQuiz = (quiz: QuizItem, questions?: QuizQ[]) => {
    setActiveQuiz(quiz);
    setActiveQuestions(questions);
    setQuizAnswers({});
    setTimeUsed(0);
    setPhase("active");
  };

  const finishQuiz = (answers: Record<number, number>, used: number) => {
    setQuizAnswers(answers);
    setTimeUsed(used);
    setPhase("results");
  };

  const backToList = () => {
    setPhase("list");
    setActiveQuiz(null);
    setActiveQuestions(undefined);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === "list" && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Quizzes</h1>
                <p className="text-[13px] text-muted-foreground mt-1">
                  {completed.length} completed · {inProgress.length} available
                </p>
              </div>
              <Button className="gap-2" onClick={() => setShowModal(true)}>
                <Plus size={14} />Generate Quiz
              </Button>
            </motion.div>

            {loading && (
              <div className="space-y-3 animate-pulse">
                {[0, 1, 2].map((i) => <div key={i} className="h-20 rounded-xl bg-white/5" />)}
              </div>
            )}

            {fetchError && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <AlertCircle size={28} className="text-red-400" />
                <p className="text-sm text-muted-foreground">{fetchError}</p>
              </div>
            )}

            {!loading && !fetchError && (
              <>
                {inProgress.length > 0 && (
                  <div>
                    <p className="section-title mb-3">Available</p>
                    <div className="space-y-3">
                      {inProgress.map((quiz, i) => (
                        <QuizRow key={quiz.id} quiz={quiz} index={i} onStart={startQuiz} />
                      ))}
                    </div>
                  </div>
                )}

                {completed.length > 0 && (
                  <div>
                    <p className="section-title mb-3">Completed</p>
                    <div className="space-y-3">
                      {completed.map((quiz, i) => (
                        <QuizRow key={quiz.id} quiz={quiz} index={i} onStart={startQuiz} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {phase === "active" && activeQuiz && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ActiveQuiz quiz={activeQuiz} questions={activeQuestions} onFinish={finishQuiz} />
          </motion.div>
        )}

        {phase === "results" && activeQuiz && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizResults
              quiz={activeQuiz}
              questions={activeQuestions}
              answers={quizAnswers}
              timeUsed={timeUsed}
              onRetry={() => startQuiz(activeQuiz, activeQuestions)}
              onBack={backToList}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate quiz modal */}
      <AnimatePresence>
        {showModal && (
          <GenerateQuizModal
            onClose={() => setShowModal(false)}
            onGenerated={(quizItem, questions) => startQuiz(quizItem, questions)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
