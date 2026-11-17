import { normalisePhone, EMAIL_RE } from '../../logic/validate.js';
import { nowIso } from '../../lib/utils.js';

export function ShortText({ q, ans, onChange }) {
  return (
    <input className="field" autoFocus maxLength={200} placeholder={q.placeholder || 'Type here'}
      value={ans?.v || ''} onChange={(e) => onChange({ v: e.target.value }, { auto: false })} />
  );
}

export function LongText({ q, ans, onChange }) {
  return (
    <textarea className="field area" rows={5} maxLength={1500} autoFocus placeholder="Type here"
      aria-label={q.text} value={ans?.v || ''} onChange={(e) => onChange({ v: e.target.value }, { auto: false })} />
  );
}

export function MultiText({ q, ans, onChange }) {
  const v = ans?.v || Array(q.count).fill('');
  const set = (i, val) => {
    const next = [...v];
    next[i] = val;
    onChange({ v: next }, { auto: false });
  };
  return (
    <div className="stack">
      {Array.from({ length: q.count }, (_, i) => (
        <input key={i} className="field" autoFocus={i === 0} maxLength={60}
          placeholder={`${q.placeholder} ${i + 1}`} aria-label={`${q.placeholder} ${i + 1}`}
          value={v[i] || ''} onChange={(e) => set(i, e.target.value)} />
      ))}
    </div>
  );
}

// Phone and email: a value, a format check, and a consent tick.
export function ContactField({ q, ans, onChange }) {
  const isPhone = q.type === 'phone';
  const value = ans?.v || '';
  const filled = value.trim().length > 0;
  const formatOk = isPhone ? !!normalisePhone(value) : EMAIL_RE.test(value.trim());
  const label = isPhone
    ? 'I agree that ARYS GARAGE may use my phone number only to send launch updates and test-ride invites.'
    : 'I agree that ARYS GARAGE may use my email address only to send launch updates and test-ride invites.';

  return (
    <div className="stack">
      <input className="field" autoFocus maxLength={80}
        type={isPhone ? 'tel' : 'email'} inputMode={isPhone ? 'tel' : 'email'}
        autoComplete={isPhone ? 'tel' : 'email'}
        placeholder={isPhone ? '98765 43210' : 'name@example.com'}
        value={value} onChange={(e) => onChange({ ...ans, v: e.target.value }, { auto: false })} />
      <p className="err">
        {filled && !formatOk ? (isPhone ? 'Enter a 10-digit mobile number.' : 'Enter a valid email address.') : '\u00a0'}
      </p>
      <label className="consent">
        <input type="checkbox" checked={!!ans?.consentAt}
          onChange={(e) => onChange({ ...ans, v: value, consentAt: e.target.checked ? nowIso() : null }, { auto: false })} />
        <span className="box" aria-hidden="true" />
        <span>{label}</span>
      </label>
      {filled && formatOk && !ans?.consentAt && <p className="err">Tick the box to share this with us, or clear the field to skip.</p>}
    </div>
  );
}
