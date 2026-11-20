import fs from 'node:fs';
import { orig } from './table-from-original.mjs';
import R from '../romanizer.js';
const dir = 'C:/Todo/Repos/tuna-lyrics/public/lrc/';
const words = new Set();
for (const f of fs.readdirSync(dir)) { if (!f.endsWith('.json')) continue; const j = JSON.parse(fs.readFileSync(dir + f, 'utf8')); for (const w of ((j.plainLyrics || '') + (j.syncedLyrics || '')).match(/[가-힣]+/g) || []) words.add(w); }
let n = 0; for (const w of words) { const a = orig(w), b = R.romanize(w); if (a !== b) { n++; console.log(w.padEnd(8, '　'), a.padEnd(18), '→', b); } }
console.log(n, 'of', words.size, 'unique words changed');
