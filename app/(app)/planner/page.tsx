"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Check, Plus, CircleHelp, Layers, BookOpen, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, relativeDay } from "@/lib/utils";
import { fetchPlanner, togglePlannerTask } from "@/lib/api";
import { SUBJECT_COLORS } from "@/lib/constants";
import type { PlannerTask, TaskType, Priority } from "@/types";

const TASK_ICONS: Record<TaskType, React.ReactNode> = {
  quiz:      <CircleHelp size={13} />,
  flashcard: <Layers size={13} />,
  study:     <BookOpen size={13} />,
  revision:  <RotateCcw size={13} />,
};

const PRIORITY_CFG: Record<Priority, { variant: "rose" | "amber" | "blue"; dot: string }> = {
  high:   { variant: "rose",  dot: "bg-rose-400"  },
  medium: { variant: "amber", dot: "bg-amber-400" },
  low:    { variant: "blue",  dot: "bg-blue-400"  },
};

function LoadingSkeleton() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-white/5" />
          <div className="h-4 w-48 rounded bg-white/5" />
        </div>
        <div className="h-9 w-24 rounded bg-white/5" />
      </div>
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlanner()
      .then(setTasks)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load tasks"),
      )
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    try {
      await togglePlannerTask(id, !task.completed);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: task.completed } : t)));
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm font-medium text-foreground">{error}</p>
        <p className="text-xs text-muted-foreground">Make sure the backend is running at http://127.0.0.1:8000</p>
      </div>
    );
  }

  const pending   = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) =>  t.completed);

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Study Planner</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {pending.length} tasks remaining · {completed.length} completed
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={14} />
          Add Task
        </Button>
      </motion.div>

      {pending.length > 0 && (
        <div>
          <p className="section-title mb-3">Upcoming</p>
          <div className="space-y-2">
            {pending.map((task, i) => (
              <TaskRow key={task.id} task={task} index={i} onToggle={toggle} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <p className="section-title mb-3">Completed</p>
          <div className="space-y-2 opacity-60">
            {completed.map((task, i) => (
              <TaskRow key={task.id} task={task} index={i} onToggle={toggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  index,
  onToggle,
}: {
  task: PlannerTask;
  index: number;
  onToggle: (id: string) => void;
}) {
  const priority = PRIORITY_CFG[task.priority];
  const subj     = SUBJECT_COLORS[task.subject];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-4 rounded-xl glass-card border border-white/6 hover:border-white/12 transition-all group"
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
          task.completed
            ? "bg-emerald-500/20 border-emerald-500/60"
            : "border-white/20 hover:border-violet-500"
        )}
      >
        {task.completed && <Check size={10} className="text-emerald-400" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={cn("text-[13px] font-semibold", task.completed ? "line-through text-muted-foreground" : "text-foreground")}>
            {task.title}
          </span>
          <Badge variant={priority.variant}>{task.priority}</Badge>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
          {subj && <span className={cn("tag", subj.bg, subj.text, subj.border)}>{task.subject}</span>}
          <span className="flex items-center gap-1">{TASK_ICONS[task.type]} {task.type}</span>
          <span className="flex items-center gap-1"><Clock size={10} />{task.estimatedMinutes}m</span>
          <span className="flex items-center gap-1"><CalendarDays size={10} />{relativeDay(task.dueAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}
