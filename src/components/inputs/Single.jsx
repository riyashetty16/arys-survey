import { Fragment } from 'react';
import { isOtherLabel } from '../../logic/flow.js';

export default function Single({ q, options, ans, onChange }) {
  const v = ans?.v;
  const wide = options.some((o) => o.length > 24);
  const followUp = q.followUp;

  const choose = (o) => {
    const extra = isOtherLabel(o) || (followUp && o === followUp.when);
    onChange({ v: o, other: isOtherLabel(o) ? ans?.other || '' : '', follow: o === followUp?.when ? ans?.follow || '' : '' },
      { auto: !extra });
  };

  return (
    <div className={`opts${wide ? ' wide' : ''}`} role="radiogroup" aria-label={q.text}>
      {options.map((o) => (
        <Fragment key={o}>
          <button type="button" role="radio" aria-checked={v === o}
            className={`opt${v === o ? ' on' : ''}`} onClick={() => choose(o)}>
            {o}
          </button>
          {/* The text box opens directly under the option it belongs to */}
          {v === o && isOtherLabel(o) && (
            <input className="field" autoFocus placeholder="Type here" maxLength={120}
              value={ans.other || ''} onChange={(e) => onChange({ ...ans, other: e.target.value }, { auto: false })} />
          )}
          {v === o && followUp && o === followUp.when && (
            <input className="field" autoFocus placeholder={followUp.placeholder} maxLength={80}
              value={ans.follow || ''} onChange={(e) => onChange({ ...ans, follow: e.target.value }, { auto: false })} />
          )}
        </Fragment>
      ))}
    </div>
  );
}