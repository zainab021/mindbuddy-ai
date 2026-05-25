"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Clock, ArrowRight, CircleHelp, Layers, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_SUGGESTIONS } from "@/data/mock";
import { DIFFICULTY_CONFIG, SUBJECT_COLORS } from "@/lib/constants";
import type { AISuggestion } from "@/types";

const ACTION_ICON: Record<AISuggestion["actionType"], React.ReactNode> = {
  quiz:      <CircleHelp size={12} />,
  flashcard: <Layers size={12} />,
  study:     <BookOpen size={12} />,
};

const ACTION_HREF: Record<AISuggestion["actionType"], string> = {
  quiz: "/quiz", flashcard: "/flashcards", study: "/study",
};

function MatchDot({ pct }: { pct: number }) {
  const color = pct >= 90 ? "bg-emerald-400" : pct >= 80 ? "bg-violet-400" : "bg-amber-400";
  return (
    <span className="flex items-center gap-1">
      <motion.span
        className={cn("w-1.5 h-1.5 rounded-full", color)}
        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-[10px] text-muted-foreground">{pct}% match</span>
    </span>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
};

const item = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
};

export function AISuggestions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
    >
      <Card className="h-full">
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-violet-400" />
            <CardTitle>AI Suggestions</CardTitle>
          </div>
          <Badge variant="violet">Personalized</Badge>
        </CardHeader>

        <CardContent className="pt-0 space-y-2.5">
          <motion.div variants={container} initial="hidden" animate="show">
            {MOCK_SUGGESTIONS.map((s) => {
              const diff = DIFFICULTY_CONFIG[s.difficulty];
              const subj = SUBJECT_COLORS[s.subject];
              const href = ACTION_HREF[s.actionType];

              return (
                <motion.div
                  key={s.id}
                  variants={item}
                  whileHover={{ x: 2, transition: { duration: 0.15 } }}
                  className="group p-3.5 rounded-xl border border-white/6 bg-white/[0.02] hover:border-violet-500/25 hover:bg-violet-500/5 transition-colors duration-200 mb-2.5 last:mb-0"
                >
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    {subj && <span className={cn("tag", subj.bg, subj.text, subj.border)}>{s.subject}</span>}
                    <span className={cn("tag", diff.bg, diff.text, diff.border)}>{diff.label}</span>
                  </div>

                  <p className="text-[13px] font-semibold text-foreground/90 group-hover:text-foreground transition-colors mb-1">
                    {s.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
                    {s.rationale}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock size={10} />{s.estimatedMinutes}m
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        {ACTION_ICON[s.actionType]}
                        {s.actionType.charAt(0).toUpperCase() + s.actionType.slice(1)}
                      </span>
                      <MatchDot pct={s.matchPct} />
                    </div>
                    <Link
                      href={href}
                      className="flex items-center justify-center w-6 h-6 rounded-lg bg-violet-600/20 border border-violet-500/25 text-violet-400 opacity-0 group-hover:opacity-100 hover:bg-violet-600/35 transition-all"
                    >
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
