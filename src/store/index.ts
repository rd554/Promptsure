import { create } from "zustand";
import type { Project, Job, User } from "@/types";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;

  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;

  activeJobs: Job[];
  setActiveJobs: (jobs: Job[]) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;

  isDemo: boolean;
  setIsDemo: (isDemo: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  activeJobs: [],
  setActiveJobs: (activeJobs) => set({ activeJobs }),
  updateJob: (id, updates) =>
    set((state) => ({
      activeJobs: state.activeJobs.map((job) =>
        job.id === id ? { ...job, ...updates } : job
      ),
    })),

  isDemo: false,
  setIsDemo: (isDemo) => set({ isDemo }),
}));
