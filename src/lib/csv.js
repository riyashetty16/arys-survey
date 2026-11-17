import { MAIN_QUESTIONS } from '../data/questions.js';

const esc = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const line = (arr) => arr.map(esc).join(',');

export function download(filename, text) {
  const blob = new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Question columns in survey order (owner questions O1-O11 sit after Q15, O12-O14 after Q28).
export function questionOrder(lateQuestions) {
  const all = [...MAIN_QUESTIONS, ...lateQuestions];
  const byId = Object.fromEntries(all.map((q) => [q.id, q]));
  const ids = [
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q5b', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15',
    'O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11', 'Q16', 'Q17',
    'Q18', 'Q19', 'Q20', 'Q21', 'Q22', 'Q23', 'Q24', 'Q25', 'Q26', 'Q27', 'Q28', 'O12', 'O13', 'O14',
    'Q29', 'Q30', 'Q31', 'Q32', 'Q33', 'Q34', 'Q36', 'Q37', 'Q38', 'Q39', 'Q40', 'Q41', 'Q42', 'Q43', 'Q44', 'Q45',
  ];
  return ids.map((id) => byId[id]).filter(Boolean);
}

// Turn one stored answer into a single readable cell.
export function cell(q, a) {
  if (!a || a.v == null) return '';
  const v = a.v;
  const withOther = (x) => (typeof x === 'string' && x.includes('___') ? `Other: ${a.other || ''}` : x);
  switch (q.type) {
    case 'single': {
      let out = withOther(v);
      if (a.follow) out += ` (${a.follow})`;
      return out;
    }
    case 'multi': return v.map(withOther).join(' | ');
    case 'grid': return Object.entries(v).map(([k, x]) => `${k}=${x}`).join(' | ');
    case 'numbers': return Object.entries(v).map(([k, x]) => `${k}=${x}`).join(' | ');
    case 'multitext': return v.filter(Boolean).join(' | ');
    case 'age': return `age=${v.age}${v.years ? ` | riding=${v.years}` : ''}`;
    case 'ladder': return v.steps.map((s) => `${s.price}:${s.answer}`).join(' | ');
    default: return v;
  }
}

export function answersCsv(responses, lateQuestions) {
  const qs = questionOrder(lateQuestions);
  const completed = responses.filter((r) => r.completedAt && r.status === 'completed');
  const durations = completed.map((r) => (new Date(r.completedAt) - new Date(r.startedAt)) / 1000).sort((a, b) => a - b);
  const median = durations.length ? durations[Math.floor(durations.length / 2)] : 0;

  const head = ['response_id', 'link_id', 'status', 'src', 'device', 'browser', 'started_at', 'updated_at',
    'completed_at', 'duration_s', 'q28_start', 'flags', 'flag_fast'];
  qs.forEach((q) => head.push(q.id, `${q.id}_ts`, `${q.id}_ms`, `${q.id}_order`));

  const rows = responses.map((r) => {
    const dur = r.completedAt ? Math.round((new Date(r.completedAt) - new Date(r.startedAt)) / 1000) : '';
    const fast = r.status === 'completed' && median && dur !== '' && dur < median / 3;
    const base = [r.id, r.linkId, r.status, r.src, r.device, r.browser, r.startedAt, r.updatedAt,
      r.completedAt, dur, r.q28Start, [...(r.flags || []), ...(fast ? ['fast_completion'] : [])].join('|'), fast ? 1 : 0];
    qs.forEach((q) => {
      const a = r.answers?.[q.id];
      base.push(cell(q, a), a?.ts || '', a?.ms ?? '', (r.orders?.[q.id] || []).join(' | '));
    });
    return line(base);
  });
  return [line(head), ...rows].join('\r\n');
}

export function contactsCsv(contacts) {
  const head = ['link_id', 'name', 'phone', 'phone_consent_at', 'email', 'email_consent_at', 'created_at'];
  const rows = contacts.map((c) => line([c.linkId, c.name, c.phone, c.phoneConsentAt, c.email, c.emailConsentAt, c.createdAt]));
  return [line(head), ...rows].join('\r\n');
}
