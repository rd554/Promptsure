export interface User {
  id: string;
  email: string;
  full_name?: string;
  building?: string;
  use_case?: string;
  main_risk?: string;
  onboarded: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  prompt_template?: string;
  api_endpoint?: string;
  input_mode: "prompt" | "api";
  last_run_at?: string;
  overall_score?: number;
  created_at: string;
}

export interface Scenario {
  id: string;
  project_id: string;
  input_text: string;
  type: string;
  persona?: string;
  created_at: string;
}

export interface Simulation {
  id: string;
  project_id: string;
  scenario_id: string;
  input: string;
  output?: string;
  latency?: number;
  tokens?: number;
  status: "queued" | "running" | "completed" | "failed";
  error?: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
  simulation_id: string;
  helpfulness_score: number;
  tone_score: number;
  accuracy_score: number;
  safety_score: number;
  hallucination_score: number;
  overall_score: number;
  reasoning?: string;
  created_at: string;
}

export interface Job {
  id: string;
  project_id: string;
  type: "generate_scenarios" | "run_simulation" | "evaluate_output";
  status: "queued" | "running" | "completed" | "failed";
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  progress?: number;
  total?: number;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  total_simulations: number;
  avg_latency: number;
  total_tokens: number;
  estimated_cost: number;
  avg_score: number;
  simulations_by_day: { date: string; count: number }[];
  score_distribution: { range: string; count: number }[];
  scores_over_time: { date: string; score: number }[];
}
