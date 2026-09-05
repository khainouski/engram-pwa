/**
 * Line icons for sections, keyed by group and vocabulary id.
 *
 * Drawn rather than taken from a library: the set is small, and inlining keeps
 * the app one HTTP request wide and free of an external CDN.
 */

const PATHS = {
  // Grammar groups
  time: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  conditionals: '<path d="M3.5 12H9"/><path d="M9 12l3.5-4.5H19"/><path d="M9 12l3.5 4.5H19"/><path d="M16.8 5.3 19 7.5l-2.2 2.2"/><path d="M16.8 14.3 19 16.5l-2.2 2.2"/>',
  modals: '<path d="M3.8 16.5a8.2 8.2 0 0 1 16.4 0"/><path d="M12 16.5 16 10.6"/><circle cx="12" cy="16.5" r="1.4"/>',
  'verb-patterns': '<path d="M9.2 4.2H6.4a1.8 1.8 0 0 0-1.8 1.8v12a1.8 1.8 0 0 0 1.8 1.8h2.8"/><path d="M14.8 4.2h2.8a1.8 1.8 0 0 1 1.8 1.8v12a1.8 1.8 0 0 1-1.8 1.8h-2.8"/><path d="M12 9.4v5.2"/><path d="M9.4 12h5.2"/>',
  'sentence-structure': '<path d="M4 7h16"/><path d="M4 12h10.5"/><path d="M4 17h6.5"/>',
  passive: '<path d="M5 9h13"/><path d="M15.4 6 18.4 9l-3 3"/><path d="M19 15H6"/><path d="M8.6 12 5.6 15l3 3"/>',
  'reported-speech': '<path d="M4.5 6.2a1.7 1.7 0 0 1 1.7-1.7h11.6a1.7 1.7 0 0 1 1.7 1.7v7.6a1.7 1.7 0 0 1-1.7 1.7H10l-5.5 4z"/><path d="M9.2 8.2v1.4c0 .9-.5 1.5-1.3 1.8"/><path d="M14 8.2v1.4c0 .9-.5 1.5-1.3 1.8"/>',

  // Vocabulary sections
  vocabulary: '<path d="M5.5 5.2a1.7 1.7 0 0 1 1.7-1.7H19v14.5H7.2a1.7 1.7 0 0 0-1.7 1.7z"/><path d="M5.5 18a1.7 1.7 0 0 1 1.7-1.7H19"/>',
  have: '<path d="M12 3.6 20 7.4v9.2L12 20.4 4 16.6V7.4z"/><path d="m4 7.4 8 3.8 8-3.8"/><path d="M12 11.2v9.2"/>',
  get: '<path d="M12 3.8v9.4"/><path d="m8.2 9.6 3.8 3.8 3.8-3.8"/><path d="M4.5 16.4v2a1.7 1.7 0 0 0 1.7 1.7h11.6a1.7 1.7 0 0 0 1.7-1.7v-2"/>',
  'must-know': '<circle cx="12" cy="9.2" r="5.4"/><path d="M8.7 13.8 7.6 20.4 12 18.1l4.4 2.3-1.1-6.6"/>',
  processes: '<path d="m4 7.3 1.9 1.9L9.3 5.8"/><path d="m4 15.3 1.9 1.9 3.4-3.4"/><path d="M13 8h7"/><path d="M13 16h7"/>',
  communication: '<circle cx="9.3" cy="8.2" r="3.1"/><path d="M3.6 19.4a5.7 5.7 0 0 1 11.4 0"/><path d="M16.4 5.6a3.1 3.1 0 0 1 0 5.2"/><path d="M17.4 14.4a5.7 5.7 0 0 1 3.4 5"/>',
  opinions: '<path d="M3.6 6.6a1.5 1.5 0 0 1 1.5-1.5h8.6a1.5 1.5 0 0 1 1.5 1.5v4.6a1.5 1.5 0 0 1-1.5 1.5H8l-4.4 3.2z"/><path d="M9 15.9v1.5a1.5 1.5 0 0 0 1.5 1.5h4.9l3.8 2.7v-2.7a1.5 1.5 0 0 0 1.2-1.5v-3.3a1.5 1.5 0 0 0-1.5-1.5h-1.4"/>',
  growth: '<path d="m3.6 17.2 5.6-5.6 3.6 3.6 7.6-7.6"/><path d="M15.6 7.6h4.8v4.8"/>',
  phrasal: '<path d="M9.2 12h5.6"/><path d="M11 7.8H8.4a4.2 4.2 0 0 0 0 8.4H11"/><path d="M13 7.8h2.6a4.2 4.2 0 0 1 0 8.4H13"/>',

  // Standalone rows
  words: '<path d="m12 3.8 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  settings: '<circle cx="12" cy="12" r="3.1"/><path d="M19.4 14.2a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a1.9 1.9 0 1 1-3.8 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.3a1.9 1.9 0 1 1 0-3.8h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5v-.3a1.9 1.9 0 1 1 3.8 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a1.9 1.9 0 1 1 0 3.8h-.2a1.6 1.6 0 0 0-1.5 1z"/>',
};

/**
 * @param {string} id group, vocabulary section or standalone row id
 * @param {string} [extraClass]
 * @returns {string} inline SVG, or '' when the id has no icon (callers fall
 *   back to the emoji kept in the data files)
 */
export function icon(id, extraClass = '') {
  const paths = PATHS[id];
  if (!paths) return '';
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${paths}</svg>`;
}
