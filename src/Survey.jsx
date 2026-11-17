import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from './lib/api.js';
import { deviceInfo, nowIso, pick, uid } from './lib/utils.js';
import { LATE, getQuestion, registerLate } from './data/questions.js';
import {
  buildPath, ladderNext, makeOptionOrder, makeRowOrder, screenOutFor,
} from './logic/flow.js';
import { normalisePhone } from './logic/validate.js';
import { formatNum } from './config.js';
import Intro from './components/Intro.jsx';
import IdeaPage from './components/IdeaPage.jsx';
import QuestionScreen from './components/QuestionScreen.jsx';
import { AlreadyTaken, Closed, ScreenedOut, Thanks } from './components/EndScreens.jsx';

const LATE_START = 'IDEA';
const LOCKED_BACK = new Set(['IDEA', 'Q18']); // Part 5 is a one-way door
const CONTACT_IDS = new Set(['Q40', 'Q44', 'Q45']);

// ---- helpers ---------------------------------------------------------------
function newState(cfg) {
  const { device, browser } = deviceInfo();
  const src = new URLSearchParams(window.location.search).get('src') || '';
  const t = nowIso();
  return {
    id: uid(),
    linkId: uid(),
    status: 'started',
    src, device, browser,
    startedAt: t, updatedAt: t, completedAt: null,
    answers: {}, orders: {}, flags: [],
    q28Start: pick(cfg.q28Starts),
    cfg: { price: cfg.price, range: cfg.range, q28Ladder: cfg.q28Ladder },
    unlocked: false,
    current: 'Q1',
  };
}

const ctxOf = (s) => {
  const eng = s.answers.Q2?.v;
  return {
    P: eng ? formatNum(s.cfg.price[eng]) : '',
    X: eng ? s.cfg.range[eng] : '',
    ladder: s.cfg.q28Ladder,
  };
};

// What goes to the answers table. Contact values (Q40, Q44, Q45) never go in it.
function toResponse(s) {
  const answers = {};
  for (const [id, a] of Object.entries(s.answers)) {
    answers[id] = CONTACT_IDS.has(id)
      ? { v: String(a.v || '').trim() ? 'provided' : 'skipped', ts: a.ts, ms: a.ms }
      : a;
  }
  return {
    id: s.id, linkId: s.linkId, status: s.status, src: s.src, device: s.device, browser: s.browser,
    startedAt: s.startedAt, updatedAt: s.updatedAt, completedAt: s.completedAt,
    q28Start: s.q28Start, flags: s.flags, answers, orders: s.orders,
  };
}

function toContact(s) {
  const a = s.answers;
  const phone = a.Q44?.consentAt ? normalisePhone(a.Q44?.v) : null;
  const email = a.Q45?.consentAt && a.Q45?.v ? String(a.Q45.v).trim() : null;
  const name = String(a.Q40?.v || '').trim();
  if (!phone && !email && !name) return null;
  return {
    linkId: s.linkId, name, phone, phoneConsentAt: phone ? a.Q44.consentAt : null,
    email, emailConsentAt: email ? a.Q45.consentAt : null, createdAt: s.updatedAt,
  };
}

async function loadLate() {
  if (LATE.ready) return;
  registerLate(await import('./data/part5.js'));
}

function enter(s, id) {
  const q = getQuestion(id);
  let orders = s.orders;
  if (q && !orders[id]) {
    if (q.random && q.options) orders = { ...orders, [id]: makeOptionOrder(q.options) };
    else if (q.type === 'grid' && q.randomRows) orders = { ...orders, [id]: makeRowOrder(q.rows) };
  }
  return { ...s, current: id, orders };
}

function addTime(s, id, startedAt) {
  const ms = Date.now() - startedAt;
  const prev = s.answers[id] || {};
  return { ...s, answers: { ...s.answers, [id]: { ...prev, ms: (prev.ms || 0) + ms } } };
}

function popLadder(s) {
  const a = s.answers.Q28;
  if (!a?.v?.steps?.length) return s;
  return { ...s, answers: { ...s.answers, Q28: { ...a, v: { ...a.v, steps: a.v.steps.slice(0, -1) } } } };
}

