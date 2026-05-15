import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FlashCard } from "./FlashCard";
import { SPEECH_LANG, VOCAB } from "@/lib/sample-data";
import type { Profile } from "@/lib/profile";

export function VocabularyView({ profile }: { profile: Profile }) {
  const deck = useMemo(() => VOCAB[profile.language], [profile.language]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ remember: 0, forget: 0 });

  const card = deck[index % deck.length];

  function decide(d: "remember" | "forget") {
    setStats((s) => ({
      remember: s.remember + (d === "remember" ? 1 : 0),
      forget: s.forget + (d === "forget" ? 1 : 0),
    }));
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span>
          Card{" "}
          <span className="font-medium text-foreground tabular-nums">
            {(index % deck.length) + 1}
          </span>{" "}
          / {deck.length}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="tabular-nums">{stats.remember}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="tabular-nums">{stats.forget}</span>
        </span>
      </div>

      <div className="relative flex w-full max-w-md items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <FlashCard
              word={card}
              speechLang={SPEECH_LANG[profile.language]}
              onDecide={decide}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}