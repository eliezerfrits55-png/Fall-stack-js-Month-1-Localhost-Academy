const STORAGE_KEY = 'mbeccul_data';

export function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) { console.error('Could not save state:', err); }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
