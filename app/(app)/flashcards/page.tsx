"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, Plus, Search, Clock, ArrowRight,
  ChevronLeft, ChevronRight, RotateCcw, X, CheckCircle2,
  AlertCircle, Sparkles, Brain, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { fetchFlashcards, fetchFlashcardDeck, generateFlashcardDeck } from "@/lib/api";
import { SUBJECT_COLORS } from "@/lib/constants";
import { timeAgo, cn } from "@/lib/utils";
import type { FlashcardDeck } from "@/types";
import type { FlashcardCard } from "@/lib/api";

/* ─── Loading skeleton ───────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-white/5" />
          <div className="h-4 w-64 rounded-lg bg-white/5" />
        </div>
        <div className="h-9 w-24 rounded-lg bg-white/5" />
      </div>
      <div className="h-9 w-64 rounded-lg bg-white/5" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle size={32} className="text-red-400" />
      <p className="text-sm font-medium text-foreground">{message}</p>
      <p className="text-xs text-muted-foreground">
        Make sure the backend is running at http://127.0.0.1:8000
      </p>
    </div>
  );
}

const COLOR_MAP: Record<string, "violet" | "blue" | "indigo" | "cyan" | "amber" | "rose"> = {
  "#7c3aed": "violet",
  "#2563eb": "blue",
  "#4f46e5": "indigo",
  "#0891b2": "cyan",
  "#d97706": "amber",
  "#db2777": "rose",
};

const SUBJECTS = ["Mathematics", "Physics", "Computer Science", "Chemistry", "Biology", "History", "Literature"];
const FC_OPTIONS = [5, 8, 10, 15];

/* ─── Create Deck Modal ──────────────────────────────────────────────────── */
function CreateDeckModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (deck: FlashcardDeck) => void;
}) {
  const [deckName, setDeckName]     = useState("");
  const [subject, setSubject]       = useState("");
  const [topic, setTopic]           = useState("");
  const [cardCount, setCardCount]   = useState(8);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const canGenerate = deckName.trim().length > 0 && topic.trim().length > 0;

  const generate = async () => {
    if (!canGenerate || loading) return;
    setError(null);
    setLoading(true);
    try {
      const { deck } = await generateFlashcardDeck({
        deckName:      deckName.trim(),
        subject:       subject || null,
        topic:         topic.trim(),
        flashcardCount: cardCount,
      });
      onCreated(deck);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
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
              <Brain size={14} className="text-violet-400" />
            </div>
            <p className="text-[15px] font-semibold text-foreground">Create AI Deck</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Deck name */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground">Deck Name</p>
          <Input
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="e.g. Machine Learning Basics"
            disabled={loading}
          />
        </div>

        {/* Topic */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground">Topic to generate cards on</p>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Neural networks and deep learning"
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

        {/* Card count */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground">Number of flashcards</p>
          <div className="flex gap-2">
            {FC_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                disabled={loading}
                onClick={() => setCardCount(n)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[13px] font-medium border transition-all",
                  cardCount === n
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {/* Actions */}
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

/* ─── Study mode ─────────────────────────────────────────────────────────── */
function StudyMode({ deck, onExit }: { deck: FlashcardDeck; onExit: () => void }) {
  const [cards, setCards]           = useState<FlashcardCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [idx, setIdx]               = useState(0);
  const [flipped, setFlipped]       = useState(false);
  const [known, setKnown]           = useState<Set<number>>(new Set());
  const [finished, setFinished]     = useState(false);

  useEffect(() => {
    fetchFlashcardDeck(deck.id)
      .then(({ cards: c }) => setCards(c))
      .catch(() => setCards([]))
      .finally(() => setCardsLoading(false));
  }, [deck.id]);

  const subj = SUBJECT_COLORS[deck.subject];
  const pct  = cards.length > 0 ? ((idx + 1) / cards.length) * 100 : 0;
  const card = cards[idx];

  const goTo = (next: number) => {
    setFlipped(false);
    setTimeout(() => setIdx(next), 170);
  };

  const markKnown = () => {
    setKnown((prev) => new Set(Array.from(prev).concat(idx)));
    if (idx < cards.length - 1) goTo(idx + 1);
    else setFinished(true);
  };

  const markAgain = () => {
    if (idx < cards.length - 1) goTo(idx + 1);
    else setFinished(true);
  };

  const restart = () => {
    setIdx(0);
    setFlipped(false);
    setKnown(new Set());
    setFinished(false);
  };

  if (cardsLoading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-xl border-2 border-violet-500/25 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  if (finished) {
    const knownCount = known.size;
    const knownPct   = Math.round((knownCount / cards.length) * 100);
    return (
      <motion.div
        key="finished"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center space-y-6 py-12"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto">
          <CheckCircle2 size={28} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Session Complete!</h2>
          <p className="text-[13px] text-muted-foreground mt-2">
            You marked <span className="text-foreground font-semibold">{knownCount}</span> of{" "}
            <span className="text-foreground font-semibold">{cards.length}</span> cards as known.
          </p>
        </div>
        <Progress value={knownPct} size="md" color="emerald" />
        <p className="text-[11px] text-muted-foreground">{knownPct}% mastery this session</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={restart} className="gap-2"><RotateCcw size={13} /> Study Again</Button>
          <Button onClick={onExit} className="gap-2"><Layers size={13} /> Back to Decks</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="study"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="w-8 h-8 rounded-xl glass border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
          >
            <X size={14} />
          </button>
          <div>
            <p className="text-[14px] font-semibold text-foreground">{deck.title}</p>
            {subj && (
              <span className={cn("tag text-[10px]", subj.bg, subj.text, subj.border)}>{deck.subject}</span>
            )}
          </div>
        </div>
        <span className="text-[12px] text-muted-foreground">{idx + 1} / {cards.length}</span>
      </div>

      <Progress value={pct} size="xs" color="violet" />

      <div style={{ perspective: "1200px" }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative cursor-pointer w-full h-64 select-none"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className="absolute inset-0 rounded-2xl glass-card border border-white/10 flex flex-col items-center justify-center p-8 gap-4"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400/70">Question</p>
            <p className="text-[18px] font-semibold text-center text-foreground leading-snug">{card.front}</p>
            <p className="text-[11px] text-muted-foreground/50 mt-2">Tap to reveal answer</p>
          </div>
          <div
            className="absolute inset-0 rounded-2xl border border-violet-500/25 bg-violet-500/[0.05] flex flex-col items-center justify-center p-8 gap-4"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Answer</p>
            <p className="text-[16px] font-medium text-center text-foreground leading-relaxed whitespace-pre-line">{card.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-1.5">
        {cards.map((_card: FlashcardCard, i: number) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              i === idx ? "bg-violet-400 w-5" : known.has(i) ? "bg-emerald-500/60 w-1.5" : "bg-white/20 hover:bg-white/40 w-1.5",
            )}
          />
        ))}
      </div>

      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex gap-3"
          >
            <Button
              variant="outline"
              className="flex-1 border-rose-500/25 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 gap-2"
              onClick={markAgain}
            >
              <RotateCcw size={13} /> Study Again
            </Button>
            <Button
              className="flex-1 border-emerald-500/25 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 gap-2"
              onClick={markKnown}
            >
              <CheckCircle2 size={13} /> Got It
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => goTo(idx - 1)} disabled={idx === 0} className="gap-2">
          <ChevronLeft size={14} /> Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => idx < cards.length - 1 ? goTo(idx + 1) : setFinished(true)} className="gap-2">
          {idx < cards.length - 1 ? "Skip" : "Finish"} <ChevronRight size={14} />
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Deck grid ─────────────────────────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function FlashcardsPage() {
  const [decks, setDecks]         = useState<FlashcardDeck[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [query, setQuery]         = useState("");
  const [studyDeck, setStudyDeck] = useState<FlashcardDeck | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFlashcards()
      .then(setDecks)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load flashcards"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  if (studyDeck) {
    return <StudyMode deck={studyDeck} onExit={() => setStudyDeck(null)} />;
  }

  const filtered = decks.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.subject.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Flashcard Decks</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              {decks.length} decks · Spaced repetition for maximum retention
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowModal(true)}>
            <Plus size={14} />New Deck
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Input
            placeholder="Search decks or subjects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search size={14} />}
            className="max-w-xs"
          />
        </motion.div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Layers size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No decks found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 flex items-center gap-1.5 text-[12px] text-violet-400 hover:text-violet-300 mx-auto"
            >
              <Zap size={12} /> Generate your first deck
            </button>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((deck) => {
              const color = COLOR_MAP[deck.colorHex] ?? "violet";
              return (
                <motion.div
                  key={deck.id}
                  variants={item}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="glass-card rounded-2xl p-5 border border-white/6 hover:border-white/14 transition-colors group cursor-pointer"
                  style={{ "--glow-color": `${deck.colorHex}33` } as React.CSSProperties}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${deck.colorHex}22`, border: `1px solid ${deck.colorHex}40` }}
                  >
                    <Layers size={18} style={{ color: deck.colorHex }} />
                  </div>

                  <h3 className="text-[14px] font-semibold text-foreground mb-0.5">{deck.title}</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">{deck.subject} · {deck.cardCount} cards</p>

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-muted-foreground">Mastery</span>
                    <span className="text-[10px] font-bold text-foreground">{deck.masteryPct}%</span>
                  </div>
                  <Progress value={deck.masteryPct} size="xs" color={color} />

                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                      <Clock size={9} />
                      {deck.lastStudiedAt ? timeAgo(deck.lastStudiedAt) : "Never studied"}
                    </span>
                    <button
                      onClick={() => setStudyDeck(deck)}
                      className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 font-medium opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Study <ArrowRight size={10} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Create deck modal */}
      <AnimatePresence>
        {showModal && (
          <CreateDeckModal
            onClose={() => setShowModal(false)}
            onCreated={(deck) => setDecks((prev) => [deck, ...prev])}
          />
        )}
      </AnimatePresence>
    </>
  );
}
