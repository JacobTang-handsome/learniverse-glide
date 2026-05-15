import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Mail, Apple, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PillToggle } from "@/components/onboarding/PillToggle";
import {
  saveProfile,
  type DailyMinutes,
  type Goal,
  type Language,
  type Level,
  type Topic,
} from "@/lib/profile";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — Lingua" },
      {
        name: "description",
        content:
          "Set up your personal AI language tutor in under a minute.",
      },
    ],
  }),
  component: Onboarding,
});

const LANGUAGES: Language[] = ["Spanish", "Catalan", "Italian"];
const LEVELS: Level[] = ["A0", "A1", "A2", "B1"];
const GOALS: Goal[] = ["Travel", "Study Abroad", "Daily Communication", "Interest"];
const TOPICS: Topic[] = ["Food", "Campus", "Travel", "Music", "History"];
const TIMES: DailyMinutes[] = [15, 30, 60];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState<Language | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [time, setTime] = useState<DailyMinutes | null>(null);

  const total = 6;
  const canContinue = (() => {
    switch (step) {
      case 0:
        return /.+@.+\..+/.test(email);
      case 1:
        return !!language;
      case 2:
        return !!level;
      case 3:
        return !!goal;
      case 4:
        return topics.length > 0;
      case 5:
        return !!time;
      default:
        return false;
    }
  })();

  function next() {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      saveProfile({
        email,
        language: language!,
        level: level!,
        goal: goal!,
        topics,
        dailyMinutes: time!,
      });
      navigate({ to: "/app" });
    }
  }

  function toggleTopic(t: Topic) {
    setTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top progress */}
      <div className="mx-auto mt-10 flex w-full max-w-md items-center gap-1.5 px-6">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-foreground" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <div className="space-y-8">
                  <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                      Welcome to Lingua
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      A calmer way to learn a new language with AI.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl text-base"
                    />
                    <Button
                      onClick={next}
                      disabled={!canContinue}
                      className="h-12 w-full rounded-xl text-base"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Continue with email
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="h-px flex-1 bg-border" />
                    or
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmail("guest@google.com");
                        setStep(1);
                      }}
                      className="h-12 w-full rounded-xl text-base"
                    >
                      <GoogleIcon className="mr-2 h-4 w-4" />
                      Continue with Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmail("guest@apple.com");
                        setStep(1);
                      }}
                      className="h-12 w-full rounded-xl text-base"
                    >
                      <Apple className="mr-2 h-4 w-4" />
                      Continue with Apple
                    </Button>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    No password. We'll email you a magic link.
                  </p>
                </div>
              )}

              {step === 1 && (
                <StepShell
                  title="Which language?"
                  subtitle="You can change this later in settings."
                >
                  <div className="flex flex-wrap justify-center gap-3">
                    {LANGUAGES.map((l) => (
                      <PillToggle
                        key={l}
                        active={language === l}
                        onClick={() => setLanguage(l)}
                      >
                        {l}
                      </PillToggle>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  title="What's your level?"
                  subtitle="Be honest — we'll calibrate your tutor."
                >
                  <div className="flex flex-wrap justify-center gap-3">
                    {LEVELS.map((l) => (
                      <PillToggle
                        key={l}
                        active={level === l}
                        onClick={() => setLevel(l)}
                      >
                        {l}
                      </PillToggle>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell
                  title="What's your goal?"
                  subtitle="We'll tailor lessons around it."
                >
                  <div className="flex flex-wrap justify-center gap-3">
                    {GOALS.map((g) => (
                      <PillToggle
                        key={g}
                        active={goal === g}
                        onClick={() => setGoal(g)}
                      >
                        {g}
                      </PillToggle>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 4 && (
                <StepShell
                  title="What interests you?"
                  subtitle="Pick a few — your tutor will lean into them."
                >
                  <div className="flex flex-wrap justify-center gap-3">
                    {TOPICS.map((t) => (
                      <PillToggle
                        key={t}
                        active={topics.includes(t)}
                        onClick={() => toggleTopic(t)}
                      >
                        {t}
                      </PillToggle>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 5 && (
                <StepShell
                  title="Daily practice time"
                  subtitle="Small, consistent sessions beat long, rare ones."
                >
                  <div className="flex flex-wrap justify-center gap-3">
                    {TIMES.map((t) => (
                      <PillToggle
                        key={t}
                        active={time === t}
                        onClick={() => setTime(t)}
                      >
                        {t} min
                      </PillToggle>
                    ))}
                  </div>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer nav */}
      {step > 0 && (
        <div className="mx-auto mb-10 flex w-full max-w-md items-center justify-between gap-3 px-6">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className="rounded-xl"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={next}
            disabled={!canContinue}
            className="h-11 rounded-xl px-6"
          >
            {step === total - 1 ? "Start learning" : "Continue"}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}