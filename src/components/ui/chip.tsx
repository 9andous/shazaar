import { cn } from "@/lib/cn";

/** Toggle chip for filters. Pressed state is conveyed with aria-pressed, not colour alone. */
export function Chip({
  pressed = false,
  className,
  children,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean }) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cn(
        "rounded-soft inline-flex h-10 shrink-0 items-center gap-2 border px-4 text-sm font-medium whitespace-nowrap",
        "transition-colors duration-200",
        pressed
          ? "border-ink bg-ink text-on-ink"
          : "border-line-strong text-ink hover:border-ink bg-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Static label (Vérifié, Populaire). Text in gold-deep for AA at small sizes. */
export function Badge({
  tone = "gold",
  className,
  children,
}: {
  tone?: "gold" | "light" | "ink";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-sharp inline-flex items-center gap-1 px-2 py-1 text-[0.6875rem] leading-none font-semibold tracking-[0.08em] uppercase rtl:tracking-normal",
        tone === "gold" && "bg-gold-soft text-gold-deep",
        tone === "light" && "bg-surface text-ink",
        tone === "ink" && "bg-ink text-on-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
