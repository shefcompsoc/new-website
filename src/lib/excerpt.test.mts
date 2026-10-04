import assert from "node:assert/strict";
import { test } from "node:test";

import { excerpt } from "./excerpt.ts";

test("a short description is its own summary", () => {
  assert.equal(excerpt("Drinks, pool and introductions."), "Drinks, pool and introductions.");
});

test("nothing to summarise reads as nothing, not an empty string", () => {
  assert.equal(excerpt(null), null);
  assert.equal(excerpt(""), null);
  assert.equal(excerpt("   \n  "), null);
});

test("the first sentence wins when the whole thing is too long", () => {
  const text =
    "Stop emailing yourself zip files. A hands-on session covering branching, " +
    "merging and pull requests, with the slides linked at the end.";
  assert.equal(excerpt(text, 60), "Stop emailing yourself zip files.");
  assert.equal(excerpt(text), text);
});

test("a long opening sentence is cut on a word boundary", () => {
  const text = "one two three four five six seven eight nine ten eleven twelve";
  const short = excerpt(text, 20);
  assert.equal(short, "one two three four...");
  assert.ok(!short!.includes("fiv"));
});

test("the cut does not leave a comma stranded in front of the ellipsis", () => {
  assert.equal(excerpt("Drinks, pool and introductions for the new cohort", 8), "Drinks...");
});

test("newlines and runs of spaces collapse, so a card is always one line", () => {
  assert.equal(excerpt("Drinks,\n\n  pool   and pool"), "Drinks, pool and pool");
});

test("an unpunctuated wall of text still gets cut", () => {
  const text = "x".repeat(400);
  const short = excerpt(text, 50);
  assert.equal(short!.length, 53);
  assert.ok(short!.endsWith("..."));
});
