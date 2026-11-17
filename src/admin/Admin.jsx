import { useEffect, useMemo, useState } from 'react';
import * as api from '../lib/api.js';
import { AGE_BANDS, CITIES, ENGINE_CLASSES, formatNum } from '../config.js';
import { answersCsv, contactsCsv, download } from '../lib/csv.js';
import { PART5_QUESTIONS } from '../data/part5.js';

const ownerLabel = (v) => (v && v !== 'No' ? 'Owners' : 'Non-owners');
const ageBand = (age) => {
  const n = Number(age);
  if (n < 16) return null;
  if (n <= 24) return '16–24';
  if (n <= 34) return '25–34';
  if (n <= 44) return '35–44';
  if (n <= 54) return '45–54';
  return '55–80';
};

function Counts({ title, labels, counts, quotas }) {
  return (
    <div className="a-card">
      <h3>{title}</h3>
      {labels.map((l) => {
        const n = counts[l] || 0;
        const quota = Number(quotas?.[l]) || 0;
        const pct = quota ? Math.min(100, Math.round((n / quota) * 100)) : 0;
        return (
          <div className="a-count" key={l}>
            <span>{l}</span>
            <span>{n} / {quota || '–'}</span>
            <div className="a-bar"><i style={{ width: `${pct}%` }} /></div>
          </div>
        );
      })}
    </div>
  );
}

