"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Sparkles, BookOpen, Target, Zap, Clock,
  ArrowRight, RotateCcw, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, Trophy, Star, Lightbulb,
  FileText, Upload, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateStudy, type StudyResult } from "@/lib/api";
import { cn } from "@/lib/utils";

type Phase = "form" | "loading" | "result";

const SUBJECTS      = ["Mathematics", "Physics", "Computer Science", "Chemistry"];
const RECENT_TOPICS = ["Integration by parts", "Newton's laws", "Binary search trees", "Organic reactions"];
const FC_OPTIONS    = [3, 5, 8, 10];
const QZ_OPTIONS    = [2, 3, 5, 8];

/* ─── Loading ───────────────────────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[380px] gap-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          className="w-16 h-16 rounded-2xl border-2 border-violet-500/25 border-t-violet-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={22} className="text-violet-400" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-foreground font-semibold">AI is crafting your session…</p>
        <p className="text-[12px] text-muted-foreground mt-1">Generating notes, flashcards, and quiz questions</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Notes section ─────────────────────────────────────────────────────── */
function NotesSection({ result }: { result: StudyResult }) {
  const notes = result.notes;
  if (!notes) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen size={14} className="text-violet-400" />
        <p className="text-[13px] font-semibold text-foreground">Study Notes</p>
        <Badge variant="violet" className="flex items-center gap-1 ml-auto"><Zap size={10} />+{notes.xpReward} XP</Badge>
      </div>

      {(notes.sections ?? []).map((s, i) => (
        <motion.div
          key={s.heading}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 + i * 0.07 }}
        >
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={13} className="text-violet-400" />
                <p className="text-[12px] font-semibold text-foreground">{s.heading}</p>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-line">{s.body}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {(notes.keyTakeaways ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star size={13} className="text-amber-400" />
              <CardTitle className="text-[14px]">Key Takeaways</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex flex-wrap gap-2">
            {(notes.keyTakeaways ?? []).map((t) => (
              <span key={t} className="text-[11px] px-3 py-1.5 rounded-full bg-violet-500/12 border border-violet-500/20 text-violet-300">
                {t}
              </span>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ─── Flashcards section ─────────────────────────────────────────────────── */
function FlashcardsSection({ result }: { result: StudyResult }) {
  const cards = result.cards ?? [];
  const [idx, setIdx]     = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;

  const goTo = (next: number) => { setFlipped(false); setTimeout(() => setIdx(next), 160); };
  const card = cards[idx];
  const pct  = ((idx + 1) / cards.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-cyan-400" />
        <p className="text-[13px] font-semibold text-foreground">Flashcards</p>
        <span className="text-[11px] text-muted-foreground ml-auto">{idx + 1} / {cards.length}</span>
      </div>

      <Progress value={pct} size="xs" color="cyan" />

      <div style={{ perspective: "1200px" }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative cursor-pointer w-full h-48 select-none"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className="absolute inset-0 rounded-2xl glass-card border border-white/10 flex flex-col items-center justify-center p-6 gap-3"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/70">Question</p>
            <p className="text-[15px] font-semibold text-center text-foreground leading-snug">{card.front}</p>
            <p className="text-[11px] text-muted-foreground/60">Click to reveal answer</p>
          </div>
          <div
            className="absolute inset-0 rounded-2xl border border-cyan-500/25 bg-cyan-500/[0.06] flex flex-col items-center justify-center p-6 gap-3"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Answer</p>
            <p className="text-[14px] font-medium text-center text-foreground leading-relaxed whitespace-pre-line">{card.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => goTo(idx - 1)} disabled={idx === 0} className="gap-2">
          <ChevronLeft size={14} /> Prev
        </Button>
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={cn("h-1.5 rounded-full transition-all", i === idx ? "bg-cyan-400 w-5" : "bg-white/20 w-1.5")}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => goTo(idx + 1)} disabled={idx === cards.length - 1} className="gap-2">
          Next <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}

/* ─── Quiz section ──────────────────────────────────────────────────────── */
function QuizSection({ result }: { result: StudyResult }) {
  const questions = result.questions ?? [];
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (questions.length === 0) return null;

  const allAnswered = Object.keys(answers).length === questions.length;
  const score = allAnswered ? questions.filter((q, i) => answers[i] === q.answer).length : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target size={14} className="text-pink-400" />
        <p className="text-[13px] font-semibold text-foreground">Practice Quiz</p>
        <Badge variant="rose" className="ml-auto">{questions.length} questions</Badge>
        {allAnswered && (
          <Badge variant={score === questions.length ? "emerald" : score >= questions.length * 0.67 ? "amber" : "rose"} className="flex items-center gap-1">
            <Trophy size={10} />{score}/{questions.length}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {questions.map((q, qi) => {
          const chosen   = answers[qi];
          const answered = chosen !== undefined;
          const correct  = answered && chosen === q.answer;
          return (
            <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.07 }}>
              <Card className={cn(answered && correct ? "border-emerald-500/25" : answered ? "border-rose-500/25" : "")}>
                <CardContent className="py-4 space-y-3">
                  <p className="text-[13px] font-medium text-foreground">
                    <span className="text-muted-foreground mr-2">Q{qi + 1}.</span>{q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => {
                      let cls = "border-white/8 text-muted-foreground hover:border-white/20 hover:text-foreground cursor-pointer";
                      if (answered) {
                        if (oi === q.answer)        cls = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 cursor-default";
                        else if (oi === chosen)     cls = "border-rose-500/40 bg-rose-500/10 text-rose-300 cursor-default";
                        else                        cls = "border-white/5 text-muted-foreground/40 cursor-default";
                      }
                      return (
                        <button key={oi} disabled={answered}
                          onClick={() => !answered && setAnswers((p) => ({ ...p, [qi]: oi }))}
                          className={cn("flex items-center gap-2.5 text-left px-3.5 py-2.5 rounded-xl border text-[12px] transition-all", cls)}
                        >
                          {answered && oi === q.answer && <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />}
                          {answered && oi === chosen && oi !== q.answer && <XCircle size={13} className="text-rose-400 flex-shrink-0" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {answered && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="flex items-start gap-2 px-3 py-2 rounded-xl bg-white/4 border border-white/8"
                      >
                        <Lightbulb size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-muted-foreground">{q.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {allAnswered && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-violet-500/20 bg-violet-500/5">
            <CardContent className="py-4">
              <p className="text-[14px] font-bold text-foreground">
                {score}/{questions.length} correct · {Math.round((score / questions.length) * 100)}%
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">+{score * 40} XP earned</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Full result (notes + flashcards + quiz) ───────────────────────────── */
function FullResult({ result, onReset }: { result: StudyResult; onReset: () => void }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
            <Sparkles size={16} className="text-violet-400" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground">{result.topic}</p>
            <p className="text-[11px] text-muted-foreground">
              {result.subject ? `${result.subject} · ` : ""}AI Study Session
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onReset} title="Start over"><RotateCcw size={13} /></Button>
      </div>

      {/* Notes */}
      {result.notes && <NotesSection result={result} />}

      {/* Divider */}
      {result.cards && result.cards.length > 0 && <div className="border-t border-white/8" />}

      {/* Flashcards */}
      {result.cards && result.cards.length > 0 && <FlashcardsSection result={result} />}

      {/* Divider */}
      {result.questions && result.questions.length > 0 && <div className="border-t border-white/8" />}

      {/* Quiz */}
      {result.questions && result.questions.length > 0 && <QuizSection result={result} />}

      {/* Bottom reset */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Button variant="outline" className="w-full gap-2" onClick={onReset}>
          <RotateCcw size={13} /> Generate Another Session
        </Button>
      </motion.div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function StudyPage() {
  const [topic,          setTopic]          = useState("");
  const [subject,        setSubject]        = useState("");
  const [file,           setFile]           = useState<File | null>(null);
  const [flashcardCount, setFlashcardCount] = useState(5);
  const [quizCount,      setQuizCount]      = useState(3);
  const [phase,          setPhase]          = useState<Phase>("form");
  const [studyResult,    setStudyResult]    = useState<StudyResult | null>(null);
  const [genError,       setGenError]       = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canGenerate = topic.trim().length > 0 || file !== null;

  const generate = async () => {
    if (!canGenerate) return;
    setGenError(null);
    setPhase("loading");
    try {
      const result = await generateStudy({ topic, subject: subject || null, flashcardCount, quizCount, file });
      setStudyResult(result);
      setPhase("result");
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
      setPhase("form");
    }
  };

  const reset = () => { setPhase("form"); setStudyResult(null); setGenError(null); };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-3xl space-y-6">
      <AnimatePresence mode="wait">

        {/* ── Form ── */}
        {phase === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-foreground">AI Study Generator</h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                Type a topic, upload a PDF, or both — AI creates notes, flashcards, and a quiz.
              </p>
            </motion.div>

            {/* Topic + file card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-violet-400" />
                    <CardTitle>What do you want to study?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    rows={3}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. 'Explain integration by parts' or 'Newton's laws for tomorrow's exam'…"
                  />

                  {/* File upload */}
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-2">Or upload a PDF / image</p>
                    {file ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-violet-500/30 bg-violet-500/8">
                        <FileText size={14} className="text-violet-400 flex-shrink-0" />
                        <span className="text-[12px] text-foreground flex-1 truncate">{file.name}</span>
                        <button onClick={removeFile} className="text-muted-foreground hover:text-foreground transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border border-dashed border-white/15 hover:border-violet-500/40 text-muted-foreground hover:text-foreground transition-all text-[12px]"
                      >
                        <Upload size={14} />
                        Click to upload PDF or image
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-2">Subject (optional)</p>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => (
                        <button key={s} type="button" onClick={() => setSubject(s === subject ? "" : s)}
                          className={cn("text-[11px] px-3 py-1.5 rounded-full border transition-all",
                            subject === s
                              ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                              : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
                          )}
                        >{s}</button>
                      ))}
                    </div>
                  </div>

                  {genError && (
                    <p className="text-[12px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                      {genError}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock size={11} />~20 min
                    </span>
                    <Button onClick={generate} className="gap-2" disabled={!canGenerate}>
                      <Brain size={14} />
                      Generate Session
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Count selectors */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
              <div className="grid grid-cols-2 gap-4">
                {/* Flashcard count */}
                <Card>
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap size={13} className="text-cyan-400" />
                      <p className="text-[12px] font-semibold text-foreground">Flashcards</p>
                    </div>
                    <div className="flex gap-1.5">
                      {FC_OPTIONS.map((n) => (
                        <button key={n} type="button" onClick={() => setFlashcardCount(n)}
                          className={cn("flex-1 py-1.5 rounded-lg text-[12px] font-medium border transition-all",
                            flashcardCount === n
                              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                              : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"
                          )}
                        >{n}</button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quiz count */}
                <Card>
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Target size={13} className="text-pink-400" />
                      <p className="text-[12px] font-semibold text-foreground">Quiz Questions</p>
                    </div>
                    <div className="flex gap-1.5">
                      {QZ_OPTIONS.map((n) => (
                        <button key={n} type="button" onClick={() => setQuizCount(n)}
                          className={cn("flex-1 py-1.5 rounded-lg text-[12px] font-medium border transition-all",
                            quizCount === n
                              ? "bg-pink-500/20 border-pink-500/40 text-pink-300"
                              : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"
                          )}
                        >{n}</button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Recent topics */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
              <p className="section-title mb-3">Recent Topics</p>
              <div className="flex flex-wrap gap-2">
                {RECENT_TOPICS.map((t) => (
                  <button key={t} type="button" onClick={() => setTopic(t)}
                    className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full glass border border-white/8 text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-all"
                  >
                    <Clock size={10} />{t}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Loading ── */}
        {phase === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState />
          </motion.div>
        )}

        {/* ── Result ── */}
        {phase === "result" && studyResult && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FullResult result={studyResult} onReset={reset} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
