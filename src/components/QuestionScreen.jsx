import { useEffect } from 'react';
import { PARTS } from '../data/questions.js';
import { fillText, isOtherLabel } from '../logic/flow.js';
import { isEmpty, isValid } from '../logic/validate.js';
import ProgressBar from './ProgressBar.jsx';
import Single from './inputs/Single.jsx';
import Multi from './inputs/Multi.jsx';
import Scale from './inputs/Scale.jsx';
import Grid from './inputs/Grid.jsx';
import Numbers from './inputs/Numbers.jsx';
import Age from './inputs/Age.jsx';
import Ladder from './inputs/Ladder.jsx';
import { ShortText, LongText, MultiText, ContactField } from './inputs/TextFields.jsx';

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </svg>
);

export default function QuestionScreen({ q, ans, order, ctx, progress, canBack, onBack, onChange, onNext, ladderStart }) {
  const valid = isValid(q, ans, ctx);
  const empty = isEmpty(q, ans);

  const partLabel = q.part === 'O' ? PARTS.O : `Part ${q.part} : ${PARTS[q.part]}`;
  const qLabel = q.label || `Question ${q.id.slice(1)}`;
  const options = q.options ? order || q.options : null;

  // Which types move on by themselves. Others show a Next button.
  const selfAdvancing = q.type === 'scale' || q.type === 'ladder' ||
    (q.type === 'single' && !(isOtherLabel(ans?.v) || (q.followUp && ans?.v === q.followUp.when)));
  const showNext = !selfAdvancing;
  const nextLabel = q.optional && empty ? 'Skip' : q.id === 'Q45' ? 'Finish' : 'Next';

  useEffect(() => { window.scrollTo(0, 0); }, [q.id]);

  // Enter moves on. In a long-text box Enter is a new line.
  const onKeyDown = (e) => {
    if (e.key !== 'Enter' || e.shiftKey || e.target.tagName === 'TEXTAREA') return;
    if (selfAdvancing) return;
    e.preventDefault();
    if (valid) onNext();
  };

  let input = null;
  switch (q.type) {
    case 'single': input = <Single q={q} options={options} ans={ans} onChange={onChange} />; break;
    case 'multi': input = <Multi q={q} options={options} ans={ans} onChange={onChange} />; break;
    case 'scale': input = <Scale ans={ans} onChange={onChange} />; break;
    case 'grid': input = <Grid q={q} order={order} ans={ans} onChange={onChange} />; break;
    case 'numbers': input = <Numbers q={q} ans={ans} onChange={onChange} />; break;
    case 'text':
    case 'name': input = <ShortText q={q} ans={ans} onChange={onChange} />; break;
    case 'longtext': input = <LongText q={q} ans={ans} onChange={onChange} />; break;
    case 'multitext': input = <MultiText q={q} ans={ans} onChange={onChange} />; break;
    case 'phone':
    case 'email': input = <ContactField q={q} ans={ans} onChange={onChange} />; break;
    case 'age': input = <Age q={q} ans={ans} onChange={onChange} />; break;
    case 'ladder': input = <Ladder q={q} ans={ans} start={ladderStart} ladder={ctx.ladder} onChange={onChange} />; break;
    default: break;
  }

  return (
    <main className="screen question" onKeyDown={onKeyDown}>
      <header className="q-head">
        {canBack ? (
          <button className="back" type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        ) : <span className="back-space" />}
      </header>

      <div className="q-meta">
        <p className="label">{partLabel}</p>
        <ProgressBar value={progress} />
        <p className="label">{qLabel}</p>
      </div>

      <section className="card" key={q.id}>
        {q.pre && <p className="pre">{fillText(q.pre, ctx)}</p>}
        <h1 className="q-title">{fillText(q.text, ctx)}</h1>
        {q.note && <p className="pre">{q.note}</p>}
        {input}
      </section>

      {showNext && (
        <div className="actions">
          <button className="btn" type="button" disabled={!valid} onClick={onNext}>{nextLabel}</button>
        </div>
      )}
    </main>
  );
}
