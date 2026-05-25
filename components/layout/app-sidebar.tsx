"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Brain, Layers, CircleHelp, BarChart3,
  CalendarDays, Settings, Sparkles, ChevronLeft, ChevronRight,
  Flame, Zap, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_USER } from "@/data/mock";
import { useUserName, getInitials } from "@/hooks/use-user-name";

/* ─── Icon map ─────────────────────────────────────────────────────────── */
const ICONS: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={17} />,
  Brain:           <Brain size={17} />,
  Layers:          <Layers size={17} />,
  CircleHelp:      <CircleHelp size={17} />,
  BarChart3:       <BarChart3 size={17} />,
  CalendarDays:    <CalendarDays size={17} />,
  Settings:        <Settings size={17} />,
};

/* ─── Nav data ─────────────────────────────────────────────────────────── */
const NAV = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" }],
  },
  {
    group: "Learning",
    items: [
      { label: "AI Study",   href: "/study",      icon: "Brain"      },
      { label: "Flashcards", href: "/flashcards",  icon: "Layers"     },
      { label: "Quiz",       href: "/quiz",        icon: "CircleHelp" },
    ],
  },
  {
    group: "Progress",
    items: [
      { label: "Analytics", href: "/analytics", icon: "BarChart3"   },
      { label: "Planner",   href: "/planner",   icon: "CalendarDays"},
    ],
  },
  {
    group: "Account",
    items: [{ label: "Settings", href: "/settings", icon: "Settings" }],
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const userName = useUserName();
  const xpPct    = Math.round((MOCK_USER.xp / MOCK_USER.xpToNextLevel) * 100);
  const initials = getInitials(userName);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen glass-md border-r border-white/8 flex-shrink-0 z-30 overflow-hidden"
    >
      {/* ── Collapse toggle ── */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute -right-3 top-[22px] z-50 w-6 h-6 rounded-full glass border border-white/15 flex items-center justify-center hover:border-violet-500/40 hover:text-violet-400 text-muted-foreground transition-colors shadow-glass"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </motion.button>

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 h-[60px] border-b border-white/8 flex-shrink-0">
        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-glow-xs flex-shrink-0"
        >
          <Sparkles size={17} className="text-white" />
        </motion.div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <span className="text-gradient font-bold text-[15px] tracking-tight">MindSprint</span>
              <span className="ml-1 text-violet-400 font-bold text-[11px]">AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 overflow-x-hidden">
        {NAV.map((section) => (
          <div key={section.group}>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="section-title px-3 mb-1.5"
                >
                  {section.group}
                </motion.p>
              )}
            </AnimatePresence>

            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group outline-none",
                        active
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {/* Active background */}
                      {active && (
                        <motion.span
                          layoutId="sidebar-pill"
                          className="absolute inset-0 rounded-xl bg-violet-600/20 border border-violet-500/30"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                        />
                      )}

                      <span
                        className={cn(
                          "relative z-10 flex-shrink-0 transition-colors",
                          active
                            ? "text-violet-400"
                            : "text-muted-foreground/60 group-hover:text-muted-foreground"
                        )}
                      >
                        {ICONS[item.icon]}
                      </span>

                      <AnimatePresence initial={false}>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.13 }}
                            className="relative z-10 truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── User card ── */}
      <div className="border-t border-white/8 p-3 flex-shrink-0">
        <div className={cn("glass rounded-xl p-3 space-y-2", collapsed && "px-1.5")}>
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <Avatar className="w-8 h-8 rounded-xl">
                <AvatarFallback className="rounded-xl text-[11px]">{initials}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#060610]" />
            </div>

            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.13 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-[13px] font-semibold text-foreground truncate">
                    {userName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Trophy size={9} className="text-amber-400" />
                      Lv.{MOCK_USER.level}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Flame size={9} className="text-orange-400" />
                      {MOCK_USER.streak}d
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Zap size={9} className="text-violet-400" />
                      {MOCK_USER.xp.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Progress value={xpPct} size="xs" color="violet" />
                <p className="text-[9px] text-muted-foreground/50 mt-1">
                  {MOCK_USER.xp.toLocaleString()} / {MOCK_USER.xpToNextLevel.toLocaleString()} XP
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
