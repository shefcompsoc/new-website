import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Event } from "../src/types/content.ts";
import { buildCalendar } from "./lib/ics.mts";
import { fetchEvents, readConfig } from "./lib/notion.mts";
import { syncSponsors } from "./lib/sponsors.mts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const EVENTS_JSON = path.join(root, "src", "data", "events.generated.json");
const IMAGE_ROOT = path.join(root, "public", "events");
const CALENDAR_ICS = path.join(root, "public", "calendar.ics");

const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const siteUrl = ["localhost", "127.0.0.1"].includes(new URL(rawSiteUrl).hostname) ? "https://shefcompsoc.uk" : rawSiteUrl;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function extensionFor(url: string, contentType: string | null): string {
  const fromType = contentType ? EXTENSIONS[contentType.split(";")[0].trim()] : undefined;
  if (fromType) return fromType;

  const pathname = (() => {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  })();
  const match = /\.([a-z0-9]{3,4})$/i.exec(pathname);
  return match ? match[1].toLowerCase() : "jpg";
}

async function downloadImages(event: Event, urls: string[]): Promise<string[]> {
  if (urls.length === 0) return [];

  const dir = path.join(IMAGE_ROOT, event.id);
  await mkdir(dir, { recursive: true });

  const written: string[] = [];
  for (const [index, url] of urls.entries()) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const extension = extensionFor(url, response.headers.get("content-type"));
      const filename = `${index + 1}.${extension}`;
      const bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(path.join(dir, filename), bytes);
      written.push(`/events/${event.id}/${filename}`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(`  ! image ${index + 1} for "${event.name}" failed: ${reason}`);
    }
  }
  return written;
}

async function pruneImages(keep: Set<string>): Promise<number> {
  let removed = 0;
  let entries;
  try {
    entries = await readdir(IMAGE_ROOT, { withFileTypes: true });
  } catch {
    return 0;
  }

  for (const entry of entries) {
    if (entry.isDirectory() && !keep.has(entry.name)) {
      await rm(path.join(IMAGE_ROOT, entry.name), { recursive: true, force: true });
      removed += 1;
    }
  }
  return removed;
}

async function main(): Promise<void> {
  const config = readConfig();
  await syncSponsors(config);

  console.log("Reading events from Notion ...");
  const { mapped, skipped } = await fetchEvents(config);
  console.log(`  ${mapped.length} published or cancelled event(s)`);

  if (skipped.length > 0) {
    const byReason = new Map<string, number>();
    for (const row of skipped) byReason.set(row.reason, (byReason.get(row.reason) ?? 0) + 1);
    const summary = [...byReason].map(([reason, count]) => `${count} ${reason}`).join(", ");
    console.log(`  ${skipped.length} row(s) not published (${summary})`);
    for (const row of skipped.filter((r) => r.reason.startsWith("no time"))) {
      console.log(`  ? "${row.name}" is ticked to publish but has ${row.reason}`);
    }
  }

  const events: Event[] = [];
  for (const { event, imageUrls } of mapped) {
    event.images = await downloadImages(event, imageUrls);
    events.push(event);
    const images = event.images.length === 0 ? "no images" : `${event.images.length} image(s)`;
    const flag = event.status === "cancelled" ? " [CANCELLED]" : "";
    console.log(`  - ${event.name}${flag} (${images})`);
  }

  events.sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  const pruned = await pruneImages(new Set(events.map((event) => event.id)));
  if (pruned > 0) console.log(`  pruned ${pruned} stale image folder(s)`);

  await mkdir(path.dirname(EVENTS_JSON), { recursive: true });
  await writeFile(EVENTS_JSON, `${JSON.stringify(events, null, 2)}\n`, "utf8");

  await mkdir(path.dirname(CALENDAR_ICS), { recursive: true });
  await writeFile(CALENDAR_ICS, buildCalendar(events, siteUrl), "utf8");

  console.log("");
  console.log(`Wrote ${path.relative(root, EVENTS_JSON)}`);
  console.log(`Wrote ${path.relative(root, CALENDAR_ICS)}`);
  console.log("");
  console.log("Commit the changes to publish them. Nothing is live until you do.");
}

main().catch((error: unknown) => {
  console.error("");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
