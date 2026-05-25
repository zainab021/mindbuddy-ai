"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Sparkles, Flame, X, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_USER } from "@/data/mock";
import { useUserName, getInitials } from "@/hooks/use-user-name";

const NOTIFICATIONS = [
  { id: 1, title: "New AI study plan generated",       time: "2m ago",  unread: true,  icon: "ai"     },
  { id: 2, title: "Physics quiz reminder at 3 PM",     time: "1h ago",  unread: true,  icon: "quiz"   },
  { id: 3, title: "Achievement: Consistency Champion", time: "5h ago",  unread: false, icon: "badge"  },
  { id: 4, title: "Weekly report is ready to view",    time: "1d ago",  unread: false, icon: "report" },
];

export function TopNav() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread   = NOTIFICATIONS.filter((n) => n.unread).length;
  const userName = useUserName();
  const initials = getInitials(userName);

  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-4 px-6 glass-md border-b border-white/8">

      {/* ── Search ── */}
      <div className="flex-1 max-w-sm">
        <div
          className={cn(
            "flex items-center gap-2.5 h-9 rounded-xl border bg-white/5 px-3.5 transition-all duration-200",
            focused
              ? "border-violet-500/50 bg-violet-500/5 shadow-glow-xs"
              : "border-white/8 hover:border-white/15"
          )}
        >
          <Search size={14} className="text-muted-foreground/50 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search topics, decks, quizzes…"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none flex-1 w-full min-w-0"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 h-8">
          <Flame size={13} className="text-orange-400" />
          <span className="text-orange-300 text-[11px] font-semibold">{MOCK_USER.streak}d streak</span>
        </div>

        {/* Trend */}
        <div className="hidden lg:flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
          <TrendingUp size={12} />
          <span>+15% this week</span>
        </div>

        {/* Ask AI */}
        <Button size="sm" className="hidden md:flex gap-1.5 text-[11px] h-8 px-3">
          <Sparkles size={12} />
          Ask AI
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 rounded-xl glass border border-white/8 flex items-center justify-center hover:border-violet-500/30 text-muted-foreground hover:text-foreground transition-all"
          >
            <Bell size={15} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[14px] h-[14px] bg-violet-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-80 glass-md rounded-2xl border border-white/10 shadow-glass z-40 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                    <span className="text-[13px] font-semibold">Notifications</span>
                    <button className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors">
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors",
                          n.unread && "bg-violet-500/5"
                        )}
                      >
                        <div className={cn("w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0", n.unread ? "bg-violet-400" : "bg-transparent")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-foreground/90 font-medium leading-snug">{n.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-8 h-8 rounded-xl cursor-pointer hover:shadow-glow-xs transition-shadow">
            <AvatarFallback className="rounded-xl text-[11px]">{initials}</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#060610]" />
        </div>
      </div>
    </header>
  );
}
