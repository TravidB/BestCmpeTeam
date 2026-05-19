import { detectTenantFromHost, resolveTenant, ALL_TENANTS } from './config.js'
import { auth } from './auth.js'
import { hotelService } from './hotel-service.js'
import { flightService } from './flight-service.js'
import { bookingService } from './booking-service.js'
import { attractionService, getCityCoords } from './attraction-service.js'

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  tenant: null,
  params: { tripType: 'ROUNDTRIP', origin: '', destination: '', fromDate: '', toDate: '', adults: 1, children: 0, travelingWithPets: false, petCount: 1, petType: 'dog' },
  results: { flights: [], returnFlights: [], hotels: [], activities: [] },
  sel: { flight: null, returnFlight: null, hotel: null },
  activeTab: 'flights',
  hasSearched: false,
  bookingResult: null,
  bookingError: '',
  isBooking: false,
}

let _attractionMap = null

// ── DOM helpers ────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id)
const show = (el) => el && el.classList.remove('hidden')
const hide = (el) => el && el.classList.add('hidden')
const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)
const fmt = (n) => Number(n || 0).toLocaleString()

const PALETTES = [
  ['#1a365d','#2c5282'],['#276749','#2f855a'],['#744210','#975a16'],
  ['#553c9a','#6b46c1'],['#2c7a7b','#285e61'],
]

// ── Tenant ─────────────────────────────────────────────────────────────────
function setTenant(tenant) {
  state.tenant = tenant
  localStorage.setItem('tenant', tenant.key)
  document.documentElement.setAttribute('data-theme', tenant.theme)
  $('brand-logo').textContent = tenant.brandLogo
  $('brand-name').textContent = tenant.brandName
  $('tenant-badge').textContent = `Agent ${tenant.agentId}`
  hide($('tenant-overlay'))
}

function initTenantPicker() {
  const grid = $('tenant-grid')
  ALL_TENANTS.forEach((t) => {
    const btn = document.createElement('button')
    btn.className = 'tenant-btn'
    btn.innerHTML = `<span class="logo">${t.brandLogo}</span><div class="t-name">${t.brandName}</div><div class="t-id">Agent ${t.agentId}</div>`
    btn.addEventListener('click', () => setTenant(t))
    grid.appendChild(btn)
  })
  show($('tenant-overlay'))
}

// ── Auth UI ────────────────────────────────────────────────────────────────
function updateAuthUI() {
  const loggedIn = auth.isAuthenticated()
  const email = auth.getEmail()
  if (loggedIn) {
    $('btn-signin').textContent = 'Sign Out'
    $('user-badge').textContent = email || `User ${auth.getUserId()}`
    show($('user-badge'))
    show($('trips-nav-btn'))
    hide($('signed-in-badge-empty'))
    const adminLink = $('admin-nav-btn')
    if (adminLink) auth.isAdmin() ? show(adminLink) : hide(adminLink)
  } else {
    $('btn-signin').textContent = 'Sign In'
    hide($('user-badge'))
    hide($('trips-nav-btn'))
    const adminLink = $('admin-nav-btn')
    if (adminLink) hide(adminLink)
  }
  const badge = $('signed-in-badge')
  if (badge) { badge.textContent = loggedIn ? `Signed in as ${email}` : ''; loggedIn ? show(badge) : hide(badge) }
}

// Track which tab is active in the auth modal
let authMode = 'signin'

function _showAuthError(msg) {
  const el = $('auth-error')
  el.textContent = msg
  el.classList.remove('hidden')
  // Shake animation
  el.closest('.modal-card')?.classList.remove('shake')
  void el.closest('.modal-card')?.offsetWidth // reflow
  el.closest('.modal-card')?.classList.add('shake')
}
function _clearAuthError() {
  const el = $('auth-error')
  el.textContent = ''
  el.classList.add('hidden')
}

function openAuthModal() {
  authMode = 'signin'
  _applyAuthMode()
  show($('auth-overlay'))
  $('auth-email').focus()
}
function closeAuthModal() {
  hide($('auth-overlay'))
  _clearAuthError()
}
function _applyAuthMode() {
  const isReg = authMode === 'register'
  $('auth-title').textContent = isReg ? 'Create Account' : 'Sign In'
  $('btn-auth-submit').textContent = isReg ? 'Create Account' : 'Sign In'
  $('auth-register-fields').classList.toggle('hidden', !isReg)
  $('auth-toggle-link').textContent = isReg ? 'Already have an account? Sign In' : "Don't have an account? Register"
  _clearAuthError()
}

