import assert from "node:assert/strict";
import { test } from "node:test";

import type { Event } from "../../src/types/content.ts";
import {
  compactId,
  disambiguate,
  mapEvent,
  nameOf,
  readConfig,
  readStatus,
  skipReason,
  slugify,
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

test("readConfig names both variables when nothing is set", () => {
  assert.throws(() => readConfig({}), /NOTION_TOKEN and NOTION_EVENTS_DB_ID/);
});

test("readConfig names only the variable that is actually missing", () => {
  assert.throws(
    () => readConfig({ NOTION_TOKEN: "secret" }),
    /Missing NOTION_EVENTS_DB_ID/,
  );
});

test("readConfig returns both values once they are set", () => {
  const config = readConfig({ NOTION_TOKEN: "t", NOTION_EVENTS_DB_ID: "d" });
  assert.deepEqual(config, { token: "t", eventsDbId: "d" });
});

test("compactId strips the dashes Notion returns", () => {
  assert.equal(compactId("35e8a4ec-2ff0-8072-8b21-daeeeedb8f80"), "35e8a4ec2ff080728b21daeeeedb8f80");
});

test("slugify produces a URL segment and falls back when there is nothing usable", () => {
  assert.equal(slugify("Intro to Git!", "fallback"), "intro-to-git");
  assert.equal(slugify("  Hack  Sheffield 10 ", "fallback"), "hack-sheffield-10");
  assert.equal(slugify("!!!", "fallback"), "fallback");
});

test("mapEvent converts a local time to UTC rather than assuming UTC", () => {
  const { event } = mapEvent(makePage());
  assert.equal(event.startsAt, "2026-10-08T17:00:00.000Z");
});

test("mapEvent reads the core fields", () => {
  const { event } = mapEvent(makePage());
  assert.equal(event.name, "Intro to Git");
  assert.equal(event.type, "tech");
  assert.equal(event.status, "published");
  assert.equal(event.location, "Diamond, Room 4");
  assert.equal(event.id, "intro-to-git");
  assert.equal(event.uid, "35e8a4ec2ff080728b21daeeeedb8f80");
  assert.equal(event.endsAt, null);
  assert.equal(event.updatedAt, "2026-09-10T09:00:00.000Z");
});

test("mapEvent leaves images empty because Notion URLs expire", () => {
  const { event, imageUrls } = mapEvent(
    makePage({
      properties: {
        Images: {
          type: "files",
          files: [
            { file: { url: "https://s3.notion/expiring-1.jpg" } },
            { external: { url: "https://example.com/2.png" } },
          ],
        },
      },
    }),
  );
  assert.deepEqual(event.images, []);
  assert.deepEqual(imageUrls, ["https://s3.notion/expiring-1.jpg", "https://example.com/2.png"]);
});

test("the slug always comes from the name, even when a stray Slug column exists", () => {
  const { event } = mapEvent(
    makePage({ properties: { Slug: { type: "rich_text", rich_text: [{ plain_text: "git-101" }] } } }),
  );
  assert.equal(event.id, "intro-to-git");
});

test("mapEvent keeps the date the committee typed, not the UTC one", () => {
  const { localDate } = mapEvent(
    makePage({ properties: { "Event Date": { type: "date", date: { start: "2026-10-08T00:30:00.000+01:00" } } } }),
  );
  assert.equal(localDate, "2026-10-08");
});

test("mapEvent maps a cancelled event rather than refusing it", () => {
  const { event } = mapEvent(
    makePage({ properties: { Cancelled: { type: "checkbox", checkbox: true } } }),
  );
  assert.equal(event.status, "cancelled");
});

test("a renamed column fails loudly and lists what the database actually has", () => {
  const page = makePage();
  delete (page.properties as any).Location;
  assert.throws(() => mapEvent(page), /no "Location" property/);
  assert.throws(() => mapEvent(page), /The database has: Name, Type, Publish, Hide, Event Date/);
});

test("a column of the wrong kind is reported as such", () => {
  assert.throws(
    () => mapEvent(makePage({ properties: { Type: { type: "rich_text", rich_text: [] } } })),
    /property "Type" is a rich_text, expected select/,
  );
});

test("Publish must be a checkbox, not a select", () => {
  assert.throws(
    () => skipReason(makePage({ properties: { Publish: { type: "select", select: { name: "Yes" } } } })),
    /property "Publish" is a select, expected checkbox/,
  );
});

test('Type accepts the Notion option names and drops the word "Event"', () => {
  const social = mapEvent(
    makePage({ properties: { Type: { type: "select", select: { name: "Social Event" } } } }),
  );
  assert.equal(social.event.type, "social");

  const tech = mapEvent(
    makePage({ properties: { Type: { type: "select", select: { name: "tech" } } } }),
  );
  assert.equal(tech.event.type, "tech");
});

test("readType still rejects an unrecognised type with the two allowed values", () => {
  assert.throws(
    () => mapEvent(makePage({ properties: { Type: { type: "select", select: { name: "Workshop" } } } })),
    /Workshop/,
  );
});

test("planner rows that are not events are skipped by type, not rejected", () => {
  for (const name of ["Meeting", "Committee Social", "Constraint", "Ops"]) {
    const page = makePage({ properties: { Type: { type: "select", select: { name } } } });
    assert.equal(skipReason(page), name);
  }
  assert.equal(skipReason(makePage({ properties: { Type: { type: "select", select: null } } })), "no Type");
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

test("a ticked event with no date, or a date but no time, is skipped with the reason", () => {
  assert.equal(
    skipReason(makePage({ properties: { "Event Date": { type: "date", date: null } } })),
    "no Event Date",
  );
  assert.equal(
    skipReason(makePage({ properties: { "Event Date": { type: "date", date: { start: "2026-10-08" } } } })),
    "no time in Event Date",
  );
});

test("status is published unless the Cancelled box is ticked", () => {
  assert.equal(readStatus(makePage()), "published");
  assert.equal(readStatus(makePage({ properties: { Cancelled: { type: "checkbox", checkbox: true } } })), "cancelled");
  assert.equal(nameOf(makePage()), "Intro to Git");
});

test("mapEvent refuses a row that should have been skipped, rather than publishing it", () => {
  assert.throws(
    () => mapEvent(makePage({ properties: { Publish: { type: "checkbox", checkbox: false } } })),
    /should have been skipped/,
  );
});

test("an event with no start time is rejected by name", () => {
  assert.throws(
    () => mapEvent(makePage({ properties: { "Event Date": { type: "date", date: null } } })),
    /\("Intro to Git"\) has no start time in Event Date/,
  );
});

test("a price is carried through in pounds, as typed", () => {
  const { event } = mapEvent(makePage({ properties: { Price: { type: "number", number: 3 } } }));
  assert.equal(event.price, 3);

  const half = mapEvent(makePage({ properties: { Price: { type: "number", number: 3.5 } } }));
  assert.equal(half.event.price, 3.5);
});

test("a blank or negative price is free, and stray decimals round to the penny", () => {
  const blank = mapEvent(makePage({ properties: { Price: { type: "number", number: null } } }));
  assert.equal(blank.event.price, 0);

  const negative = mapEvent(makePage({ properties: { Price: { type: "number", number: -5 } } }));
  assert.equal(negative.event.price, 0);

  const messy = mapEvent(makePage({ properties: { Price: { type: "number", number: 3.456 } } }));
  assert.equal(messy.event.price, 3.46);
});

function row(id: string, uid: string, localDate: string) {
  return { event: { id, uid } as Event, localDate };
}

test("disambiguate leaves a unique slug alone", () => {
  const rows = [row("intro-to-git", "a", "2026-10-08"), row("autumn-social", "b", "2026-10-15")];
  disambiguate(rows);
  assert.deepEqual(rows.map((r) => r.event.id), ["intro-to-git", "autumn-social"]);
});

test("a repeated name gives every clashing event a date, not just the later one", () => {
  const rows = [row("weekly-social", "a", "2026-10-02"), row("weekly-social", "b", "2026-10-09")];
  disambiguate(rows);
  assert.deepEqual(rows.map((r) => r.event.id), [
    "weekly-social-2026-10-02",
    "weekly-social-2026-10-09",
  ]);
});

test("two events with the same name on the same day need a human", () => {
  const rows = [row("weekly-social", "a", "2026-10-02"), row("weekly-social", "b", "2026-10-02")];
  assert.throws(() => disambiguate(rows), /share a name and a date. Rename one/);
});
