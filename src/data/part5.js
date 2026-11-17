// Parts 5 to 8 and owner questions O12 to O14.
// This file is a separate chunk. It is requested only after Q17 has been saved,
// so the product idea is not in the first download.
//
// Backend note: a file served from a public URL can still be guessed. For a hard
// guarantee, have the server hand this chunk out only to a session that has saved Q17.
import { AGREE } from './questions.js';

const row = (key, text) => ({ key, text });

export const IDEA = {
  heading: 'Now a different kind of electric motorcycle.',
  body: 'The same bike, same price, same warranty. It rides like the petrol bikes you know. You pull a clutch lever and press through the gears with your foot, and you feel the bike respond: the way the power builds and the way each gear engages. But it is fully electric. Clutch and gears are two separate switches: use both, either one, or neither. Switch them off and it rides twist-and-go. You set it up the way you like, any time.',
};

export const PART5_QUESTIONS = [
  // ---------------- Part 5 ----------------
  { id: 'Q18', part: 5, type: 'longtext', optional: true, text: 'In one line, what is this bike?' },
  { id: 'Q19', part: 5, type: 'scale', text: 'At Rs {P}, how likely would you buy this as your next bike?' },
  { id: 'Q20', part: 5, type: 'multi', text: 'How does it make you feel?', max: 3, random: true,
    options: ['Excited', 'Curious', 'Sceptical', 'Indifferent', 'Proud', 'Nervous', 'Nostalgic', 'Amused', 'Uneasy'] },
  { id: 'Q21', part: 5, type: 'grid', text: 'How much do you agree?', options: AGREE, randomRows: true,
    rows: [
      row('a', 'This is different from other bikes I could buy.'),
      row('b', 'This is for riders like me.'),
      row('c', 'It would feel like riding a real motorcycle.'),
      row('d', 'I believe it would deliver what it promises.'),
      row('e', 'It is good value for the money.'),
    ] },
  { id: 'Q22', part: 5, type: 'longtext', optional: true, text: 'What would make it feel fake?' },
  { id: 'Q23', part: 5, type: 'longtext', optional: true, text: 'What would stop you buying it?' },

  // ---------------- Part 6 ----------------
  { id: 'Q24', part: 6, type: 'single', text: 'Which set-up would you want on your bike?', random: true,
    options: ['Feel always on, no switch', 'One switch for everything', 'Separate switches for clutch and gears',
      'Twist-and-go only', 'A real gearbox'] },
  { id: 'Q25', part: 6, type: 'multi', text: 'When would you keep the feel on?', random: true,
    options: ['Weekend rides', 'Ghat or twisty roads', 'Daily commute', 'Heavy traffic', 'Long highway',
      'Skill practice', 'Never'] },
  { id: 'Q26', part: 6, type: 'single', text: 'How often would you switch it off?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Most of the time'] },
  { id: 'Q27', part: 6, type: 'single', text: 'How would you want to change the feel?',
    options: ['Never, set once', 'A few ready modes', 'Detailed tuning', 'Let the bike adapt to my riding'] },
  { id: 'Q28', part: 6, type: 'ladder', text: 'This idea costs more than the plain bike.' },

  // ---------------- Owner questions O12 to O14 (after Part 6) ----------------
  { id: 'O12', part: 'O', label: 'Owner question 12', type: 'multi', text: 'Which of these do you miss from petrol bikes?',
    options: ['Engine sound', 'Vibration', 'Clutch control', 'Gear shifting', 'A bike that responds to my skill',
      'Nothing', 'Other: ___'] },
  { id: 'O13', part: 'O', label: 'Owner question 13', type: 'scale',
    text: 'Suppose the idea you just saw were available in your own bike’s class, same price. How likely would you swap to it?' },
  { id: 'O14', part: 'O', label: 'Owner question 14', type: 'multi', text: 'What would keep you with your current brand?', max: 2,
    options: ['Service I trust', 'Resale value', 'Performance', 'Looks', 'Community of owners',
      'Nothing, I would switch', 'Other: ___'] },

  // ---------------- Part 7 ----------------
  { id: 'Q29', part: 7, type: 'single', text: 'How much would buying this from a new start-up worry you?',
    options: ['Not at all', 'A little', 'Somewhat', 'Quite a lot', 'Extremely'] },
  { id: 'Q30', part: 7, type: 'scale',
    text: 'The same bike at the same price, from a leading two-wheeler maker you know. How likely would you buy it?' },
  { id: 'Q31', part: 7, type: 'multi', text: 'What would make you comfortable buying from a company you do not know?', max: 3, random: true,
    options: ['8-year battery warranty', 'Buyback at 50% after 3 years', 'Service centre within 10 km',
      'Doorstep service', 'A week-long test ride', 'Refundable booking deposit',
      'Verdict from a reviewer I trust', 'Backing from a big two-wheeler maker',
      'Independent battery-safety certificate', 'Feedback from owners'] },
  { id: 'Q32', part: 7, type: 'single', text: 'Furthest you would travel for service?',
    options: ['5 km', '10', '20', '30', 'More than 30'] },
  { id: 'Q33', part: 7, type: 'single', text: 'Most days you would accept being without your bike for a repair?',
    options: ['1', '2–3', '4–7', 'More than 7'] },

  // ---------------- Part 8 ----------------
  // Q35 in the brief is a note, not a question. It is shown as the note under Q34.
  { id: 'Q34', part: 8, type: 'single', text: 'If this bike were real, what is the most you would do today?',
    note: 'Contact details for launch updates and test rides are asked in Part 9, all optional.',
    options: ['Nothing', 'Get launch updates', 'Take a test ride when available',
      'Pay a refundable Rs 1,000 to reserve', 'Pay a refundable Rs 5,000 to reserve'] },
];
