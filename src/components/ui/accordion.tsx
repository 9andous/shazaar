"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

export interface AccordionItem {
  /** Used as the element id and URL hash: /#faq-voyageurs-1 opens that item. */
  id: string;
  question: string;
  answer: React.ReactNode;
}

/**
 * WAI-ARIA accordion: each header is a heading containing a button with
 * aria-expanded/aria-controls; panels are labelled regions. Several items can
 * be open. Opening animates height via grid rows (no JS measuring).
 */
export function Accordion({
  items,
  headingLevel = 3,
  className,
}: {
  items: AccordionItem[];
  headingLevel?: 2 | 3 | 4;
  className?: string;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sync = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (items.some((it) => it.id === hash)) {
        setOpen((prev) => new Set(prev).add(hash));
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [items]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const Heading = `h${headingLevel}` as const;

  return (
    <div className={cn("border-line border-t", className)}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id} id={item.id} className="border-line scroll-mt-28 border-b">
            <Heading className="font-sans text-base font-semibold">
              <button
                type="button"
                id={`${item.id}-button`}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-start"
              >
                <span>{item.question}</span>
                <Icon
                  icon={Plus}
                  className={cn(
                    "text-gold transition-transform duration-300 ease-out",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </Heading>
            <div
              id={`${item.id}-panel`}
              role="region"
              aria-labelledby={`${item.id}-button`}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
              inert={!isOpen}
            >
              <div className="overflow-hidden">
                <div className="text-ink-muted max-w-prose pb-6">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
