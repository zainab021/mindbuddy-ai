"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Clock, Target, TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import { fetchAnalytics, type AnalyticsSummary } from "@/lib/api";

const ACCENT_BG: Record<string, string> = {
  "text-orange-400":  "bg-orange-500/12 border-orange-500/20",
  "text-violet-400":  "bg-violet-500/12 border-violet-500/20",
  "text-cyan-400":    "bg-cyan-500/12 border-cyan-500/20",
  "text-emerald-400": "bg-emerald-500/12 border-emerald-500/20",
};

const HOVER_GLOW: Record<string, string> = {
  "text-orange-400":  "hover:shadow-[0_0_28px_rgba(251,146,60,0.18)]",
  "text-violet-400":  "hover:shadow-[0_0_28px_rgba(167,139,250,0.18)]",
  "text-cyan-400":    "hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]",
  "text-emerald-400": "hover:shadow-[0_0_28px_rgba(52,211,153,0.18)]",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] as const } },
};

function buildStats(s: AnalyticsSummary) {
  return [
    {
      id: "streak",
      label: "Study Streak",
      value: `${s.currentStreak} days`,
      icon: <Flame size={18} />,
      accentClass: "text-orange-400",
      delta: 20,
      deltaLabel: "vs last week",
    },
    {
      id: "xp",
      label: "Total XP",
      value: s.totalXp.toLocaleString(),
      icon: <Zap size={18} />,
      accentClass: "text-violet-400",
      delta: 15,
      deltaLabel: "this week",
    },
    {
      id: "time",
      label: "Study Time",
      value: formatMinutes(Math.round(s.totalStudyHours * 60)),
      icon: <Clock size={18} />,
      accentClass: "text-cyan-400",
      delta: 8,
      deltaLabel: "total",
    },
    {
      id: "quiz",
      label: "Quiz Avg",
      value: `${s.averageQuizScore}%`,
      icon: <Target size={18} />,
      accentClass: "text-emerald-400",
      delta: 5,
      deltaLabel: "all time",
    },
  ];
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 w-20 rounded bg-white/8" />
        <div className="w-9 h-9 rounded-xl bg-white/8" />
      </div>
      <div className="h-7 w-24 rounded bg-white/8 mb-2" />
      <div className="h-3 w-16 rounded bg-white/5" />
    </div>
  );
}

export function StatsRow() {
  const [stats, setStats] = useState<ReturnType<typeof buildStats> | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then((data) => setStats(buildStats(data.summary)))
      .catch(() => {/* silently degrade */});
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          variants={item}
          whileHover={{ y: -3, transition: { duration: 0.18 } }}
          className={cn(
            "glass-card rounded-2xl p-5 relative overflow-hidden cursor-default transition-shadow duration-300 group",
            HOVER_GLOW[stat.accentClass]
          )}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(124,58,237,0.06), transparent 60%)" }}
          />

          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-medium text-muted-foreground">{stat.label}</p>
            <div className={cn(
              "w-9 h-9 rounded-xl border flex items-center justify-center",
              ACCENT_BG[stat.accentClass] ?? "bg-white/8 border-white/12",
              stat.accentClass
            )}>
              {stat.icon}
            </div>
          </div>

          <p className="stat-number mb-2">{stat.value}</p>

          <div className="flex items-center gap-1.5">
            {stat.delta >= 0
              ? <TrendingUp size={11} className="text-emerald-400" />
              : <TrendingDown size={11} className="text-rose-400" />
            }
            <span className={cn("text-[11px] font-medium", stat.delta >= 0 ? "text-emerald-400" : "text-rose-400")}>
              {stat.delta >= 0 ? "+" : ""}{stat.delta}%
            </span>
            <span className="text-[11px] text-muted-foreground/50">{stat.deltaLabel}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
