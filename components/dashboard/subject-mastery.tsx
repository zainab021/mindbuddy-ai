"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMinutes } from "@/lib/utils";
import { fetchAnalytics, type ApiSubject } from "@/lib/api";

const COLOR_MAP: Record<string, "violet" | "blue" | "indigo" | "cyan" | "emerald"> = {
  "#7c3aed": "violet",
  "#2563eb": "blue",
  "#4f46e5": "indigo",
  "#0891b2": "cyan",
  "#059669": "emerald",
};

export function SubjectMastery() {
  const [subjects, setSubjects] = useState<ApiSubject[] | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then((data) => setSubjects(data.subjectStats))
      .catch(() => {/* silently degrade */});
  }, []);

  const overallAvg = subjects
    ? Math.round(subjects.reduce((s, x) => s + x.masteryPct, 0) / subjects.length)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader className="flex-row items-start justify-between pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={15} className="text-blue-400" />
              <CardTitle>Subject Mastery</CardTitle>
            </div>
            <CardDescription>Avg. mastery across all subjects</CardDescription>
          </div>
          <Link
            href="/analytics"
            className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Full report <ArrowRight size={11} />
          </Link>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {!subjects ? (
            <div className="space-y-4 animate-pulse">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-28 rounded bg-white/5" />
                    <div className="h-3 w-8 rounded bg-white/5" />
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {subjects.map((stat, i) => {
                const color = COLOR_MAP[stat.colorHex] ?? "violet";
                return (
                  <motion.div
                    key={stat.subject}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.45 + i * 0.06 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: stat.colorHex }}
                        />
                        <span className="text-[13px] font-medium text-foreground/90">{stat.subject}</span>
                      </div>
                      <span className="text-[13px] font-bold text-foreground">{stat.masteryPct}%</span>
                    </div>
                    <Progress value={stat.masteryPct} size="sm" color={color} />
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-muted-foreground/50">
                        {formatMinutes(stat.studyMinutes)} studied
                      </span>
                      <span className="text-[10px] text-muted-foreground/50">
                        {stat.quizzesCompleted} quizzes
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {overallAvg !== null && (
                <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Overall average</span>
                  <span className="text-sm font-bold text-gradient">{overallAvg}%</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
