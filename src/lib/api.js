// Storage layer. Everything here uses localStorage so the frontend works on its own.
// To connect a backend, replace the body of each function with a fetch() call.
// Keep the same function names and return shapes and nothing else needs to change.
import { mergeConfig, SESSION_DAYS } from '../config.js';

const K = {
  progress: 'arys.progress.v1',
  responses: 'arys.responses.v1',
  contacts: 'arys.contacts.v1',
  config: 'arys.config.v1',
  lock: 'arys.device.v1',
};

const read = (k, d) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
};
const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage full or blocked */
  }
};

// ---- Config (admin-editable) ----------------------------------------------
export async function getConfig() {
  return mergeConfig(read(K.config, null));
}
export async function saveConfig(cfg) {
  write(K.config, cfg);
}

// ---- Resume (same device, 7 days) -----------------------------------------
export async function getProgress() {
  const p = read(K.progress, null);
  if (!p) return null;
  const age = Date.now() - (p.savedAt || 0);
  if (age > SESSION_DAYS * 24 * 3600 * 1000) {
    localStorage.removeItem(K.progress);
    return null;
  }
  return p.state;
}
export async function saveProgress(state) {
  write(K.progress, { savedAt: Date.now(), state });
}
export async function clearProgress() {
  localStorage.removeItem(K.progress);
}

// ---- Responses (answers table, anonymous) ---------------------------------
export async function upsertResponse(resp) {
  const list = read(K.responses, []);
  const i = list.findIndex((r) => r.id === resp.id);
  if (i >= 0) list[i] = resp;
  else list.push(resp);
  write(K.responses, list);
}
export async function listResponses() {
  return read(K.responses, []);
}

// ---- Contacts (separate table, linked only by linkId) ---------------------
export async function upsertContact(c) {
  const list = read(K.contacts, []);
  const i = list.findIndex((x) => x.linkId === c.linkId);
  if (i >= 0) list[i] = c;
  else list.push(c);
  write(K.contacts, list);
}
export async function listContacts() {
  return read(K.contacts, []);
}
export async function isPhoneUsed(phone, linkId) {
  return read(K.contacts, []).some((c) => c.phone === phone && c.linkId !== linkId);
}

// ---- One response per device ----------------------------------------------
export async function getDeviceLock() {
  return read(K.lock, null);
}
export async function setDeviceLock(status) {
  write(K.lock, { status, at: new Date().toISOString() });
}
