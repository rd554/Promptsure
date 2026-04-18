"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/auth/onboarding");
    }
    setLoading(false);
  };

  const benefits = [
    "Generate 100+ test scenarios automatically",
    "AI-powered evaluation of every output",
    "Track reliability scores over time",
    "Catch hallucinations before your users do",
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-950 via-zinc-950 to-zinc-950 p-12 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 mb-8">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Ship AI features with confidence
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-md">
            PromptSure tests your AI before users do. Simulate edge cases,
            evaluate quality, and catch issues early.
          </p>
          <ul className="space-y-3">
            {benefits.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-zinc-300"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20">
                  <Check className="h-3 w-3 text-violet-400" />
                </div>
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 grid-pattern">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-strong rounded-2xl p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-sm text-zinc-400 mt-1">
                Start testing AI features in minutes
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

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
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-xs text-zinc-500 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
              <p className="text-sm text-zinc-400">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-violet-400 hover:text-violet-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
