# ARYS GARAGE rider survey (frontend)

React + Vite + JavaScript + CSS. One question per screen, phone first.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in dist/

Admin page: open `/#/admin`. Default password is `change-me` (set in `src/config.js`).
Link source: `?src=club` is saved with each response.

## Where things are
| Need | File |
|---|---|
| Question wording and options | `src/data/questions.js` (Parts 1-4, owners O1-O11, Part 9), `src/data/part5.js` (Parts 5-8, O12-O14) |
| Branching, screen-outs, Q28 ladder | `src/logic/flow.js` |
| Required rules and format checks | `src/logic/validate.js` |
| P, X, Q28 prices, quotas (defaults) | `src/config.js`, editable at `/#/admin` |
| Flow, resume, saving, flags | `src/Survey.jsx` |
| Storage (localStorage now) | `src/lib/api.js` |
| CSV export | `src/lib/csv.js` |
| Look and feel | `src/styles.css` |

## Connecting a backend
Every storage call goes through `src/lib/api.js`. Replace each function body with a `fetch()`
and keep the names and return shapes. Server-side jobs still needed: one response per phone,
rate limiting, real admin login, serving the Part 5 chunk only after Q17 is saved, and delete on request.

## Placeholders to replace
- P and X per engine class: `src/config.js` or Admin
- Invented brand in Q14: `DECOY_BRAND` in `src/data/questions.js` (currently "Voltaro")
- Admin password
