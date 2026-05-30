// ============================
//  SafeHer — Main JS
// ============================

const API_BASE = 'http://localhost:8000/api';

// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const actions = document.querySelector('.nav-actions');
  if (links) links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  if (actions) actions.style.display = actions.style.display === 'flex' ? 'none' : 'flex';
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.feature-card, .resource-card, .stat-card').forEach(el => observer.observe(el));

// ============================
//  Auth Helpers
// ============================
function getToken() { return localStorage.getItem('safeher_token'); }
function setToken(t) { localStorage.setItem('safeher_token', t); }
function clearToken() { localStorage.removeItem('safeher_token'); localStorage.removeItem('safeher_user'); }
function getUser()  { return JSON.parse(localStorage.getItem('safeher_user') || 'null'); }
function setUser(u) { localStorage.setItem('safeher_user', JSON.stringify(u)); }

function authHeader() {
  const t = getToken();
  return t ? { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function showAlert(msg, type = 'success', containerId = 'alert-box') {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(() => box.innerHTML = '', 4000);
}

// ============================
//  Register
// ============================
async function handleRegister(e) {
  e.preventDefault();
  const name     = document.getElementById('name').value;
  const email    = document.getElementById('email').value;
  const phone    = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Creating Account...'; btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();
    if (res.ok) {
      showAlert('✅ Account created! Please login.', 'success');
      setTimeout(() => window.location.href = 'login.html', 1500);
    } else {
      showAlert(data.error || 'Registration failed', 'error');
    }
  } catch { showAlert('Network error. Please try again.', 'error'); }
  finally { btn.textContent = 'Create Account'; btn.disabled = false; }
}

// ============================
//  Login
// ============================
async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Logging in...'; btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token); setUser(data.user);
      showAlert('✅ Welcome back!', 'success');
      setTimeout(() => window.location.href = '../index.html', 1000);
    } else {
      showAlert(data.error || 'Invalid credentials', 'error');
    }
  } catch { showAlert('Network error.', 'error'); }
  finally { btn.textContent = 'Login'; btn.disabled = false; }
}

// ============================
//  Admin Login
// ============================
async function handleAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Authenticating...'; btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/admin/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('safeher_admin_token', data.token);
      localStorage.setItem('safeher_admin', JSON.stringify(data.admin));
      window.location.href = 'admin-dashboard.html';
    } else {
      showAlert(data.error || 'Invalid admin credentials', 'error');
    }
  } catch { showAlert('Network error.', 'error'); }
  finally { btn.textContent = 'Login to Admin'; btn.disabled = false; }
}

// ============================
//  Report Incident
// ============================
async function handleReport(e) {
  e.preventDefault();
  if (!getToken()) { window.location.href = 'login.html'; return; }
  const incidentType = document.getElementById('incident_type').value;
  const description  = document.getElementById('description').value;
  const location     = document.getElementById('location').value;
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Submitting...'; btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/incidents/`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ incident_type: incidentType, description, location })
    });
    const data = await res.json();
    if (res.ok) {
      showAlert('✅ Incident reported successfully. Stay safe.', 'success');
      e.target.reset();
    } else { showAlert(data.error || 'Failed to submit', 'error'); }
  } catch { showAlert('Network error.', 'error'); }
  finally { btn.textContent = 'Submit Report'; btn.disabled = false; }
}

// ============================
//  Add Emergency Contact
// ============================
async function handleAddContact(e) {
  e.preventDefault();
  if (!getToken()) { window.location.href = 'login.html'; return; }
  const name  = document.getElementById('contact_name').value;
  const phone = document.getElementById('contact_phone').value;
  const rel   = document.getElementById('relationship').value;
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Adding...'; btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/contacts/`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ name, phone, relationship: rel })
    });
    const data = await res.json();
    if (res.ok) {
      showAlert('✅ Contact added!', 'success');
      e.target.reset();
      loadContacts();
    } else { showAlert(data.error || 'Failed to add', 'error'); }
  } catch { showAlert('Network error.', 'error'); }
  finally { btn.textContent = 'Add Contact'; btn.disabled = false; }
}

// ============================
//  Load Contacts
// ============================
async function loadContacts() {
  const list = document.getElementById('contacts-list');
  if (!list) return;
  if (!getToken()) { list.innerHTML = '<p style="color:var(--muted)">Please login first.</p>'; return; }
  try {
    const res = await fetch(`${API_BASE}/contacts/`, { headers: authHeader() });
    const data = await res.json();
    if (res.ok && data.length > 0) {
      list.innerHTML = data.map(c => `
        <div class="contact-item" style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;margin-bottom:12px;">
          <div>
            <strong>${c.name}</strong><br>
            <span style="color:var(--muted);font-size:0.85rem">${c.phone} · ${c.relationship}</span>
          </div>
          <button onclick="deleteContact(${c.id})" style="background:rgba(201,24,74,0.2);color:var(--rose);border:none;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:0.8rem;">Remove</button>
        </div>
      `).join('');
    } else { list.innerHTML = '<p style="color:var(--muted);text-align:center;padding:24px;">No contacts yet.</p>'; }
  } catch { list.innerHTML = '<p style="color:var(--rose)">Failed to load contacts.</p>'; }
}

