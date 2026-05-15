import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listThreads = createServerFn({ method: "GET" })
  .inputValidator((d: { deviceId: string }) =>
    z.object({ deviceId: z.string().min(1).max(100) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("threads")
      .select("id, title, created_at, updated_at")
      .eq("device_id", data.deviceId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { threads: rows ?? [] };
  });

export const createThread = createServerFn({ method: "POST" })
  .inputValidator((d: { deviceId: string; title?: string }) =>
    z
      .object({
        deviceId: z.string().min(1).max(100),
        title: z.string().min(1).max(200).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("threads")
      .insert({ device_id: data.deviceId, title: data.title ?? "New chat" })
      .select("id, title, created_at, updated_at")
      .single();
    if (error || !row) throw new Error(error?.message ?? "Failed to create thread");
    return { thread: row };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .inputValidator((d: { deviceId: string; threadId: string }) =>
    z
      .object({
        deviceId: z.string().min(1).max(100),
        threadId: z.string().uuid(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("threads")
      .delete()
      .eq("id", data.threadId)
      .eq("device_id", data.deviceId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMessages = createServerFn({ method: "GET" })
  .inputValidator((d: { threadId: string; deviceId: string }) =>
    z
      .object({
        threadId: z.string().uuid(),
        deviceId: z.string().min(1).max(100),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    // Verify ownership
    const { data: thread } = await supabaseAdmin
      .from("threads")
      .select("id")
      .eq("id", data.threadId)
      .eq("device_id", data.deviceId)
      .maybeSingle();
    if (!thread) return { messages: [] };

    const { data: rows, error } = await supabaseAdmin
      .from("messages")
      .select("id, role, parts, created_at")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { messages: rows ?? [] };
  });