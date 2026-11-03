import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Original live asset (89x128 PNG). Never redrawn.
 * TODO(content): replace with the founder's SVG mark + wordmark when supplied.
 * The wordmark is set in Fraunces, as on the live site.
 */
export function Logo({
  label,
  showWordmark = true,
  tone = "ink",
  className,
}: {
  label: string;
  showWordmark?: boolean;
  tone?: "ink" | "light";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image src="/brand/shazaar-mark-gold.png" alt={showWordmark ? "" : label} width={20} height={29} priority />
      {showWordmark && (
        <span
          lang="en"
          className={cn(
            "font-display text-[1.375rem] leading-none tracking-tight",
            tone === "ink" ? "text-ink" : "text-on-ink",
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
