import { isExclusiveLabel, isOtherLabel } from '../../logic/flow.js';

export default function Multi({ q, options, ans, onChange }) {
  const sel = ans?.v || [];
  const wide = options.some((o) => o.length > 24);
  const max = q.max;
  const full = max && sel.filter((x) => !isExclusiveLabel(x)).length >= max;

  const toggle = (o) => {
    let next;
    if (isExclusiveLabel(o)) {
      next = sel.includes(o) ? [] : [o];
    } else {
      const base = sel.filter((x) => !isExclusiveLabel(x));
      if (base.includes(o)) next = base.filter((x) => x !== o);
      else if (max && base.length >= max) return;
      else next = [...base, o];
    }
    const hasOther = next.some(isOtherLabel);
    onChange({ ...ans, v: next, other: hasOther ? ans?.other || '' : '' }, { auto: false });
  };

  const hint = q.exact ? `Pick ${q.exact}` : max ? `Pick up to ${max}` : 'Tick all that apply';
  const otherSelected = sel.some(isOtherLabel);

  return (
    <>
      <p className="hint">
        {hint}{max ? ` · ${sel.filter((x) => !isExclusiveLabel(x)).length} of ${max}` : ''}
      </p>
      <div className={`opts${wide ? ' wide' : ''}`} role="group" aria-label={q.text}>
        {options.map((o) => {
          const on = sel.includes(o);
          const blocked = full && !on && !isExclusiveLabel(o);
          return (
            <button key={o} type="button" aria-pressed={on} disabled={blocked}
              className={`opt${on ? ' on' : ''}`} onClick={() => toggle(o)}>
              {o}
            </button>
          );
        })}
        {otherSelected && (
          <input className="field" autoFocus placeholder="Type here" maxLength={120}
            value={ans.other || ''} onChange={(e) => onChange({ ...ans, other: e.target.value }, { auto: false })} />
        )}
      </div>
    </>
  );
}
