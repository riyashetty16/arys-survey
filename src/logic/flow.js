import { LATE_IDS } from '../data/questions.js';
import { pick, shuffle } from '../lib/utils.js';

export const isOtherLabel = (l) => typeof l === 'string' && l.includes('___');
export const isExclusiveLabel = (l) => /^(Nothing|None|Never)\b/.test(l);
export const isPinnedLabel = (l) => isOtherLabel(l) || isExclusiveLabel(l);

export const isOwner = (answers) => {
  const v = answers.Q5b?.v;
  return !!v && v !== 'No';
};

export const showQ15 = (answers) =>
  ['Heard of it', 'Know a bit'].includes(answers.Q14?.v?.Ultraviolette);

// The full list of screens this rider will see, given the answers so far.
export function buildPath(answers) {
  const owner = isOwner(answers);
  const p = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q5b', 'Q6', 'Q7', 'Q8', 'Q9',
    'Q10', 'Q11', 'Q12', 'Q13', 'Q14'];
  if (showQ15(answers)) p.push('Q15');
  if (owner) p.push('O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11');
  p.push('Q16', 'Q17', 'IDEA');
  p.push(...LATE_IDS.part5, ...LATE_IDS.part6);
  if (owner) p.push(...LATE_IDS.ownerLate);
  p.push(...LATE_IDS.part7, ...LATE_IDS.part8);
  p.push('Q36', 'Q37', 'Q38', 'Q39', 'Q40', 'Q41', 'Q42', 'Q43', 'Q44', 'Q45');
  return p;
}

// Screen-out rules from the logic table.
export function screenOutFor(id, value) {
  if (id === 'Q1') return !(Array.isArray(value) && value.includes('Geared motorcycle'));
  if (id === 'Q3') return value === 'No plans';
  if (id === 'Q5') return value === 'Yes';
  return false;
}

// Q28 branching price ladder.
// Start at a random price. A Yes goes up the ladder, a No goes down.
// Keep going in the same direction. Stop when the answer flips or the ladder ends.
export function ladderNext(start, steps, ladder) {
  if (!steps.length) return start;
  const sorted = [...ladder].sort((a, b) => a - b);
  const last = steps[steps.length - 1];
  const i = sorted.indexOf(last.price);
  if (i === -1) return null;
  const dirUp = steps[0].answer === 'Yes';
  if (dirUp && last.answer === 'Yes') return sorted[i + 1] ?? null;
  if (!dirUp && last.answer === 'No') return sorted[i - 1] ?? null;
  return null;
}

export const ladderDone = (start, steps, ladder) =>
  steps.length > 0 && ladderNext(start, steps, ladder) === null;

// Options in the order the rider sees them. "Other", "Nothing", "None" and "Never" stay last.
export function makeOptionOrder(options) {
  const free = options.filter((o) => !isPinnedLabel(o));
  const pinned = options.filter(isPinnedLabel);
  return [...shuffle(free), ...pinned];
}

export function makeRowOrder(rows) {
  return shuffle(rows.map((r) => r.key));
}

export const randomLadderStart = (starts) => pick(starts);

// Text placeholders
export function fillText(text, ctx) {
  if (!text) return text;
  return text.replace('{P}', ctx.P ?? '').replace('{X}', ctx.X ?? '');
}
