import assert from "node:assert/strict";
import { test } from "node:test";

import type { Event } from "../../src/types/content.ts";
import {
  buildCalendar,
  endOf,
  escapeText,
  foldLine,
  formatUtc,
  sequenceFor,
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

test("escapeText escapes the four reserved sequences", () => {
  assert.equal(escapeText("a;b"), "a\\;b");
  assert.equal(escapeText("a,b"), "a\\,b");
  assert.equal(escapeText("a\\b"), "a\\\\b");
  assert.equal(escapeText("a\nb"), "a\\nb");
  assert.equal(escapeText("a\r\nb"), "a\\nb");
});

test("escapeText escapes backslashes before the escapes it introduces", () => {
  assert.equal(escapeText("\\;"), "\\\\\\;");
});

test("foldLine leaves short lines alone", () => {
  assert.equal(foldLine("SUMMARY:short"), "SUMMARY:short");
});

test("foldLine folds long lines with a leading space and no data loss", () => {
  const line = "DESCRIPTION:" + "x".repeat(200);
  const folded = foldLine(line);
  assert.ok(folded.includes("\r\n "));
  for (const segment of folded.split("\r\n")) {
    assert.ok(new TextEncoder().encode(segment).length <= 75);
  }
  assert.equal(folded.split("\r\n ").join(""), line);
});

test("foldLine never splits a multi-byte character across the fold", () => {
  const line = "SUMMARY:" + "é".repeat(60);
  for (const segment of foldLine(line).split("\r\n")) {
    const bytes = new TextEncoder().encode(segment);
    assert.ok(!new TextDecoder("utf-8", { fatal: false }).decode(bytes).includes("�"));
  }
});

test("formatUtc produces a basic-format UTC stamp", () => {
  assert.equal(formatUtc("2026-10-08T17:00:00.000Z"), "20261008T170000Z");
});

test("formatUtc rejects an unparseable date rather than emitting a broken feed", () => {
  assert.throws(() => formatUtc("not a date"), /Invalid date/);
});

test("sequenceFor increases when Notion sees a later edit", () => {
  const before = sequenceFor("2026-09-10T09:00:00.000Z");
  const after = sequenceFor("2026-09-10T09:01:00.000Z");
  assert.ok(after > before);
  assert.ok(before > 0);
  assert.ok(after < 2 ** 31 - 1);
});

test("endOf falls back to a two hour event when there is no end time", () => {
  assert.equal(endOf(makeEvent({ endsAt: null })), "2026-10-08T19:00:00.000Z");
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

test("events are ordered by start time regardless of input order", () => {
  const later = makeEvent({ uid: "b", id: "b", startsAt: "2026-11-01T18:00:00.000Z" });
  const earlier = makeEvent({ uid: "a", id: "a", startsAt: "2026-10-01T18:00:00.000Z" });
  const ics = buildCalendar([later, earlier], "https://compsoc.example", NOW);
  assert.ok(ics.indexOf("UID:a@") < ics.indexOf("UID:b@"));
});

test("a paid event states its price in pounds", () => {
  const ics = buildCalendar([makeEvent({ price: 3 })], "https://compsoc.example", NOW);
  assert.ok(ics.includes("3.00 GBP"));
});

test("a free event says nothing about tickets at all", () => {
  const ics = buildCalendar([makeEvent({ price: 0 })], "https://compsoc.example", NOW);
  assert.ok(!ics.includes("GBP"));
});
