import { motion } from "framer-motion";
import { Languages, Quote } from "lucide-react";

interface VocabCardProps {
  word: string;
  example: string;
}

export function VocabCard({ word, example }: VocabCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,#fffdf8_0%,#f7f1e3_100%)] p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
        <Languages className="h-4 w-4" />
        Vocabulary
      </div>

      <h3 className="mt-4 text-2xl font-semibold text-slate-900">{word}</h3>

      <div className="mt-5 rounded-2xl bg-white/70 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          <Quote className="h-4 w-4" />
          Example
        </div>
        <p className="mt-3 text-base leading-7 text-slate-700">{example}</p>
      </div>
    </motion.div>
  );
}
