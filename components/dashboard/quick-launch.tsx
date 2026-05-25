"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Layers, CircleHelp, CalendarDays, BarChart3, ArrowRight } from "lucide-react";

const CARDS = [
  { label: "AI Study",   desc: "Generate tailored sessions",  icon: Brain,        href: "/study",      gradient: "from-violet-600/20 to-violet-900/20", border: "border-violet-500/20 hover:border-violet-500/45", iconCls: "bg-violet-500/15 text-violet-400", glow: "hover:shadow-[0_0_28px_rgba(124,58,237,0.22)]" },
  { label: "Flashcards", desc: "Spaced repetition review",    icon: Layers,       href: "/flashcards", gradient: "from-blue-600/20 to-blue-900/20",     border: "border-blue-500/20 hover:border-blue-500/45",     iconCls: "bg-blue-500/15 text-blue-400",    glow: "hover:shadow-[0_0_28px_rgba(37,99,235,0.22)]"  },
  { label: "Take Quiz",  desc: "Test your knowledge",         icon: CircleHelp,   href: "/quiz",       gradient: "from-pink-600/20 to-pink-900/20",     border: "border-pink-500/20 hover:border-pink-500/45",     iconCls: "bg-pink-500/15 text-pink-400",    glow: "hover:shadow-[0_0_28px_rgba(219,39,119,0.22)]" },
  { label: "Planner",    desc: "Organise your schedule",      icon: CalendarDays, href: "/planner",    gradient: "from-cyan-600/20 to-cyan-900/20",     border: "border-cyan-500/20 hover:border-cyan-500/45",     iconCls: "bg-cyan-500/15 text-cyan-400",    glow: "hover:shadow-[0_0_28px_rgba(8,145,178,0.22)]"  },
  { label: "Analytics",  desc: "Track your progress",         icon: BarChart3,    href: "/analytics",  gradient: "from-emerald-600/20 to-emerald-900/20",border: "border-emerald-500/20 hover:border-emerald-500/45",iconCls: "bg-emerald-500/15 text-emerald-400",glow: "hover:shadow-[0_0_28px_rgba(5,150,105,0.22)]" },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
};

export function QuickLaunch() {
  return (
    <div>
      <p className="section-title mb-3">Quick Actions</p>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {CARDS.map((c) => (
          <motion.div key={c.href} variants={item} whileHover={{ y: -4, transition: { duration: 0.18 } }}>
            <Link
              href={c.href}
              className={`flex flex-col gap-3 p-4 rounded-2xl glass-card border bg-gradient-to-br transition-all duration-200 group ${c.gradient} ${c.border} ${c.glow}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconCls}`}>
                <c.icon size={19} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{c.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{c.desc}</p>
              </div>
              <ArrowRight
                size={13}
                className="text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all duration-200 mt-auto"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
