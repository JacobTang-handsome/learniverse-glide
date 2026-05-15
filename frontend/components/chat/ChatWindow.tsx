"use client";

import { useEffect, useRef } from "react";
import { Loader2, MessageSquareText } from "lucide-react";
import type { ChangeEvent } from "react";

import { useChat } from "@/hooks/useChat";
import { InputBox } from "@/components/chat/InputBox";
import { MessageBubble } from "@/components/chat/MessageBubble";

interface ChatWindowProps {
  userId?: string | number | null;
}

export function ChatWindow({ userId }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { messages, input, handleInputChange, handleSubmit, status, error, setInput } =
    useChat({ userId });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-stone-100 p-2 text-slate-700">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Tutor Chat</p>
            <p className="text-xs text-slate-500">
              Practice naturally and let the system capture learning signals in the background.
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-200 bg-stone-50 px-4 py-5 text-sm leading-7 text-slate-600">
            Start the conversation in Spanish or English. The tutor will respond in a learner-friendly
            way and your vocabulary practice will improve from the chat.
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            The tutor is thinking...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error.message || "Something went wrong while streaming the chat response."}
          </div>
        ) : null}
      </div>

      <InputBox
        input={input}
        isLoading={isLoading}
        onInputChange={(value) =>
          handleInputChange({
            target: { value },
          } as ChangeEvent<HTMLTextAreaElement>)
        }
        onSubmit={() => {
          if (!userId) {
            return;
          }

          handleSubmit();
          setInput("");
        }}
      />
    </div>
  );
}
