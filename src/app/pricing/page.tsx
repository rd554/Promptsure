"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Check, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type PlanKey = "starter" | "pro" | "team" | "enterprise";

const plans: Array<{
  key: PlanKey;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}> = [
  {
    key: "starter",
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "For individuals exploring AI testing",
    features: [
      "100 simulations/month",
      "3 projects",
      "Basic evaluations (5 metrics)",
      "7-day data retention",
      "Community support",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "For teams shipping AI features",
    features: [
      "5,000 simulations/month",
      "Unlimited projects",
      "Advanced evaluations",
      "90-day data retention",
      "Priority support",
      "API access",
      "Custom evaluation criteria",
      "Export PDF reports",
      "Webhook integrations",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    key: "team",
    name: "Team",
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: "For scaling AI teams",
    features: [
      "25,000 simulations/month",
      "Unlimited projects",
      "Advanced evaluations",
      "Unlimited data retention",
      "24/7 priority support",
      "API access + CLI",
      "Custom evaluation criteria",
      "CI/CD integration",
      "Team collaboration (5 seats)",
      "SSO / SAML",
      "Custom branding",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    monthlyPrice: -1,
    yearlyPrice: -1,
    description: "For organizations with custom needs",
    features: [
      "Unlimited simulations",
      "Unlimited everything",
      "Custom model support",
      "On-premise deployment option",
      "Dedicated account manager",
      "SLA guarantees (99.9%)",
      "Custom integrations",
      "Training & onboarding",
      "Audit logs",
      "SOC 2 compliance",
    ],
    cta: "Contact sales",
    popular: false,
  },
];

const comparisonFeatures = [
  { name: "Simulations/month", starter: "100", pro: "5,000", team: "25,000", enterprise: "Unlimited" },
  { name: "Projects", starter: "3", pro: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
  { name: "Evaluation metrics", starter: "5 basic", pro: "All + custom", team: "All + custom", enterprise: "All + custom" },
  { name: "Data retention", starter: "7 days", pro: "90 days", team: "Unlimited", enterprise: "Unlimited" },
  { name: "API access", starter: "—", pro: "Yes", team: "Yes + CLI", enterprise: "Yes + CLI" },
  { name: "CI/CD integration", starter: "—", pro: "—", team: "Yes", enterprise: "Yes" },
  { name: "Team seats", starter: "1", pro: "1", team: "5", enterprise: "Unlimited" },
  { name: "SSO / SAML", starter: "—", pro: "—", team: "Yes", enterprise: "Yes" },
  { name: "Support", starter: "Community", pro: "Priority", team: "24/7 Priority", enterprise: "Dedicated AM" },
  { name: "Export reports", starter: "—", pro: "PDF", team: "PDF + CSV", enterprise: "All formats" },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  const ctaHref = (plan: PlanKey) => {
    if (plan === "enterprise")
      return "mailto:sales@promptsure.ai?subject=Enterprise%20plan%20inquiry";
    return "/auth/signup";
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">PromptSure</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-8">
            Start free, upgrade when you need more. Cancel anytime.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Label className={yearly ? "text-zinc-500" : "text-zinc-200"}>Monthly</Label>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <Label className={yearly ? "text-zinc-200" : "text-zinc-500"}>
              Yearly
              <Badge variant="success" className="ml-2">Save 17%</Badge>
            </Label>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Paid plans are launching soon. Sign up now and we&apos;ll notify you first.
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                <CardContent className="p-6 flex flex-col h-full">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                    <div className="mt-4 mb-6">
                      {plan.monthlyPrice === -1 ? (
                        <span className="text-3xl font-bold">Custom</span>
                      ) : plan.monthlyPrice === 0 ? (
                        <span className="text-3xl font-bold">Free</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold">
                            ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-zinc-500">
                            /{yearly ? "year" : "month"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link href={ctaHref(plan.key)} className="block mb-6">
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      className="w-full"
                    >
                      {plan.cta}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
                        <Check className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">Feature</th>
                  <th className="text-center p-4 text-sm font-medium text-zinc-400">Starter</th>
                  <th className="text-center p-4 text-sm font-medium text-violet-400">Pro</th>
                  <th className="text-center p-4 text-sm font-medium text-zinc-400">Team</th>
                  <th className="text-center p-4 text-sm font-medium text-zinc-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr
                    key={feature.name}
                    className={`border-b border-zinc-800/50 ${
                      i % 2 === 0 ? "bg-zinc-900/20" : ""
                    }`}
                  >
                    <td className="p-4 text-sm text-zinc-300">{feature.name}</td>
                    <td className="text-center p-4 text-sm text-zinc-500">{feature.starter}</td>
                    <td className="text-center p-4 text-sm text-zinc-300">{feature.pro}</td>
                    <td className="text-center p-4 text-sm text-zinc-300">{feature.team}</td>
                    <td className="text-center p-4 text-sm text-zinc-300">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
