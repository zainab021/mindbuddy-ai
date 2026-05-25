"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, Brain, Layers, CircleHelp, BarChart3,
  ArrowRight, Zap, Star, CheckCircle2, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Feature cards ─────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Brain,
    title: "AI Study Generator",
    body: "Describe a topic and get a fully personalised study session — summaries, examples, and practice questions in seconds.",
    cls: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Layers,
    title: "Smart Flashcards",
    body: "Spaced-repetition algorithm reviews cards at the scientifically optimal time so you forget less and retain more.",
    cls: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: CircleHelp,
    title: "Adaptive Quizzes",
    body: "AI adjusts difficulty in real time based on your performance, focusing energy on the exact gaps that matter.",
    cls: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    body: "Visualise mastery per subject, track streaks, XP, and study patterns to stay motivated and on track.",
    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
] as const;

const HERO_STATS = [
  { value: "50K+", label: "Active learners" },
  { value: "2.4×", label: "Faster results"  },
  { value: "98%",  label: "Satisfaction"    },
  { value: "4.9★", label: "App rating"      },
];

const PERKS = [
  "Personalised AI study plans",
  "Spaced-repetition flashcards",
  "Adaptive quizzes & analytics",
  "Daily planner & streak tracker",
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="relative min-h-dvh bg-[#060610] text-white overflow-x-hidden">
      {/* Ambient orbs */}
      <div className="orb orb-violet w-[600px] h-[600px] -top-60 -right-20 opacity-[0.13]" />
      <div className="orb orb-blue w-[500px] h-[500px] top-1/3 -left-40 opacity-[0.09]" />
      <div className="orb orb-violet w-[400px] h-[400px] bottom-0 right-1/3 opacity-[0.08]" />

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 glass border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-glow-xs"
          >
            <Sparkles size={15} className="text-white" />
          </motion.div>
          <span className="text-gradient font-bold text-[15px] tracking-tight">MindSprint</span>
          <span className="text-violet-400 font-bold text-[11px]">AI</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-[11px] font-medium text-violet-300">AI-Powered Learning Platform</span>
            <span className="bg-violet-600 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 ml-1">NEW</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
            Learn{" "}
            <span className="text-gradient">Smarter,</span>
            <br />
            Not Harder
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            MindSprint AI adapts to your unique learning style, identifies knowledge gaps,
            and generates study plans that actually work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2.5 shadow-glow-sm">
              <Link href="/dashboard">
                <Sparkles size={17} />
                Start Learning Free
                <ArrowRight size={15} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Perks list */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
            {PERKS.map((p) => (
              <div key={p} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {p}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {HERO_STATS.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 text-center">
              <p className="text-3xl font-extrabold text-gradient">{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 pb-28 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything to{" "}
            <span className="text-gradient">ace your studies</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Powered by advanced AI to give you the most efficient learning experience possible.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              className={`glass-card rounded-2xl p-6 border hover:-translate-y-0.5 transition-all duration-200 ${f.cls}`}
            >
              <div className="mb-4">
                <f.icon size={22} />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-3xl mx-auto relative rounded-3xl overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 to-indigo-900/60" />
          <div className="absolute inset-0 border border-violet-500/25 rounded-3xl" />
          <div className="relative px-10 py-16">
            <TrendingUp size={36} className="text-violet-400 mx-auto mb-5" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to transform your learning?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-[14px]">
              Join 50,000 students already using MindSprint AI to reach their goals faster.
            </p>
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 gap-2.5 shadow-glow-md">
              <Link href="/dashboard">
                <Zap size={17} className="text-violet-600" />
                Start for Free
                <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-gradient font-bold text-sm">MindSprint AI</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            © 2025 MindSprint AI — Built for learners, by learners.
          </p>
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
            <span className="text-[11px] text-muted-foreground ml-1">4.9 / 5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
