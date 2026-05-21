export const API_BASE = 'http://localhost:8000/api/v1'

const TENANTS = {
  agenta: {
    key: 'agenta',
    agentId: 1,
    brandName: 'SkyLux Travel',
    brandLogo: '🛫',
    theme: 'agenta',
    tagline: 'Travel in Style',
    heroTitle: 'Your Premium Travel Partner',
    heroSub: 'Curated flights, luxury hotels & VIP experiences for the discerning traveler.',
    heroFeatures: [
      { icon: '✈️', label: 'Business Class' },
      { icon: '🏨', label: '5-Star Hotels' },
      { icon: '🥂', label: 'VIP Service' },
      { icon: '🐾', label: 'Pet Friendly' },
    ],
  },
  agentb: {
    key: 'agentb',
    agentId: 2,
    brandName: 'Horizon Adventures',
    brandLogo: '🌍',
    theme: 'agentb',
    tagline: 'Go Further, Explore More',
    heroTitle: 'Adventure Awaits',
    heroSub: 'Bold travel for bold explorers — mountain trails, tropical shores & hidden gems worldwide.',
    heroFeatures: [
      { icon: '✈️', label: 'Global Routes' },
      { icon: '🏔️', label: 'Adventures' },
      { icon: '🌊', label: 'Beach Escapes' },
      { icon: '🐾', label: 'Pet Friendly' },
    ],
  },
}

const HOSTNAME_MAP = { 'agenta.local': 'agenta', 'agentb.local': 'agentb' }

export function detectTenantFromHost() {
  return TENANTS[HOSTNAME_MAP[window.location.hostname]] || null
}

export function resolveTenant(key) {
  return TENANTS[key] || TENANTS.agenta
}

export const ALL_TENANTS = Object.values(TENANTS)
