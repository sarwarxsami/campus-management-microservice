// API Base URL
const API_BASE = 'http://localhost/service/create-service';

// Utility to display results
function displayResult(containerId, data, status) {
    const container = document.getElementById(containerId);
    
    let html = '<div class="result-box">';
    
    // Status badge
    const isSuccess = status >= 200 && status < 300;
    html += `<div class="result-meta">
        <span>Status: ${status}</span>
        <span class="${isSuccess ? 'status-ok' : 'status-err'}">${isSuccess ? '✓ Success' : '✗ Error'}</span>
    </div>`;
    
    // Response data
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

// Get JWT token from localStorage
function getAuthToken() {
    return localStorage.getItem('jwt_token') || localStorage.getItem('token') || null;
}

// Generic POST function with JWT support
async function postRequest(endpoint, body, containerId) {
    const btn = document.querySelector(`#${containerId.replace('result-', 'btn-')}`);
    if (btn) btn.disabled = true;
    
    try {
        const url = `${API_BASE}${endpoint}`;
        console.log('📤 Sending to:', url);
        console.log('📦 Body:', body);
        
        // Prepare headers
        const headers = { 'Content-Type': 'application/json' };
        const token = getAuthToken();
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('🔑 JWT token attached to request');
        } else {
            console.warn('⚠️ No JWT token found in localStorage');
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        
        console.log('📥 Response status:', response.status);
        
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        // Handle unauthorized response
        if (response.status === 401) {
            console.error('🔒 Unauthorized - Token may be expired or invalid');
            // Optional: Redirect to login page
            // window.location.href = '/login.html';
        }
        
        displayResult(containerId, data, response.status);
    } catch (error) {
        console.error('❌ Error:', error);
        displayResult(containerId, { error: error.message }, 500);
    } finally {
        if (btn) btn.disabled = false;
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
    });
});

// ---- Create Resource ----
document.getElementById('btn-resource').addEventListener('click', function() {
    const body = {
        name: document.getElementById('res-name').value,
        type: document.getElementById('res-type').value,
        location_id: parseInt(document.getElementById('res-location').value),
        capacity: parseInt(document.getElementById('res-capacity').value) || null
    };
    postRequest('/resource', body, 'result-resource');
});

// ---- Create Location ----
document.getElementById('btn-location').addEventListener('click', function() {
    const body = {
        name: document.getElementById('loc-name').value
    };
    postRequest('/location', body, 'result-location');
});

// ---- Create Descriptor ----
document.getElementById('btn-descriptor').addEventListener('click', function() {
    const body = {
        description: document.getElementById('desc-desc').value
    };
    postRequest('/descriptor', body, 'result-descriptor');
});

// ---- Link Resource & Descriptor ----
document.getElementById('btn-rd').addEventListener('click', function() {
    const resourceIds = document.getElementById('rd-resources').value
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));
    
    const descriptorIds = document.getElementById('rd-descriptors').value
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));
    
    const body = {
        resourceIds: resourceIds,
        descriptorIds: descriptorIds
    };
    postRequest('/resource-descriptor', body, 'result-rd');
});

// ---- Create Admin ----
document.getElementById('btn-admin').addEventListener('click', function() {
    const body = {
        name: document.getElementById('admin-name').value,
        email: document.getElementById('admin-email').value,
        password: document.getElementById('admin-pass').value,
        user_name: document.getElementById('admin-user').value
    };
    postRequest('/admin', body, 'result-admin');
});

// ---- Create Student ----
document.getElementById('btn-student').addEventListener('click', function() {
    const body = {
        name: document.getElementById('student-name').value,
        email: document.getElementById('student-email').value,
        password: document.getElementById('student-pass').value,
        user_name: document.getElementById('student-user').value
    };
    postRequest('/student', body, 'result-student');
});

// ---- Set JWT Token (Utility function for login) ----
// Add this function to set token after login
function setAuthToken(token) {
    localStorage.setItem('jwt_token', token);
    console.log('✅ JWT token saved to localStorage');
}

// ---- Clear JWT Token (Utility function for logout) ----
function clearAuthToken() {
    localStorage.removeItem('jwt_token');
    console.log('🗑️ JWT token removed from localStorage');
}

// ---- Check if token exists on page load ----
(function checkTokenOnLoad() {
    const token = getAuthToken();
    if (token) {
        console.log('🔑 JWT token found on page load');
        // Optionally display token status in UI
        const statusEl = document.createElement('div');
        statusEl.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 10px; background: #4CAF50; color: white; border-radius: 5px; font-size: 12px; z-index: 9999;';
        statusEl.textContent = '🔒 Authenticated';
        document.body.appendChild(statusEl);
    } else {
        console.log('🔓 No JWT token found');
    }
})();

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

console.log('✅ Create Service Frontend loaded!');
console.log('📡 API Base URL:', API_BASE);
console.log('🔑 Token support:', getAuthToken() ? 'Token found' : 'No token found');