async function handleSignIn(e) {
  e.preventDefault()
  const email = $('auth-email').value.trim()
  const password = $('auth-password').value
  _clearAuthError()

  if (authMode === 'register') {
    const firstName = $('auth-first-name').value.trim()
    const lastName = $('auth-last-name').value.trim()
    if (!firstName) { _showAuthError('Please enter your first name.'); return }
    if (!lastName) { _showAuthError('Please enter your last name.'); return }
    if (!email) { _showAuthError('Please enter your email address.'); return }
    if (!password) { _showAuthError('Please enter a password.'); return }
    if (password.length < 6) { _showAuthError('Password must be at least 6 characters.'); return }
    $('btn-auth-submit').disabled = true
    $('btn-auth-submit').textContent = 'Creating account…'
    const result = await auth.register({ firstName, lastName, email, phone: '', password })
    $('btn-auth-submit').disabled = false
    $('btn-auth-submit').textContent = 'Create Account'
    if (result.success) { closeAuthModal(); updateAuthUI() }
    else _showAuthError(result.error || 'Registration failed. Please try again.')
    return
  }

  if (!email) { _showAuthError('Please enter your email address.'); return }
  if (!password) { _showAuthError('Please enter your password.'); return }
  $('btn-auth-submit').disabled = true
  $('btn-auth-submit').textContent = 'Signing in…'
  const result = await auth.signIn(email, password)
  $('btn-auth-submit').disabled = false
  $('btn-auth-submit').textContent = 'Sign In'
  if (result.success) {
    closeAuthModal()
    updateAuthUI()
    if (result.isAdmin) window.location.href = 'admin.html'
  } else {
    _showAuthError(result.error || 'Incorrect email or password. Please try again.')
  }
}

// ── Search panel ───────────────────────────────────────────────────────────
function readParams() {
  state.params.tripType = $('trip-type').value
  state.params.origin = $('origin').value.trim()
  state.params.destination = $('destination').value.trim()
  state.params.fromDate = $('from-date').value
  state.params.toDate = $('to-date').value
  state.params.adults = Math.max(1, Number($('adults').value) || 1)
  state.params.children = Math.max(0, Number($('children').value) || 0)
  state.params.travelingWithPets = $('pets-toggle').value === 'yes'
  state.params.petCount = Math.max(1, Number($('pet-count').value) || 1)
  state.params.petType = $('pet-type').value
}

function togglePetFields() {
  const show = $('pets-toggle').value === 'yes'
  $('pet-fields').classList.toggle('hidden', !show)
}

function validateParams() {
  const p = state.params
  if (!p.origin) throw new Error('Origin is required.')
  if (!p.destination) throw new Error('Destination is required.')
  if (!p.fromDate) throw new Error('Departure date is required.')
  if (p.tripType === 'ROUNDTRIP' && !p.toDate) throw new Error('Return date is required for round trips.')
  if (p.tripType === 'ROUNDTRIP' && p.toDate && new Date(p.toDate) <= new Date(p.fromDate))
    throw new Error('Return date must be after departure date.')
}

function effectiveParams() {
  const p = { ...state.params }
  if (p.tripType === 'ONEWAY' && !p.toDate) {
    const d = new Date(p.fromDate); d.setDate(d.getDate() + 1)
    p.toDate = d.toISOString().split('T')[0]
  }
  return p
}

