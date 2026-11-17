import { ladderNext } from '../../logic/flow.js';
import { formatRs } from '../../config.js';

// Q28: one price per screen. Yes goes up, No goes down. Every answer is stored.
export default function Ladder({ q, ans, start, ladder, onChange }) {
  const steps = ans?.v?.steps || [];
  const price = ladderNext(start, steps, ladder);
  if (price === null) return null;

  const answer = (yn) => {
    onChange({ v: { start, steps: [...steps, { price, answer: yn }] } }, { auto: true });
  };

  return (
    <div className="ladder" key={steps.length}>
      <p className="ladder-price">{price === 0 ? 'Same price, Rs 0 more' : `${formatRs(price)} more`}</p>
      <p className="hint">Would you still buy it?</p>
      <div className="opts yn">
        <button type="button" className="opt" onClick={() => answer('Yes')}>Yes</button>
        <button type="button" className="opt" onClick={() => answer('No')}>No</button>
      </div>
    </div>
  );
}
