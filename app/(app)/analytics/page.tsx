"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Clock, Zap, Trophy, TrendingUp, AlertCircle,
} from "lucide-react";
import {
  Chart, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Tooltip, Filler,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMinutes } from "@/lib/utils";
import { fetchAnalytics, type AnalyticsData } from "@/lib/api";

Chart.register(
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Tooltip, Filler,
);

const COLOR_MAP: Record<string, "violet" | "blue" | "indigo" | "cyan"> = {
  "#7c3aed": "violet",
  "#2563eb": "blue",
  "#4f46e5": "indigo",
  "#0891b2": "cyan",
};

function buildSummaryCards(s: AnalyticsData["summary"]) {
  return [
    {
      label: "Total Study Time",
      value: formatMinutes(Math.round(s.totalStudyHours * 60)),
      icon: Clock,
      cls: "text-cyan-400 bg-cyan-500/12 border-cyan-500/20",
    },
    {
      label: "Total XP Earned",
      value: s.totalXp.toLocaleString(),
      icon: Zap,
      cls: "text-violet-400 bg-violet-500/12 border-violet-500/20",
    },
    {
      label: "Quizzes Completed",
      value: String(s.quizzesCompleted),
      icon: Trophy,
      cls: "text-amber-400 bg-amber-500/12 border-amber-500/20",
    },
    {
      label: "Average Quiz Score",
      value: `${s.averageQuizScore}%`,
      icon: TrendingUp,
      cls: "text-emerald-400 bg-emerald-500/12 border-emerald-500/20",
    },
  ];
}

// ── Loading skeleton ───────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 rounded-lg bg-white/5" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 rounded-xl bg-white/5" />
        <div className="h-64 rounded-xl bg-white/5" />
      </div>
      <div className="h-72 rounded-xl bg-white/5" />
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────────

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

// ── Page ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load analytics"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState message={error ?? "No data returned from server"} />;

  const summaryCards = buildSummaryCards(data.summary);

  /* Weekly bar chart data */
  const weeklyChartData = {
    labels: data.weeklyData.map((d) => d.day),
    datasets: [{
      label: "Study Minutes",
      data: data.weeklyData.map((d) => d.studyMinutes),
      backgroundColor: "rgba(124,58,237,0.6)",
      borderColor: "#7c3aed",
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const weeklyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(6,6,16,0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        borderColor: "rgba(124,58,237,0.35)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 10 },
          callback: (v: number | string) => `${v}m`,
        },
        beginAtZero: true,
      },
    },
  };

  /* Donut chart data */
  const donutChartData = {
    labels: data.subjectStats.map((s) => s.subject),
    datasets: [{
      data: data.subjectStats.map((s) => s.studyMinutes),
      backgroundColor: data.subjectStats.map((s) => `${s.colorHex}cc`),
      borderColor: data.subjectStats.map((s) => s.colorHex),
      borderWidth: 2,
      hoverOffset: 4,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(6,6,16,0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        borderColor: "rgba(124,58,237,0.25)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
      },
    },
    cutout: "72%",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Deep insights into your learning journey</p>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${s.cls}`}>
                  <s.icon size={17} />
                </div>
                <p className="stat-number">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-violet-400" />
                <CardTitle>Weekly Study Time</CardTitle>
              </div>
              <CardDescription>Minutes studied per day this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <Bar data={weeklyChartData} options={weeklyOptions as never} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Time by Subject</CardTitle>
              <CardDescription>Total study minutes distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-36 mb-4">
                <Doughnut data={donutChartData} options={donutOptions as never} />
              </div>
              <div className="space-y-2">
                {data.subjectStats.map((s) => (
                  <div key={s.subject} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.colorHex }}
                    />
                    <span className="text-[11px] text-foreground/80 flex-1 truncate">{s.subject}</span>
                    <span className="text-[11px] font-medium text-foreground">
                      {formatMinutes(s.studyMinutes)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Subject mastery */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subject Mastery</CardTitle>
            <CardDescription>
              Your knowledge level per subject based on quiz scores and review sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.subjectStats.map((stat) => {
              const color = COLOR_MAP[stat.colorHex] ?? "violet";
              return (
                <div key={stat.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: stat.colorHex }}
                      />
                      <span className="text-sm font-medium text-foreground/90">{stat.subject}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span>{formatMinutes(stat.studyMinutes)} studied</span>
                      <span>{stat.quizzesCompleted} quizzes</span>
                      <span className="font-bold text-foreground">{stat.masteryPct}%</span>
                    </div>
                  </div>
                  <Progress value={stat.masteryPct} size="lg" color={color} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