async function handleSearch() {
  readParams()
  $('search-error').textContent = ''
  try { validateParams() } catch (e) { $('search-error').textContent = e.message; return }

  state.results = { flights: [], returnFlights: [], hotels: [], activities: [] }
  state.sel = { flight: null, returnFlight: null, hotel: null }
  state.bookingResult = null
  state.bookingError = ''
  state.hasSearched = true
  state.activeTab = 'flights'

  const p = effectiveParams()
  showResults()

  setLoading('flights', true)
  setLoading('hotels', true)
  setLoading('activities', true)

  const searchFlights = async () => {
    try {
      state.results.flights = await flightService.search({ origin: p.origin, destination: p.destination, fromDate: p.fromDate, adults: p.adults, children: p.children })
    } catch (e) {
      renderError('flights', e.message)
    } finally { setLoading('flights', false) }
    if (p.tripType === 'ROUNDTRIP') {
      setLoading('returnFlights', true)
      try {
        state.results.returnFlights = await flightService.search({ origin: p.destination, destination: p.origin, fromDate: p.toDate, adults: p.adults, children: p.children })
      } catch (e) {
        renderError('returnFlights', e.message)
      } finally { setLoading('returnFlights', false) }
    }
    renderFlights()
  }

  const searchHotels = async () => {
    try {
      state.results.hotels = await hotelService.search({ ...p })
    } catch (e) {
      renderError('hotels', e.message)
    } finally { setLoading('hotels', false); renderHotels() }
  }

  const searchActivities = async () => {
    try {
      state.results.activities = attractionService.getAttractions(p.destination)
    } catch { /* attractions optional */ } finally { setLoading('activities', false); renderActivities() }
  }

  await Promise.all([searchFlights(), searchHotels(), searchActivities()])
  updateTabCounts()
  renderSummary()
}

function handleClear() {
  Object.assign(state.params, { tripType: 'ROUNDTRIP', origin: '', destination: '', fromDate: '', toDate: '', adults: 1, children: 0, travelingWithPets: false, petCount: 1, petType: 'dog' })
  $('trip-type').value = 'ROUNDTRIP'
  $('origin').value = ''; $('destination').value = ''
  $('from-date').value = ''; $('to-date').value = ''
  $('adults').value = 1; $('children').value = 0
  $('pets-toggle').value = 'no'
  $('pet-count').value = 1; $('pet-type').value = 'dog'
  togglePetFields()
  state.hasSearched = false
  state.sel = { flight: null, returnFlight: null, hotel: null }
  state.results = { flights: [], returnFlights: [], hotels: [], activities: [] }
  state.bookingResult = null; state.bookingError = ''
  hide($('results-section'))
  show($('hero-section'))
  $('search-error').textContent = ''
}

// ── Results view ───────────────────────────────────────────────────────────
function showResults() {
  hide($('hero-section'))
  show($('results-section'))
  switchTab('flights')
}

function switchTab(tab) {
  state.activeTab = tab
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab))
  ;['flights','hotels','activities'].forEach((t) => {
    const el = $(`${t}-panel`); el && el.classList.toggle('hidden', t !== tab)
  })
  if (tab === 'activities' && _attractionMap) setTimeout(() => _attractionMap.invalidateSize(), 50)
}

function updateTabCounts() {
  const f = state.results.flights.length + state.results.returnFlights.length
  const h = state.results.hotels.length
  const a = state.results.activities.length
  $('flights-count').textContent = f; $('flights-count').classList.toggle('hidden', f === 0)
  $('hotels-count').textContent = h; $('hotels-count').classList.toggle('hidden', h === 0)
  $('activities-count').textContent = a; $('activities-count').classList.toggle('hidden', a === 0)
}

function setLoading(type, val) {
  const map = { flights: 'flights-panel', returnFlights: 'return-flights-panel', hotels: 'hotels-panel', activities: 'activities-panel' }
  const el = $(map[type])
  if (!el) return
  if (val) el.innerHTML = `<div class="state-msg"><span class="state-msg-icon">⏳</span><p>Searching…</p></div>`
}

function renderError(type, msg) {
  const map = { flights: 'flights-panel', returnFlights: 'return-flights-panel', hotels: 'hotels-panel', activities: 'activities-panel' }
  const el = $(map[type])
  if (el) el.innerHTML = `<div class="state-msg error"><span class="state-msg-icon">⚠️</span><p>${msg}</p></div>`
}

