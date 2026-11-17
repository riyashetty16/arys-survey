import { SCALE_NOTE } from '../../data/questions.js';

export default function Scale({ ans, onChange }) {
  const v = ans?.v;
  return (
    <>
      <div className="scale" role="radiogroup">
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i} type="button" role="radio" aria-checked={v === i}
            className={`dot${v === i ? ' on' : ''}`} onClick={() => onChange({ v: i }, { auto: true })}>
            {i}
          </button>
        ))}
      </div>
      <p className="hint">{SCALE_NOTE}</p>
    </>
  );
}
