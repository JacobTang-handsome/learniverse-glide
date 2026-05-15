import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { MicButton } from "./MicButton";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/profile";

type Props = {
  threadId: string;
  deviceId: string;
  profile: Profile;
  initialMessages: UIMessage[];
  onFirstMessage?: () => void;
};

export function ChatWindow({
  threadId,
  deviceId,
  profile,
  initialMessages,
  onFirstMessage,
}: Props) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { threadId, deviceId, profile },
      }),
    [threadId, deviceId, profile],
  );

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
  });

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  // Keep textarea focused
  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading, threadId]);

  function submit() {
    const text = input.trim();
    if (!text || isLoading) return;
    const wasFirst = messages.length === 0;
    void sendMessage({ text });
    setInput("");
    if (wasFirst) onFirstMessage?.();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Transcript */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-1 py-2"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Practice {profile.language} with your tutor
              </p>
              <p className="text-xs text-muted-foreground">
                Ask anything — vocab, grammar, or just chat.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            if (m.role === "user") {
              return (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-muted px-3.5 py-2 text-sm text-foreground">
                    {text}
                  </div>
                </div>
              );
            }
            return (
              <div key={m.id} className="flex justify-start">
                <div className="prose prose-sm max-w-none text-foreground prose-p:my-2 prose-p:leading-relaxed prose-strong:text-foreground prose-code:text-foreground">
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
              </div>
            );
          })}

          <AnimatePresence>
            {status === "submitted" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70" />
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:150ms]" />
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:300ms]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Composer */}
      <div className="mt-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={`Message your ${profile.language} tutor…`}
          className="block w-full resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          style={{ maxHeight: 140 }}
        />
        <div className="flex items-center justify-between pt-1">
          <MicButton
            active={listening}
            onClick={() => setListening((v) => !v)}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all",
              input.trim() && !isLoading
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-muted text-muted-foreground",
            )}
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}