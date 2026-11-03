/**
 * Billing rules. Pending founder confirmation, so everything is configurable.
 *
 * - Linear half-hour billing (1h30 is billed 1.5 h). The live site bills a
 *   30-minute remainder as 0.65 h; NOT replicated until confirmed.
 * - Extra guests: 7 TND per person per hour above the included capacity
 *   (confirmed live rule), overridable per listing.
 * - Dogs: 13 TND per dog per hour (live constant), overridable per listing.
 */
export const BILLING = {
  /** Billing step in minutes. Durations are rounded UP to this step. */
  stepMinutes: 30,
  minimumMinutes: 60,
  extraGuestFeeTnd: 7,
  dogFeeTnd: 13,
} as const;

/** Listings priced above this are flagged for host review (yachts, restaurants). */
export const PRICE_OUTLIER_TND = 300;
