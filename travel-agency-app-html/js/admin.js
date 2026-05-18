import { api } from './api.js'
import { auth } from './auth.js'

// ── Guard: redirect non-admins ─────────────────────────────────────────────
if (!auth.isAuthenticated() || !auth.isAdmin()) {
  window.location.href = 'index.html'
}

// ── State ──────────────────────────────────────────────────────────────────
const state = { users: [], bookings: [], activeTab: 'users' }

// ── DOM helpers ────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id)

// ── Header ─────────────────────────────────────────────────────────────────
function initHeader() {
  const emailEl = $('admin-email')
  if (emailEl) emailEl.textContent = auth.getEmail()
  $('sign-out-btn')?.addEventListener('click', () => {
    auth.signOut()
    window.location.href = 'index.html'
  })
}

// ── Tabs ───────────────────────────────────────────────────────────────────
function switchTab(tab) {
  state.activeTab = tab
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab))
  $('panel-users').classList.toggle('hidden', tab !== 'users')
  $('panel-bookings').classList.toggle('hidden', tab !== 'bookings')
}

// ── Fetch helpers ──────────────────────────────────────────────────────────
async function fetchWithAdmin(endpoint) {
  return api.get(endpoint, {
    admin_email: auth.getEmail(),
    admin_password: getAdminPassword(),
  })
}

function getAdminPassword() {
  return sessionStorage.getItem('admin_pw') || ''
}

// ── Render users ────────────────────────────────────────────────────────────
function renderUsers() {
  const panel = $('panel-users')
  if (!state.users.length) {
    panel.innerHTML = '<p class="state-card">No users found.</p>'
    return
  }
  panel.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          ${state.users.map(u => `
            <tr class="${u.Is_Admin ? 'row--admin' : ''}">
              <td>${u.User_ID}</td>
              <td>${u.First_Name} ${u.Last_Name}</td>
              <td>${u.Email}</td>
              <td>${u.Phone_Number || '—'}</td>
              <td><span class="role-badge role-badge--${u.Is_Admin ? 'admin' : 'user'}">${u.Is_Admin ? '⚙️ Admin' : 'User'}</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="table-meta">${state.users.length} total user${state.users.length !== 1 ? 's' : ''}</p>`
}

// ── Render bookings ─────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return isNaN(dt) ? String(d) : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function renderBookings() {
  const panel = $('panel-bookings')
  if (!state.bookings.length) {
    panel.innerHTML = '<p class="state-card">No bookings found.</p>'
    return
  }
  panel.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Booking #</th>
            <th>User</th>
            <th>Agent</th>
            <th>Start</th>
            <th>End</th>
            <th>Flights</th>
            <th>Hotels</th>
          </tr>
        </thead>
        <tbody>
          ${state.bookings.map(b => `
            <tr>
              <td>${b.Booking_Id}</td>
              <td>${b.user ? `${b.user.First_Name} ${b.user.Last_Name}` : '—'}<br>
                <small style="color:#718096">${b.user?.Email || ''}</small></td>
              <td>${b.Agent_Id ?? '—'}</td>
              <td>${fmtDate(b.Start_Date)}</td>
              <td>${fmtDate(b.End_Date)}</td>
              <td>${(b.flight_reservations || []).length}</td>
              <td>${(b.hotel_reservations || []).length}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="table-meta">${state.bookings.length} total booking${state.bookings.length !== 1 ? 's' : ''}</p>`
}

// ── Load data ──────────────────────────────────────────────────────────────
async function loadData() {
  const pw = sessionStorage.getItem('admin_pw')
  if (!pw) {
    showPasswordPrompt()
    return
  }
  setStatus('Loading…')
  try {
    const [users, bookings] = await Promise.all([
      fetchWithAdmin('/admin/users'),
      fetchWithAdmin('/admin/bookings'),
    ])
    state.users = users
    state.bookings = bookings
    $('user-count').textContent = users.length
    $('booking-count').textContent = bookings.length
    renderUsers()
    renderBookings()
    setStatus('')
  } catch (err) {
    setStatus('Error: ' + (err.message || 'Failed to load data.'), true)
    if (err.message?.includes('401') || err.message?.includes('403')) {
      sessionStorage.removeItem('admin_pw')
      showPasswordPrompt()
    }
  }
}

function setStatus(msg, isError = false) {
  const el = $('status-bar')
  if (!el) return
  el.textContent = msg
  el.className = 'status-bar' + (isError ? ' status-bar--error' : '')
  el.style.display = msg ? 'block' : 'none'
}

function showPasswordPrompt() {
  const modal = $('pw-modal')
  if (modal) {
    modal.style.display = 'flex'
    $('pw-input')?.focus()
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeader()

  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  })

  // Refresh button
  $('refresh-btn')?.addEventListener('click', loadData)

  // Password prompt modal
  $('pw-form')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const pw = $('pw-input').value
    if (!pw) return
    sessionStorage.setItem('admin_pw', pw)
    $('pw-modal').style.display = 'none'
    loadData()
  })
  $('pw-cancel')?.addEventListener('click', () => {
    window.location.href = 'index.html'
  })

  // Check if we already have the password stored
  if (sessionStorage.getItem('admin_pw')) {
    loadData()
  } else {
    showPasswordPrompt()
  }
})
