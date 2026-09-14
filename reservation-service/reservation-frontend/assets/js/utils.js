// Reservation Service frontend utilities.

const BASE = 'http://localhost:80/service/reservation-service';

// ── Token management ────────────────────────────────────────
function getToken() {
  try {
    const t = localStorage.getItem('jwt_token');
    if (t) console.log('JWT token retrieved');
    else console.warn('No JWT token found');
    return t;
  } catch (e) {
    console.error('Error accessing localStorage:', e);
    return null;
  }
}

function setToken(token) { localStorage.setItem('jwt_token', token); }
function removeToken()   { localStorage.removeItem('jwt_token'); }
function isAuthenticated() { return getToken() !== null; }

// ── URL helpers ─────────────────────────────────────────────
function buildQS(params = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v !== null && v !== undefined) p.set(k, v);
  }
  const s = p.toString();
  return s ? '?' + s : '';
}

// ── Core API caller ─────────────────────────────────────────
/**
 * Call an endpoint on the reservation service.
 * @param {string} path         - e.g. '/search/location?locationId=1'
 * @param {string} containerId  - id of the .result-box element
 * @param {object} [options]    - fetch options; method/body are merged
 */
async function callAPI(path, containerId, options = {}) {
  const box = document.getElementById(containerId);
  if (!box) return;

  const fullURL = BASE + path;
  const method  = (options.method || 'GET').toUpperCase();

  box.style.display = 'block';
  box.innerHTML = `
    <div class="result-meta">
      <span>${method} ${fullURL}</span>
      <span>Loading…</span>
    </div>
    <div class="result-raw">…</div>
  `;

  let res, data;
  try {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    res = await fetch(fullURL, {
      method,
      headers,
      body: options.body || undefined
    });

    const ct = res.headers.get('content-type') || '';
    data = ct.includes('application/json') ? await res.json() : await res.text();
  } catch (err) {
    box.innerHTML = `
      <div class="result-meta">
        <span>${method} ${fullURL}</span>
        <span class="status-err">Network error</span>
      </div>
      <div class="result-raw">${err.message}</div>
    `;
    return;
  }

  // Auth errors
  if (res.status === 401) {
    box.innerHTML = `
      <div class="result-meta">
        <span>${method} ${fullURL}</span>
        <span class="status-err">401 Unauthorized</span>
      </div>
      <div class="result-raw">${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}</div>
    `;
    return;
  }
  if (res.status === 403) {
    box.innerHTML = `
      <div class="result-meta">
        <span>${method} ${fullURL}</span>
        <span class="status-err">403 Forbidden</span>
      </div>
      <div class="result-raw">${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}</div>
    `;
    return;
  }

  const statusClass = res.ok ? 'status-ok' : 'status-err';
  const statusText  = `${res.status} ${res.statusText}`;

  if (!res.ok) {
    box.innerHTML = `
      <div class="result-meta">
        <span>${method} ${fullURL}</span>
        <span class="${statusClass}">${statusText}</span>
      </div>
      <div class="result-raw">${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}</div>
    `;
    return;
  }

  // If the response is a single object (POST transition response), render as JSON.
  if (data && !Array.isArray(data) && typeof data === 'object') {
    box.innerHTML = `
      <div class="result-meta">
        <span>${method} ${fullURL}</span>
        <span class="${statusClass}">${statusText}</span>
      </div>
      <div class="result-raw">${JSON.stringify(data, null, 2)}</div>
    `;
    return;
  }

  // Array response — render as table
  let rows = null;
  if (Array.isArray(data)) {
    rows = data;
  } else if (data && typeof data === 'object') {
    for (const v of Object.values(data)) {
      if (Array.isArray(v)) { rows = v; break; }
    }
  }

  let body;
  if (!rows || rows.length === 0) {
    body = `<div class="result-empty">No results returned.</div>`;
  } else {
    const cols = Object.keys(rows[0]);
    const headerCells = cols.map(c => `<th>${c}</th>`).join('');
    const bodyRows = rows.map(row => {
      const cells = cols.map(c => `<td>${formatCell(c, row[c])}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    body = `
      <div class="result-table-wrap">
        <table>
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    `;
  }

  box.innerHTML = `
    <div class="result-meta">
      <span>${method} ${fullURL}</span>
      <span class="${statusClass}">${statusText} · ${rows ? rows.length + ' row' + (rows.length !== 1 ? 's' : '') : '0 rows'}</span>
    </div>
    ${body}
  `;
}

// ── Cell formatting ─────────────────────────────────────────
const STATE_LABELS = {
  0: ['PENDING',   'badge-yellow'],
  1: ['CONFIRMED', 'badge-green'],
  2: ['CANCELLED', 'badge-gray'],
  3: ['COMPLETED', 'badge-blue']
};

function formatCell(col, val) {
  if (val === null || val === undefined) return '<span style="color:#aaa">—</span>';

  if (col === 'currentState' && STATE_LABELS[val] !== undefined) {
    const [label, cls] = STATE_LABELS[val];
    return `<span class="badge ${cls}">${label}</span>`;
  }
  return String(val);
}

// ── Auth UI ─────────────────────────────────────────────────
function updateAuthUI() {
  const token = getToken();
  const statusEl = document.getElementById('auth-status');
  const logoutBtn = document.getElementById('btn-logout');

  if (statusEl) {
    if (token) {
      statusEl.innerHTML = '✅ Logged in';
      statusEl.style.color = 'var(--ok)';
    } else {
      statusEl.innerHTML = '❌ Not logged in';
      statusEl.style.color = 'var(--danger)';
    }
  }
  if (logoutBtn) {
    logoutBtn.style.display = token ? 'inline-block' : 'none';
  }
}

function handleLogout() {
  removeToken();
  updateAuthUI();
  console.log('🔐 Logged out');
}

// ── Boot ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
});