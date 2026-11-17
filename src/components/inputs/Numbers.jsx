import { numbersState } from '../../logic/validate.js';
import { formatNum } from '../../config.js';

export default function Numbers({ q, ans, onChange }) {
  const v = ans?.v || {};
  const { errorKey } = numbersState(q, v);
  const keys = q.rows.map((r) => r.key);

  const set = (k, raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 9);
    onChange({ v: { ...v, [k]: digits } }, { auto: false });
  };

  return (
    <div className="nums">
      {q.rows.map((r, i) => {
        const prevKey = keys[i - 1];
        const locked = i > 0 && !v[prevKey];
        const bad = errorKey === r.key;
        return (
          <div className="num-row" key={r.key}>
            <label htmlFor={`n-${r.key}`}>{r.text}</label>
            <div className={`num-box${bad ? ' bad' : ''}${locked ? ' locked' : ''}`}>
              <span>Rs</span>
              <input id={`n-${r.key}`} inputMode="numeric" pattern="[0-9]*" autoComplete="off"
                disabled={locked} value={v[r.key] || ''} placeholder="0"
                onChange={(e) => set(r.key, e.target.value)} />
            </div>
            <p className="num-hint">
              {bad ? `Enter a price higher than Rs ${formatNum(v[prevKey])}.` : '\u00a0'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
