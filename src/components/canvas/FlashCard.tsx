import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useState } from "react";
import { Volume2 } from "lucide-react";
import { type Word } from "@/lib/sample-data";

export function FlashCard({
  word,
  speechLang,
  onDecide,
}: {
  word: Word;
  speechLang: string;
  onDecide: (decision: "remember" | "forget") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const rememberOpacity = useTransform(x, [40, 160], [0, 1]);
  const forgetOpacity = useTransform(x, [-160, -40], [1, 0]);
  const [revealed, setRevealed] = useState(false);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 140) onDecide("remember");
    else if (info.offset.x < -140) onDecide("forget");
  }

  function speak() {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(word.word);
    u.lang = speechLang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      style={{ x, rotate }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className="relative w-full max-w-md cursor-grab"
    >
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
        {/* Overlays */}
        <motion.div
          style={{ opacity: forgetOpacity }}
          className="pointer-events-none absolute inset-0 flex items-start justify-start bg-red-500/5 p-6"
        >
          <span className="rounded-lg border-2 border-red-500/70 px-3 py-1 text-sm font-bold uppercase tracking-wider text-red-600">
            Forget
          </span>
        </motion.div>
        <motion.div
          style={{ opacity: rememberOpacity }}
          className="pointer-events-none absolute inset-0 flex items-start justify-end bg-emerald-500/5 p-6"
        >
          <span className="rounded-lg border-2 border-emerald-500/70 px-3 py-1 text-sm font-bold uppercase tracking-wider text-emerald-600">
            Remember
          </span>
        </motion.div>

        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-5xl font-semibold tracking-tight text-foreground">
              {word.word}
            </p>
            <p className="text-sm text-muted-foreground">/{word.ipa}/</p>
          </div>

          <button
            onClick={speak}
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label="Pronounce"
          >
            <Volume2 className="h-4 w-4" />
          </button>

          <div
            onMouseEnter={() => setRevealed(true)}
            onMouseLeave={() => setRevealed(false)}
            onClick={() => setRevealed((v) => !v)}
            className="mx-auto cursor-pointer rounded-2xl border border-dashed border-border px-5 py-4 transition-all"
          >
            {revealed ? (
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground">{word.en}</p>
                <p className="text-sm text-muted-foreground">{word.zh}</p>
              </div>
            ) : (
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Hover to reveal
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Swipe ← Forget · Remember →
          </p>
        </div>
      </div>
    </motion.div>
  );
}