async function deleteContact(id) {
  if (!confirm('Remove this contact?')) return;
  await fetch(`${API_BASE}/contacts/${id}/`, { method: 'DELETE', headers: authHeader() });
  loadContacts();
}

// ============================
//  SOS
// ============================
async function triggerSOS() {
  const btn = document.getElementById('sos-main-btn');
  if (btn) { btn.style.transform = 'scale(0.95)'; setTimeout(() => btn.style.transform = '', 200); }

  const info = document.getElementById('sos-status');
  if (info) info.textContent = '📡 Sending SOS...';

  let lat = null, lng = null;
  try {
    const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
    lat = pos.coords.latitude; lng = pos.coords.longitude;
  } catch { /* use null */ }

  try {
    const res = await fetch(`${API_BASE}/sos/`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ latitude: lat, longitude: lng })
    });
    if (res.ok) {
      if (info) info.textContent = '✅ SOS sent! Contacts & authorities notified.';
      document.getElementById('sos-time')?.classList.remove('hidden');
    } else {
      if (info) info.textContent = '⚠️ SOS sent (not logged in — calling emergency lines)';
    }
  } catch {
    if (info) info.textContent = '📵 Offline — call 112 immediately!';
  }
}

// ============================
//  Countdown timer for SOS page
// ============================
function startCountdown(seconds) {
  const el = document.getElementById('countdown');
  if (!el) return;
  let s = seconds;
  el.textContent = s;
  const t = setInterval(() => {
    s--;
    el.textContent = s;
    if (s <= 0) { clearInterval(t); el.parentElement.textContent = '🚨 Alert Sent!'; }
  }, 1000);
}

// ============================
//  Admin Dashboard Data
// ============================
async function loadAdminDashboard() {
  const token = localStorage.getItem('safeher_admin_token');
  if (!token) { window.location.href = 'admin-login.html'; return; }
  const h = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  try {
    const [statsRes, incRes, sosRes, usersRes] = await Promise.all([
      fetch(`${API_BASE}/admin/stats/`, { headers: h }),
      fetch(`${API_BASE}/admin/incidents/`, { headers: h }),
      fetch(`${API_BASE}/admin/sos/`, { headers: h }),
      fetch(`${API_BASE}/admin/users/`, { headers: h })
    ]);

    if (statsRes.ok) {
      const s = await statsRes.json();
      document.getElementById('stat-users')?.innerText !== undefined && (document.getElementById('stat-users').innerText = s.total_users || 0);
      document.getElementById('stat-incidents')?.innerText !== undefined && (document.getElementById('stat-incidents').innerText = s.total_incidents || 0);
      document.getElementById('stat-sos')?.innerText !== undefined && (document.getElementById('stat-sos').innerText = s.total_sos || 0);
      document.getElementById('stat-resolved')?.innerText !== undefined && (document.getElementById('stat-resolved').innerText = s.resolved || 0);
    }

    if (incRes.ok) {
      const incidents = await incRes.json();
      const tbody = document.getElementById('incidents-table');
      if (tbody) {
        tbody.innerHTML = incidents.slice(0, 10).map(i => `
          <tr>
            <td>${i.id}</td>
            <td>${i.user_name || 'Anonymous'}</td>
            <td>${i.incident_type}</td>
            <td>${i.location || '—'}</td>
            <td>${new Date(i.created_at).toLocaleDateString()}</td>
            <td><span class="badge ${i.status === 'resolved' ? 'badge-green' : i.status === 'urgent' ? 'badge-red' : 'badge-yellow'}">${i.status}</span></td>
          </tr>
        `).join('');
      }
    }

    if (sosRes.ok) {
      const sos = await sosRes.json();
      const sb = document.getElementById('sos-table');
      if (sb) {
        sb.innerHTML = sos.slice(0, 10).map(s => `
          <tr>
            <td>${s.id}</td>
            <td>${s.user_name || 'Unknown'}</td>
            <td>${s.phone || '—'}</td>
            <td>${s.latitude ? s.latitude.toFixed(4) + ', ' + s.longitude.toFixed(4) : '—'}</td>
            <td>${new Date(s.created_at).toLocaleDateString()}</td>
          </tr>
        `).join('');
      }
    }

    if (usersRes.ok) {
      const users = await usersRes.json();
      const ub = document.getElementById('users-table');
      if (ub) {
        ub.innerHTML = users.map(u => `
          <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.phone || '—'}</td>
            <td>${new Date(u.created_at).toLocaleDateString()}</td>
            <td><span class="badge badge-green">Active</span></td>
          </tr>
        `).join('');
      }
    }
  } catch(err) { console.error('Dashboard load error', err); }
}

function adminLogout() {
  localStorage.removeItem('safeher_admin_token');
  localStorage.removeItem('safeher_admin');
  window.location.href = 'admin-login.html';
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  // Attach form handlers
  document.getElementById('register-form')?.addEventListener('submit', handleRegister);
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('admin-login-form')?.addEventListener('submit', handleAdminLogin);
  document.getElementById('report-form')?.addEventListener('submit', handleReport);
  document.getElementById('contact-form')?.addEventListener('submit', handleAddContact);

  // Load contacts page
  if (document.getElementById('contacts-list')) loadContacts();

  // Load admin dashboard
  if (document.getElementById('stat-users') !== undefined && window.location.pathname.includes('admin-dashboard')) loadAdminDashboard();
});
