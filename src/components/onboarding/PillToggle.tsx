import { cn } from "@/lib/utils";

export function PillToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "border-foreground bg-foreground text-background shadow-sm"
          : "border-border bg-background text-foreground hover:border-foreground/40 hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}