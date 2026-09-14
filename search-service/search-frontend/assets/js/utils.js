const BASE = 'http://localhost:80/service/search-service';

// ⭐ JWT Token management
function getToken() {
  try {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      console.log('JWT token retrieved successfully');
    } else {
      console.warn('No JWT token found in localStorage');
    }
    return token;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
}

function setToken(token) {
    localStorage.setItem('jwt_token', token);
}

function removeToken() {
    localStorage.removeItem('jwt_token');
}

function isAuthenticated() {
    return getToken() !== null;
}

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
    // ⭐ Get token and add to headers
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
      console.log('🔑 Token added to request');
    } else {
      console.warn('⚠️ No token found - please login first');
    }
    
    res = await fetch(fullURL, { headers });
    
    // Try to parse as JSON, but handle non-JSON responses
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
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

  // ⭐ Handle 401 Unauthorized
  if (res.status === 401) {
    box.innerHTML = `
      <div class="result-meta">
        <span>GET ${fullURL}</span>
        <span class="status-err">401 Unauthorized - Please login</span>
      </div>
      <div class="result-raw">${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}</div>
    `;
    return;
  }

  // ⭐ Handle 403 Forbidden (not admin)
  if (res.status === 403) {
    box.innerHTML = `
      <div class="result-meta">
        <span>GET ${fullURL}</span>
        <span class="status-err">403 Forbidden - Admin access required</span>
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
        <span>GET ${fullURL}</span>
        <span class="${statusClass}">${statusText}</span>
      </div>
      <div class="result-raw">${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}</div>
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
  if (col === 'user_type') {
    return val === 0
      ? '<span class="badge badge-blue">Student</span>'
      : '<span class="badge badge-gray">Admin</span>';
  }
  return String(val);
}

// ⭐ Add login status check on page load
document.addEventListener('DOMContentLoaded', function() {
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
        if (token) {
            logoutBtn.style.display = 'inline-block';
        } else {
            logoutBtn.style.display = 'none';
        }
    }
});

// ⭐ Logout function
function handleLogout() {
    removeToken();
    const statusEl = document.getElementById('auth-status');
    const logoutBtn = document.getElementById('btn-logout');
    
    if (statusEl) {
        statusEl.innerHTML = '❌ Not logged in';
        statusEl.style.color = 'var(--danger)';
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
    
    console.log('🔐 Logged out');
    // Optionally reload the page
    // location.reload();
}

// ⭐ Check if user is admin (for UI purposes)
function isAdmin() {
    try {
        const token = getToken();
        if (!token) return false;
        
        // Decode token to check user_type
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userType === '1' || payload.user_type === '1';
    } catch (e) {
        return false;
    }
}

// ⭐ Get user info from token
function getUserInfo() {
    try {
        const token = getToken();
        if (!token) return null;
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            userId: payload.userId,
            userType: payload.userType || payload.user_type,
            username: payload.sub
        };
    } catch (e) {
        return null;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getToken,
        setToken,
        removeToken,
        isAuthenticated,
        isAdmin,
        getUserInfo,
        callAPI,
        buildQS,
        handleLogout
    };
}