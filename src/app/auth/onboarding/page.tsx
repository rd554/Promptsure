"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Loader2, Sparkles, Target, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

const steps = [
  {
    id: "building",
    title: "What are you building?",
    subtitle: "Help us customize your experience",
    icon: Sparkles,
  },
  {
    id: "use_case",
    title: "What's your primary use case?",
    subtitle: "We'll set up relevant templates",
    icon: Target,
  },
  {
    id: "risk",
    title: "What's your main concern?",
    subtitle: "We'll prioritize these evaluations",
    icon: AlertTriangle,
  },
];

const useCases = [
  "Customer support bot",
  "AI copilot / assistant",
  "Content generation",
  "Code generation",
  "Data analysis / Q&A",
  "Chatbot / conversational AI",
  "Search / RAG system",
  "Other",
];

const risks = [
  { value: "hallucination", label: "Hallucination / factual errors" },
  { value: "tone", label: "Inappropriate tone or language" },
  { value: "safety", label: "Safety / harmful outputs" },
  { value: "accuracy", label: "Poor accuracy / relevance" },
  { value: "consistency", label: "Inconsistent responses" },
  { value: "latency", label: "Latency / performance" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [building, setBuilding] = useState("");
  const [useCase, setUseCase] = useState("");
  const [risk, setRisk] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          building,
          use_case: useCase,
          main_risk: risk,
          onboarded: true,
        });
      }
    } catch {
      // Proceed even if DB update fails
    }
    router.push("/dashboard");
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const canProceed =
    (step === 0 && building.length > 0) ||
    (step === 1 && useCase.length > 0) ||
    (step === 2 && risk.length > 0);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg mx-4"
      >
        <div className="glass-strong rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-violet-500" : "bg-zinc-800"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <CurrentIcon className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{steps[step].title}</h2>
                  <p className="text-sm text-zinc-400">{steps[step].subtitle}</p>
                </div>
              </div>

              {step === 0 && (
                <div className="space-y-3">
                  <Label>Describe your AI feature</Label>
                  <Input
                    placeholder="e.g., Customer support chatbot for a SaaS platform"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {useCases.map((uc) => (
                    <button
                      key={uc}
                      onClick={() => setUseCase(uc)}
                      className={`rounded-lg border px-4 py-3 text-sm text-left transition-all ${
                        useCase === uc
                          ? "border-violet-500 bg-violet-500/10 text-violet-300"
                          : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {uc}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <Label>Primary risk to monitor</Label>
                  <Select value={risk} onValueChange={setRisk}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a risk category" />
                    </SelectTrigger>
                    <SelectContent>
                      {risks.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : step === steps.length - 1 ? (
                "Get started"
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full text-center mt-4 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
