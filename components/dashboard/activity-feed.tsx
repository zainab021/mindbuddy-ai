"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity, BookOpen, Layers, Trophy, CircleHelp, Flame, Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn, timeAgo } from "@/lib/utils";
import { fetchAnalytics, type ApiActivity } from "@/lib/api";

const CONFIG: Record<string, { icon: React.ReactNode; cls: string }> = {
  quiz:        { icon: <CircleHelp size={14} />, cls: "bg-violet-500/12 border-violet-500/25 text-violet-400" },
  flashcard:   { icon: <Layers size={14} />,     cls: "bg-blue-500/12 border-blue-500/25 text-blue-400"      },
  study:       { icon: <BookOpen size={14} />,   cls: "bg-cyan-500/12 border-cyan-500/25 text-cyan-400"      },
  achievement: { icon: <Trophy size={14} />,     cls: "bg-amber-500/12 border-amber-500/25 text-amber-400"   },
  streak:      { icon: <Flame size={14} />,      cls: "bg-orange-500/12 border-orange-500/25 text-orange-400" },
};

const DEFAULT_CFG = { icon: <BookOpen size={14} />, cls: "bg-white/8 border-white/15 text-muted-foreground" };

export function ActivityFeed() {
  const [activity, setActivity] = useState<ApiActivity[] | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then((data) => setActivity(data.recentActivity))
      .catch(() => {/* silently degrade */});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-violet-400" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <button className="text-[11px] text-violet-400 hover:text-violet-300 font-medium transition-colors">
            View all
          </button>
        </CardHeader>

        <CardContent className="pt-0 space-y-1">
          {!activity ? (
            <div className="space-y-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-36 rounded bg-white/5" />
                    <div className="h-2.5 w-24 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            activity.map((entry, i) => {
              const cfg = CONFIG[entry.type] ?? DEFAULT_CFG;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/4 transition-colors group cursor-default"
                >
                  <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0", cfg.cls)}>
                    {cfg.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground/90 truncate group-hover:text-foreground transition-colors">
                      {entry.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {entry.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] text-muted-foreground/50">{timeAgo(entry.createdAt)}</span>
                    <span className="flex items-center gap-0.5 text-violet-400 text-[10px] font-semibold">
                      <Zap size={9} />+{entry.xpGained}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
