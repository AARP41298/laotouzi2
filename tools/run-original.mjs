// Runs one of the original converters in Node with a fake `document`.
// usage: node tools/run-original.mjs <konv|neuer_versuch|konvohne> "text"
import fs from 'node:fs';
import vm from 'node:vm';
const [, , name, ...rest] = process.argv;
const fn = { konv: ['gbv', 'text1', 'text2'], neuer_versuch: ['corlat', 'text3', 'text4'], konvohne: ['gbvohne', 'text5', 'text6'] }[name];
const t = {}; for (let i = 1; i <= 6; i++) t['text' + i] = { value: '' };
const ctx = { document: { transcription: t } };
vm.createContext(ctx);
let src = fs.readFileSync(new URL(`../original/${name}.js`, import.meta.url), 'utf8');
vm.runInContext(src, ctx);
t[fn[1]].value = rest.join(' ') || fs.readFileSync(0, 'utf8');
ctx[fn[0]]();
process.stdout.write(t[fn[2]].value + '\n');
