import { bookingService } from './booking-service.js'
import { auth } from './auth.js'
import { resolveTenant, detectTenantFromHost, ALL_TENANTS } from './config.js'

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  tenant: null,
  bookings: [],
  isLoading: false,
  editingBooking: null,
}

// ── Tenant ─────────────────────────────────────────────────────────────────
function applyTenant(tenant) {
  state.tenant = tenant
  document.title = `My Trips — ${tenant.brandName}`
  document.body.setAttribute('data-theme', tenant.theme)
  const logo = document.getElementById('brand-logo')
  const name = document.getElementById('brand-name')
  if (logo) logo.textContent = tenant.brandLogo
  if (name) name.textContent = tenant.brandName
}

function initTenantPicker() {
  const detected = detectTenantFromHost()
  if (detected) { applyTenant(detected); return }
  const saved = localStorage.getItem('tenant')
  if (saved) { applyTenant(resolveTenant(saved)); return }

  const overlay = document.getElementById('tenant-overlay')
  const list = document.getElementById('tenant-list')
  if (!overlay || !list) { applyTenant(resolveTenant('agenta')); return }

  list.innerHTML = ALL_TENANTS.map(t => `
    <button class="tenant-btn" data-key="${t.key}">
      <span class="tenant-logo">${t.brandLogo}</span>
      <span class="tenant-label">${t.brandName}</span>
    </button>`).join('')

  list.querySelectorAll('.tenant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = resolveTenant(btn.dataset.key)
      localStorage.setItem('tenant', t.key)
      overlay.classList.add('hidden')
      applyTenant(t)
      loadTrips()
    })
  })
  overlay.classList.remove('hidden')
}

// ── Auth UI ────────────────────────────────────────────────────────────────
function updateAuthUI() {
  const userMenu = document.getElementById('user-menu')
  const signInBtn = document.getElementById('sign-in-btn')
  const userEmail = document.getElementById('user-email')

  if (auth.isAuthenticated()) {
    if (userMenu) userMenu.style.display = 'flex'
    if (signInBtn) signInBtn.style.display = 'none'
    if (userEmail) userEmail.textContent = auth.getEmail()
  } else {
    if (userMenu) userMenu.style.display = 'none'
    if (signInBtn) signInBtn.style.display = 'block'
  }
}

function openAuthModal() {
  const modal = document.getElementById('auth-modal')
  if (modal) {
    modal.classList.remove('hidden')
    document.getElementById('auth-email')?.focus()
    const errEl = document.getElementById('auth-error')
    if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden') }
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal')
  if (modal) modal.classList.add('hidden')
}

function _showAuthError(msg) {
  const el = document.getElementById('auth-error')
  if (!el) return
  el.textContent = msg
  el.classList.remove('hidden')
}
function _clearAuthError() {
  const el = document.getElementById('auth-error')
  if (!el) return
  el.textContent = ''
  el.classList.add('hidden')
}

async function handleSignIn(e) {
  e.preventDefault()
  const email = document.getElementById('auth-email')?.value?.trim()
  const password = document.getElementById('auth-password')?.value
  const btn = document.getElementById('auth-submit')

  _clearAuthError()

  if (!email) { _showAuthError('Please enter your email address.'); return }
  if (!password) { _showAuthError('Please enter your password.'); return }

  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…' }

  const result = await auth.signIn(email, password)
  if (btn) { btn.disabled = false; btn.textContent = 'Sign In' }

  if (result.success) {
    closeAuthModal()
    updateAuthUI()
    loadTrips()
  } else {
    _showAuthError(result.error || 'Incorrect email or password. Please try again.')
  }
}

// ── Format helpers ─────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return isNaN(dt) ? String(d) : dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtTime(t) {
  if (!t) return ''
  return String(t).slice(0, 5)
}

