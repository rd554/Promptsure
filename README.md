<div align="center">

# PromptSure

### The reliability layer for AI features.

**Simulate real users. Evaluate every output. Ship AI you can trust.**

[Live demo](http://localhost:3000/demo) · [Report an issue](https://github.com/rd554/Promptsure/issues) · [Architecture](#architecture) · [Roadmap](#roadmap)

</div>

---

## What is PromptSure?

Shipping AI features is easy. Knowing they work is hard.

Most teams discover their AI hallucinates, misbehaves, or drifts **after** users complain. PromptSure flips that — it simulates realistic user scenarios against your prompt or API, uses an LLM-as-judge to score every output across multiple dimensions, and surfaces failures before your users do.

Think of it as **unit tests for AI features**, plus analytics and regression tracking.

### Who it's for

- Product teams shipping LLM-powered features
- Prompt engineers iterating on system prompts
- ML engineers benchmarking models and providers
- Founders de-risking AI launches

### Core loop

```
  Describe feature  ──▶  Auto-generate scenarios  ──▶  Run simulations
         ▲                                                    │
         │                                                    ▼
  Iterate prompt  ◀──  Review insights  ◀──  Evaluate with LLM-as-judge
```

---

## Features

### Scenario generation
Describe your feature and goal. PromptSure generates **diverse adversarial scenarios** across categories like `angry`, `vague`, `edge_case`, `fraud_attempt`, `emotional`, `sarcastic`, `multilingual`, `adversarial`, and `happy_path` — each with a persona and a realistic user message.

### Simulation runner
Pick how many simulations to run (5 / 10 / 20 / 30 / 50), launch them as async jobs, and watch live progress. Every simulation captures input, output, latency, and token usage.

### LLM-as-judge evaluation
Each output is scored 0–100 on five dimensions:
- **Helpfulness** — does it actually solve the user's problem?
- **Tone** — appropriate, empathetic, on-brand?
- **Accuracy** — factually correct?
- **Safety** — refuses harmful or out-of-scope requests?
- **Hallucination** — free of made-up facts?

Plus a written reasoning trace for every score.

### Analytics dashboard
- Overall reliability score per project
- Score breakdown radar / bar charts
- Simulations-by-day area chart
- Score distribution histogram
- Score-over-time trends (regression detection)
- Latency and token spend tracking

### Demo mode
A fully populated project, scenarios, simulations, and evaluations — no login required. Available at `/demo`.

### Premium UI
Dark-mode glassmorphism, smooth Framer Motion transitions, collapsible sidebar, responsive layouts, skeleton loading states, empty states — shadcn/ui primitives throughout.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components) |
| Styling | Tailwind CSS v4 + shadcn/ui primitives |
| Animations | Framer Motion |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| AI | OpenAI (`gpt-4o-mini` for generation, simulation, evaluation) |
| Charts | Recharts |
| State | Zustand |
| Analytics | PostHog (optional) |
| Hosting | Vercel |
| Language | TypeScript (strict) |

---

## Architecture

```
src/
├── app/
│   ├── (dashboard)/            Protected app (sidebar layout)
│   │   ├── dashboard/          Overview + project grid
│   │   ├── projects/           List + per-project detail (tabs)
│   │   ├── analytics/          Aggregate charts & stats
│   │   └── settings/           Profile + plan
│   ├── auth/                   Login, signup, onboarding, magic-link callback
│   ├── api/                    REST endpoints (see below)
│   ├── demo/                   Public demo (no auth)
│   ├── pricing/                Public pricing page
│   └── page.tsx                Landing page
├── components/
│   ├── ui/                     Button, Card, Dialog, Tabs, etc.
│   ├── layout/                 Sidebar, Header
│   ├── dashboard/              StatsCards, ProjectCard, CreateProjectDialog
│   ├── scenarios/              ScenarioGenerator, ScenarioList
│   ├── simulations/            SimulationRunner, SimulationLogs
│   ├── results/                ScoreOverview, ScoreCharts, InsightsPanel, TrendChart
│   └── shared/                 LoadingSpinner, EmptyState, ScoreRing
├── lib/
│   ├── supabase/               Browser, server, and middleware clients
│   ├── openai.ts               Lazy-initialized OpenAI client + prompts
│   ├── posthog.ts              Event tracking helpers
│   ├── demo-data.ts            Static demo project, scenarios, sims, analytics
│   └── utils.ts                cn(), formatters, score/status color helpers
├── types/                      Database + domain types
├── store/                      Zustand slices (user, projects, jobs)
└── middleware.ts               Session refresh + auth redirects
```

