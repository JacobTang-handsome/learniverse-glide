import { Link, useParams } from "@tanstack/react-router";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ThreadRow = {
  id: string;
  title: string;
  updated_at: string;
};

export function ThreadList({
  threads,
  onNew,
  onDelete,
}: {
  threads: ThreadRow[];
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  const params = useParams({ strict: false }) as { threadId?: string };
  const activeId = params.threadId;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-1 pb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversations
        </p>
        <button
          onClick={onNew}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="New chat"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 space-y-0.5 overflow-y-auto pr-1">
        {threads.length === 0 && (
          <p className="px-2 py-3 text-xs text-muted-foreground">
            No chats yet. Start one below.
          </p>
        )}
        {threads.map((t) => (
          <div
            key={t.id}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
              activeId === t.id ? "bg-muted" : "hover:bg-muted/60",
            )}
          >
            <Link
              to="/app/$threadId"
              params={{ threadId: t.id }}
              className="flex min-w-0 flex-1 items-center gap-2 text-sm"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-foreground">{t.title}</span>
            </Link>
            <button
              onClick={() => onDelete(t.id)}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Delete thread"
            >
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}