"use client";

import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const text =
    typeof message.content === "string"
      ? message.content
      : message.parts
          ?.map((part) => ("text" in part ? part.text : ""))
          .join("")
          .trim() ?? "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm ${
          isUser
            ? "bg-[#1f3a2f] text-stone-50"
            : "border border-stone-200 bg-stone-50 text-slate-800"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose prose-sm prose-stone max-w-none">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
