/**
 * Captures a PUBLIC-FIELDS-ONLY snapshot of the listings rendered on the live
 * homepage (https://www.shazaar.tn) into /mocks, plus image dimensions and an
 * image audit. Read-only: a single GET of the homepage and ranged GETs of image
 * headers. Never submits anything.
 *
 * The live page embeds its router state as a JS literal. We parse it with
 * acorn and walk the AST statically (no remote code is executed).
 *
 * Removed on purpose (private / not for the client): address, maps_url,
 * host_id, contact_whatsapp. See INTEGRATION.md.
 *
 * Usage: pnpm snapshot:listings [--dev-images]
 *   --dev-images  also downloads the first photo of each popular listing into
 *                 public/dev-images (the small subset used by the hero prototype)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "acorn";

const ORIGIN = "https://www.shazaar.tn";
const ROOT = process.cwd();
const MOCKS = join(ROOT, "mocks");
const PUBLIC_FIELDS = [
  "id",
  "title",
  "description",
  "category",
  "location",
  "images",
  "price",
  "currency",
  "duration_label",
  "capacity",
  "max_capacity",
  "availability",
  "opening_hours",
  "amenities",
  "use_cases",
  "sub_use_cases",
  "rules",
  "rating",
  "status",
  "availability_status",
  "badge_popular",
  "hosted_by",
  "offer_label",
  "instant_book",
  "allow_dogs",
  "sort_order",
] as const;
const REMOVED_FIELDS = ["address", "maps_url", "host_id", "contact_whatsapp", "slug"];

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };
// Minimal ESTree node shape for the static evaluator.
type Node = { type: string; [k: string]: unknown };

/* ---------- static evaluation of the serialized router state ---------- */

function evaluate(node: Node, refs: Map<number, Json>): Json {
  switch (node.type) {
    case "Literal":
      return node.value as Json;
    case "TemplateLiteral": {
      const quasis = node.quasis as { value: { cooked: string } }[];
      return quasis.map((q) => q.value.cooked).join("");
    }
    case "UnaryExpression": {
      const arg = evaluate(node.argument as Node, refs);
      if (node.operator === "!") return !arg;
      if (node.operator === "-") return -(arg as number);
      throw new Error(`Unsupported unary ${String(node.operator)}`);
    }
    case "ArrayExpression":
      return (node.elements as (Node | null)[]).map((e) => (e ? evaluate(e, refs) : null));
    case "ObjectExpression": {
      const out: Record<string, Json> = {};
      for (const p of node.properties as Node[]) {
        if (p.type !== "Property") continue;
        const key = p.key as Node;
        const name =
          key.type === "Identifier" ? (key.name as string) : String(evaluate(key, refs));
        out[name] = evaluate(p.value as Node, refs);
      }
      return out;
    }
    case "AssignmentExpression": {
      // $R[n] = value  -> register and return value
      const value = evaluate(node.right as Node, refs);
      const left = node.left as Node;
      if (left.type === "MemberExpression") {
        const prop = left.property as Node;
        if (prop.type === "Literal" && typeof prop.value === "number") refs.set(prop.value, value);
      }
      return value;
    }
    case "MemberExpression": {
      // back-reference $R[n]
      const prop = node.property as Node;
      if (prop.type === "Literal" && typeof prop.value === "number" && refs.has(prop.value)) {
        return refs.get(prop.value)!;
      }
      return null;
    }
    case "Identifier":
      return node.name === "undefined" ? null : null;
    case "SequenceExpression": {
      const exprs = node.expressions as Node[];
      let last: Json = null;
      for (const e of exprs) last = evaluate(e, refs);
      return last;
    }
    default:
      // Functions, calls, Sets/Maps etc. are not part of the data we need.
      return null;
  }
}

function findRouterState(html: string): Record<string, Json> {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1] ?? "");
  const source = scripts.find((s) => s.includes("$_TSR.router="));
  if (!source) throw new Error("Router state script not found on the live page");

  const ast = parse(source, { ecmaVersion: "latest" }) as unknown as Node;
  let found: Node | null = null;
  const visit = (n: unknown) => {
    if (found || !n || typeof n !== "object") return;
    const node = n as Node;
    if (
      node.type === "ArrowFunctionExpression" &&
      (node.body as Node)?.type === "AssignmentExpression"
    ) {
      found = node.body as Node;
      return;
    }
    for (const v of Object.values(node)) {
      if (Array.isArray(v)) v.forEach(visit);
      else if (v && typeof v === "object") visit(v);
    }
  };
  visit(ast);
  if (!found) throw new Error("Serialized router state not found");
  return evaluate(found, new Map()) as Record<string, Json>;
}

