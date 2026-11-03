"use client";

import { BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/lib/domain/types";
import { cn } from "@/lib/cn";
import { WishlistButton } from "./wishlist-button";

/**
 * Grid card: photo, type · neighbourhood, title (host-entered French, lang=fr),
 * capacity, price per hour, Vérifié / Populaire, host first name, wishlist,
 * Réserver. The whole card is one link target; the heart and CTA sit above it.
 */
export function ListingCard({
  listing,
  priority = false,
  className,
}: {
  listing: Listing;
  priority?: boolean;
  className?: string;
}) {
  const t = useTranslations();
  const photo = listing.photos[0];
  const href = `/espaces/${listing.slug}`;

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="rounded-card bg-sunk relative aspect-[4/5] overflow-hidden">
        {photo && (
          <ResponsiveImage
            photo={photo}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 520px) 50vw, 100vw"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {listing.isVerified && (
              <Badge tone="light">
                <Icon icon={BadgeCheck} size={13} className="text-gold-deep" />
                {t("listing.verified")}
              </Badge>
            )}
            {listing.isPopular && <Badge tone="gold">{t("listing.popular")}</Badge>}
          </div>
          <WishlistButton listingTitle={listing.title} className="relative z-10" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <p className="eyebrow text-ink-muted">
          {t(`categories.${listing.category}`)}
          {listing.location.neighbourhood && (
            <>
              {" · "}
              <span lang="fr">{listing.location.neighbourhood}</span>
            </>
          )}
        </p>
        <h3 className="text-xl leading-snug" lang="fr">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {listing.title}
          </Link>
        </h3>
        <p className="text-ink-muted text-sm">
          {t("listing.guestsUpTo", { count: listing.capacity.max })}
          {listing.hostFirstName && (
            <>
              {" · "}
              {t("listing.hostedBy", { name: listing.hostFirstName })}
            </>
          )}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <Price amountTnd={listing.price.amountTnd} unit={listing.price.unit} />
          <Link
            href={href}
            className={buttonStyles({ variant: "secondary", size: "sm", className: "relative z-10" })}
            tabIndex={-1}
            aria-hidden
          >
            {t("listing.book")}
          </Link>
        </div>
      </div>
    </article>
  );
}
