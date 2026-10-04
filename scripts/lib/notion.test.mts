import assert from "node:assert/strict";
import { test } from "node:test";

import type { Event } from "../../src/types/content.ts";
import {
  disambiguate,
  mapEvent,
  skipReason,
} from "./notion.mts";

function makePage(overrides: Record<string, any> = {}) {
  const properties = {
    Name: { type: "title", title: [{ plain_text: "Intro to Git" }] },
    Type: { type: "select", select: { name: "Tech Event" } },
    Publish: { type: "checkbox", checkbox: true },
    Hide: { type: "checkbox", checkbox: false },
    Location: { type: "rich_text", rich_text: [{ plain_text: "Diamond, Room 4" }] },
    "Event Date": { type: "date", date: { start: "2026-10-08T18:00:00.000+01:00", end: null } },
    Description: { type: "rich_text", rich_text: [{ plain_text: "Branching and merging." }] },
    Price: { type: "number", number: 0 },
    "Ticket Link": { type: "url", url: null },
    ...(overrides.properties ?? {}),
  };
  return {
    id: "35e8a4ec-2ff0-8072-8b21-daeeeedb8f80",
    last_edited_time: "2026-09-10T09:00:00.000Z",
    ...overrides,
    properties,
  };
}

test("mapEvent converts a local time to UTC rather than assuming UTC", () => {
  const { event } = mapEvent(makePage());
  assert.equal(event.startsAt, "2026-10-08T17:00:00.000Z");
});

test("a renamed column fails loudly and lists what the database actually has", () => {
  const page = makePage();
  delete (page.properties as any).Location;
  assert.throws(() => mapEvent(page), /no "Location" property/);
  assert.throws(() => mapEvent(page), /The database has: Name, Type, Publish, Hide, Event Date/);
});

test("an event publishes only when Publish is ticked and Hide is not", () => {
  assert.equal(skipReason(makePage()), null);
  assert.equal(
    skipReason(makePage({ properties: { Publish: { type: "checkbox", checkbox: false } } })),
    "Publish not ticked",
  );
  assert.equal(
    skipReason(makePage({ properties: { Hide: { type: "checkbox", checkbox: true } } })),
    "hidden",
  );
});

test("mapEvent refuses a row that should have been skipped, rather than publishing it", () => {
  assert.throws(
    () => mapEvent(makePage({ properties: { Publish: { type: "checkbox", checkbox: false } } })),
    /should have been skipped/,
  );
});

function row(id: string, uid: string, localDate: string) {
  return { event: { id, uid } as Event, localDate };
}

test("a repeated name gives every clashing event a date, not just the later one", () => {
  const rows = [row("weekly-social", "a", "2026-10-02"), row("weekly-social", "b", "2026-10-09")];
  disambiguate(rows);
  assert.deepEqual(rows.map((r) => r.event.id), [
    "weekly-social-2026-10-02",
    "weekly-social-2026-10-09",
  ]);
});
