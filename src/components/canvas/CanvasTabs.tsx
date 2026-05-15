import { cn } from "@/lib/utils";

export type CanvasView = "vocabulary" | "reading";

export function CanvasTabs({
  value,
  onChange,
}: {
  value: CanvasView;
  onChange: (v: CanvasView) => void;
}) {
  const items: { id: CanvasView; label: string }[] = [
    { id: "vocabulary", label: "Vocabulary" },
    { id: "reading", label: "Reading" },
  ];
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            value === it.id
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}