import type { Event, EventStatus, EventType } from "../../src/types/content.ts";

const NOTION_VERSION = "2022-06-28";
const API = "https://api.notion.com/v1";

const REQUEST_SPACING_MS = 350;

const DATE = "Event Date";

export interface NotionConfig {
  token: string;
  eventsDbId: string;
}

export interface SkippedRow {
  name: string;
  reason: string;
}

export function readConfig(
  env: Record<string, string | undefined> = process.env,
): NotionConfig {
  const token = env.NOTION_TOKEN;
  const eventsDbId = env.NOTION_EVENTS_DB_ID;

  const missing: string[] = [];
  if (!token) missing.push("NOTION_TOKEN");
  if (!eventsDbId) missing.push("NOTION_EVENTS_DB_ID");

  if (!token || !eventsDbId) {
    throw new Error(
      `Missing ${missing.join(" and ")} in the environment.\n` +
        `Copy .env.example to .env.local and fill it in. The token comes from\n` +
        `notion.so/my-integrations (Read content is enough), and the integration\n` +
        `must be connected to the events database from its ... menu in Notion.`,
    );
  }

  return { token, eventsDbId };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function post(config: NotionConfig, path: string, body: unknown): Promise<any> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`${API}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after") ?? "1");
      await sleep(Math.max(1, retryAfter) * 1000);
      continue;
    }

    const text = await response.text();
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          `Notion rejected the token (401). Check NOTION_TOKEN, and that the\n` +
            `integration is still connected to the database.\n${text}`,
        );
      }
      if (response.status === 404) {
        throw new Error(
          `Notion returned 404 for ${path}. Either NOTION_EVENTS_DB_ID is wrong,\n` +
            `or the integration has not been connected to that database yet.\n` +
            `In Notion open the database, ... menu, Connections, add the integration.\n${text}`,
        );
      }
      throw new Error(`Notion returned ${response.status} for ${path}.\n${text}`);
    }

    return JSON.parse(text);
  }

  throw new Error("Notion kept rate limiting the sync. Try again in a minute.");
}

export async function queryAll(config: NotionConfig, databaseId: string, filter?: unknown) {
  const results: any[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    if (filter) body.filter = filter;

    const page = await post(config, `/databases/${databaseId}/query`, body);
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
    if (cursor) await sleep(REQUEST_SPACING_MS);
  } while (cursor);

  return results;
}

function property(page: any, name: string, expectedType: string): any {
  const prop = page.properties?.[name];
  if (prop === undefined) {
    const present = Object.keys(page.properties ?? {}).join(", ");
    throw new Error(
      `Event ${page.id} has no "${name}" property.\n` +
        `Expected a ${expectedType} column called "${name}".\n` +
        `The database has: ${present}`,
    );
  }
  if (prop.type !== expectedType) {
    throw new Error(
      `Event ${page.id}: property "${name}" is a ${prop.type}, expected ${expectedType}.`,
    );
  }
  return prop;
}

function plainText(prop: any): string {
  const parts = prop.type === "title" ? prop.title : prop.rich_text;
  return (parts ?? []).map((part: any) => part.plain_text).join("").trim();
}

function optionalText(page: any, name: string): string | null {
  const prop = page.properties?.[name];
  if (!prop || (prop.type !== "rich_text" && prop.type !== "title")) return null;
  const value = plainText(prop);
  return value === "" ? null : value;
}

function optionalUrl(page: any, name: string): string | null {
  const prop = page.properties?.[name];
  if (!prop || prop.type !== "url") return null;
  return prop.url && prop.url.trim() !== "" ? prop.url.trim() : null;
}

function optionalNumber(page: any, name: string): number {
  const prop = page.properties?.[name];
  if (!prop || prop.type !== "number" || prop.number === null) return 0;
  return prop.number;
}

export function slugify(value: string, fallback: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug === "" ? fallback : slug;
}

export function compactId(id: string): string {
  return id.replace(/-/g, "");
}

export function readType(page: any): EventType {
  const prop = property(page, "Type", "select");
  const raw = prop.select?.name ?? "";
  const key = raw.toLowerCase().trim().replace(/\s+/g, " ").replace(/ event$/, "");
  if (key === "social" || key === "tech") return key;
  throw new Error(
    `Event ${page.id}: Type is "${raw === "" ? "empty" : raw}".\n` +
      `Expected "Social Event" or "Tech Event".`,
  );
}

function checkbox(page: any, name: string): boolean {
  const prop = page.properties?.[name];
  return prop?.type === "checkbox" && prop.checkbox === true;
}

export function skipReason(page: any): string | null {
  const type = property(page, "Type", "select").select?.name?.trim() ?? "";
  if (!/^(social|tech)( event)?$/i.test(type)) return type === "" ? "no Type" : type;
  if (checkbox(page, "Hide")) return "hidden";
  if (!property(page, "Publish", "checkbox").checkbox) return "Publish not ticked";
  const start = property(page, DATE, "date").date?.start;
  if (!start) return `no ${DATE}`;
  if (!String(start).includes("T")) return `no time in ${DATE}`;
  return null;
}

export function readStatus(page: any): EventStatus {
  return checkbox(page, "Cancelled") ? "cancelled" : "published";
}

export function nameOf(page: any): string {
  return optionalText(page, "Name") ?? page.id;
}

export function mapEvent(page: any): {
  event: Event;
  imageUrls: string[];
  localDate: string;
} {
  const name = plainText(property(page, "Name", "title"));
  if (name === "") throw new Error(`Event ${page.id} has an empty Name.`);

  const date = property(page, DATE, "date");
  if (!date.date?.start) {
    throw new Error(`Event ${page.id} ("${name}") has no start time in ${DATE}.`);
  }

  const start = new Date(date.date.start);
  if (Number.isNaN(start.getTime())) {
    throw new Error(`Event ${page.id} ("${name}") has an unreadable ${DATE}.`);
  }
  const end = date.date.end ? new Date(date.date.end) : null;

  const reason = skipReason(page);
  if (reason !== null) {
    throw new Error(
      `Event ${page.id} ("${name}") is not publishable (${reason}) and should ` +
        `have been skipped before mapping.`,
    );
  }

  const uid = compactId(page.id);

  const filesProp = page.properties?.["Images"];
  const imageUrls: string[] =
    filesProp?.type === "files"
      ? filesProp.files
          .map((file: any) => file.file?.url ?? file.external?.url ?? null)
          .filter((url: string | null): url is string => url !== null)
      : [];

  const event: Event = {
    id: slugify(name, uid),
    uid,
    name,
    type: readType(page),
    status: readStatus(page),
    location: plainText(property(page, "Location", "rich_text")) || "To be confirmed",
    description: optionalText(page, "Description"),
    startsAt: start.toISOString(),
    endsAt: end ? end.toISOString() : null,
    images: [],
    price: Math.max(0, Math.round(optionalNumber(page, "Price") * 100) / 100),
    ticketLink: optionalUrl(page, "Ticket Link"),
    updatedAt: page.last_edited_time,
  };

  return { event, imageUrls, localDate: String(date.date.start).slice(0, 10) };
}

export function disambiguate(mapped: { event: Event; localDate: string }[]): void {
  const groups = new Map<string, { event: Event; localDate: string }[]>();
  for (const row of mapped) {
    const group = groups.get(row.event.id);
    if (group) group.push(row);
    else groups.set(row.event.id, [row]);
  }

  for (const [slug, group] of groups) {
    if (group.length === 1) continue;
    for (const row of group) row.event.id = `${slug}-${row.localDate}`;
  }

  const seen = new Map<string, string>();
  for (const { event } of mapped) {
    const clash = seen.get(event.id);
    if (clash) {
      throw new Error(
        `Two events both slug to "${event.id}" (${clash} and ${event.uid}).\n` +
          `They share a name and a date. Rename one of them in Notion.`,
      );
    }
    seen.set(event.id, event.uid);
  }
}

export async function fetchEvents(config: NotionConfig): Promise<{
  mapped: { event: Event; imageUrls: string[]; localDate: string }[];
  skipped: SkippedRow[];
}> {
  const pages = await queryAll(config, config.eventsDbId);

  const publishable: any[] = [];
  const skipped: SkippedRow[] = [];
  for (const page of pages) {
    const reason = skipReason(page);
    if (reason === null) publishable.push(page);
    else skipped.push({ name: nameOf(page), reason });
  }

  const mapped = publishable.map(mapEvent);
  disambiguate(mapped);

  return { mapped, skipped };
}
