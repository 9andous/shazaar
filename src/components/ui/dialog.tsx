"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./button";
import { Icon } from "./icon";

/**
 * Modal built on the native <dialog>: focus trap, Escape, inert background
 * and top-layer stacking come from the browser. Focus returns to the opener.
 *
 * variant="dialog"  centred panel
 * variant="sheet"   full-height panel from the logical end (mobile menu)
 * variant="bottom"  bottom sheet (filters on mobile)
 */
export function Dialog({
  open,
  onClose,
  title,
  closeLabel,
  variant = "dialog",
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  variant?: "dialog" | "sheet" | "bottom";
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
      className={cn(
        "bg-surface text-ink backdrop:bg-scrim/50 m-0 max-h-none max-w-none p-0",
        "open:motion-safe:animate-[shz-fade-in_300ms_var(--ease-out)]",
        variant === "dialog" && "rounded-card shadow-float m-auto w-[min(36rem,calc(100vw-2rem))]",
        variant === "sheet" && "ms-auto h-dvh w-full sm:w-[28rem]",
        variant === "bottom" && "rounded-t-card mt-auto max-h-[90dvh] w-full",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3">
        <h2 id="dialog-title" className="text-2xl">
          {title}
        </h2>
        <IconButton label={closeLabel} onClick={onClose} className="-me-3">
          <Icon icon={X} />
        </IconButton>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </dialog>
  );
}
