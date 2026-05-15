import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export function MicButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Stop listening" : "Start listening"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full"
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full",
          active && "siri-ripple",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          active
            ? "border-transparent bg-foreground text-background"
            : "border-border bg-background text-foreground hover:bg-muted",
        )}
      >
        <Mic className="h-4 w-4" />
      </span>
    </button>
  );
}