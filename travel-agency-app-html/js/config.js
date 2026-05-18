export const API_BASE = 'http://localhost:8000/api/v1'

const TENANTS = {
  agenta: { key: 'agenta', agentId: 1, brandName: 'TravelEase Alpha', brandLogo: '🚀', theme: 'agenta' },
  agentb: { key: 'agentb', agentId: 2, brandName: 'TravelEase Horizon', brandLogo: '🌍', theme: 'agentb' },
}

const HOSTNAME_MAP = { 'agenta.local': 'agenta', 'agentb.local': 'agentb' }

export function detectTenantFromHost() {
  return TENANTS[HOSTNAME_MAP[window.location.hostname]] || null
}

export function resolveTenant(key) {
  return TENANTS[key] || TENANTS.agenta
}

export const ALL_TENANTS = Object.values(TENANTS)
