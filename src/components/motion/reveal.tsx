"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Fades + lifts content in when it scrolls into view. `index` staggers
 * siblings (80ms each). Content renders visible on the server and only hides
 * once JS has confirmed it is below the fold, so no-JS, crawlers and
 * above-the-fold content are never blank. Reduced motion: no effect.
 * Do not wrap the hero / LCP element.
 */
export function Reveal({
  children,
  index = 0,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  index?: number;
  as?: "div" | "li" | "section" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: leave it
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={{ transitionDelay: state === "shown" ? `${index * 80}ms` : undefined }}
      className={cn(
        "transition-[opacity,translate] duration-700 ease-out",
        state === "hidden" && "translate-y-4 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
