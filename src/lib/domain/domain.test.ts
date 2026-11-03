import { describe, expect, it } from "vitest";
import snapshot from "@mocks/listings.snapshot.json";
import { normalizeCategory } from "./categories";
import { formatPrice, availableCurrencies } from "./currency";
import { applyFilters } from "./filters";
import { normalizeLocation } from "./locations";
import { normalizeListing, normalizePriceUnit, type RawListing } from "./normalize";
import { billedHours, quote } from "./pricing";
import { cleanText, slugify, stripEmoji } from "./text";

const raw = (snapshot as unknown as { listings: RawListing[]; popularOrder: string[] }).listings;
const ctx = {
  popularOrder: (snapshot as unknown as { popularOrder: string[] }).popularOrder,
  resolvePhoto: (src: string) => ({ src, width: 1000, height: 1000 }),
};
const listings = raw.map((r) => normalizeListing(r, ctx));

describe("snapshot privacy", () => {
  it("contains no private fields", () => {
    for (const l of raw as unknown as Record<string, unknown>[]) {
      for (const field of ["address", "maps_url", "host_id", "contact_whatsapp"]) {
        expect(l).not.toHaveProperty(field);
      }
    }
  });
});

describe("text", () => {
  it("strips emojis and tidies spacing", () => {
    expect(stripEmoji("Halloween limited edition 🎃")).toBe("Halloween limited edition ");
    expect(cleanText("Spot savannah : détente & Shooting/ Events ")).toBe(
      "Spot savannah : détente & Shooting / Events",
    );
  });
  it("slugifies French titles", () => {
    expect(slugify("Piscine Panorama : Détente & Mariage / Shootings")).toBe(
      "piscine-panorama-detente-et-mariage-shootings",
    );
  });
});

describe("categories", () => {
  it.each([
    ["pool", "pools"],
    ["Villa", "villas"],
    ["Professional Space", "pro"],
    ["salle", "pro"],
    ["jardin", "outdoor"],
    ["courtyard", "outdoor"],
    ["Cinema room", "cinema-gaming"],
    ["padel court", "sport"],
    ["Studio Shooting", "studios"],
    ["studio", "studios"],
    ["Yachts", "yachts"],
    ["café", "cafes"],
    ["Hammam", "hammam"],
    ["something new", "other"],
  ])("%s -> %s", (input, expected) => {
    expect(normalizeCategory(input)).toBe(expected);
  });
});

describe("locations", () => {
  it.each([
    ["Lac 1, tunis", "tunis", "Lac 1"],
    ["Marsa", "tunis", "La Marsa"],
    ["Mutelleville", "tunis", "Mutuelleville"],
    ["Cap zbib, Bizerte", "bizerte", "Cap Zebib"],
    ["El mourouj", "ben-arous", "El Mourouj"],
    ["Nabeul, Hammamet", "nabeul", "Hammamet"],
    ["Marina, Gammarth", "tunis", "Marina Gammarth"],
    ["Chatt meriem, Sousse", "sousse", "Chatt Meriem"],
    ["Djerba", "medenine", "Djerba"],
  ])("%s -> %s / %s", (input, gov, hood) => {
    expect(normalizeLocation(input)).toEqual({ governorate: gov, neighbourhood: hood });
  });

  it("maps nearly every live location", () => {
    const unmapped = listings.filter((l) => !l.location.governorate);
    expect(unmapped.length).toBeLessThanOrEqual(2);
  });
});

describe("price units", () => {
  it("normalises duration labels", () => {
    for (const label of ["/ heure", "/ hr", "/ HR", "/hr", "/ 1hr", "1hr"]) {
      expect(normalizePriceUnit(label)).toBe("hour");
    }
    expect(normalizePriceUnit("/ nuit")).toBe("night");
    expect(normalizePriceUnit("heure trente")).toBe("90min");
  });
});

