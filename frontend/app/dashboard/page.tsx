"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, Sparkles } from "lucide-react";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { DailyTasks } from "@/components/dashboard/DailyTasks";
import { VocabCard } from "@/components/vocabulary/VocabCard";
import { useTaskStore } from "@/stores/taskStore";
import { useAuth } from "@/stores/authStore";

type DashboardTab = "vocabulary" | "reading";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("vocabulary");
  const { user } = useAuth();
  const { dailyPlan, error, isLoading, fetchPlan } = useTaskStore();

  useEffect(() => {
    if (!user?.id || dailyPlan || isLoading) {
      return;
    }

    void fetchPlan(String(user.id));
  }, [dailyPlan, fetchPlan, isLoading, user?.id]);

  if (isLoading && !dailyPlan) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-10 text-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-[32px] border border-stone-200 bg-white/80 p-12 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating your daily Spanish plan...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-rose-200 bg-rose-50 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
            Daily Plan Unavailable
          </p>
          <p className="mt-3 text-base text-rose-900">{error}</p>
        </div>
      </div>
    );
  }

  if (!dailyPlan) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Waiting For Context
          </p>
          <p className="mt-3 text-base text-slate-700">
            Sign in to generate your zero-input daily Spanish plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f5ef_0%,#f1eee6_100%)] px-6 py-8 text-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-10 lg:items-stretch"
      >
        <aside className="flex min-h-[calc(100vh-4rem)] flex-col gap-6 lg:col-span-3">
          <DailyTasks
            dailyGreeting={dailyPlan.daily_greeting}
            flashcardCount={dailyPlan.flashcards.length}
          />
          <ChatWindow userId={user?.id} />
        </aside>

        <section className="lg:col-span-7">
          <div className="rounded-[32px] border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Zero-Input Push
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                  Today&apos;s Spanish practice
                </h1>
              </div>

              <div className="inline-flex rounded-full bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("vocabulary")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === "vocabulary"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  Vocabulary
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("reading")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === "reading"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Immersive Reading
                </button>
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pt-6"
            >
              {activeTab === "vocabulary" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {dailyPlan.flashcards.map((flashcard) => (
                    <VocabCard
                      key={`${flashcard.word}-${flashcard.example}`}
                      word={flashcard.word}
                      example={flashcard.example}
                    />
                  ))}
                </div>
              ) : (
                <article className="prose prose-stone max-w-none">
                  <p className="text-lg leading-8 text-slate-700">
                    {dailyPlan.reading_text}
                  </p>
                </article>
              )}
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
