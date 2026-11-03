import { BILLING } from "@/config/billing";

export interface QuoteInput {
  hourlyPriceTnd: number;
  durationMinutes: number;
  guests: number;
  includedCapacity: number;
  maxCapacity: number;
  dogs?: number;
  extraGuestFeeTnd?: number | null;
  dogFeeTnd?: number | null;
}

export interface Quote {
  billedHours: number;
  hoursTotal: number;
  extraGuests: number;
  extraGuestsTotal: number;
  dogsTotal: number;
  total: number;
  overCapacity: boolean;
}

/** Round up to the billing step, never below the minimum. Linear: 90 min -> 1.5 h. */
export function billedHours(durationMinutes: number): number {
  const minutes = Math.max(BILLING.minimumMinutes, Math.max(0, durationMinutes));
  const steps = Math.ceil(minutes / BILLING.stepMinutes);
  return (steps * BILLING.stepMinutes) / 60;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Price for the whole space: never per person. Supplements per hour. */
export function quote(input: QuoteInput): Quote {
  const hours = billedHours(input.durationMinutes);
  const included = Math.max(0, input.includedCapacity);
  const max = Math.max(included, input.maxCapacity);
  const guests = Math.max(0, Math.floor(input.guests));
  const extraGuests = Math.max(0, Math.min(guests, max) - included);
  const guestFee = input.extraGuestFeeTnd ?? BILLING.extraGuestFeeTnd;
  const dogFee = input.dogFeeTnd ?? BILLING.dogFeeTnd;
  const dogs = Math.max(0, Math.floor(input.dogs ?? 0));

  const hoursTotal = round2(input.hourlyPriceTnd * hours);
  const extraGuestsTotal = round2(extraGuests * guestFee * hours);
  const dogsTotal = round2(dogs * dogFee * hours);

  return {
    billedHours: hours,
    hoursTotal,
    extraGuests,
    extraGuestsTotal,
    dogsTotal,
    total: round2(hoursTotal + extraGuestsTotal + dogsTotal),
    overCapacity: guests > max,
  };
}
