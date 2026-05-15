import axios from "@/lib/axios";
import type { DailyPlan } from "@/types/task";

export async function fetchDailyPlan(userId: string): Promise<DailyPlan> {
  try {
    const response = await axios.get<DailyPlan>("/api/tasks/daily", {
      params: { user_id: userId },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch daily plan: ${error.message}`);
    }

    throw new Error("Failed to fetch daily plan.");
  }
}
