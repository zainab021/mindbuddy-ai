"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Palette, BookOpen, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MOCK_USER } from "@/data/mock";
import { useUserName } from "@/hooks/use-user-name";
import { cn } from "@/lib/utils";

/* ─── Toggle ────────────────────────────────────────────────────────────── */
function Toggle({ on }: { on: boolean }) {
  const [enabled, setEnabled] = useState(on);
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={cn(
        "relative w-10 h-[22px] rounded-full transition-colors duration-200",
        enabled ? "bg-violet-600" : "bg-white/12"
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
          enabled ? "translate-x-[22px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
const NOTIF_TOGGLES = [
  { label: "Study reminders",       on: true  },
  { label: "Quiz results",          on: true  },
  { label: "Weekly progress report",on: false },
  { label: "AI recommendations",    on: true  },
];

const APPEAR_TOGGLES = [
  { label: "Dark mode",      on: true  },
  { label: "Reduced motion", on: false },
  { label: "Compact sidebar",on: false },
];

export default function SettingsPage() {
  const userName = useUserName();

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User size={15} className="text-violet-400" />
              <CardTitle>Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Full Name</label>
              <Input defaultValue={userName} key={userName} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Email</label>
              <Input type="email" defaultValue={MOCK_USER.email} />
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-blue-400" />
              <CardTitle>Learning Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Daily Study Goal (minutes)</label>
              <Input type="number" defaultValue="60" className="max-w-[120px]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Preferred Difficulty</label>
              <select className="flex h-10 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground outline-none focus:border-violet-500/50">
                {["Easy", "Medium", "Hard"].map((o) => (
                  <option key={o} value={o} className="bg-[#0e0e1a]">{o}</option>
                ))}
              </select>
            </div>
            <Button size="sm">Save Preferences</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-cyan-400" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-white/6">
            {NOTIF_TOGGLES.map((t, i) => (
              <div key={t.label} className={cn("flex items-center justify-between", i === 0 ? "pb-3" : "py-3")}>
                <span className="text-[13px] text-foreground/90">{t.label}</span>
                <Toggle on={t.on} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette size={15} className="text-pink-400" />
              <CardTitle>Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-white/6">
            {APPEAR_TOGGLES.map((t, i) => (
              <div key={t.label} className={cn("flex items-center justify-between", i === 0 ? "pb-3" : "py-3")}>
                <span className="text-[13px] text-foreground/90">{t.label}</span>
                <Toggle on={t.on} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
        <Card className="border-rose-500/20 bg-rose-500/[0.03]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-rose-400" />
              <CardTitle className="text-rose-400">Danger Zone</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[12px] text-muted-foreground mb-4">
              These actions are permanent and cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50">
                Reset Progress
              </Button>
              <Button variant="outline" size="sm" className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
