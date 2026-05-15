import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ThreadList, type ThreadRow } from "@/components/dashboard/ThreadList";
import { CanvasTabs, type CanvasView } from "@/components/canvas/CanvasTabs";
import { VocabularyView } from "@/components/canvas/VocabularyView";
import { ReadingView } from "@/components/canvas/ReadingView";
import { LogOut } from "lucide-react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ThreadList, type ThreadRow } from "@/components/dashboard/ThreadList";
import { CanvasTabs, type CanvasView } from "@/components/canvas/CanvasTabs";
import { VocabularyView } from "@/components/canvas/VocabularyView";
import { ReadingView } from "@/components/canvas/ReadingView";
import { loadProfile, clearProfile, type Profile } from "@/lib/profile";
import { getDeviceId } from "@/lib/device";
import {
  createThread,
  deleteThread,
  listThreads,
} from "@/lib/chat.functions";
import { getDeviceId } from "@/lib/device";
import {
  createThread,
  deleteThread,
  listThreads,
} from "@/lib/chat.functions";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Lingua — your AI tutor" },
      {
        name: "description",
        content:
          "Chat with your tutor, drill vocabulary cards, and read in your target language.",
      },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [view, setView] = useState<CanvasView>("vocabulary");

  const listFn = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const deleteFn = useServerFn(deleteThread);

  // Hydrate client state
  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      navigate({ to: "/onboarding" });
      return;
    }
    setProfile(p);
    setDeviceId(getDeviceId());
  }, [navigate]);

  const threadsQuery = useQuery({
    queryKey: ["threads", deviceId],
    queryFn: () => listFn({ data: { deviceId } }),
    enabled: !!deviceId,
  });

  const threads: ThreadRow[] = threadsQuery.data?.threads ?? [];

  // Auto-create / pick the first thread when landing on /app
  useEffect(() => {
    if (!deviceId || threadsQuery.isLoading) return;
    const path = window.location.pathname;
    if (path !== "/app") return;
    if (threads.length > 0) {
      navigate({
        to: "/app/$threadId",
        params: { threadId: threads[0].id },
        replace: true,
      });
    } else {
      void (async () => {
        const { thread } = await createFn({ data: { deviceId } });
        await qc.invalidateQueries({ queryKey: ["threads", deviceId] });
        navigate({
          to: "/app/$threadId",
          params: { threadId: thread.id },
          replace: true,
        });
      })();
    }
  }, [deviceId, threads, threadsQuery.isLoading, navigate, createFn, qc]);

  async function handleNew() {
    if (!deviceId) return;
    const { thread } = await createFn({ data: { deviceId } });
    await qc.invalidateQueries({ queryKey: ["threads", deviceId] });
    navigate({ to: "/app/$threadId", params: { threadId: thread.id } });
  }

  async function handleDelete(id: string) {
    if (!deviceId) return;
    await deleteFn({ data: { deviceId, threadId: id } });
    await qc.invalidateQueries({ queryKey: ["threads", deviceId] });
    const remaining = threads.filter((t) => t.id !== id);
    if (remaining.length) {
      navigate({ to: "/app/$threadId", params: { threadId: remaining[0].id } });
    } else {
      navigate({ to: "/app" });
    }
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left panel */}
      <aside className="flex h-full w-[30%] min-w-[320px] max-w-[440px] flex-col border-r border-border bg-card/40 p-4">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <span className="text-xs font-bold">L</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">Lingua</span>
          </div>
        </div>

        <StatsCard profile={profile} />

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <ThreadList
            threads={threads}
            onNew={handleNew}
            onDelete={handleDelete}
          />
        </div>

        <div className="mt-3 flex min-h-[280px] flex-col border-t border-border pt-3">
          <Outlet />
        </div>
      </aside>

      {/* Right panel */}
      <main className="flex h-full flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-8 py-5">
          <CanvasTabs value={view} onChange={setView} />
          <p className="text-xs text-muted-foreground">
            {profile.goal} · {profile.dailyMinutes} min / day
          </p>
        </header>
        <div className="flex-1 overflow-y-auto">
          {view === "vocabulary" ? (
            <VocabularyView profile={profile} />
          ) : (
            <ReadingView profile={profile} />
          )}
        </div>
      </main>
    </div>
  );
}