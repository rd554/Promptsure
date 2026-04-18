# PromptSure — AI Reliability Platform

**Test and de-risk AI features before shipping.**

PromptSure simulates real-world scenarios, evaluates AI outputs with LLM-as-judge, and surfaces risks before they reach production.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `OPENAI_API_KEY` | OpenAI API key |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key (optional) |

### 3. Set up the database

Run the SQL schema in your Supabase SQL Editor:

```bash
# File: supabase-schema.sql
```

This creates all tables (users, projects, scenarios, simulations, evaluations, jobs) with RLS policies and indexes.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (dashboard)/        # Protected dashboard layout
│   ├── auth/               # Login, signup, onboarding
│   ├── api/                # REST API routes
│   ├── demo/               # Public demo (no login required)
│   └── pricing/            # Pricing page
├── components/
│   ├── ui/                 # shadcn/ui-style primitives
│   ├── layout/             # Sidebar, header
│   ├── dashboard/          # Project cards, stats
│   ├── scenarios/          # Scenario generator & list
│   ├── simulations/        # Simulation runner & logs
│   ├── results/            # Score charts, insights
│   └── shared/             # Loading spinners, empty states
├── lib/
│   ├── supabase/           # Client & server Supabase clients
│   ├── openai.ts           # OpenAI integration
│   ├── posthog.ts          # Analytics
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript types
└── store/                  # Zustand state management
```

## Features

- **AI Scenario Generation** — Generate 50+ diverse test scenarios from a feature description
- **Async Simulation Engine** — Run simulations with real-time progress tracking
- **LLM-as-Judge Evaluation** — AI evaluates helpfulness, tone, accuracy, safety, hallucination
- **Analytics Dashboard** — Score breakdowns, trends, failure categories, risk insights
- **Demo Mode** — Full platform experience without login
- **Dark Mode UI** — Glassmorphism design with Framer Motion animations

## Tech Stack

- **Frontend**: Next.js 16, Tailwind CSS v4, Framer Motion
- **UI**: shadcn/ui components, Recharts
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: OpenAI GPT-4o-mini
- **State**: Zustand
- **Analytics**: PostHog
- **Deployment**: Vercel

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set all environment variables in Vercel's dashboard.

## License

MIT
