/** Display-layer clean-up of host-entered text. Stored data is never modified. */

const EMOJI = /[\p{Extended_Pictographic}\p{Emoji_Modifier}\u{FE0F}\u{200D}\u{20E3}]/gu;

export function stripEmoji(input: string): string {
  return input.replace(EMOJI, "");
}

/** Strip emojis, collapse whitespace, tidy spaces around slashes and colons. */
export function cleanText(input: string | null | undefined): string {
  if (!input) return "";
  return stripEmoji(input)
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+([,.])/g, "$1")
    .trim();
}

export function cleanOptional(input: string | null | undefined): string | null {
  const out = cleanText(input);
  return out.length > 0 ? out : null;
}

/** "el mourouj" -> "El Mourouj"; keeps small French particles lower-case mid-string. */
export function titleCase(input: string): string {
  const small = new Set(["de", "des", "du", "la", "le", "les", "et"]);
  return input
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((part, i) => {
      if (!/\p{L}/u.test(part)) return part;
      if (i > 0 && small.has(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

export function slugify(input: string): string {
  return stripEmoji(input)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}
