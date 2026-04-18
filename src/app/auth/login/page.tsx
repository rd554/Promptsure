"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [magicSent, setMagicSent] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setError(error.message);
      } else {
        setMagicSent(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass-strong rounded-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Sign in to your PromptSure account
            </p>
          </div>

          {magicSent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="h-16 w-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-1">Check your email</h3>
              <p className="text-sm text-zinc-400">
                We sent a magic link to <strong className="text-zinc-200">{email}</strong>
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {mode === "password" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "magic" ? (
                  "Send magic link"
                ) : (
                  "Sign in"
                )}
              </Button>

              <button
                type="button"
                onClick={() => setMode(mode === "password" ? "magic" : "password")}
                className="w-full text-center text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {mode === "password"
                  ? "Use magic link instead"
                  : "Use password instead"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300">
                Sign up
              </Link>
            </p>
            <Link
              href="/demo"
              className="inline-block mt-3 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Or try the demo without signing up →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
