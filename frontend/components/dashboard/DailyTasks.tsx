import { BookMarked, MessageCircleHeart, Target } from "lucide-react";

interface DailyTasksProps {
  dailyGreeting: string;
  flashcardCount: number;
}

export function DailyTasks({
  dailyGreeting,
  flashcardCount,
}: DailyTasksProps) {
  return (
    <div className="rounded-[32px] border border-stone-200 bg-[#1f3a2f] p-6 text-stone-50 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">
        Daily Brief
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight">
        Your Spanish plan is ready.
      </h2>
      <p className="mt-4 text-base leading-7 text-emerald-50/90">
        {dailyGreeting}
      </p>

      <div className="mt-8 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <MessageCircleHeart className="h-5 w-5 text-emerald-200" />
            <span className="text-sm font-medium text-emerald-50">
              Warm-up focus
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-emerald-50/80">
            Start with the greeting, then move into practical Spanish you can
            actually reuse today.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <BookMarked className="h-5 w-5 text-emerald-200" />
            <span className="text-sm font-medium text-emerald-50">
              Flashcards ready
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {flashcardCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-emerald-200" />
            <span className="text-sm font-medium text-emerald-50">
              Session goal
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-emerald-50/80">
            Review vocabulary first, then read the paragraph aloud once for
            rhythm and confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
