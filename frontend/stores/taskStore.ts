import { create } from "zustand";

import { fetchDailyPlan } from "@/services/task.service";
import type { DailyPlan } from "@/types/task";

interface TaskStore {
  dailyPlan: DailyPlan | null;
  error: string | null;
  isLoading: boolean;
  fetchPlan: (userId: string) => Promise<void>;
  clearPlan: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  dailyPlan: null,
  error: null,
  isLoading: false,
  fetchPlan: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const dailyPlan = await fetchDailyPlan(userId);
      set({ dailyPlan, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch daily plan.";
      set({ dailyPlan: null, error: message, isLoading: false });
    }
  },
  clearPlan: () => set({ dailyPlan: null, error: null, isLoading: false }),
}));
