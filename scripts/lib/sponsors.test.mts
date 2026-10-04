import assert from "node:assert/strict";
import test from "node:test";
import { mapSponsor } from "./sponsors.mts";

const row = { id: "sponsor", properties: { Name: { title: [{ plain_text: "TPP" }] }, Publish: { checkbox: true } } };
test("sponsors must be explicitly published and not hidden", () => {
  assert.equal(mapSponsor({ ...row, properties: { Name: row.properties.Name } }), null);
  assert.equal(mapSponsor({ ...row, properties: { ...row.properties, Publish: { checkbox: false } } }), null);
  assert.equal(mapSponsor({ ...row, properties: { ...row.properties, Hide: { checkbox: true } } }), null);
});
test("sponsor mapping supports uploaded and external logos", () => {
  for (const file of [{ file: { url: "https://example.com/logo.png" } }, { external: { url: "https://example.com/logo.png" } }]) {
    assert.equal(mapSponsor({ ...row, properties: { ...row.properties, "Company Logo": { files: [file] } } })?.imageUrl, "https://example.com/logo.png");
  }
});
test("sponsor mapping excludes internal fields and unsafe links", () => {
  const properties = { ...row.properties, Contact: { email: "private@example.com" }, URL: { url: "javascript:alert(1)" } };
  assert.deepEqual(mapSponsor({ ...row, properties }), { id: "sponsor", Name: "TPP", URL: null, imageUrl: null });
});
test("published sponsor with missing name fails instead of replacing the snapshot", () => {
  assert.throws(() => mapSponsor({ ...row, properties: { Publish: { checkbox: true } } }), /missing Name/);
});
