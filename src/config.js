// Defaults for everything the admin page can change. Values marked PLACEHOLDER
// must be replaced with real numbers in the Admin page before launch.

export const ENGINE_CLASSES = ['Under 125cc', '125–200cc', '200–350cc', 'Over 350cc'];
export const CITIES = ['Bengaluru', 'Other metro', 'City of 10 lakh or more', 'Smaller city or town'];
export const AGE_BANDS = ['16–24', '25–34', '35–44', '45–54', '55–80'];
export const SESSION_DAYS = 7;

export const DEFAULT_CONFIG = {
  status: 'open', // open | paused | closed
  adminPassword: 'change-me', // PLACEHOLDER. Real auth must be done on the server.
  // P: price shown in Q17 and Q19, per engine class from Q2 (PLACEHOLDER)
  price: {
    'Under 125cc': 85000,
    '125–200cc': 120000,
    '200–350cc': 180000,
    'Over 350cc': 280000,
  },
  // X: real range in km shown in Part 4, per engine class (PLACEHOLDER)
  range: {
    'Under 125cc': 90,
    '125–200cc': 110,
    '200–350cc': 140,
    'Over 350cc': 170,
  },
  q28Starts: [7500, 15000, 30000], // random start of the Q28 price ladder
  q28Ladder: [0, 7500, 15000, 30000, 50000], // every price the ladder can visit
  quotas: {
    engine: { 'Under 125cc': 50, '125–200cc': 150, '200–350cc': 150, 'Over 350cc': 50 },
    city: {
      Bengaluru: 150,
      'Other metro': 100,
      'City of 10 lakh or more': 100,
      'Smaller city or town': 50,
    },
    owner: { Owners: 60, 'Non-owners': 340 },
    age: { '16–24': 80, '25–34': 160, '35–44': 100, '45–54': 40, '55–80': 20 },
  },
};

export const formatNum = (n) => Number(n).toLocaleString('en-IN');
export const formatRs = (n) => `Rs ${formatNum(n)}`;

export function mergeConfig(saved) {
  const d = DEFAULT_CONFIG;
  const s = saved || {};
  return {
    ...d,
    ...s,
    price: { ...d.price, ...(s.price || {}) },
    range: { ...d.range, ...(s.range || {}) },
    quotas: {
      engine: { ...d.quotas.engine, ...(s.quotas?.engine || {}) },
      city: { ...d.quotas.city, ...(s.quotas?.city || {}) },
      owner: { ...d.quotas.owner, ...(s.quotas?.owner || {}) },
      age: { ...d.quotas.age, ...(s.quotas?.age || {}) },
    },
  };
}
