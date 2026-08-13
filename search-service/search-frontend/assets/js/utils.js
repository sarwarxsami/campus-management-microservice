const BASE = 'http://localhost:3001/service/search-service';

/**
 * Build query string from an object, skipping empty values.
 */
function buildQS(params = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v !== null && v !== undefined) p.set(k, v);
  }
  const s = p.toString();
  return s ? '?' + s : '';
}

/**
 * Fetch a Search Service endpoint and render the result into a container element.
 * @param {string} path  - e.g. '/resources?name=Room'
 * @param {string} containerId - id of the .result-box div
 */
async function callAPI(path, containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;

  const fullURL = BASE + path;

  // Show the result box and loading state
  box.style.display = 'block';
  box.innerHTML = `
    <div class="result-meta">
      <span>GET ${fullURL}</span>
      <span>Loading…</span>
    </div>
    <div class="result-raw">…</div>
  `;

  let res, data;
  try {
    res  = await fetch(fullURL);
    data = await res.json();
  } catch (err) {
    box.innerHTML = `
      <div class="result-meta">
        <span>GET ${fullURL}</span>
        <span class="status-err">Network error</span>
      </div>
      <div class="result-raw">${err.message}</div>
    `;
    return;
  }

  const statusClass = res.ok ? 'status-ok' : 'status-err';
  const statusText  = `${res.status} ${res.statusText}`;

  if (!res.ok) {
    box.innerHTML = `
      <div class="result-meta">
        <span>GET ${fullURL}</span>
        <span class="${statusClass}">${statusText}</span>
      </div>
      <div class="result-raw">${JSON.stringify(data, null, 2)}</div>
    `;
    return;
  }

  // find the first array in the response to tabulate
  let rows = null;
  if (Array.isArray(data)) {
    rows = data;
  } else {
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
      <span>GET ${fullURL}</span>
      <span class="${statusClass}">${statusText} · ${rows ? rows.length + ' row' + (rows.length !== 1 ? 's' : '') : '0 rows'}</span>
    </div>
    ${body}
  `;
}

const STATE_LABELS = { 
  0: ['PENDING','badge-yellow'], 
  1: ['CONFIRMED','badge-green'], 
  2: ['CANCELLED','badge-gray'], 
  3: ['COMPLETED','badge-blue'] 
};

function formatCell(col, val) {
  if (val === null || val === undefined) return '<span style="color:#aaa">—</span>';

  if (col === 'available') {
    return val
      ? '<span class="badge badge-green">Yes</span>'
      : '<span class="badge badge-red">No</span>';
  }
  if (col === 'currentState' && STATE_LABELS[val]) {
    const [label, cls] = STATE_LABELS[val];
    return `<span class="badge ${cls}">${label}</span>`;
  }
  if (col === 'userType') {
    return val === 0
      ? '<span class="badge badge-blue">Student</span>'
      : '<span class="badge badge-gray">Admin</span>';
  }
  return String(val);
}