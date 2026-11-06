import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const helper = html.match(/var RESERVATION_DEPOSIT = (\d+);\s*function remainingAtDelivery\(total\)\s*\{[^}]+\}/);
assert.ok(helper, 'reservation amount and remaining balance helper must exist in the store');

function remainingAtDelivery(total) {
  return vm.runInNewContext(`${helper[0]}; remainingAtDelivery(${Number(total)})`);
}

test('reserves 100 EGP once per order and leaves the balance due at delivery', () => {
  assert.equal(Number(helper[1]), 100);
  assert.equal(remainingAtDelivery(1940 + 55), 1895);
  assert.equal(remainingAtDelivery((1940 * 2) + 55), 3835);
});
