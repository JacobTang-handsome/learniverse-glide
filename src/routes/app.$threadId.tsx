import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { UIMessage } from "ai";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { getMessages } from "@/lib/chat.functions";
import { loadProfile, type Profile } from "@/lib/profile";
import { getDeviceId } from "@/lib/device";

export const Route = createFileRoute("/app/$threadId")({
  component: ThreadRoute,
});

function ThreadRoute() {
  const { threadId } = Route.useParams();
  const qc = useQueryClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");

  useEffect(() => {
    setProfile(loadProfile());
    setDeviceId(getDeviceId());
  }, []);

  const getMessagesFn = useServerFn(getMessages);
  const messagesQuery = useQuery({
    queryKey: ["messages", threadId, deviceId],
    queryFn: () => getMessagesFn({ data: { threadId, deviceId } }),
    enabled: !!deviceId && !!threadId,
  });

  if (!profile || !deviceId || messagesQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xs text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const initial: UIMessage[] = (messagesQuery.data?.messages ?? []).map(
    (m) => ({
      id: m.id,
      role: m.role as UIMessage["role"],
      parts: (m.parts as UIMessage["parts"]) ?? [],
    }),
  );

  return (
    <ChatWindow
      key={threadId}
      threadId={threadId}
      deviceId={deviceId}
      profile={profile}
      initialMessages={initial}
      onFirstMessage={() => {
        // Refresh threads list shortly after to pick up the new title
        setTimeout(() => {
          void qc.invalidateQueries({ queryKey: ["threads", deviceId] });
        }, 1500);
      }}
    />
  );
}