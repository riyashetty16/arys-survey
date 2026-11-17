export default function Age({ q, ans, onChange }) {
  const v = ans?.v || {};
  const age = v.age ?? '';
  const n = Number(age);
  const bad = age !== '' && !(Number.isInteger(n) && n >= 16 && n <= 80);

  return (
    <div className="stack">
      <input className="field" inputMode="numeric" pattern="[0-9]*" autoFocus placeholder="Age"
        aria-label="Your age in years" value={age}
        onChange={(e) => onChange({ v: { ...v, age: e.target.value.replace(/\D/g, '').slice(0, 2) } }, { auto: false })} />
      <p className="err">{bad ? 'Enter an age between 16 and 80.' : '\u00a0'}</p>
      <p className="sub">Years of riding (optional)</p>
      <div className="opts years">
        {q.yearsOptions.map((o) => (
          <button key={o} type="button" aria-pressed={v.years === o}
            className={`opt${v.years === o ? ' on' : ''}`}
            onClick={() => onChange({ v: { ...v, years: v.years === o ? '' : o } }, { auto: false })}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
