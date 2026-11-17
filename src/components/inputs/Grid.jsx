export default function Grid({ q, order, ans, onChange }) {
  const v = ans?.v || {};
  const keys = order || q.rows.map((r) => r.key);
  const rows = keys.map((k) => q.rows.find((r) => r.key === k)).filter(Boolean);
  const last = q.options.length;

  return (
    <div className="grid">
      <p className="hint">1 = {q.options[0]} · {last} = {q.options[last - 1]}</p>
      {rows.map((r) => (
        <div className="grid-row" key={r.key} role="radiogroup" aria-label={r.text}>
          <p className="grid-label">{r.text}</p>
          <div className="seg">
            {q.options.map((o, i) => (
              <button key={o} type="button" role="radio" aria-checked={v[r.key] === o} aria-label={o}
                className={v[r.key] === o ? 'on' : ''}
                onClick={() => onChange({ v: { ...v, [r.key]: o } }, { auto: false })}>
                {i + 1}
              </button>
            ))}
          </div>
          <p className="grid-pick">{v[r.key] || '\u00a0'}</p>
        </div>
      ))}
    </div>
  );
}
