const PREFIX = 'allfix_';

function isAvailable() {
  try {
    const k = '__test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

function getKey(key) {
  return `${PREFIX}${key}`;
}

function get(key) {
  try {
    return localStorage.getItem(getKey(key));
  } catch {
    return null;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(getKey(key), value);
    return true;
  } catch {
    return false;
  }
}

function remove(key) {
  try {
    localStorage.removeItem(getKey(key));
    return true;
  } catch {
    return false;
  }
}

function getJSON(key) {
  try {
    const raw = get(key);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed._expiry) {
      if (Date.now() > parsed._expiry) {
        remove(key);
        return null;
      }
      delete parsed._expiry;
      return parsed;
    }
    return parsed;
  } catch {
    return null;
  }
}

function setJSON(key, value, ttlMs) {
  try {
    const data = ttlMs ? { ...value, _expiry: Date.now() + ttlMs } : value;
    return set(key, JSON.stringify(data));
  } catch {
    return false;
  }
}

function clear() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    return true;
  } catch {
    return false;
  }
}

function listen(key, callback) {
  const handler = (e) => {
    if (e.key === getKey(key) || e.key === null) {
      callback(e.newValue, e.oldValue);
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

const storage = { isAvailable, get, set, remove, getJSON, setJSON, clear, listen };
export default storage;

export const KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  CURRENCY: 'currency',
};
