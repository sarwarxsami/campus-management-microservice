// API Base URL
const API_BASE = 'http://localhost/service/login-service';

// JWT Token management
function getToken() {
    return localStorage.getItem('jwt_token');
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

// Display result function
function displayResult(containerId, data, status) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '<div class="result-box">';
    
    const isSuccess = status >= 200 && status < 300;
    html += `<div class="result-meta">
        <span>Status: ${status}</span>
        <span class="${isSuccess ? 'status-ok' : 'status-err'}">${isSuccess ? '✓ Success' : '✗ Error'}</span>
    </div>`;
    
    if (data) {
        if (typeof data === 'object') {
            html += `<div class="result-raw">${JSON.stringify(data, null, 2)}</div>`;
        } else {
            html += `<div class="result-raw">${data}</div>`;
        }
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Login function
async function handleLogin(username, password) {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_name: username, password: password })
        });
        
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        if (response.ok && data.token) {
            setToken(data.token);
            return { success: true, data, status: response.status };
        } else {
            return { success: false, data, status: response.status };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, data: { error: error.message }, status: 500 };
    }
}

// Logout function
function handleLogout() {
    removeToken();
    updateAuthUI();
    return { success: true };
}

// Update UI based on auth status
function updateAuthUI() {
    const token = getToken();
    const statusEl = document.getElementById('auth-status');
    const tokenDisplay = document.getElementById('token-display');
    
    if (statusEl) {
        if (token) {
            statusEl.innerHTML = '<span class="badge badge-green">✅ Logged in</span>';
        } else {
            statusEl.innerHTML = '<span class="badge badge-gray">❌ Not logged in</span>';
        }
    }
    
    if (tokenDisplay) {
        if (token) {
            tokenDisplay.textContent = token.substring(0, 50) + '...';
            tokenDisplay.style.color = 'var(--ok)';
        } else {
            tokenDisplay.textContent = 'None';
            tokenDisplay.style.color = 'var(--muted)';
        }
    }
}

// ---- Tab Navigation ----
document.querySelectorAll('nav a[data-tab]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        
        const tab = this.dataset.tab;
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
        
        // Update UI when switching to logout tab
        if (tab === 'logout') {
            updateAuthUI();
        }
    });
});

// ---- Login ----
document.getElementById('btn-login').addEventListener('click', async function() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        displayResult('result-login', { error: 'Username and password are required' }, 400);
        return;
    }
    
    this.disabled = true;
    
    const result = await handleLogin(username, password);
    
    this.disabled = false;
    
    if (result.success) {
        displayResult('result-login', {
            message: 'Login successful!',
            token: result.data.token.substring(0, 30) + '...'
        }, result.status);
        
        // Update auth UI
        updateAuthUI();
        
        // Auto-switch to logout tab
        document.querySelector('nav a[data-tab="logout"]')?.click();
    } else {
        displayResult('result-login', result.data, result.status);
    }
});

// ---- Logout ----
document.getElementById('btn-logout').addEventListener('click', function() {
    const result = handleLogout();
    
    if (result.success) {
        displayResult('result-logout', { message: 'Logged out successfully' }, 200);
        updateAuthUI();
    }
});

// ---- Enter key support ----
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const panel = this.closest('.panel');
            if (panel) {
                const btn = panel.querySelector('.btn-primary');
                if (btn) btn.click();
            }
        }
    });
});

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // If already logged in, show token in logout tab
    if (isAuthenticated()) {
        console.log('✅ Already logged in');
    }
});

console.log('🔐 Login Service Frontend loaded!');
console.log('📡 API Base URL:', API_BASE);