/* ---------- image header parsing (dimensions without full download) ---------- */

function readDimensions(buf: Buffer): { width: number; height: number; format: string } | null {
  // PNG
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), format: "png" };
  }
  // WebP
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return {
        width: 1 + buf.readUIntLE(24, 3),
        height: 1 + buf.readUIntLE(27, 3),
        format: "webp",
      };
    }
    if (chunk === "VP8 ") {
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
        format: "webp",
      };
    }
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1, format: "webp" };
    }
  }
  // JPEG: scan for a SOF marker
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1]!;
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7), format: "jpeg" };
      }
      i += 2 + len;
    }
  }
  return null;
}

async function probe(path: string) {
  const url = ORIGIN + path;
  for (const bytes of [65_535, 1_048_575]) {
    const res = await fetch(url, { headers: { Range: `bytes=0-${bytes}` } });
    if (!res.ok && res.status !== 206) return { path, error: `HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    const dims = readDimensions(buf);
    if (dims) {
      const total = res.headers.get("content-range")?.split("/")[1];
      return { path, ...dims, bytes: total ? Number(total) : buf.length };
    }
  }
  return { path, error: "unreadable header" };
}

async function pool<T, R>(items: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]!);
      }
    }),
  );
  return out;
}

/* ---------- main ---------- */

async function main() {
  const withDevImages = process.argv.includes("--dev-images");
  const html = await (await fetch(ORIGIN + "/")).text();
  const state = findRouterState(html);

  // Serialized matches use short keys: `l` = loaderData.
  const matches = state.matches as { l?: Json; loaderData?: Json }[];
  const loader = matches.map((m) => m.l ?? m.loaderData).find((d) => Array.isArray(d) && Array.isArray(d[0]));
  if (!Array.isArray(loader)) throw new Error("Listings loader data not found");

  const rawListings = loader[0] as Record<string, Json>[];
  const index = loader.find((d) => d && !Array.isArray(d) && typeof d === "object" && "popular" in d) as
    | { popular: string[] }
    | undefined;

  const listings = rawListings.map((raw) => {
    const out: Record<string, Json> = {};
    for (const f of PUBLIC_FIELDS) out[f] = raw[f] ?? null;
    return out;
  });

  mkdirSync(MOCKS, { recursive: true });
  const capturedAt = new Date().toISOString();
  writeFileSync(
    join(MOCKS, "listings.snapshot.json"),
    JSON.stringify(
      {
        meta: {
          source: ORIGIN + "/",
          capturedAt,
          count: listings.length,
          popularCount: listings.filter((l) => l.badge_popular === true).length,
          removedFields: REMOVED_FIELDS,
          note: "Public fields only. Raw, un-normalised values: normalisation happens in src/lib/domain.",
        },
        popularOrder: index?.popular ?? [],
        listings,
      },
      null,
      1,
    ) + "\n",
  );
  console.log(`listings: ${listings.length}`);

  // Image dimensions (needed for explicit width/height, zero CLS) + audit.
  const paths = [...new Set(listings.flatMap((l) => l.images as string[]))];
  const probes = await pool(paths, 6, probe);
  const meta: Record<string, { w: number; h: number; format: string; bytes: number }> = {};
  for (const p of probes) {
    if ("width" in p && p.width) meta[p.path] = { w: p.width, h: p.height, format: p.format, bytes: p.bytes };
  }
  writeFileSync(join(MOCKS, "image-meta.json"), JSON.stringify({ capturedAt, images: meta }, null, 1) + "\n");
  console.log(`images probed: ${probes.length}, readable: ${Object.keys(meta).length}`);

  if (withDevImages) {
    const dir = join(ROOT, "public", "dev-images");
    mkdirSync(dir, { recursive: true });
    const popular = listings.filter((l) => l.badge_popular === true);
    const local: string[] = [];
    for (const l of popular) {
      const first = (l.images as string[])[0];
      if (!first) continue;
      const res = await fetch(ORIGIN + first);
      writeFileSync(join(dir, first.split("/").pop()!), Buffer.from(await res.arrayBuffer()));
      local.push(first);
    }
    // The mock adapter serves these from /dev-images and the rest from the live origin.
    writeFileSync(join(MOCKS, "dev-images.json"), JSON.stringify(local, null, 1) + "\n");
    console.log(`dev images: ${local.length}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
