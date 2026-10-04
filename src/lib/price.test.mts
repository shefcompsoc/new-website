import assert from "node:assert/strict";
import { test } from "node:test";

import { formatPrice } from "./price.ts";

const POUND = "\u00A3";

test("a free event says so in words, not as a zero", () => {
  assert.equal(formatPrice(0), "Free");
});

test("a whole number of pounds does not grow decimals", () => {
  assert.equal(formatPrice(3), `${POUND}3`);
  assert.equal(formatPrice(12), `${POUND}12`);
});

test("pence are shown when there are any", () => {
  assert.equal(formatPrice(3.5), `${POUND}3.50`);
  assert.equal(formatPrice(2.25), `${POUND}2.25`);
});

test("nonsense is treated as free rather than rendered", () => {
  assert.equal(formatPrice(Number.NaN), "Free");
  assert.equal(formatPrice(-1), "Free");
});