function fmtCurrency(n) {
  const v = Number(n)
  if (isNaN(v) || v === 0) return ''
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// ── Render bookings ────────────────────────────────────────────────────────
function reservationStatusClass(startDate) {
  const now = new Date()
  const start = new Date(startDate)
  if (isNaN(start)) return ''
  const diff = start - now
  if (diff < 0) return 'reservation--past'
  if (diff < 1000 * 60 * 60 * 24 * 7) return 'reservation--soon'
  return 'reservation--upcoming'
}

function flightBadgeHTML(f) {
  const stops = Number(f.Stops ?? 0)
  const stopLabel = stops === 0 ? 'Nonstop' : stops === 1 ? '1 Stop' : `${stops} Stops`
  return `
    <div class="reservation-card reservation-card--flight">
      <div class="res-icon">✈️</div>
      <div class="res-body">
        <div class="res-title">${f.Airline_Code ?? ''} ${f.Flight_Number ?? ''}</div>
        <div class="res-detail">
          <span>${f.Origin_Airport_Code ?? '?'}</span>
          <span class="res-arrow">→</span>
          <span>${f.Destination_Airport_Code ?? '?'}</span>
        </div>
        <div class="res-meta">
          ${fmtDate(f.Departure_Date ?? f.departure_date)}
          ${f.Departure_Time ? ' · ' + fmtTime(f.Departure_Time) : ''}
          ${f.Arrive_Time ? ' → ' + fmtTime(f.Arrive_Time) : ''}
          · <span class="stop-badge stop-badge--${stops === 0 ? 'nonstop' : 'stop'}">${stopLabel}</span>
        </div>
        ${f.Rate ? `<div class="res-price">${fmtCurrency(f.Rate)}</div>` : ''}
      </div>
    </div>`
}

function hotelBadgeHTML(h) {
  const petCount = Number(h.Pet_Count ?? h.pet_count ?? 0)
  const petFee = Number(h.Pet_Fee ?? h.pet_fee ?? 0)
  const petType = h.Pet_Type ?? h.pet_type ?? ''
  const hasPet = petCount > 0

  return `
    <div class="reservation-card reservation-card--hotel${hasPet ? ' reservation-card--pet' : ''}">
      <div class="res-icon">🏨</div>
      <div class="res-body">
        <div class="res-title">
          Hotel #${h.Hotel_Code ?? h.hotel_code ?? '?'}
          ${hasPet ? '<span class="pet-pill">🐾 Pet Stay</span>' : ''}
        </div>
        <div class="res-meta">
          ${fmtDate(h.Check_In_Date ?? h.check_in_date)} → ${fmtDate(h.Check_Out_Date ?? h.check_out_date)}
          ${h.Check_In_Time ? ' · Check-in ' + fmtTime(h.Check_In_Time) : ''}
        </div>
        ${h.Rate ? `<div class="res-price">${fmtCurrency(h.Rate)}</div>` : ''}
        ${hasPet ? `<div class="pet-details">🐾 ${petCount} ${petType}${petCount > 1 ? 's' : ''}${petFee ? ' · Pet fee: ' + fmtCurrency(petFee) : ''}</div>` : ''}
      </div>
    </div>`
}

function bookingCardHTML(b) {
  const id = b.bookingId
  const flights = (b.flightReservations || []).map(flightBadgeHTML).join('')
  const hotels = (b.hotelReservations || []).map(hotelBadgeHTML).join('')
  const statusClass = reservationStatusClass(b.startDate)
  const tripLabel = b.tripType === 'ONEWAY' ? 'One-way' : b.tripType === 'HOTEL_ONLY' ? 'Hotel Only' : 'Roundtrip'

  return `
    <div class="booking-card ${statusClass}" data-booking-id="${id}">
      <div class="booking-card__header">
        <div class="booking-meta">
          <span class="booking-id">Booking #${id}</span>
          <span class="booking-dates">${fmtDate(b.startDate)}${b.endDate && b.endDate !== b.startDate ? ' → ' + fmtDate(b.endDate) : ''}</span>
          <span class="booking-dates">${tripLabel} · ${b.adults ?? 1} adult${(b.adults ?? 1) !== 1 ? 's' : ''}${b.children ? ' · ' + b.children + ' child' + (b.children !== 1 ? 'ren' : '') : ''}</span>
        </div>
        <div class="booking-actions">
          <button class="btn btn--sm btn--outline edit-btn" data-id="${id}" title="Edit booking">
            ✏️ Edit
          </button>
          <button class="btn btn--sm btn--danger delete-btn" data-id="${id}" title="Delete booking">
            🗑️ Delete
          </button>
        </div>
      </div>
      <div class="booking-reservations">
        ${flights}
        ${hotels}
        ${!flights && !hotels ? '<p class="no-reservations">No reservation details available.</p>' : ''}
      </div>
    </div>`
}

function renderBookings() {
  const container = document.getElementById('trips-container')
  const emptyState = document.getElementById('empty-state')
  const loadingEl = document.getElementById('trips-loading')

  if (loadingEl) loadingEl.style.display = 'none'

  if (!container) return

  if (state.bookings.length === 0) {
    container.innerHTML = ''
    if (emptyState) emptyState.style.display = 'block'
    return
  }

  if (emptyState) emptyState.style.display = 'none'
  container.innerHTML = state.bookings.map(bookingCardHTML).join('')
  attachCardListeners(container)
}

function attachCardListeners(container) {
  container.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const booking = state.bookings.find(b => String(b.bookingId) === String(btn.dataset.id))
      if (booking) openEditModal(booking)
    })
  })

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => confirmDelete(btn.dataset.id))
  })
}