// ── Render flights ─────────────────────────────────────────────────────────
function renderFlights() {
  const panel = $('flights-panel')
  const p = state.params
  let html = ''

  if (state.results.flights.length === 0 && !panel.querySelector('.state-msg')) {
    html += `<div class="state-msg"><span class="state-msg-icon">✈️</span><p>No outbound flights found.</p></div>`
  } else {
    html += `<div class="flight-section-title">Outbound flight</div>`
    html += state.results.flights.map((f) => flightCardHTML(f, 'out')).join('')
  }

  if (p.tripType === 'ROUNDTRIP') {
    html += `<div class="flight-section-title" style="margin-top:.75rem">Return flight</div>`
    if (state.results.returnFlights.length === 0) {
      html += `<div class="state-msg"><span class="state-msg-icon">↩️</span><p>No return flights found.</p></div>`
    } else {
      html += state.results.returnFlights.map((f) => flightCardHTML(f, 'ret')).join('')
    }
  }

  panel.innerHTML = html
  panel.querySelectorAll('.flight-card').forEach((el) => {
    el.addEventListener('click', () => {
      const dir = el.dataset.dir
      const id = el.dataset.id
      const arr = dir === 'out' ? state.results.flights : state.results.returnFlights
      const flight = arr.find((f) => f.id === id)
      if (!flight) return
      if (dir === 'out') state.sel.flight = state.sel.flight?.id === id ? null : flight
      else state.sel.returnFlight = state.sel.returnFlight?.id === id ? null : flight
      renderFlights()
      renderSummary()
    })
  })
}

function flightCardHTML(f, dir) {
  const sel = (dir === 'out' ? state.sel.flight : state.sel.returnFlight)?.id === f.id
  return `<div class="flight-card${sel ? ' selected' : ''}" data-id="${f.id}" data-dir="${dir}">
    <div>
      <div class="flight-card__airline">${f.airline}</div>
      <div class="flight-card__number">${f.flightNumber}</div>
    </div>
    <div class="flight-card__route">
      <span class="flight-card__time">${f.departureTime}</span>
      <span class="flight-card__arrow">→</span>
      <span class="flight-card__time">${f.arrivalTime}</span>
      <span class="flight-card__meta">${f.origin} → ${f.destination} · ${f.duration} · ${f.stops === 0 ? 'Nonstop' : f.stops + ' stop(s)'}</span>
    </div>
    <div class="flight-card__price">
      <div class="flight-card__price-main">$${fmt(f.totalPrice)}</div>
      <div class="flight-card__price-sub">${f.class}</div>
    </div>
  </div>`
}

// ── Render hotels ──────────────────────────────────────────────────────────
function renderHotels() {
  const panel = $('hotels-panel')
  const p = state.params
  if (state.results.hotels.length === 0) {
    panel.innerHTML = `<div class="state-msg"><span class="state-msg-icon">${p.travelingWithPets ? '🐾' : '🏨'}</span><p>${p.travelingWithPets ? 'No pet-friendly hotels found.' : 'No hotels found.'}</p></div>`
    return
  }
  panel.innerHTML = state.results.hotels.map((h) => hotelCardHTML(h, p)).join('')
  panel.querySelectorAll('.hotel-card').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.id
      const hotel = state.results.hotels.find((h) => h.id === id)
      if (!hotel) return
      state.sel.hotel = state.sel.hotel?.id === id ? null : hotel
      renderHotels()
      renderSummary()
    })
  })
}