### API routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` `POST` | `/api/projects` | List / create projects |
| `GET` `PATCH` `DELETE` | `/api/projects/[id]` | Read / update / delete a project |
| `POST` | `/api/scenarios/generate` | Generate N scenarios via OpenAI |
| `POST` | `/api/simulations/run` | Launch a simulation job |
| `POST` | `/api/evaluations` | Score a single output on demand |
| `GET` | `/api/jobs/[id]` | Poll job status / progress |
| `GET` | `/api/analytics` | Aggregate account-wide analytics |
| `GET` `PATCH` | `/api/user/me` | Current user profile |

### Database schema

Six tables, all protected by Row Level Security so users can only access their own data:

- `users` — profile extension of `auth.users` (onboarding answers)
- `projects` — AI features being tested (prompt or API mode)
- `scenarios` — generated test inputs with type + persona
- `simulations` — one run per scenario (input, output, latency, tokens, status)
- `evaluations` — LLM-judge scores tied to a simulation
- `jobs` — async job tracker for generation / simulation / evaluation

Full schema, policies, indexes, and the auto-create-on-signup trigger live in [`supabase-schema.sql`](./supabase-schema.sql).

---

## Quick Start

### Prerequisites

- Node.js 20+
- A Supabase project ([create one free](https://supabase.com))
- An OpenAI API key

### 1. Clone & install

```bash
git clone https://github.com/rd554/Promptsure.git
cd Promptsure
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```bash
# Supabase — from https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# OpenAI — from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-...

# PostHog (optional — leave blank to disable analytics)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# App URL (for Supabase redirect URLs)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> `.env.local` is git-ignored. Never commit secrets.

### 3. Run the database schema

Open your Supabase dashboard → **SQL Editor** → paste the contents of [`supabase-schema.sql`](./supabase-schema.sql) → **Run**.

This creates all tables, RLS policies, indexes, and the trigger that auto-provisions a `public.users` row whenever someone signs up.

### 4. Configure Supabase auth

In Supabase dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/auth/callback`

Enable **Email** provider. Magic links and email/password both work.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Try the demo (no setup needed)

Even without Supabase configured, visit [http://localhost:3000/demo](http://localhost:3000/demo) to see a fully populated project with 12 scenarios, simulations, evaluations, and analytics — backed by static demo data.

---

## Usage

1. **Sign up** at `/auth/signup` and complete the 3-step onboarding (use case, primary risk).
2. **Create a project** from the dashboard — give it a name, description, and a prompt template (or an API endpoint).
3. **Generate scenarios** — pick a count (10–50), describe the goal, and let the AI generate diverse adversarial test cases.
4. **Run simulations** — select how many to run, kick off the job, and watch real-time progress in the Jobs badge.
5. **Review the log** — click any simulation to expand input, output, and the judge's reasoning.
6. **Iterate** — tweak your prompt, re-run, and watch the trend line climb in the Analytics tab.

---

## Scripts

```bash
npm run dev       # Dev server with Turbopack
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

---

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add all env vars from `.env.local` to the Vercel project settings.
4. Update `NEXT_PUBLIC_APP_URL` to your production URL.
5. Update Supabase **Redirect URLs** to include `https://your-domain.com/auth/callback`.
6. Deploy.

---

## Roadmap

- [x] Scenario generation
- [x] Simulation runner with async jobs
- [x] LLM-as-judge evaluation (5 dimensions)
- [x] Analytics dashboard
- [x] Demo mode
- [x] Projects / Analytics / Settings pages
- [ ] **Payments (Razorpay)** — once live; Stripe isn't available in India without invite
- [ ] Upstash Redis + BullMQ for production-grade job queue
- [ ] Custom evaluation criteria per project
- [ ] Regression alerts (Slack / email when score drops)
- [ ] CI/CD integration (run scenarios as a GitHub Action)
- [ ] Team collaboration & SSO
- [ ] Multi-provider support (Anthropic, Gemini, self-hosted)

---

## Troubleshooting

**`Database tables not set up` (503)** — You haven't run `supabase-schema.sql` yet. Open Supabase SQL Editor and run it.

**`projects_user_id_fkey` violation** — The auto-create-user trigger was added after your account existed. The app already upserts the missing row on first project creation; just try again.

**`Missing credentials: OPENAI_API_KEY`** — Check `.env.local` has `OPENAI_API_KEY` set and restart `npm run dev`.

**Turbopack cache errors / `No space left on device`** — Free disk space, then:

```bash
rm -rf .next
npm run dev
```

---

## Contributing

Issues and PRs are welcome. For larger changes, open an issue first to discuss the approach.

```bash
git checkout -b feat/your-feature
# ... make changes ...
npm run lint
git commit -m "feat: ..."
git push origin feat/your-feature
```

---

## License

MIT — see [LICENSE](./LICENSE) if present.

---

<div align="center">

Built with Next.js, Supabase, and OpenAI.

</div>
