"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, Github, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupUser } from "@/lib/api";

const PERKS = [
  "Personalised AI study plans",
  "Spaced-repetition flashcards",
  "Adaptive quizzes & deep analytics",
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signupUser(name, email, password);
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user_name", result.user.name);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-glow-xs">
          <Sparkles size={17} className="text-white" />
        </div>
        <span className="text-gradient font-bold text-base">MindSprint</span>
        <span className="text-violet-400 font-bold text-xs">AI</span>
      </div>

      <div className="glass-card rounded-3xl p-8">
        <h1 className="text-xl font-bold text-foreground mb-1">Create your account</h1>
        <p className="text-[13px] text-muted-foreground mb-4">
          Join 50,000+ students learning smarter
        </p>

        <div className="space-y-1.5 mb-5">
          {PERKS.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
              <span className="text-[12px] text-muted-foreground">{p}</span>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full gap-2.5 mb-5" size="default" type="button">
          <Github size={16} />
          Continue with GitHub
        </Button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11px] text-muted-foreground">or with email</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground">Full Name</label>
            <Input
              type="text"
              placeholder="Alex Rivera"
              icon={<User size={14} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground">Email</label>
            <Input
              type="email"
              placeholder="alex@student.edu"
              icon={<Mail size={14} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground">Password</label>
            <Input
              type="password"
              placeholder="Min. 8 characters"
              icon={<Lock size={14} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-[12px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <Button size="default" className="w-full gap-2 mt-1" type="submit" disabled={loading}>
            {loading ? "Creating account…" : <>Create Account <ArrowRight size={14} /></>}
          </Button>
        </form>

        <p className="text-center text-[12px] text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
