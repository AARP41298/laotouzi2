import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import R from '../romanizer.js';

const { romanize } = R;

test('keeps non-Hangul text untouched', () => {
  for (const s of ["I'm in love babe (Oh)", 'Jesus, OK Xbox (5 X 5)', 'Woo Yeah Hoh', '🐲 ☀️ 🐰', '漢字 ひらがな', '']) {
    assert.equal(romanize(s), s);
  }
  assert.equal(romanize("🐲 I'm in love 눈에 콩깍지 씌었어 babe (Oh)"), "🐲 I'm in love nune k'ongkkakchi ssŭiŏssŏ babe (Oh)");
  assert.equal(romanize('변치 않아 babe 오 곱하기 오 (5 X 5) babe'), 'pyŏnch\'i anha babe o kophagi o (5 X 5) babe');
  assert.equal(romanize('너무 chic 해 (Yeah)'), 'nŏmu chic hae (Yeah)');
});

test('syllables that the original printed as (??) or markers', () => {
  const cases = {
    사랑해: 'saranghae', 몽롱해지고: 'mongnonghaejigo', 궁합이: 'kunghabi', 읽고: 'ilkko',
    받아들여: 'padadŭryŏ', 것뿐: 'kŏtppun', 밟다: 'papta', 밟는: 'pamnŭn', 넓다: 'nŏltta',
    핥다: 'haltta', 갔: 'kat', 했다: 'haetta', 왔어: 'wassŏ', 앉: 'an', 않: 'an', 끝판: 'kkŭtp\'an',
    앞이: "ap'i", 부엌이: "puŏk'i", 굳이: 'kuji', 같이: "kach'i", 굳히다: "kuch'ida", 뎶: 'tyep',
  };
  for (const [k, v] of Object.entries(cases)) assert.equal(romanize(k), v, k);
});

test('assimilation from the original converter is kept', () => {
  const cases = {
    한국어: "han'gugŏ", 한국말: "han'gungmal", 맛있다: 'masitta', 신라: 'silla', 독립: 'tongnip',
    좋아: 'choha', 좋다: "chot'a", 정신이: 'chŏngsini', 홀렸어: 'hollyŏssŏ', 있게: 'itke',
  };
  for (const [k, v] of Object.entries(cases)) assert.equal(romanize(k), v, k);
});

test('standalone jamo and decomposed jamo', () => {
  assert.equal(romanize('ㅋㅋㅋ ㅠㅠ'), 'kkk yuyu');
  assert.equal(romanize('한글'.normalize('NFD')), 'han\'gŭl');
});

test('every syllable, alone and in pairs, gives clean output', () => {
  const bad = /[^a-zŏŭ']/;
  for (let c = 0xac00; c <= 0xd7a3; c++) {
    const s = String.fromCharCode(c);
    assert.doesNotMatch(romanize(s), bad, s);
  }
  for (let f = 0; f < 28; f++) for (let i = 0; i < 19; i++) for (const v of [0, 6, 20]) {
    const w = String.fromCharCode(0xac00 + 11 * 588 + f, 0xac00 + i * 588 + v * 28);
    assert.doesNotMatch(romanize(w), bad, w);
  }
});

const LRC = 'C:/Todo/Repos/tuna-lyrics/public/lrc/';
test('BIGBANG lyrics: no Hangul left, everything else byte-identical', { skip: !fs.existsSync(LRC) }, () => {
  for (const f of fs.readdirSync(LRC).filter((f) => f.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(LRC + f, 'utf8'));
    for (const line of `${j.plainLyrics ?? ''}\n${j.syncedLyrics ?? ''}`.split('\n')) {
      const out = romanize(line);
      assert.doesNotMatch(out, /[\uAC00-\uD7A3\u3131-\u3163]|\(\?\?\)/, `${f}: ${line}`);
      const keep = line.split(/[\uAC00-\uD7A3\u3131-\u3163]+/);
      let at = 0;
      for (const part of keep) {
        const idx = out.indexOf(part, at);
        assert.ok(idx >= 0, `${f}: lost "${part}" in ${line}`);
        at = idx + part.length;
      }
    }
  }
});
