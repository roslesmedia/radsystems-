import { test } from "node:test";
import assert from "node:assert/strict";
import { storageTB, compatibility, adjustPrice } from "../lib/rules.mjs";
test("storage estimate uses decimal TB, continuous recording and 15% overhead", () => {
  assert.equal(storageTB(4, 2, 14), 1.4);
  assert.equal(storageTB(8, 4, 30), 12);
});
test("configurator rejects protocol mismatch and insufficient recorder channels", () => {
  assert.equal(
    compatibility({ protocol: "IP" }, { protocol: "Analog", channels: 4 }, 8)
      .length,
    2,
  );
  assert.deepEqual(
    compatibility({ protocol: "IP" }, { protocol: "IP", channels: 8 }, 8),
    [],
  );
});
test("price adjustments preserve integer toman and reject negative or non-finite prices", () => {
  assert.equal(adjustPrice(4200000, "percent", 10), 4620000);
  assert.equal(adjustPrice(4200000, "fixed", -100000), 4100000);
  assert.throws(() => adjustPrice(1000, "percent", -150));
  assert.throws(() => adjustPrice(1000, "fixed", NaN));
});
