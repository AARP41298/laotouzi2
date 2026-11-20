// Runs the ORIGINAL second converter (corlat) on every final x next-onset
// combination and prints what it produces at the syllable boundary.
import fs from 'node:fs'; import vm from 'node:vm';
const t = { text3: { value: '' }, text4: { value: '' } };
const ctx = { document: { transcription: t } }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('../original/neuer_versuch.js', import.meta.url), 'utf8'), ctx);
export const orig = (s) => { t.text3.value = s; ctx.corlat(); return t.text4.value.replace(/ $/, ''); };
const syl = (i, v, f = 0) => String.fromCharCode(0xac00 + i * 588 + v * 28 + f);
const FN = ['∅','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const IN = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
if (process.argv[1]?.endsWith('table-from-original.mjs')) {
  // next syllables: each initial + ㅏ (v=0), plus ㅇ+ㅣ (20), ㅇ+ㅑ (2), ㅇ+ㅘ(9)
  const nexts = IN.map((n, i) => [n + 'a', syl(i, 0)]).concat([['ㅇi', syl(11, 20)], ['ㅇy', syl(11, 2)], ['ㅇw', syl(11, 9)]]);
  const rows = [];
  for (let f = 0; f < 28; f++) {
    const first = syl(11, 0, f); // 아+final
    const row = { F: FN[f], end: orig(first), comma: orig(first + ','), cells: {} };
    for (const [k, nx] of nexts) row.cells[k] = orig(first + nx);
    rows.push(row);
  }
  for (const r of rows) console.log(r.F.padEnd(2), 'end=' + JSON.stringify(r.end), 'comma=' + JSON.stringify(r.comma), Object.entries(r.cells).map(([k, v]) => k + ':' + v).join('  '));
}
