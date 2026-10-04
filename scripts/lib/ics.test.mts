import assert from "node:assert/strict";
import { test } from "node:test";

import type { Event } from "../../src/types/content.ts";
import {
  buildCalendar,
  foldLine,
  formatUtc,
} from "./ics.mts";

const NOW = new Date("2026-09-10T12:00:00Z");

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: "intro-to-git",
    uid: "35e8a4ec2ff080728b21daeeeedb8f80",
    name: "Intro to Git",
    type: "tech",
    status: "published",
    location: "Diamond, Computer Room 4",
    description: "Branching, merging and pull requests.",
    startsAt: "2026-10-08T17:00:00.000Z",
    endsAt: "2026-10-08T19:00:00.000Z",
    images: [],
    price: 0,
    ticketLink: null,
    updatedAt: "2026-09-10T09:00:00.000Z",
    ...overrides,
  };
}

test("foldLine never splits a multi-byte character across the fold", () => {
  const line = "SUMMARY:" + "é".repeat(60);
  for (const segment of foldLine(line).split("\r\n")) {
    const bytes = new TextEncoder().encode(segment);
    assert.ok(!new TextDecoder("utf-8", { fatal: false }).decode(bytes).includes("�"));
  }
});

test("formatUtc rejects an unparseable date rather than emitting a broken feed", () => {
  assert.throws(() => formatUtc("not a date"), /Invalid date/);
});

test("buildCalendar uses CRLF throughout, as the spec requires", () => {
  const ics = buildCalendar([makeEvent()], "https://compsoc.example", NOW);
  const withoutCrlf = ics.split("\r\n").join("");
  assert.ok(!withoutCrlf.includes("\n"));
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
});

test("buildCalendar keys the entry on the stable Notion id, not the slug", () => {
  const ics = buildCalendar([makeEvent({ id: "renamed-slug" })], "https://compsoc.example", NOW);
  assert.ok(ics.includes("UID:35e8a4ec2ff080728b21daeeeedb8f80@shefcompsoc.org"));
});

test("a cancelled event stays in the feed and is marked cancelled", () => {
  const ics = buildCalendar(
    [makeEvent({ status: "cancelled" })],
    "https://compsoc.example",
    NOW,
  );
  assert.ok(ics.includes("STATUS:CANCELLED"));
  assert.ok(ics.includes("SUMMARY:Intro to Git"));
});
