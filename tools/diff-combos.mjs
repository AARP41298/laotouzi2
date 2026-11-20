import { orig } from './table-from-original.mjs';
import R from '../romanizer.js';
const syl = (i, v, f = 0) => String.fromCharCode(0xac00 + i * 588 + v * 28 + f);
const FN = ['∅','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
let same = 0, diff = 0; const out = [];
for (let f = 0; f < 28; f++) {
  const words = [syl(11, 0, f)];
  for (let i = 0; i < 19; i++) words.push(syl(11, 0, f) + syl(i, 0));
  words.push(syl(11, 0, f) + syl(11, 20), syl(11, 0, f) + syl(11, 6), syl(11, 0, f) + syl(18, 20));
  const d = [];
  for (const w of words) { const a = orig(w), b = R.romanize(w); if (a === b) same++; else { diff++; d.push(`${w} ${a}→${b}`); } }
  if (d.length) out.push(FN[f] + ': ' + d.join(' | '));
}
console.log(out.join('\n')); console.log('same', same, 'diff', diff);
// every single syllable alone
let sd = 0; const ex = [];
for (let c = 0xac00; c <= 0xd7a3; c++) { const s = String.fromCharCode(c); if (orig(s) !== R.romanize(s)) { sd++; if (ex.length < 12) ex.push(s + ' ' + orig(s) + '→' + R.romanize(s)); } }
console.log('single syllables differing', sd, ex.join(' | '));