function hotelCardHTML(h, p) {
  const sel = state.sel.hotel?.id === h.id
  const [bg1, bg2] = PALETTES[h.imageIndex] || PALETTES[0]
  const selFlight = state.sel.flight
  const petTotal = h.petFriendly && p.travelingWithPets ? (h.petFeePerNight || 0) * h.nights * (p.petCount || 1) : 0
  const travelTotal = h.totalPrice + petTotal + (selFlight ? selFlight.totalPrice : 0)

  let costBar = ''
  if (p.travelingWithPets && h.petFriendly && petTotal > 0) {
    costBar = `<div class="travel-cost-bar">
      <div class="travel-cost-label">Total travel cost</div>
      <div class="cost-items">
        <span>🏨 $${fmt(h.totalPrice)}</span>
        <span class="cost-sep">+</span>
        <span class="cost-item pet">🐾 $${fmt(petTotal)} pet fees</span>
        ${selFlight ? `<span class="cost-sep">+</span><span>✈️ $${fmt(selFlight.totalPrice)}</span>` : ''}
        <span class="cost-sep">=</span>
        <span class="cost-total">$${fmt(travelTotal)}</span>
      </div>
    </div>`
  } else if (selFlight) {
    costBar = `<div class="travel-cost-bar plain">
      <div class="travel-cost-label">Total travel cost</div>
      <div class="cost-items">
        <span>🏨 $${fmt(h.totalPrice)}</span>
        <span class="cost-sep">+</span>
        <span>✈️ $${fmt(selFlight.totalPrice)}</span>
        <span class="cost-sep">=</span>
        <span class="cost-total">$${fmt(travelTotal)}</span>
      </div>
    </div>`
  }

  return `<div class="hotel-card${sel ? ' selected' : ''}${h.petFriendly ? ' pet-friendly' : ''}" data-id="${h.id}">
    <div class="hotel-card__img" style="background:linear-gradient(135deg,${bg1},${bg2})">${h.petFriendly ? '🐾' : '🏨'}</div>
    <div class="hotel-card__body">
      <div class="hotel-card__top">
        <div>
          <div class="hotel-name-row">
            <span class="hotel-name">${h.name}</span>
            ${h.petFriendly ? `<span class="pet-badge">🐾 Pet-Friendly</span>` : ''}
          </div>
          <div class="hotel-location">📍 ${h.location}</div>
          <div class="hotel-stars">
            <span class="stars">${stars(h.stars)}</span>
            <span class="rating-badge">${h.rating} · ${h.reviews.toLocaleString()} reviews</span>
          </div>
        </div>
        <div class="hotel-price-block">
          <span class="price">$${h.pricePerNight}</span><span class="price-sub">/night</span>
          <div class="price-total">$${fmt(h.totalPrice)} hotel</div>
          ${h.petFriendly && p.travelingWithPets && h.petFeePerNight ? `<div class="pet-fee-line">+$${h.petFeePerNight}/night per 🐾</div>` : ''}
          <div class="price-nights">${h.nights} night${h.nights > 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="amenities">${h.amenities.map((a) => `<span class="amenity-tag">${a}</span>`).join('')}</div>
      ${p.travelingWithPets && h.petAmenities?.length ? `<div class="amenities">${h.petAmenities.map((a) => `<span class="amenity-tag pet">${a}</span>`).join('')}</div>` : ''}
      ${costBar}
      <div class="hotel-footer">
        <span class="room-tag">${h.roomType}</span>
        ${sel ? `<span class="selected-indicator">✓ Selected</span>` : ''}
      </div>
    </div>
  </div>`
}

// ── Render activities ──────────────────────────────────────────────────────
const MARKER_COLORS = { park: '#276749', beach: '#1565c0', petcafe: '#e65100', trail: '#6a1b9a', petstore: '#880e4f' }

