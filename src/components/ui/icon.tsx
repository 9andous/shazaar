import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The only way to render an icon. Lucide at 1.5px stroke. Directional icons
 * (arrows, chevrons) pass `directional` so they mirror in RTL. Decorative by
 * default; pass `label` when the icon carries meaning on its own.
 */
export function Icon({
  icon: Glyph,
  size = 20,
  directional = false,
  label,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  directional?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <Glyph
      width={size}
      height={size}
      strokeWidth={1.5}
      absoluteStrokeWidth
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable={false}
      className={cn("shrink-0", directional && "rtl:-scale-x-100", className)}
    />
  );
}
