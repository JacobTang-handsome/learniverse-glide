import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loadProfile } from "@/lib/profile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lingua — AI language learning" },
      {
        name: "description",
        content:
          "A calm, AI-native way to learn Spanish, Catalan, and Italian. Your personal tutor, vocabulary cards, and immersive reading.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const profile = loadProfile();
    if (profile) navigate({ to: "/app" });
    else navigate({ to: "/onboarding" });
  }, [navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-sm text-muted-foreground">Loading…</div>
    </div>
  );
}