function openEditModal(booking) {
  state.editingBooking = booking

  const firstFlight = (booking.flightReservations || [])[0]
  const firstHotel = (booking.hotelReservations || [])[0]
  const hasPets = firstHotel ? Number(firstHotel.Pet_Count ?? 0) > 0 : false

  document.getElementById('edit-trip-type').value = booking.tripType || 'ROUNDTRIP'
  document.getElementById('edit-origin').value = firstFlight?.Origin_Airport_Code ?? ''
  document.getElementById('edit-destination').value = firstFlight?.Destination_Airport_Code ?? ''
  document.getElementById('edit-depart-date').value = booking.startDate || ''
  document.getElementById('edit-return-date').value = booking.endDate || ''
  document.getElementById('edit-adults').value = booking.adults ?? 1
  document.getElementById('edit-children').value = booking.children ?? 0
  document.getElementById('edit-pets').value = hasPets ? 'yes' : 'no'
  document.getElementById('edit-pet-type').value = firstHotel?.Pet_Type ?? 'dog'
  document.getElementById('edit-pet-count').value = firstHotel?.Pet_Count ?? 1
  document.getElementById('edit-pet-fields').classList.toggle('hidden', !hasPets)

  const errEl = document.getElementById('edit-error')
  errEl.textContent = ''; errEl.classList.add('hidden')

  document.getElementById('edit-modal').classList.remove('hidden')
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden')
  state.editingBooking = null
}

async function saveEditModal(e) {
  e.preventDefault()
  const b = state.editingBooking
  if (!b) return

  const tripType = document.getElementById('edit-trip-type').value
  const origin = document.getElementById('edit-origin').value.trim()
  const destination = document.getElementById('edit-destination').value.trim()
  const departDate = document.getElementById('edit-depart-date').value
  const returnDate = document.getElementById('edit-return-date').value
  const adults = Number(document.getElementById('edit-adults').value) || 1
  const children = Number(document.getElementById('edit-children').value) || 0
  const hasPets = document.getElementById('edit-pets').value === 'yes'
  const petType = document.getElementById('edit-pet-type').value
  const petCount = hasPets ? (Number(document.getElementById('edit-pet-count').value) || 1) : 0

  const saveBtn = document.getElementById('edit-save')
  const errEl = document.getElementById('edit-error')
  saveBtn.disabled = true; saveBtn.textContent = 'Saving…'
  errEl.classList.add('hidden')

  try {
    await bookingService.updateBooking(b.bookingId, {
      startDate: departDate, endDate: returnDate || departDate, adults, children, tripType,
    })

    const flights = b.flightReservations || []
    if (flights[0]) {
      await bookingService.updateFlightReservation(b.bookingId, flights[0].Reservation_No, {
        origin, destination, departureDate: departDate,
      })
    }
    if (flights[1]) {
      // Return flight: reversed route, departs on return date
      await bookingService.updateFlightReservation(b.bookingId, flights[1].Reservation_No, {
        origin: destination, destination: origin, departureDate: returnDate || departDate,
      })
    }

    for (const h of (b.hotelReservations || [])) {
      await bookingService.updateHotelReservation(b.bookingId, h.Reservation_No, {
        checkIn: departDate, checkOut: returnDate || departDate,
        petCount, petType: hasPets ? petType : '',
      })
    }

    // Update local state so re-render reflects changes immediately
    const local = state.bookings.find(bk => String(bk.bookingId) === String(b.bookingId))
    if (local) {
      local.startDate = departDate; local.endDate = returnDate || departDate
      local.adults = adults; local.children = children; local.tripType = tripType
    }

    closeEditModal()
    renderBookings()
    showToast('Booking updated successfully.')
  } catch (err) {
    errEl.textContent = 'Failed to save: ' + (err.message || 'Unknown error')
    errEl.classList.remove('hidden')
    saveBtn.disabled = false; saveBtn.textContent = 'Save Changes'
  }
}