function _makeMarkerIcon(icon, color, size = 32) {
  return L.divIcon({
    html: `<div style="background:${color};color:#fff;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.5)}px;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.4)">${icon}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  })
}

function renderActivities() {
  const panel = $('activities-panel')
  const items = state.results.activities

  if (_attractionMap) { _attractionMap.remove(); _attractionMap = null }

  if (!items.length) {
    panel.innerHTML = `<div class="state-msg"><span class="state-msg-icon">🐾</span><p>No pet-friendly attractions found for this destination.</p></div>`
    return
  }

  const dest = state.params.destination
  const cityInfo = getCityCoords(dest)
  const centerLat = cityInfo?.lat ?? items[0].lat
  const centerLon = cityInfo?.lon ?? items[0].lon

  panel.innerHTML = `
    <div class="attractions-header">
      <span class="attractions-title">Pet-friendly spots near ${dest}</span>
      <span class="attractions-sub">${items.length} attractions · sorted by distance</span>
    </div>
    <div id="attraction-map" class="attraction-map"></div>
    ${items.map((a) => `
    <div class="activity-card attraction-card">
      <div class="activity-card__header">
        <div class="activity-icon">${a.meta.icon}</div>
        <div style="flex:1">
          <div class="activity-name">${a.name}</div>
          <div class="activity-meta">
            <span class="type-badge type-badge--${a.type}">${a.meta.label}</span>
            <span class="dist-text">· ${a.distanceMiles} mi (${a.distanceKm} km) from city centre</span>
          </div>
          <div class="activity-desc">${a.description}</div>
        </div>
        <div class="walk-badge ${a.walkable ? 'walk-badge--walkable' : 'walk-badge--drive'}">
          ${a.walkable ? '🚶 Walkable' : '🚗 Drive'}
        </div>
      </div>
    </div>`).join('')}
  `

  _attractionMap = L.map('attraction-map', { scrollWheelZoom: false }).setView([centerLat, centerLon], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(_attractionMap)

  if (cityInfo) {
    L.marker([cityInfo.lat, cityInfo.lon], { icon: _makeMarkerIcon('📍', '#1a365d', 36) })
      .addTo(_attractionMap)
      .bindPopup(`<b>${cityInfo.city}</b><br><small>City Centre</small>`)
  }

  items.forEach((a) => {
    L.marker([a.lat, a.lon], { icon: _makeMarkerIcon(a.meta.icon, MARKER_COLORS[a.type] || '#555') })
      .addTo(_attractionMap)
      .bindPopup(`<b>${a.name}</b><br><small>${a.meta.label} · ${a.distanceMiles} mi</small><br><small>${a.walkable ? '🚶 Walkable' : '🚗 Drive'}</small>`)
  })
}

// ── Summary panel ──────────────────────────────────────────────────────────
function renderSummary() {
  const p = state.params
  const { flight, returnFlight, hotel } = state.sel
  const hasSel = !!(flight || returnFlight || hotel)

  if (!hasSel && !state.bookingResult) {
    $('summary-body').innerHTML = `<div class="summary-empty">
      <div class="summary-empty-icon">✈️</div>
      <p>Search for travel options and select your flight and hotel.</p>
    </div>`
    hide($('summary-footer'))
    return
  }

  show($('summary-footer'))
  const petTotal = hotel?.petFriendly && p.travelingWithPets ? (hotel.petFeePerNight || 0) * (hotel.nights || 1) * (p.petCount || 1) : 0
  const total = (flight?.totalPrice || 0) + (returnFlight?.totalPrice || 0) + (hotel?.totalPrice || 0) + petTotal
  const petEmoji = p.petType === 'cat' ? '🐱' : p.petType === 'other' ? '🐇' : '🐶'

  let html = ''
  if (auth.isAuthenticated()) {
    html += `<div id="signed-in-badge" class="signed-in-badge">${auth.getEmail()}</div>`
  }

  // Flight section
  html += `<div class="summary-section"><div class="section-label"><span>✈️</span> Outbound Flight</div>`
  if (flight) {
    html += `<div class="summary-item"><div class="item-title">${flight.airline} ${flight.flightNumber}</div>
      <div class="item-sub">${flight.origin} → ${flight.destination}</div>
      <div class="item-sub">${flight.departureTime} – ${flight.arrivalTime} · ${flight.duration}</div>
      <div class="item-price">$${fmt(flight.totalPrice)}</div></div>`
  } else { html += `<p class="not-selected">No flight selected</p>` }
  html += `</div>`

  if (p.tripType === 'ROUNDTRIP') {
    html += `<div class="summary-divider"></div><div class="summary-section"><div class="section-label"><span>↩️</span> Return Flight</div>`
    if (returnFlight) {
      html += `<div class="summary-item"><div class="item-title">${returnFlight.airline} ${returnFlight.flightNumber}</div>
        <div class="item-sub">${returnFlight.origin} → ${returnFlight.destination}</div>
        <div class="item-sub">${returnFlight.departureTime} – ${returnFlight.arrivalTime}</div>
        <div class="item-price">$${fmt(returnFlight.totalPrice)}</div></div>`
    } else { html += `<p class="not-selected">No return flight selected</p>` }
    html += `</div>`
  }

  html += `<div class="summary-divider"></div><div class="summary-section"><div class="section-label"><span>🏨</span> Hotel</div>`
  if (hotel) {
    html += `<div class="summary-item"><div class="item-title">${hotel.name}</div>
      <div class="item-sub">${hotel.location} · ${hotel.roomType}</div>
      <div class="item-sub">${hotel.nights} night${hotel.nights > 1 ? 's' : ''} · $${hotel.pricePerNight}/night</div>
      <div class="item-price">$${fmt(hotel.totalPrice)}</div></div>`
  } else { html += `<p class="not-selected">No hotel selected</p>` }
  html += `</div>`

  // Pet section
  if (p.travelingWithPets) {
    html += `<div class="summary-divider"></div><div class="summary-section pet-section"><div class="section-label"><span>🐾</span> Pets</div>`
    if (hotel?.petFriendly) {
      html += `<div class="summary-item pet-item">
        <div class="item-title">${petEmoji} ${p.petCount} ${p.petType}${p.petCount > 1 ? 's' : ''}</div>
        <div class="item-sub">${hotel.petAmenities?.slice(0,3).join(' · ') || ''}</div>
        <div class="item-sub">$${hotel.petFeePerNight}/night × ${hotel.nights} nights × ${p.petCount} pet${p.petCount > 1 ? 's' : ''}</div>
        <div class="item-price">$${fmt(petTotal)} pet fees</div>
      </div>`
    } else if (hotel) {
      html += `<p class="not-selected" style="color:#856404">⚠️ Selected hotel does not allow pets</p>`
    } else {
      html += `<p class="not-selected">Select a pet-friendly hotel</p>`
    }
    html += `</div>`
  }

  html += `<div class="summary-divider"></div>`

  $('summary-body').innerHTML = html
  $('summary-total-price').textContent = `$${fmt(total)}`

  // Booking result / error
  const errEl = $('booking-error')
  errEl.textContent = state.bookingError
  errEl.classList.toggle('hidden', !state.bookingError)

  const confirmEl = $('booking-confirmation')
  if (state.bookingResult) {
    show(confirmEl)
    $('confirm-ref').textContent = `Ref: ${state.bookingResult.bookingReference}`
  } else {
    hide(confirmEl)
  }

  $('btn-book').disabled = state.isBooking || !!state.bookingResult
  $('btn-book').innerHTML = state.isBooking ? '<span class="spinner"></span>' : '🎫 Book Now'
}

function clearSelections() {
  state.sel = { flight: null, returnFlight: null, hotel: null }
  state.bookingResult = null; state.bookingError = ''
  renderFlights(); renderHotels(); renderSummary()
}

// ── Booking ────────────────────────────────────────────────────────────────
async function handleBook() {
  if (!auth.isAuthenticated()) { openAuthModal(); return }
  const { flight, returnFlight, hotel } = state.sel
  if (!flight && !hotel) { state.bookingError = 'Select at least a flight or hotel.'; renderSummary(); return }
  const p = state.params
  if (p.tripType === 'ROUNDTRIP' && flight && !returnFlight) {
    state.bookingError = 'Select a return flight for a round trip.'; renderSummary(); return
  }

  state.isBooking = true; state.bookingError = ''; renderSummary()

  try {
    const petInfo = p.travelingWithPets && hotel?.petFriendly
      ? { petCount: p.petCount, petType: p.petType, petFeePerNight: hotel.petFeePerNight ?? 0 }
      : null

    state.bookingResult = await bookingService.createBooking({
      userId: auth.getUserId(),
      agentId: state.tenant?.agentId || 1,
      searchParams: p,
      flight, returnFlight, hotel, petInfo,
    })
  } catch (e) {
    state.bookingError = e.message
  } finally {
    state.isBooking = false; renderSummary()
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const fromHost = detectTenantFromHost()
  if (fromHost) {
    setTenant(fromHost)
  } else {
    const saved = localStorage.getItem('tenant')
    if (saved) { setTenant(resolveTenant(saved)) }
    else initTenantPicker()
  }

  updateAuthUI()

  // Header events
  $('btn-signin').addEventListener('click', () => {
    if (auth.isAuthenticated()) { auth.signOut(); updateAuthUI(); renderSummary() }
    else openAuthModal()
  })

  // Auth modal
  $('btn-auth-cancel').addEventListener('click', closeAuthModal)
  $('auth-overlay').addEventListener('click', (e) => { if (e.target === $('auth-overlay')) closeAuthModal() })
  $('auth-form').addEventListener('submit', handleSignIn)
  $('auth-toggle-link').addEventListener('click', () => {
    authMode = authMode === 'signin' ? 'register' : 'signin'
    _applyAuthMode()
  })

  // Search
  $('btn-search').addEventListener('click', handleSearch)
  $('btn-clear').addEventListener('click', handleClear)
  $('pets-toggle').addEventListener('change', togglePetFields)
  $('trip-type').addEventListener('change', () => {
    $('to-date').disabled = $('trip-type').value === 'ONEWAY'
  })

  // Tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  })

  // Summary
  $('btn-book').addEventListener('click', handleBook)
  $('btn-clear-sel').addEventListener('click', clearSelections)
})
