/**
 * The saved list as Markdown, in the same file format LingoPop reads and
 * writes, so one file works in both apps:
 *
 *     - **excel** — превосходить `B1` ★
 *       - _He excels at math._
 *
 * The line ends with what is known about the word: its CEFR level, and a ★ if
 * it is marked as important.
 *
 * The parser is deliberately forgiving: bold, italics, and the kind of dash
 * are all optional, because a file that has been through a human is never
 * byte-identical to the one that was written.
 */

/** What the export is called on disk. */
export const FILE_NAME = 'engram-words.md';

const TITLE = '# EnGram — saved words';

/**
 * @param {object[]} words
 * @param {Date} [now] passed in so the header is stable in tests
 * @returns {string}
 */
export function toMarkdown(words, now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  const count = `${words.length} ${words.length === 1 ? 'word' : 'words'}`;

  const lines = [TITLE, '', `<!-- ${count} · exported ${day} -->`, ''];

  for (const w of words) {
    const level = w.cefr ? ` \`${w.cefr}\`` : '';
    const star = w.starred ? ' ★' : '';
    lines.push(`- **${escape(w.text)}** — ${escape(w.translation || '')}${level}${star}`);
    if (w.example) lines.push(`  - _${escape(w.example)}_`);
  }

  return `${lines.join('\n')}\n`;
}

/**
 * Reads a file written by `toMarkdown` or by LingoPop, or any list close
 * enough to it. Anything unparseable is skipped rather than failing the whole
 * import: one mangled line should not cost the user the other two hundred.
 *
 * @param {string} text
 * @returns {object[]}
 */
export function fromMarkdown(text) {
  const words = [];

  for (const raw of String(text ?? '').split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, '');
    const bullet = /^(\s*)[-*+]\s+(.*)$/.exec(line);
    if (!bullet) continue;

    const [, indent, body] = bullet;

    // An indented bullet is the example of the word above it.
    if (indent.length >= 2) {
      const last = words.at(-1);
      if (last && !last.example) last.example = plain(body) || '';
      continue;
    }

    // The star closes the line, but an older export wrote it before the word;
    // both are read, and neither is ever part of the word itself.
    const leading = /^[★⭐]\s*(.*)$/.exec(body);
    const rest = (leading ? leading[1] : body).trim();
    const trailing = /^(.*?)\s*[★⭐]$/.exec(rest);
    const starred = Boolean(leading || trailing);

    // The em dash is the separator; a hyphen only counts when spaced, so
    // "well-being" stays one word.
    const split = /^(.*?)\s+(?:—|–|-{1,2})\s+(.*)$/.exec(trailing ? trailing[1] : rest);
    if (!split) continue;

    const word = plain(split[1]);

    // A level closes the line: in backticks as exported, or in brackets or
    // parentheses as someone might reasonably type it.
    const tail = /^(.*?)\s*(?:`([ABC][12])`|\(([ABC][12])\)|\[([ABC][12])\])$/i.exec(
      split[2].trim(),
    );
    const translation = plain(tail ? tail[1] : split[2]);
    const cefr = tail ? (tail[2] ?? tail[3] ?? tail[4]).toUpperCase() : '';
    if (!word || !translation) continue;

    words.push({ text: word, translation, example: '', cefr, starred });
  }

  return words;
}

/** Strips the emphasis marks the export adds, plus any the user typed. */
function plain(value) {
  return String(value)
    .trim()
    .replace(/^(\*\*|__|\*|_)(.*)\1$/, '$2')
    .replace(/\\([\\*_`[\]])/g, '$1')
    .trim();
}

/** Keeps a word containing `*` or `_` from turning into emphasis on the way out. */
function escape(value) {
  return String(value).replace(/\r?\n/g, ' ').replace(/([\\*_`[\]])/g, '\\$1');
}
