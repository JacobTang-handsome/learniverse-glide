import { useMemo } from "react";
import { Volume2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { READING, SPEECH_LANG, type TextChunk } from "@/lib/sample-data";
import type { Profile } from "@/lib/profile";

export function ReadingView({ profile }: { profile: Profile }) {
  const article = useMemo(() => READING[profile.language], [profile.language]);
  const speechLang = SPEECH_LANG[profile.language];

  return (
    <div className="mx-auto max-w-2xl px-8 py-16">
      <header className="mb-10 space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {profile.language} · {profile.level}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {article.title}
        </h1>
        <p className="text-sm text-muted-foreground">{article.intro}</p>
      </header>

      <article className="prose prose-slate max-w-none text-lg leading-relaxed text-foreground prose-p:my-6">
        {article.paragraphs.map((para, i) => (
          <p key={i}>
            {para.map((chunk, j) => (
              <Chunk key={j} chunk={chunk} speechLang={speechLang} />
            ))}
          </p>
        ))}
      </article>
    </div>
  );
}

function Chunk({ chunk, speechLang }: { chunk: TextChunk; speechLang: string }) {
  if (chunk.type === "text") return <>{chunk.text}</>;
  return <WordChunk chunk={chunk} speechLang={speechLang} />;
}

function WordChunk({
  chunk,
  speechLang,
}: {
  chunk: Extract<TextChunk, { type: "word" }>;
  speechLang: string;
}) {
  function speak() {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(chunk.word);
    u.lang = speechLang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span
          className="cursor-pointer rounded border-b border-dashed border-foreground/30 transition-colors hover:bg-muted hover:border-foreground"
          tabIndex={0}
          role="button"
        >
          {chunk.word}
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-64 rounded-2xl border-border p-4"
      >
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-base font-semibold text-foreground">
              {chunk.word}
            </p>
            <button
              onClick={speak}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
              aria-label="Pronounce"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">/{chunk.ipa}/</p>
          <p className="border-t border-border pt-2 text-sm text-foreground">
            {chunk.translation}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}