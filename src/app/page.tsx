"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Sparkles,
  Play,
  BarChart3,
  ArrowRight,
  Check,
  Zap,
  Brain,
  Target,
  Users,
  Code2,
  MessageSquare,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">PromptSure</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#use-cases" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Use cases
            </a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/demo">
              <Button variant="ghost" size="sm">
                Live Demo
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="purple" className="mb-6 px-4 py-1.5">
              <Star className="h-3 w-3 mr-1.5" />
              Now in Public Beta
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Test your AI
            <br />
            <span className="gradient-text">before users do</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            PromptSure simulates real-world scenarios, evaluates AI outputs, and catches failures
            before they reach production. Ship AI features with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            <Link href="/auth/signup">
              <Button variant="primary" size="xl">
                Start free trial
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="xl">
                <Play className="h-5 w-5" />
                View demo
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-zinc-500 mt-4"
          >
            No credit card required. 100 free simulations per month.
          </motion.p>

          {/* Product Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-2 shadow-2xl shadow-violet-500/5">
              <div className="rounded-xl bg-zinc-950 border border-zinc-800/50 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-xs text-zinc-600 ml-2">app.promptsure.ai/dashboard</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-6 w-48 bg-zinc-800/50 rounded" />
                      <div className="h-4 w-72 bg-zinc-800/30 rounded mt-2" />
                    </div>
                    <div className="h-10 w-32 bg-violet-600/20 rounded-lg border border-violet-500/20" />
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
                        <div className="h-3 w-8 bg-zinc-800/50 rounded mb-2" />
                        <div className="h-6 w-16 bg-zinc-800/30 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[78, 92, 65].map((score, i) => (
                      <div key={i} className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-4 w-32 bg-zinc-800/50 rounded" />
                          <span className={`text-sm font-bold ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-orange-400'}`}>
                            {score}/100
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Logos / Social Proof */}
      <section className="py-12 border-y border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-zinc-500 mb-6">Trusted by AI teams at</p>
          <div className="flex items-center justify-center gap-12 opacity-40">
            {["Acme Corp", "TechFlow", "NeuralSoft", "DataBridge", "CloudStack"].map((name) => (
              <span key={name} className="text-lg font-semibold text-zinc-400">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <Badge variant="purple" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to ship <span className="gradient-text">reliable AI</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              From scenario generation to evaluation analytics, PromptSure gives you complete
              visibility into your AI&apos;s behavior.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI Scenario Generation",
                description: "Generate 50+ diverse test scenarios from a single feature description. Cover edge cases, adversarial inputs, and real user behavior.",
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
              {
                icon: Play,
                title: "Async Simulation Engine",
                description: "Run hundreds of simulations in parallel. Queue-based architecture handles scale while tracking latency and token usage.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                icon: Brain,
                title: "LLM-as-Judge Evaluation",
                description: "AI evaluates every output on helpfulness, tone, accuracy, safety, and hallucination risk with numeric scores.",
                color: "text-pink-400",
                bg: "bg-pink-500/10",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Track score trends, latency distributions, token costs, and failure categories with interactive dashboards.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Target,
                title: "Risk Detection",
                description: "Automatically identify hallucinations, safety issues, and tone problems before they reach production.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                icon: Zap,
                title: "CI/CD Integration",
                description: "Trigger simulations from your deployment pipeline. Gate releases on reliability scores.",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                {...stagger}
                transition={{ delay: i * 0.1 }}
              >
                <Card glass className="h-full hover:border-zinc-700 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`rounded-xl ${feature.bg} p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <Badge variant="purple" className="mb-4">How it works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three steps to reliable AI
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Go from untested prompts to production-ready AI in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe your AI feature",
                description: "Tell us what your AI does. We generate diverse, realistic test scenarios covering edge cases, adversarial inputs, and happy paths.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Run simulations",
                description: "PromptSure tests every scenario against your prompt or API. We track latency, tokens, and outputs in real time.",
                icon: Play,
              },
              {
                step: "03",
                title: "Review & ship",
                description: "Get AI-powered evaluations with clear scores. See risks, fix issues, and ship with confidence.",
                icon: BarChart3,
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                {...stagger}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="relative"
              >
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-zinc-700 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-5xl font-bold text-zinc-800 mb-4">{step.step}</div>
                  <div className="rounded-xl bg-violet-500/10 p-3 w-fit mb-4">
                    <step.icon className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <Badge variant="purple" className="mb-4">Use Cases</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for every AI use case
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "AI Support Bots",
                description: "Test how your bot handles frustrated customers, vague queries, and escalation scenarios. Ensure tone consistency and factual accuracy.",
                stats: "Avg. 40% reduction in bad responses",
              },
              {
                icon: Code2,
                title: "AI Copilots & Assistants",
                description: "Validate code generation, writing assistance, and task completion across diverse user intents and skill levels.",
                stats: "Catch 3x more edge cases",
              },
              {
                icon: Brain,
                title: "RAG & Q&A Systems",
                description: "Detect hallucinations and verify factual grounding. Test with adversarial queries designed to trick your system.",
                stats: "90% hallucination detection rate",
              },
              {
                icon: Users,
                title: "Content Generation",
                description: "Ensure brand consistency, tone alignment, and safety across all generated content types and contexts.",
                stats: "Consistent tone across 95% of outputs",
              },
            ].map((uc, i) => (
              <motion.div
                key={uc.title}
                {...stagger}
                transition={{ delay: i * 0.1 }}
              >
                <Card glass className="h-full hover:border-zinc-700 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-violet-500/10 p-3">
                        <uc.icon className="h-6 w-6 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{uc.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                          {uc.description}
                        </p>
                        <span className="text-xs text-violet-400 font-medium">
                          {uc.stats}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-zinc-900/30">
        <PricingSection />
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Stop shipping <span className="gradient-text">untested AI</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join hundreds of AI teams using PromptSure to catch failures before users do.
              Start your free trial today.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="xl">
                  Start free trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="xl">
                  Try the demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">PromptSure</span>
            </div>
            <p className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} PromptSure. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "For individuals exploring AI testing",
      features: [
        "100 simulations/month",
        "3 projects",
        "Basic evaluations",
        "7-day data retention",
        "Community support",
      ],
      cta: "Get started free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For teams shipping AI features",
      features: [
        "5,000 simulations/month",
        "Unlimited projects",
        "Advanced evaluations",
        "90-day data retention",
        "Priority support",
        "API access",
        "Custom evaluation criteria",
        "Export reports",
      ],
      cta: "Start free trial",
      popular: true,
    },
    {
      name: "Team",
      price: "$99",
      period: "/month",
      description: "For scaling AI teams",
      features: [
        "25,000 simulations/month",
        "Unlimited projects",
        "Advanced evaluations",
        "Unlimited data retention",
        "24/7 priority support",
        "API access",
        "Custom evaluation criteria",
        "CI/CD integration",
        "Team collaboration",
        "SSO / SAML",
      ],
      cta: "Start free trial",
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For organizations with custom needs",
      features: [
        "Unlimited simulations",
        "Unlimited everything",
        "Custom model support",
        "On-premise deployment",
        "Dedicated account manager",
        "SLA guarantees",
        "Custom integrations",
        "Training & onboarding",
      ],
      cta: "Contact sales",
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <motion.div {...fadeInUp} className="text-center mb-16">
        <Badge variant="purple" className="mb-4">Pricing</Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Start free, upgrade as you scale. No hidden fees.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            {...stagger}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              glass
              className={`h-full relative ${
                plan.popular
                  ? "border-violet-500/50 shadow-lg shadow-violet-500/10"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="purple">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
                <Link href="/auth/signup">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full mb-6"
                  >
                    {plan.cta}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                      <Check className="h-4 w-4 text-violet-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