// ---- component -------------------------------------------------------------
export default function Survey() {
  const [cfg, setCfg] = useState(null);
  const [view, setView] = useState('LOADING'); // LOADING | INTRO | SURVEY | OUT | THANKS | TAKEN | CLOSED
  const [s, setS] = useState(null);
  const [, bump] = useState(0);
  const sRef = useRef(null);
  const t0 = useRef(Date.now());
  const busy = useRef(false);
  const honeypot = useRef(null);

  const commit = useCallback((next, { save = true } = {}) => {
    const withTime = { ...next, updatedAt: nowIso() };
    sRef.current = withTime;
    setS(withTime);
    if (save) {
      api.saveProgress(withTime);
      api.upsertResponse(toResponse(withTime));
      const c = toContact(withTime);
      if (c) api.upsertContact(c);
    }
    return withTime;
  }, []);

  // First load: config, device lock, saved progress
  useEffect(() => {
    (async () => {
      const [c, lock, saved] = await Promise.all([api.getConfig(), api.getDeviceLock(), api.getProgress()]);
      setCfg(c);
      if (lock) { setView('TAKEN'); return; }
      if (c.status !== 'open') { setView('CLOSED'); return; }
      if (saved && saved.status !== 'completed' && saved.status !== 'screened_out') {
        if (saved.unlocked) { await loadLate(); }
        sRef.current = saved;
        setS(saved);
      }
      setView('INTRO');
    })();
  }, []);

  const start = () => {
    if (s) {
      // resume
      t0.current = Date.now();
      const cur = s.current;
      setView('SURVEY');
      commit(enter(s, cur), { save: false });
      return;
    }
    let st = newState(cfg);
    if (honeypot.current?.value) st = { ...st, flags: [...st.flags, 'honeypot'] };
    t0.current = Date.now();
    setView('SURVEY');
    commit(enter(st, 'Q1'));
  };

  const onChange = (patch, { auto = false } = {}) => {
    const st = sRef.current;
    const id = st.current;
    const prev = st.answers[id] || {};
    const merged = { ...prev, ...patch, ts: nowIso() };
    const next = { ...st, answers: { ...st.answers, [id]: merged } };
    commit(next, { save: false });
    if (auto) {
      const q = getQuestion(id);
      const ok = q.type !== 'ladder' || ladderNext(next.answers.Q28.v.start, next.answers.Q28.v.steps, next.cfg.q28Ladder) === null;
      if (ok && !busy.current) {
        busy.current = true;
        setTimeout(() => { busy.current = false; advance(); }, 220);
      }
    }
  };

  const finish = (st, status) => {
    const done = { ...st, status, completedAt: nowIso() };
    commit(done);
    api.setDeviceLock(status);
    api.clearProgress();
  };

  async function advance() {
    let st = sRef.current;
    const id = st.current;
    const q = getQuestion(id);
    st = addTime(st, id, t0.current);
    const a = st.answers[id];
    if (st.status === 'started') st = { ...st, status: 'partial' };

    // Flags: flag, do not block
    const flags = new Set(st.flags);
    if (id === 'Q8' && a?.v?.[q.attentionRow] !== 'Agree') flags.add('attention_fail');
    if (id === 'Q14' && a?.v?.[q.decoyRow] && a.v[q.decoyRow] !== 'Never heard') flags.add('false_claim');
    st = { ...st, flags: [...flags] };

    // Screen-outs
    if (screenOutFor(id, a?.v)) {
      finish(st, 'screened_out');
      setView('OUT');
      return;
    }

    // One response per phone number
    if (id === 'Q44' && a?.consentAt && normalisePhone(a.v)) {
      if (await api.isPhoneUsed(normalisePhone(a.v), st.linkId)) {
        commit({ ...st, flags: [...st.flags, 'duplicate_phone'] });
        setView('TAKEN');
        return;
      }
    }

    const path = buildPath(st.answers);
    const nextId = path[path.indexOf(id) + 1];

    if (!nextId) {
      finish(st, 'completed');
      setView('THANKS');
      return;
    }

    // Save Q17 before Part 5 is revealed, then fetch Part 5
    if (nextId === LATE_START) {
      commit(st);
      await loadLate();
      st = { ...sRef.current, unlocked: true };
      bump((n) => n + 1);
    }

    t0.current = Date.now();
    st = enter(st, nextId);
    if (nextId === 'Q28' && !st.answers.Q28) {
      st = { ...st, answers: { ...st.answers, Q28: { v: { start: st.q28Start, steps: [] }, ts: nowIso() } } };
    }
    commit(st);
  }

  const goBack = () => {
    let st = sRef.current;
    const id = st.current;
    if (LOCKED_BACK.has(id)) return;
    if (id === 'Q28' && st.answers.Q28?.v?.steps?.length) {
      commit(popLadder(st), { save: false });
      return;
    }
    const path = buildPath(st.answers);
    const i = path.indexOf(id);
    if (i <= 0) { setView('INTRO'); commit(st); return; }
    const prev = path[i - 1];
    if (prev === LATE_START) return;
    st = addTime(st, id, t0.current);
    if (prev === 'Q28') st = popLadder(st);
    t0.current = Date.now();
    commit(enter(st, prev), { save: false });
  };

  // ---- render --------------------------------------------------------------
  if (view === 'LOADING') return <main className="screen" />;
  if (view === 'TAKEN') return <AlreadyTaken />;
  if (view === 'CLOSED') return <Closed />;
  if (view === 'OUT') return <ScreenedOut />;
  if (view === 'THANKS') return <Thanks />;
  if (view === 'INTRO') {
    return <Intro resumable={!!s && s.status !== 'started'} onStart={start} honeypotRef={honeypot} />;
  }

  if (!s) return null;
  if (s.current === LATE_START) {
    return (
      <IdeaPage
        onContinue={() => {
          let st = sRef.current;
          const path = buildPath(st.answers);
          t0.current = Date.now();
          st = enter(st, path[path.indexOf(LATE_START) + 1]);
          commit(st);
        }}
      />
    );
  }

  const q = getQuestion(s.current);
  if (!q) return null;
  const path = buildPath(s.answers);
  const idx = path.indexOf(s.current);
  const ctx = ctxOf(s);

  return (
    <QuestionScreen
      q={q}
      ans={s.answers[q.id]}
      order={s.orders[q.id]}
      ctx={ctx}
      ladderStart={s.q28Start}
      progress={(idx + 1) / path.length}
      canBack={!LOCKED_BACK.has(s.current)}
      onBack={goBack}
      onChange={onChange}
      onNext={advance}
    />
  );
}