export default function Admin() {
  const [cfg, setCfg] = useState(null);
  const [authed, setAuthed] = useState(sessionStorage.getItem('arys.admin') === '1');
  const [pw, setPw] = useState('');
  const [bad, setBad] = useState(false);
  const [responses, setResponses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [saved, setSaved] = useState('');

  const refresh = async () => {
    setResponses(await api.listResponses());
    setContacts(await api.listContacts());
  };

  useEffect(() => { api.getConfig().then(setCfg); }, []);
  useEffect(() => { if (authed) refresh(); }, [authed]);

  const stats = useMemo(() => {
    const done = responses.filter((r) => r.status === 'completed');
    const by = (fn) => done.reduce((m, r) => {
      const k = fn(r);
      if (k) m[k] = (m[k] || 0) + 1;
      return m;
    }, {});
    const status = responses.reduce((m, r) => { m[r.status] = (m[r.status] || 0) + 1; return m; }, {});
    return {
      status,
      engine: by((r) => r.answers.Q2?.v),
      city: by((r) => r.answers.Q4?.v),
      owner: by((r) => ownerLabel(r.answers.Q5b?.v)),
      age: by((r) => ageBand(r.answers.Q39?.v?.age)),
      flagged: responses.filter((r) => (r.flags || []).length).length,
    };
  }, [responses]);

  if (!cfg) return <main className="admin" />;

  if (!authed) {
    return (
      <main className="admin login">
        <h1>Admin</h1>
        <input className="a-input" type="password" placeholder="Password" value={pw} autoFocus
          onChange={(e) => { setPw(e.target.value); setBad(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('a-go').click(); }} />
        <button id="a-go" className="a-btn" onClick={() => {
          if (pw === cfg.adminPassword) { sessionStorage.setItem('arys.admin', '1'); setAuthed(true); }
          else setBad(true);
        }}>Sign in</button>
        {bad && <p className="a-note">Wrong password.</p>}
      </main>
    );
  }

  const update = (fn) => setCfg((c) => { const n = structuredClone(c); fn(n); return n; });
  const nums = (str) => str.split(',').map((x) => Number(x.trim().replace(/\D/g, ''))).filter((x) => Number.isFinite(x));

  const save = async () => {
    await api.saveConfig(cfg);
    setSaved('Saved. The next respondent will see these values.');
    setTimeout(() => setSaved(''), 3500);
  };

  return (
    <main className="admin">
      <header className="a-top">
        <h1>ARYS GARAGE · Survey admin</h1>
        <a href="#/" onClick={() => { window.location.hash = ''; }}>Back to survey</a>
      </header>

      <section className="a-card">
        <h2>Survey switch</h2>
        <div className="a-row">
          {['open', 'paused', 'closed'].map((s) => (
            <button key={s} className={`a-chip${cfg.status === s ? ' on' : ''}`}
              onClick={() => update((c) => { c.status = s; })}>{s[0].toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
        <p className="a-note">Paused or closed: new and returning riders see a polite closed page.</p>
      </section>

      <section className="a-card">
        <h2>Price P and range X, per engine class (Q2)</h2>
        <table className="a-table">
          <thead><tr><th>Engine class</th><th>P (Rs)</th><th>X (km)</th></tr></thead>
          <tbody>
            {ENGINE_CLASSES.map((e) => (
              <tr key={e}>
                <td>{e}</td>
                <td><input className="a-input" inputMode="numeric" value={cfg.price[e]}
                  onChange={(ev) => update((c) => { c.price[e] = Number(ev.target.value.replace(/\D/g, '')) || 0; })} /></td>
                <td><input className="a-input" inputMode="numeric" value={cfg.range[e]}
                  onChange={(ev) => update((c) => { c.range[e] = Number(ev.target.value.replace(/\D/g, '')) || 0; })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="a-note">P is shown in Q17 and Q19. X is shown at the top of Part 4.</p>
      </section>

      <section className="a-card">
        <h2>Q28 price ladder</h2>
        <label className="a-label">Random start prices (comma separated, Rs)</label>
        <input className="a-input wide" value={cfg.q28Starts.join(', ')}
          onChange={(e) => update((c) => { c.q28Starts = nums(e.target.value); })} />
        <label className="a-label">All ladder prices, lowest to highest (include 0)</label>
        <input className="a-input wide" value={cfg.q28Ladder.join(', ')}
          onChange={(e) => update((c) => { c.q28Ladder = nums(e.target.value); })} />
        <p className="a-note">Each start price must also be in the ladder list.</p>
      </section>

      <section className="a-card">
        <h2>Quotas</h2>
        {[['engine', 'Engine class (Q2)', ENGINE_CLASSES], ['city', 'City (Q4)', CITIES],
          ['owner', 'Owners (Q5b)', ['Owners', 'Non-owners']], ['age', 'Age band (Q39)', AGE_BANDS]].map(([k, t, labels]) => (
          <div key={k} className="a-quota">
            <h3>{t}</h3>
            {labels.map((l) => (
              <label key={l} className="a-q"><span>{l}</span>
                <input className="a-input small" inputMode="numeric" value={cfg.quotas[k][l]}
                  onChange={(ev) => update((c) => { c.quotas[k][l] = Number(ev.target.value.replace(/\D/g, '')) || 0; })} />
              </label>
            ))}
          </div>
        ))}
      </section>

      <div className="a-save">
        <button className="a-btn" onClick={save}>Save changes</button>
        {saved && <span className="a-note">{saved}</span>}
      </div>

      <section className="a-card">
        <h2>Live counts (completed responses)</h2>
        <p className="a-note">
          Started or partial: {(stats.status.started || 0) + (stats.status.partial || 0)} ·
          Completed: {stats.status.completed || 0} · Screened out: {stats.status.screened_out || 0} ·
          Flagged: {stats.flagged}
        </p>
        <div className="a-grid">
          <Counts title="Engine class (Q2)" labels={ENGINE_CLASSES} counts={stats.engine} quotas={cfg.quotas.engine} />
          <Counts title="City (Q4)" labels={CITIES} counts={stats.city} quotas={cfg.quotas.city} />
          <Counts title="Owners (Q5b)" labels={['Owners', 'Non-owners']} counts={stats.owner} quotas={cfg.quotas.owner} />
          <Counts title="Age band (Q39)" labels={AGE_BANDS} counts={stats.age} quotas={cfg.quotas.age} />
        </div>
        <button className="a-btn ghost" onClick={refresh}>Refresh</button>
      </section>

      <section className="a-card">
        <h2>Export</h2>
        <p className="a-note">Two separate files. The contacts file is for named people only.</p>
        <div className="a-row">
          <button className="a-btn" onClick={() => download(`arys-answers-${Date.now()}.csv`, answersCsv(responses, PART5_QUESTIONS))}>
            Download answers CSV ({formatNum(responses.length)})
          </button>
          <button className="a-btn" onClick={() => download(`arys-contacts-${Date.now()}.csv`, contactsCsv(contacts))}>
            Download contacts CSV ({formatNum(contacts.length)})
          </button>
        </div>
      </section>
    </main>
  );
}
