import { isOtherLabel, ladderDone } from './flow.js';

export const PHONE_RE = /^(?:\+?91|0)?[6-9]\d{9}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalisePhone = (s) => {
  const digits = String(s || '').replace(/[\s-]/g, '');
  return PHONE_RE.test(digits) ? `+91${digits.slice(-10)}` : null;
};

export function numbersState(q, v = {}) {
  // Returns { ok, errorKey } for Q16. Each row must be higher than the one above.
  const keys = q.rows.map((r) => r.key);
  let prev = 0;
  for (const k of keys) {
    const n = Number(v[k]);
    if (!v[k] || !Number.isFinite(n) || n <= 0) return { ok: false, errorKey: null };
    if (n <= prev) return { ok: false, errorKey: k };
    prev = n;
  }
  return { ok: true, errorKey: null };
}

export function isEmpty(q, a) {
  const v = a?.v;
  switch (q.type) {
    case 'text':
    case 'longtext':
    case 'name':
    case 'phone':
    case 'email':
      return !String(v || '').trim();
    case 'single':
      return !v;
    default:
      return v == null || v === '';
  }
}

export function isValid(q, a, ctx = {}) {
  const v = a?.v;
  if (q.optional && isEmpty(q, a)) return true;
  switch (q.type) {
    case 'single': {
      if (!v) return false;
      if (isOtherLabel(v)) return !!String(a.other || '').trim();
      return true;
    }
    case 'multi': {
      const n = v?.length || 0;
      if (n === 0) return false;
      if (q.exact && n !== q.exact) return false;
      if (q.max && n > q.max) return false;
      const other = v.find(isOtherLabel);
      if (other && !String(a.other || '').trim()) return false;
      return true;
    }
    case 'scale':
      return typeof v === 'number' && v >= 0 && v <= 10;
    case 'grid':
      return !!v && q.rows.every((r) => !!v[r.key]);
    case 'numbers':
      return numbersState(q, v).ok;
    case 'text':
    case 'longtext':
    case 'name':
      return !q.optional ? !!String(v || '').trim() : true;
    case 'multitext':
      return Array.isArray(v) && v.some((x) => String(x || '').trim());
    case 'age': {
      const n = Number(v?.age);
      return Number.isInteger(n) && n >= 16 && n <= 80;
    }
    case 'phone':
      return !!normalisePhone(v) && !!a?.consentAt;
    case 'email':
      return EMAIL_RE.test(String(v || '').trim()) && !!a?.consentAt;
    case 'ladder':
      return !!v && ladderDone(v.start, v.steps, ctx.ladder || []);
    default:
      return true;
  }
}
