"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Flame, Zap, BookOpen, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserName } from "@/hooks/use-user-name";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const } },
};

const STATS = { streak: 12, xp: 3240, level: 14 };

export function HeroBanner() {
  const userName = useUserName();
  const firstName = userName.split(" ")[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl overflow-hidden"
    >
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-violet-900/40 to-indigo-950/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(124,58,237,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_100%,rgba(37,99,235,0.15),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute inset-0 rounded-3xl border border-violet-500/20" />

      <div className="relative px-8 py-8 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:justify-between">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-violet-500/15 border border-violet-500/25 rounded-full px-3 py-1">
              <Sparkles size={11} className="text-violet-400" />
              <span className="text-[11px] font-medium text-violet-300">AI-Powered Learning</span>
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-[26px] font-bold leading-snug text-foreground">
            {greeting()},{" "}
            <span className="text-gradient">{firstName}!</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md">
            You have{" "}
            <span className="text-foreground font-medium">3 tasks</span> due today and{" "}
            <span className="text-violet-300 font-medium">4 AI recommendations</span> ready.
            Let&apos;s make today count.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center flex-wrap gap-5 mt-5">
            {[
              { icon: <Flame size={13} className="text-orange-400" />, value: `${STATS.streak}`, label: "Day streak", bg: "bg-orange-500/12 border-orange-500/20" },
              { icon: <Zap size={13} className="text-violet-400" />,   value: STATS.xp.toLocaleString(), label: "Total XP",    bg: "bg-violet-500/12 border-violet-500/20" },
              { icon: <BookOpen size={13} className="text-blue-400" />, value: `Lv.${STATS.level}`, label: "Level",       bg: "bg-blue-500/12 border-blue-500/20" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${s.bg}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto lg:w-[200px]"
        >
          <Button asChild size="default" className="w-full justify-between">
            <Link href="/study">
              <span className="flex items-center gap-2"><Brain size={15} />Start AI Session</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
          <Button asChild size="default" variant="outline" className="w-full justify-between">
            <Link href="/quiz">
              <span className="flex items-center gap-2">
                <BookOpen size={14} className="text-violet-400" />Quick Quiz
              </span>
              <ArrowRight size={13} className="text-muted-foreground" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
