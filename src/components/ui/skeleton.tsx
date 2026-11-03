import { cn } from "@/lib/cn";

/** Quiet placeholder block. Pulses gently; static with reduced motion. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("bg-sunk rounded-soft motion-safe:animate-[shz-pulse_1.8s_ease-in-out_infinite]", className)}
    />
  );
}

export function ListingCardSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-3">
      <Skeleton className="rounded-card aspect-[4/5] w-full" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
