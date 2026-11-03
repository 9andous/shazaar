"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * INTEGRATION POINT (Phase B3): persist to `wishlist_items`; anonymous users
 * are sent to sign-in first. UI-only stub for now (local state).
 */
export function WishlistButton({ listingTitle, className }: { listingTitle: string; className?: string }) {
  const t = useTranslations("listing");
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`${saved ? t("removeFromWishlist") : t("addToWishlist")} : ${listingTitle}`}
      onClick={() => setSaved((s) => !s)}
      className={cn(
        "bg-surface/90 text-ink hover:bg-surface inline-flex size-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
        className,
      )}
    >
      <Icon icon={Heart} size={18} className={cn(saved && "fill-gold text-gold")} />
    </button>
  );
}
