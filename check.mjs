// Run `node check.mjs` after editing data.js — fails loudly on broken references.
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = { window: {} };
for (const f of ['./data.js', './planets.js']) vm.runInNewContext(readFileSync(new URL(f, import.meta.url), 'utf8'), ctx);
const { window } = ctx;
const { EARTHS, TITLES, COLLISIONS } = window.MULTIVERSE;

const earthIds = new Set(EARTHS.map(e => e.id));
const numbers = new Set(TITLES.map(t => t[0]));
const kinds = ['film', 'series', 'oneshot', 'special', 'animated', 'doom'];

assert.equal(earthIds.size, EARTHS.length, 'duplicate earth id');
assert.equal(numbers.size, TITLES.length, 'duplicate title number');
for (const [n, title, , year, earth, kind, note] of TITLES) {
  assert.ok(title && note, `title ${n} missing text`);
  assert.ok(Number.isFinite(year), `title ${n} bad year`);
  assert.ok(earthIds.has(earth), `title ${n} unknown earth "${earth}"`);
  assert.ok(kinds.includes(kind), `title ${n} unknown kind "${kind}"`);
}
for (const c of COLLISIONS) {
  for (const end of [c.from, c.to]) assert.ok(earthIds.has(end) || end === 'doomsday', `collision end "${end}" unknown`);
  assert.ok(numbers.has(c.n), `collision references missing title ${c.n}`);
}
assert.equal(TITLES.filter(t => t[5] === 'doom').length, 1, 'exactly one doom title');
const charIds = new Set();
for (const [id, name, actor, earth, side, status, where] of window.MULTIVERSE.CHARACTERS) {
  assert.ok(/^[a-z0-9-]+$/.test(id) && !charIds.has(id), `character id "${id}" invalid or duplicate`);
  charIds.add(id);
  assert.ok(name && actor && where, `character ${id} missing text`);
  assert.ok(earthIds.has(earth), `character ${id} unknown earth "${earth}"`);
  assert.ok(['hero', 'villain', 'antihero'].includes(side), `character ${id} bad side "${side}"`);
  assert.ok(['alive', 'dead', 'captive', 'unknown'].includes(status), `character ${id} bad status "${status}"`);
}
const { PLANETS, REGIONS, MODELS, TIERS } = window.MULTIVERSE;
const BUILT = ['asgard', 'nidavellir', 'muspelheim', 'knowhere', 'sakaar', 'titan', 'ego', 'earth', 'rock'];
const placeIds = new Set();
for (const [id, name, region, model, tint, size, note] of PLANETS) {
  assert.ok(/^[a-z0-9-]+$/.test(id) && !placeIds.has(id), `planet id "${id}" invalid or duplicate`);
  placeIds.add(id);
  assert.ok(region === 'sol' || REGIONS[region], `planet ${id} unknown region "${region}"`);
  assert.ok(BUILT.includes(model) || existsSync(new URL(`./assets/textures/planets/${model}.jpg`, import.meta.url)), `planet ${id} unknown model/texture "${model}"`);
  assert.ok(/^#[0-9a-f]{6}$/i.test(tint) && size > 0 && name && note, `planet ${id} bad tint/size/text`);
}
for (const id of MODELS) assert.ok(placeIds.has(id) && existsSync(new URL(`./assets/models/${id}.glb`, import.meta.url)), `MODELS lists "${id}" but assets/models/${id}.glb is missing`);
assert.equal(PLANETS.filter(p => p[1] === 'Asgard').length, 1, 'Asgard sits at the top of Yggdrasil');
for (const e of EARTHS) assert.ok(TIERS.some(t => t.r === e.orbit), `earth ${e.id} orbit ${e.orbit} is not on a tier ring`);
console.log(`ok: ${PLANETS.length} worlds, ${TITLES.length} titles, ${EARTHS.length} earths, ${COLLISIONS.length} collisions, ${charIds.size} characters`);
