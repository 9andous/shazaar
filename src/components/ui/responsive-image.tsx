import Image from "next/image";
import type { Photo } from "@/lib/domain/types";
import { cn } from "@/lib/cn";

/**
 * Listing photo with explicit dimensions (zero CLS), AVIF/WebP srcset via
 * next/image, lazy by default. `priority` sets fetchpriority=high + preload:
 * use it for the first hero image only.
 *
 * INTEGRATION POINT (Phase B): switch to a custom loader that reads the
 * pre-generated variants in Supabase Storage.
 */
export function ResponsiveImage({
  photo,
  alt,
  sizes,
  priority = false,
  fill = false,
  className,
}: {
  photo: Photo;
  alt: string;
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
}) {
  const common = {
    src: photo.src,
    alt,
    sizes,
    priority,
    className: cn("bg-sunk object-cover", className),
  };
  return fill ? (
    <Image {...common} fill alt={alt} />
  ) : (
    <Image {...common} alt={alt} width={photo.width} height={photo.height} />
  );
}