async function confirmDelete(id) {
  if (!confirm(`Delete booking #${id}? This cannot be undone.`)) return

  try {
    await bookingService.deleteBooking(id)
    state.bookings = state.bookings.filter(b => String(b.bookingId) !== String(id))
    renderBookings()
    showToast('Booking deleted.')
  } catch (err) {
    showToast('Failed to delete: ' + (err.message || 'Unknown error'), 'error')
  }
}

// ── Load trips ─────────────────────────────────────────────────────────────
async function loadTrips() {
  if (!auth.isAuthenticated()) {
    const container = document.getElementById('trips-container')
    const emptyState = document.getElementById('empty-state')
    const loadingEl = document.getElementById('trips-loading')
    if (loadingEl) loadingEl.style.display = 'none'
    if (container) container.innerHTML = ''
    if (emptyState) {
      emptyState.style.display = 'block'
      emptyState.innerHTML = `
        <div class="empty-icon">🔐</div>
        <h3>Sign in to view your trips</h3>
        <p>Your saved bookings will appear here.</p>
        <button class="btn btn--primary" id="empty-sign-in-btn">Sign In</button>`
      emptyState.querySelector('#empty-sign-in-btn')?.addEventListener('click', openAuthModal)
    }
    return
  }

  const loadingEl = document.getElementById('trips-loading')
  const container = document.getElementById('trips-container')
  const emptyState = document.getElementById('empty-state')
  if (loadingEl) loadingEl.style.display = 'block'
  if (container) container.innerHTML = ''
  if (emptyState) emptyState.style.display = 'none'

  try {
    state.bookings = await bookingService.listBookings(
      auth.getUserId(),
      state.tenant?.agentId
    )
    renderBookings()
  } catch (err) {
    if (loadingEl) loadingEl.style.display = 'none'
    if (container) {
      container.innerHTML = `<div class="error-banner">Failed to load trips: ${err.message || 'Unknown error'}</div>`
    }
  }
}

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'toast'
    document.body.appendChild(toast)
  }
  toast.textContent = message
  toast.className = `toast toast--${type} toast--visible`
  clearTimeout(toast._timer)
  toast._timer = setTimeout(() => toast.classList.remove('toast--visible'), 3500)
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTenantPicker()
  updateAuthUI()

  // Nav links
  document.getElementById('sign-in-btn')?.addEventListener('click', openAuthModal)
  document.getElementById('sign-out-btn')?.addEventListener('click', () => {
    auth.signOut()
    updateAuthUI()
    loadTrips()
  })
  document.getElementById('home-link')?.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = 'index.html'
  })

  // Auth modal
  document.getElementById('auth-close')?.addEventListener('click', closeAuthModal)
  document.getElementById('auth-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAuthModal()
  })
  document.getElementById('auth-form')?.addEventListener('submit', handleSignIn)

  // Edit modal
  document.getElementById('edit-cancel')?.addEventListener('click', closeEditModal)
  document.getElementById('edit-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeEditModal()
  })
  document.getElementById('edit-form')?.addEventListener('submit', saveEditModal)
  document.getElementById('edit-pets')?.addEventListener('change', (e) => {
    document.getElementById('edit-pet-fields').classList.toggle('hidden', e.target.value !== 'yes')
  })

  if (auth.isAuthenticated()) loadTrips()
  else loadTrips() // will show sign-in prompt
})
