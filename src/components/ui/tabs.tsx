"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  /** Stable key, also used as the URL hash for deep links (e.g. "voyageurs"). */
  key: string;
  label: string;
  content: React.ReactNode;
}

/**
 * WAI-ARIA Tabs (automatic activation). Arrow keys follow the reading
 * direction (mirrored in RTL), Home/End jump. Selecting a tab updates the
 * hash so a tab can be linked to; an incoming hash selects the tab.
 */
export function Tabs({
  items,
  label,
  hashPrefix,
  className,
}: {
  items: TabItem[];
  label: string;
  hashPrefix?: string;
  className?: string;
}) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const hashFor = useCallback((key: string) => (hashPrefix ? `${hashPrefix}-${key}` : key), [hashPrefix]);

  useEffect(() => {
    const sync = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const i = items.findIndex((it) => hash === hashFor(it.key) || hash.startsWith(`${hashFor(it.key)}-`));
      if (i >= 0) setActive(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [items, hashFor]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
    const item = items[i];
    if (item && hashPrefix) history.replaceState(null, "", `#${hashFor(item.key)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
    const prevKey = rtl ? "ArrowRight" : "ArrowLeft";
    const last = items.length - 1;
    let i: number | null = null;
    if (e.key === nextKey) i = active === last ? 0 : active + 1;
    if (e.key === prevKey) i = active === 0 ? last : active - 1;
    if (e.key === "Home") i = 0;
    if (e.key === "End") i = last;
    if (i !== null) {
      e.preventDefault();
      select(i, true);
    }
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="border-line flex gap-8 border-b">
        {items.map((item, i) => (
          <button
            key={item.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={`${baseId}-tab-${item.key}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${item.key}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={cn(
              "relative -mb-px py-3 text-base font-semibold transition-colors duration-200",
              i === active
                ? "text-ink after:bg-gold after:absolute after:inset-x-0 after:bottom-0 after:h-0.5"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.key}
          id={`${baseId}-panel-${item.key}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.key}`}
          hidden={i !== active}
          tabIndex={0}
          className="pt-6 focus-visible:outline-offset-8"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
