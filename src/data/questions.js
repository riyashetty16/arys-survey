// Questions for Parts 1-4, the owner questions O1-O11, and Part 9.
// Parts 5-8 (the product idea) live in part5.js and are loaded only after Q17 is saved.
//
// Fields: id, part, text, type, options, rows, optional, max, exact, random, randomRows,
//         pre (text above the question), note, prefix, placeholder
// Placeholders in text: {P} = price for the rider's engine class, {X} = range in km.

export const PARTS = {
  1: 'Who you are',
  2: 'Your riding',
  3: 'Going electric',
  4: 'Price',
  5: 'The idea',
  6: 'Make it yours',
  7: 'Trust',
  8: 'Your move',
  9: 'About you',
  O: 'Owner questions',
};

export const AGREE = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];
export const SCALE_NOTE = '0 = no chance · 5 = fifty-fifty · 10 = certain';

// Invented brand used to catch false claims. Replace the name if you prefer another.
export const DECOY_BRAND = 'Voltaro';

const row = (key, text) => ({ key, text: text ?? key });

export const MAIN_QUESTIONS = [
  // ---------------- Part 1 ----------------
  {
    id: 'Q1', part: 1, type: 'multi', text: 'What do you ride at least twice a month?',
    options: ['Geared motorcycle', 'Scooter', 'Electric two-wheeler', 'None']
  },
  {
    id: 'Q2', part: 1, type: 'single', text: 'Engine size of your main bike?',
    options: ['Under 125cc', '125–200cc', '200–350cc', 'Over 350cc']
  },
  {
    id: 'Q3', part: 1, type: 'single', text: 'When will you buy your next bike?',
    options: ['Within a year', 'In 1–2 years', 'Later', 'No plans']
  },
  {
    id: 'Q4', part: 1, type: 'single', text: 'Where do you live?',
    options: ['Bengaluru', 'Other metro', 'City of 10 lakh or more', 'Smaller city or town']
  },
  {
    id: 'Q5', part: 1, type: 'single', text: 'Do you work in autos, EVs, bike media or market research?',
    options: ['Yes', 'No']
  },
  {
    id: 'Q5b', part: 1, type: 'single', text: 'Do you own an electric motorcycle, not a scooter?',
    options: ['Ultraviolette', 'Revolt', 'Oben', 'Tork', 'Matter', 'Zero',
      'Other electric motorcycle', 'No']
  },

  // ---------------- Part 2 ----------------
  {
    id: 'Q6', part: 2, type: 'single', text: 'Distance in a normal week?',
    options: ['Under 50 km', '50–150', '150–300', 'Over 300']
  },
  {
    id: 'Q7', part: 2, type: 'single', text: 'Budget for your next bike, on-road?',
    options: ['Under Rs 1.5 lakh', '1.5–2.5', '2.5–4', '4–8', 'Over 8']
  },
  {
    id: 'Q8', part: 2, type: 'grid', text: 'How much do you agree?', options: AGREE, randomRows: true,
    attentionRow: 'h',
    rows: [
      row('a', 'Getting better at controlling a bike is part of the fun.'),
      row('b', 'I like feeling the machine work.'),
      row('c', 'I prefer a bike that does the hard work for me.'),
      row('d', 'Riding in traffic should take as little effort as possible.'),
      row('e', 'My bike says something about who I am.'),
      row('f', 'A bike others do not see as a real motorcycle would not suit me.'),
      row('g', 'Most advertising is honest.'),
      row('h', 'Pick "Agree" for this row.'),
    ]
  },
  {
    id: 'Q9', part: 2, type: 'text', optional: true,
    text: 'Finish the line: "A real motorcycle is one that ___."',
    placeholder: 'A real motorcycle is one that…'
  },

  // ---------------- Part 3 ----------------
  { id: 'Q10', part: 3, type: 'scale', text: 'How likely is your next bike to be electric?' },
  {
    id: 'Q11', part: 3, type: 'multi', text: 'Which 3 matter most in an electric bike?', exact: 3, max: 3, random: true,
    options: ['Price', 'Running cost', 'Real range', 'Charging time', 'Home charging', 'Battery warranty',
      'Resale value', 'Service network', 'Brand trust', 'Speed and acceleration', 'Looks', 'Safety',
      'How it feels to ride']
  },
  {
    id: 'Q12', part: 3, type: 'multi', text: 'What holds you back from electric?', max: 3, random: true,
    options: ['Price', 'Range', 'Charging time', 'No home charging', 'Battery replacement cost',
      'Resale value', 'Service', 'Fire or safety worry', 'I do not trust the brands', 'Looks',
      'Too few choices', 'Nothing', 'Other']
  },
  {
    id: 'Q13', part: 3, type: 'multitext', text: 'Name up to 3 electric motorcycle brands you know.',
    count: 3, placeholder: 'Brand'
  },
  {
    id: 'Q14', part: 3, type: 'grid', text: 'How well do you know each brand?', randomRows: true,
    options: ['Never heard', 'Heard of it', 'Know a bit', 'Have considered', 'Own one'],
    decoyRow: DECOY_BRAND,
    rows: ['Ultraviolette', 'Revolt', 'Oben', 'Tork', 'Matter', 'Ola Electric', 'Zero',
      'Royal Enfield Flying Flea', DECOY_BRAND].map((b) => row(b))
  },
  {
    id: 'Q15', part: 3, type: 'multi', text: 'Why have you not considered Ultraviolette?', max: 2, random: true,
    options: ['Too expensive', 'Unsure about service', 'Do not trust the brand', 'Worried about resale',
      'Looks', 'Does not suit my needs', 'Not enough range', 'Do not know enough', 'Other']
  },

  // ---------------- Part 4 ----------------
  {
    id: 'Q16', part: 4, type: 'numbers', text: 'In rupees, at what price is it:',
    pre: 'Picture a plain electric bike in your engine class: about {X} km real range, home charging, 8-year battery warranty, from a new Bangalore company.',
    rows: [
      row('a', 'so cheap you doubt its quality?'),
      row('b', 'a bargain?'),
      row('c', 'getting expensive, but still in the running?'),
      row('d', 'too expensive to consider?'),
    ]
  },
  { id: 'Q17', part: 4, type: 'scale', text: 'At Rs {P}, how likely would you buy it as your next bike?' },

  // ---------------- Owner questions O1-O11 (after Q15) ----------------
  {
    id: 'O1', part: 'O', label: 'Owner question 1', type: 'single', text: 'How long have you owned it?',
    options: ['Under 6 months', '6–12 months', '1–2 years', 'Over 2 years']
  },
  {
    id: 'O2', part: 'O', label: 'Owner question 2', type: 'multi', text: 'Why did you buy it?', max: 3,
    options: ['Running cost', 'Performance', 'Looks', 'Technology', 'Indian brand', 'Environment',
      'Impressed on a test ride', 'Price or subsidy', 'Other']
  },
  { id: 'O3', part: 'O', label: 'Owner question 3', type: 'scale', text: 'How likely would you recommend it to a friend?' },
  {
    id: 'O4', part: 'O', label: 'Owner question 4', type: 'multi', text: 'What do you like most about it?', max: 3,
    options: ['Acceleration', 'Low running cost', 'Quiet and smooth', 'Looks', 'App and technology',
      'Low maintenance', 'Handling', 'Charging at home', 'Pride of owning it', 'Other']
  },
  {
    id: 'O5', part: 'O', label: 'Owner question 5', type: 'multi', text: 'What annoys you most about it?', max: 3,
    options: ['Real-world range', 'Charging time', 'Finding chargers', 'Slow service', 'Waiting for spares',
      'Software bugs', 'Battery worry', 'Resale value', 'Build quality', 'Heat', 'Price I paid', 'Other']
  },
  {
    id: 'O6', part: 'O', label: 'Owner question 6', type: 'grid', text: 'How satisfied are you with each?',
    options: ['Very unhappy', 'Unhappy', 'OK', 'Happy', 'Very happy'],
    rows: ['Acceleration', 'Real range', 'Charging', 'Service', 'App and software', 'Build quality',
      'Value for money', 'How enjoyable it is to ride'].map((r) => row(r))
  },
  {
    id: 'O7', part: 'O', label: 'Owner question 7', type: 'single',
    text: 'Compared with petrol motorcycles you have ridden, how engaging is the ride?',
    options: ['Much less', 'Less', 'About the same', 'More', 'Much more']
  },
  {
    id: 'O8', part: 'O', label: 'Owner question 8', type: 'longtext', optional: true,
    text: 'What, if anything, do you miss from petrol bikes?'
  },
  {
    id: 'O9', part: 'O', label: 'Owner question 9', type: 'multi', text: 'Which problems have you had in the last year?',
    options: ['Service delay of over a week', 'Spare part wait', 'Software fault', 'Range far below claim',
      'Charging problem', 'Battery or charger fault', 'None']
  },
  {
    id: 'O10', part: 'O', label: 'Owner question 10', type: 'single', text: 'How far is your nearest service centre?',
    options: ['Under 5 km', '5–10', '10–20', 'Over 20']
  },
  { id: 'O11', part: 'O', label: 'Owner question 11', type: 'scale', text: 'How likely would you buy the same brand again?' },

  // ---------------- Part 9 ----------------
  {
    id: 'Q36', part: 9, type: 'single', text: 'Highest education of any woman at home?',
    options: ['No woman at home', 'Up to class 8', 'Class 9–12', 'Diploma or ITI', 'Graduate', 'Postgraduate or professional']
  },
  {
    id: 'Q37', part: 9, type: 'single', text: 'Highest education of any man at home?',
    options: ['No man at home', 'Up to class 8', 'Class 9–12', 'Diploma or ITI', 'Graduate', 'Postgraduate or professional']
  },
  {
    id: 'Q38', part: 9, type: 'single', text: 'Main earner’s work?',
    options: ['Daily wage or unskilled', 'Skilled worker', 'Shop or small business', 'Clerk or supervisor',
      'Salaried professional or manager', 'Self-employed professional or business owner', 'Farmer',
      'Retired or not working']
  },
  {
    id: 'Q39', part: 9, type: 'age', text: 'Your age in years.',
    yearsOptions: ['Under 1', '1–3', '3–7', '7 or more']
  },
  {
    id: 'Q40', part: 9, type: 'name', optional: true, text: 'Your name.',
    pre: 'The next questions are optional. Skip any you like. If you share contact details we use them only to send launch updates and test-ride invites, and you can ask us to delete them any time.'
  },
  {
    id: 'Q41', part: 9, type: 'single', optional: true, text: 'What do you do?',
    followUp: { when: 'Student', placeholder: 'Course or year' },
    options: ['Student', 'Salaried employee', 'Self-employed or business owner', 'Freelancer', 'Homemaker',
      'Not working', 'Retired', 'Other']
  },
  {
    id: 'Q42', part: 9, type: 'single', optional: true, text: 'Your mother tongue.',
    options: ['Kannada', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Other']
  },
  {
    id: 'Q43', part: 9, type: 'text', optional: true, text: 'Where do you live? City and area, or PIN code.',
    placeholder: 'City and area, or PIN code'
  },
  { id: 'Q44', part: 9, type: 'phone', optional: true, text: 'Phone number.' },
  { id: 'Q45', part: 9, type: 'email', optional: true, text: 'Email address.' },
];

// Ids of the screens that come from part5.js, in order. Used only to build the path
// and the progress bar before part5.js has been loaded. No question text is kept here.
export const LATE_IDS = {
  part5: ['Q18', 'Q19', 'Q20', 'Q21', 'Q22', 'Q23'],
  part6: ['Q24', 'Q25', 'Q26', 'Q27', 'Q28'],
  ownerLate: ['O12', 'O13', 'O14'],
  part7: ['Q29', 'Q30', 'Q31', 'Q32', 'Q33'],
  part8: ['Q34'],
};

// ---- Registry ---------------------------------------------------------------
export const REGISTRY = {};
MAIN_QUESTIONS.forEach((q) => { REGISTRY[q.id] = q; });

export const LATE = { ready: false, idea: null };

export function registerLate(mod) {
  mod.PART5_QUESTIONS.forEach((q) => { REGISTRY[q.id] = q; });
  LATE.idea = mod.IDEA;
  LATE.ready = true;
}

export const getQuestion = (id) => REGISTRY[id];