describe("normalised snapshot", () => {
  it("keeps all 194 listings with 20 popular", () => {
    expect(listings).toHaveLength(194);
    expect(listings.filter((l) => l.isPopular)).toHaveLength(20);
  });
  it("drops expired Halloween offers and never keeps emojis", () => {
    for (const l of listings) {
      expect(l.offerLabel ?? "").not.toMatch(/halloween/i);
      expect(`${l.title}${l.offerLabel ?? ""}${l.description ?? ""}`).not.toMatch(
        /\p{Extended_Pictographic}/u,
      );
    }
  });
  it("flags non-hourly listings for host review", () => {
    const flagged = listings.filter((l) => l.reviewFlags.includes("price_unit_non_hourly"));
    expect(flagged.map((l) => l.price.unit).sort()).toEqual(["90min", "night"]);
  });
  it("produces unique slugs", () => {
    expect(new Set(listings.map((l) => l.slug)).size).toBe(listings.length);
  });
  it("max capacity is never below included capacity", () => {
    for (const l of listings) expect(l.capacity.max).toBeGreaterThanOrEqual(l.capacity.included);
  });
});

describe("pricing", () => {
  it("bills linear half hours, minimum one hour", () => {
    expect(billedHours(30)).toBe(1);
    expect(billedHours(60)).toBe(1);
    expect(billedHours(90)).toBe(1.5);
    expect(billedHours(100)).toBe(2);
  });
  it("prices the whole space plus supplements per hour", () => {
    const q = quote({
      hourlyPriceTnd: 58,
      durationMinutes: 180,
      guests: 12,
      includedCapacity: 9,
      maxCapacity: 20,
      dogs: 1,
    });
    expect(q.hoursTotal).toBe(174);
    expect(q.extraGuests).toBe(3);
    expect(q.extraGuestsTotal).toBe(63);
    expect(q.dogsTotal).toBe(39);
    expect(q.total).toBe(276);
    expect(q.overCapacity).toBe(false);
  });
  it("respects per-listing overrides and caps extra guests", () => {
    const q = quote({
      hourlyPriceTnd: 50,
      durationMinutes: 60,
      guests: 30,
      includedCapacity: 10,
      maxCapacity: 20,
      extraGuestFeeTnd: 5,
      dogFeeTnd: 0,
      dogs: 2,
    });
    expect(q.extraGuests).toBe(10);
    expect(q.extraGuestsTotal).toBe(50);
    expect(q.dogsTotal).toBe(0);
    expect(q.overCapacity).toBe(true);
  });
});

describe("currency", () => {
  it("formats TND with 0 decimals and locale symbol", () => {
    expect(formatPrice(54, "TND", "fr").text).toBe("54 DT");
    // Arabic keeps Western digits; Tunisian grouping uses a dot.
    expect(formatPrice(1384, "TND", "ar").text).toBe("1.384 د.ت");
  });
  it("marks conversions as approximate with 2 decimals", () => {
    const p = formatPrice(54, "EUR", "fr");
    expect(p.isApproximate).toBe(true);
    expect(p.text.startsWith("≈")).toBe(true);
    expect(p.text).toMatch(/\d+,\d{2}/);
  });
  it("hides currencies without a rate and falls back to TND", () => {
    expect(availableCurrencies()).not.toContain("USD");
    expect(formatPrice(54, "USD", "en").currency).toBe("TND");
  });
});

describe("filters", () => {
  it("filters by category, use case, governorate, guests and query", () => {
    expect(applyFilters(listings, { category: "pools" }).every((l) => l.category === "pools")).toBe(true);
    expect(applyFilters(listings, { useCase: "shoot" }).length).toBeGreaterThan(0);
    expect(applyFilters(listings, { governorate: "sousse" }).length).toBeGreaterThan(0);
    expect(applyFilters(listings, { guests: 500 }).every((l) => l.capacity.max >= 500)).toBe(true);
    expect(applyFilters(listings, { query: "cinema" }).length).toBeGreaterThan(0);
  });
});
