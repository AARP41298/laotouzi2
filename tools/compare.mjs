// Prints original vs new romanization, line by line.
import fs from 'node:fs';
import { orig } from './table-from-original.mjs';
import R from '../romanizer.js';
const text = process.argv[2] ? process.argv.slice(2).join(' ') : fs.readFileSync(0, 'utf8');
for (const line of text.split('\n')) {
  if (!line.trim()) continue;
  const a = orig(line), b = R.romanize(line);
  console.log('  ' + line + '\n  old: ' + a + '\n  new: ' + b + '\n');
}
