"use client";

import { SendHorizontal } from "lucide-react";
import type { KeyboardEvent } from "react";

interface InputBoxProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export function InputBox({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: InputBoxProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="border-t border-stone-200 bg-white px-4 py-4">
      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-3 shadow-sm">
        <textarea
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type in Spanish or English..."
          rows={3}
          className="w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">Enter to send, Shift+Enter for a new line.</p>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[#1f3a2f] px-4 py-2 text-sm font-medium text-stone-50 transition hover:bg-[#244636] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
