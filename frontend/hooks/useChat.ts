"use client";

import { useChat as useVercelChat } from "@ai-sdk/react";

interface UseChatOptions {
  userId?: string | number | null;
}

export function useChat({ userId }: UseChatOptions) {
  return useVercelChat({
    api: `${process.env.NEXT_PUBLIC_API_URL}/chat/`,
    body: {
      user_id: userId,
      thread_id: null,
    },
    onError: (error) => {
      console.error("Chat stream failed", error);
    },
  });
}
