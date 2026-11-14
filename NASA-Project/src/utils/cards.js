// The order of the slider cards. A card opens only after the quiz of every
// card BEFORE it is solved (viking-1 -> kepler -> pioneer-10 -> lrv).
//
// `path` = the page of that card. Cards with no page yet (path: null) don't
// block the next card; once you build their page, put its path here and the
// lock starts counting them automatically.
export const CARD_ORDER = [
  { id: "viking-1", path: "/mars1" },
  { id: "kepler", path: "/kepler" },
  { id: "pioneer-10", path: "/pioneer" },
  { id: "lrv", path: "/moon" },
];

// done = { "viking-1": true, ... } (see utils/quizProgress.js)
export function isCardUnlocked(cardId, done) {
  const index = CARD_ORDER.findIndex((c) => c.id === cardId);
  if (index === -1) return true;
  return CARD_ORDER.slice(0, index).every((c) => !c.path || !!done[c.id]);
}
