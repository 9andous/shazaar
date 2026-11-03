import { describe, expect, it } from "vitest";
import ar from "./ar.json";
import en from "./en.json";
import fr from "./fr.json";

type Tree = { [k: string]: string | Tree };

function keys(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === "string" ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`),
  );
}

function values(tree: Tree): string[] {
  return Object.values(tree).flatMap((v) => (typeof v === "string" ? [v] : values(v)));
}

describe("message catalogs", () => {
  const source = keys(fr as Tree).sort();

  it.each([
    ["en", en],
    ["ar", ar],
  ])("%s has exactly the French keys", (_name, catalog) => {
    expect(keys(catalog as Tree).sort()).toEqual(source);
  });

  it.each([
    ["fr", fr],
    ["en", en],
    ["ar", ar],
  ])("%s contains no emojis and no empty strings", (_name, catalog) => {
    for (const v of values(catalog as Tree)) {
      expect(v).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(v.trim()).not.toBe("");
    }
  });

  it("Arabic uses Western digits only", () => {
    for (const v of values(ar as Tree)) expect(v).not.toMatch(/[٠-٩۰-۹]/);
  });
});
