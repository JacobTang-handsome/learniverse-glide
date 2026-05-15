import { Flame } from "lucide-react";
import type { Profile } from "@/lib/profile";

export function StatsCard({ profile }: { profile: Profile }) {
  // Simple derived demo values
  const streak = 4;
  const minutesDone = Math.round(profile.dailyMinutes / 2);
  const pct = Math.min(100, (minutesDone / profile.dailyMinutes) * 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {profile.language} · {profile.level}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Today's session
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-orange-600">
          <Flame className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold tabular-nums">{streak}</span>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold tabular-nums">
            {minutesDone}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / {profile.dailyMinutes} min
            </span>
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}