import type { Event } from "../../src/types/content.ts";

const UID_DOMAIN = "shefcompsoc.org";

const SEQUENCE_EPOCH = Date.UTC(2020, 0, 1) / 1000;

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const out: string[] = [];
  let current = "";
  let currentBytes = 0;
  let limit = 75;

  for (const char of line) {
    const size = encoder.encode(char).length;
    if (currentBytes + size > limit) {
      out.push(current);
      current = "";
      currentBytes = 0;
      limit = 74;
    }
    current += char;
    currentBytes += size;
  }
  if (current) out.push(current);

  return out.join("\r\n ");
}

export function formatUtc(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date passed to the calendar builder: ${iso}`);
  }
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function sequenceFor(updatedAt: string): number {
  const seconds = Math.floor(new Date(updatedAt).getTime() / 1000);
  if (Number.isNaN(seconds)) return 0;
  return Math.max(0, seconds - SEQUENCE_EPOCH);
}

export function endOf(event: Event): string {
  if (event.endsAt) return event.endsAt;
  return new Date(new Date(event.startsAt).getTime() + DEFAULT_DURATION_MS).toISOString();
}

function describe(event: Event, siteUrl: string): string {
  const parts: string[] = [];
  if (event.description) parts.push(event.description);
  if (event.price > 0) parts.push(`Tickets: ${event.price.toFixed(2)} GBP`);
  if (event.ticketLink) parts.push(`Book: ${event.ticketLink}`);
  parts.push(`${siteUrl}/events/${event.id}`);
  return parts.join("\n\n");
}

export function eventLines(event: Event, siteUrl: string, stamp: string): string[] {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${event.uid}@${UID_DOMAIN}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatUtc(event.startsAt)}`,
    `DTEND:${formatUtc(endOf(event))}`,
    `SUMMARY:${escapeText(event.name)}`,
    `DESCRIPTION:${escapeText(describe(event, siteUrl))}`,
    `LOCATION:${escapeText(event.location)}`,
    `URL:${siteUrl}/events/${event.id}`,
    `SEQUENCE:${sequenceFor(event.updatedAt)}`,
    `CATEGORIES:${escapeText(event.type.toUpperCase())}`,
  ];
  lines.push(event.status === "cancelled" ? "STATUS:CANCELLED" : "STATUS:CONFIRMED");
  lines.push("END:VEVENT");
  return lines;
}

export function buildCalendar(
  events: Event[],
  siteUrl: string,
  now: Date = new Date(),
): string {
  const stamp = formatUtc(now.toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sheffield CompSoc//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Sheffield CompSoc",
    "X-WR-CALDESC:Events from the University of Sheffield Computer Science Society",
    "X-WR-TIMEZONE:Europe/London",
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
  ];

  const ordered = [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  for (const event of ordered) lines.push(...eventLines(event, siteUrl, stamp));

  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
