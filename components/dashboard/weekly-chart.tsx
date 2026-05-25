"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarController, LineController,
  BarElement, LineElement, PointElement, ArcElement,
  Tooltip, Legend, Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { fetchAnalytics, type ApiWeekDay } from "@/lib/api";
import { formatMinutes } from "@/lib/utils";

ChartJS.register(
  CategoryScale, LinearScale,
  BarController, LineController,
  BarElement, LineElement, PointElement, ArcElement,
  Tooltip, Legend, Filler,
);

function buildChartData(weekly: ApiWeekDay[]) {
  const avgMin = weekly.reduce((s, d) => s + d.studyMinutes, 0) / weekly.length;
  return {
    labels: weekly.map((d) => d.day),
    datasets: [
      {
        type: "bar" as const,
        label: "Study Minutes",
        data: weekly.map((d) => d.studyMinutes),
        backgroundColor: weekly.map((d) =>
          d.studyMinutes >= avgMin ? "rgba(124,58,237,0.75)" : "rgba(124,58,237,0.22)"
        ),
        borderColor: weekly.map((d) =>
          d.studyMinutes >= avgMin ? "#7c3aed" : "rgba(124,58,237,0.35)"
        ),
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        type: "line" as const,
        label: "XP",
        data: weekly.map((d) => d.xp / 10),
        borderColor: "rgba(96,165,250,0.8)",
        borderWidth: 2,
        pointBackgroundColor: "#60a5fa",
        pointBorderColor: "#60a5fa",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
        backgroundColor: "transparent",
      },
    ],
  };
}

const chartOptions: object = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(6,6,16,0.95)",
      titleColor: "#e2e8f0",
      bodyColor: "#94a3b8",
      borderColor: "rgba(124,58,237,0.35)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx: { datasetIndex: number; parsed: { y: number } }) => {
          const y: number = ctx?.parsed?.y ?? 0;
          return ctx.datasetIndex === 0 ? ` ${y}m study` : ` ${Math.round(y * 10)} XP`;
        },
      },
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
      ticks: { color: "#64748b", font: { size: 10 }, callback: (v: number | string) => `${v}m` },
      beginAtZero: true,
    },
  },
};

export function WeeklyChart() {
  const [weekly, setWeekly] = useState<ApiWeekDay[] | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then((data) => setWeekly(data.weeklyData))
      .catch(() => {/* silently degrade */});
  }, []);

  if (!weekly) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={15} className="text-violet-400" />
                <CardTitle>Weekly Progress</CardTitle>
              </div>
              <CardDescription>Study time & XP by day</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const totalMin = weekly.reduce((s, d) => s + d.studyMinutes, 0);
  const totalXP  = weekly.reduce((s, d) => s + d.xp, 0);
  const chartData = buildChartData(weekly);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={15} className="text-violet-400" />
              <CardTitle>Weekly Progress</CardTitle>
            </div>
            <CardDescription>Study time & XP by day</CardDescription>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-base font-bold text-foreground">{formatMinutes(totalMin)}</p>
              <p className="text-[10px] text-muted-foreground">Total this week</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-bold text-blue-400 flex items-center gap-1 justify-end">
                <TrendingUp size={13} />{totalXP.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">XP earned</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
              <span className="text-[11px] text-muted-foreground">Study time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-[2px] bg-blue-400 rounded-full" />
              <span className="text-[11px] text-muted-foreground">XP trend</span>
            </div>
          </div>
          <div className="h-48">
            <Chart type="bar" data={chartData as never} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
