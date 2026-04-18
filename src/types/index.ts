export type {
  User,
  Project,
  Scenario,
  Simulation,
  Evaluation,
  Job,
  AnalyticsData,
} from "./database";

import type { Project, Evaluation, Scenario } from "./database";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ScoreBreakdown {
  helpfulness: number;
  tone: number;
  accuracy: number;
  safety: number;
  hallucination: number;
}

export interface ProjectWithStats extends Project {
  scenario_count: number;
  simulation_count: number;
  avg_score: number;
  last_status: string;
}

export interface SimulationWithEval {
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
  evaluation?: Evaluation;
  scenario?: Scenario;
}

export interface DemoProject {
  project: Project;
  scenarios: Scenario[];
  simulations: SimulationWithEval[];
  analytics: AnalyticsData;
}

import type { AnalyticsData } from "./database";
