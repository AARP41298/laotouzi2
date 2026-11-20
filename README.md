# laotouzi Hangul romanizer

**Try it: https://aarp41298.github.io/laotouzi2/**

The converter page at `laotouzi.de/conv` is gone. A Wayback Machine copy
(2026-03-07) is backed up byte-for-byte in [`original/`](original/):

| File | Output style | Example |
| --- | --- | --- |
| `konv.js` (`gbv`) | Revised-style, syllables joined with `-` | `han-gug-eo` |
| `neuer_versuch.js` (`corlat`) | McCune-Reischauer **with sound changes** | `han'gugŏ` |
| `konvohne.js` (`gbvohne`) | Revised-style, syllables split with spaces | `han gug eo` |

[`romanizer.js`](romanizer.js) is a clean rewrite of the second one, which
romanizes lyrics the way they are sung (`맛있다` → `masitta`,
`한국말` → `han'gungmal`).

## What was wrong with the original and is fixed

- **Non-Korean text was mangled.** The original runs ~870 global
  `replace()` calls over the whole text and uses Latin letters as internal
  markers (`I X x v O J K Y W …`). So `love` → `lolme`, `Yeah` → `kkeah`,
  `Woo` → `njoo`, `(5 X 5)` → `(5  5)`, `OK Xbox` → `lk bo`. Now only Hangul
  runs are converted; everything else is returned byte-identical.
- **`(??)` placeholders** the author left for unfinished rules:
  `사랑해` → `sara(??)ae`, `읽고` → `i(lg)(kk)(??)o`, `밟다`, `핥다`, `것뿐`, …
- **Leftover markers** for some finals at the end of a word or before
  punctuation: `갔` → `kaZ`, `앉` → `aW`, `않` → `alh`, `앑` → `aO`.
- **Typos in rules**: `앞이` → `amni`, `부엌이` → `puŏngni`, `뎶` used the
  wrong final, finals `ㅋ ㅌ ㅍ` kept their apostrophe before consonants
  (`끝판` → `kkŭt'p'an`).
- Standalone jamo (`ㅋㅋ`, `ㅠㅠ`) are now romanized.

The spelling style and the author's choices are otherwise kept
(`ŏ ŭ`, aspirates with `'`, `n'g`, `좋아` → `choha`, `ㄹ+ㅅ` → `lss`).

## Use

Use the [online page](https://aarp41298.github.io/laotouzi2/) (hover a word
to find it on the other side), open `index.html` locally, or:

```js
const { romanize } = require('./romanizer.js'); // or window.HangulRomanizer
romanize("I'm in love 눈에 콩깍지 씌었어 babe"); // "I'm in love nune k'ongkkakchi ssŭiŏssŏ babe"
```

No dependencies, so it can be dropped into the YouTube Music synced-lyrics
plugin in place of `es-hangul`'s `romanize`.

```sh
npm test                      # unit tests + BIGBANG lyrics from tuna-lyrics
node tools/compare.mjs "텍스트"  # original vs new, side by side
```
