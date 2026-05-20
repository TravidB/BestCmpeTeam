import { api } from './api.js'

const DESTINATION_ALIASES = {
  'NEW YORK': 'New York, USA', JFK: 'New York, USA', LGA: 'New York, USA', EWR: 'New York, USA',
  'LOS ANGELES': 'Los Angeles, USA', LAX: 'Los Angeles, USA',
  'SAN FRANCISCO': 'San Francisco, USA', SFO: 'San Francisco, USA',
  PARIS: 'Paris, France', CDG: 'Paris, France', ORY: 'Paris, France',
  LONDON: 'London, UK', LHR: 'London, UK', LGW: 'London, UK',
  TOKYO: 'Tokyo, Japan', NRT: 'Tokyo, Japan', HND: 'Tokyo, Japan',
  HONOLULU: 'Honolulu, USA', HNL: 'Honolulu, USA',
  CHICAGO: 'Chicago, USA', ORD: 'Chicago, USA', MDW: 'Chicago, USA',
  MIAMI: 'Miami, USA', MIA: 'Miami, USA',
  SEATTLE: 'Seattle, USA', SEA: 'Seattle, USA',
  BOSTON: 'Boston, USA', BOS: 'Boston, USA',
  DUBAI: 'Dubai, UAE', DXB: 'Dubai, UAE',
  SINGAPORE: 'Singapore', SIN: 'Singapore',
  SYDNEY: 'Sydney, Australia', SYD: 'Sydney, Australia',
  SEOUL: 'Seoul, South Korea', ICN: 'Seoul, South Korea',
  BANGKOK: 'Bangkok, Thailand', BKK: 'Bangkok, Thailand',
  FRANKFURT: 'Frankfurt, Germany', FRA: 'Frankfurt, Germany',
  AMSTERDAM: 'Amsterdam, Netherlands', AMS: 'Amsterdam, Netherlands',
  TORONTO: 'Toronto, Canada', YYZ: 'Toronto, Canada',
  VANCOUVER: 'Vancouver, Canada', YVR: 'Vancouver, Canada',
  MADRID: 'Madrid, Spain', MAD: 'Madrid, Spain',
  ROME: 'Rome, Italy', FCO: 'Rome, Italy',
}

const COUNTRY_ALIASES = { USA: 'United States', US: 'United States', UK: 'United Kingdom', UAE: 'United Arab Emirates' }

// distanceKm = approximate distance from city centre
const HOTEL_INVENTORY = {
  'Paris, France': [
    { name: 'Hôtel Plaza Athénée',              stars: 5, baseRate: 820, amenities: ['Free WiFi','Spa','Restaurant','Bar','Concierge','Room Service'],          rating: '4.9', reviews: 3120, roomType: 'Deluxe Room',  imageIndex: 0, distanceKm: 2.1 },
    { name: 'Le Marais Boutique Hotel',          stars: 4, baseRate: 340, amenities: ['Free WiFi','Bar','Concierge','Restaurant'],                               rating: '4.6', reviews: 1840, roomType: 'Standard Room', imageIndex: 1, distanceKm: 1.4 },
    { name: 'Novotel Paris Centre',              stars: 4, baseRate: 260, amenities: ['Free WiFi','Gym','Restaurant','Parking'],                                  rating: '4.3', reviews: 2200, roomType: 'Standard Room', imageIndex: 2, distanceKm: 5.2 },
    { name: 'Hôtel du Louvre',                  stars: 5, baseRate: 590, amenities: ['Free WiFi','Spa','Restaurant','Bar','Room Service','Concierge'],           rating: '4.8', reviews:  980, roomType: 'Junior Suite',  imageIndex: 3, distanceKm: 0.8 },
    { name: 'Ibis Paris Montmartre',             stars: 3, baseRate: 130, amenities: ['Free WiFi','Restaurant','Parking'],                                        rating: '4.1', reviews: 3450, roomType: 'Standard Room', imageIndex: 4, distanceKm: 4.3 },
  ],
  'London, UK': [
    { name: 'The Savoy',                         stars: 5, baseRate: 900, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge'],                   rating: '4.9', reviews: 2780, roomType: 'Suite',         imageIndex: 0, distanceKm: 1.0 },
    { name: 'Premier Inn London City',           stars: 3, baseRate: 160, amenities: ['Free WiFi','Restaurant','Bar'],                                            rating: '4.2', reviews: 4100, roomType: 'Standard Room', imageIndex: 1, distanceKm: 3.2 },
    { name: 'Marriott London Grosvenor Square',  stars: 5, baseRate: 580, amenities: ['Free WiFi','Spa','Gym','Restaurant','Bar','Room Service'],                 rating: '4.7', reviews: 1620, roomType: 'Deluxe Room',  imageIndex: 2, distanceKm: 4.1 },
    { name: 'CitizenM Tower of London',          stars: 4, baseRate: 270, amenities: ['Free WiFi','Bar','Gym'],                                                   rating: '4.5', reviews: 3300, roomType: 'Standard Room', imageIndex: 3, distanceKm: 2.5 },
    { name: 'Hilton London Bankside',            stars: 5, baseRate: 490, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Room Service'],                rating: '4.6', reviews: 1950, roomType: 'Junior Suite',  imageIndex: 4, distanceKm: 2.8 },
  ],
  'Tokyo, Japan': [
    { name: 'Park Hyatt Tokyo',                  stars: 5, baseRate: 750, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar','Concierge'],              rating: '4.9', reviews: 2100, roomType: 'Deluxe Room',  imageIndex: 0, distanceKm: 9.8 },
    { name: 'Shinjuku Granbell Hotel',           stars: 4, baseRate: 280, amenities: ['Free WiFi','Bar','Concierge'],                                             rating: '4.5', reviews: 3800, roomType: 'Standard Room', imageIndex: 1, distanceKm: 9.4 },
    { name: 'Dormy Inn Akihabara',               stars: 3, baseRate: 140, amenities: ['Free WiFi','Spa','Restaurant'],                                            rating: '4.3', reviews: 5200, roomType: 'Standard Room', imageIndex: 2, distanceKm: 3.8 },
    { name: 'The Prince Gallery Tokyo Kioicho',  stars: 5, baseRate: 640, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Room Service'],                rating: '4.8', reviews:  890, roomType: 'Suite',         imageIndex: 3, distanceKm: 5.1 },
    { name: 'APA Hotel Shinjuku Kabukicho',      stars: 3, baseRate: 110, amenities: ['Free WiFi','Gym','Concierge'],                                             rating: '4.0', reviews: 6700, roomType: 'Standard Room', imageIndex: 4, distanceKm: 10.2 },
  ],
  'New York, USA': [
    { name: 'The Plaza Hotel',                   stars: 5, baseRate: 850, amenities: ['Free WiFi','Spa','Gym','Restaurant','Bar','Concierge','Room Service'],     rating: '4.8', reviews: 1950, roomType: 'Junior Suite',  imageIndex: 0, distanceKm: 1.8 },
    { name: 'Pod 51 Hotel',                      stars: 3, baseRate: 190, amenities: ['Free WiFi','Bar','Concierge'],                                             rating: '4.2', reviews: 4200, roomType: 'Standard Room', imageIndex: 1, distanceKm: 2.4 },
    { name: 'Marriott Marquis Times Square',     stars: 5, baseRate: 610, amenities: ['Free WiFi','Pool','Gym','Restaurant','Bar','Room Service'],                rating: '4.6', reviews: 2300, roomType: 'Deluxe Room',  imageIndex: 2, distanceKm: 3.0 },
    { name: 'The Standard High Line',            stars: 4, baseRate: 420, amenities: ['Free WiFi','Bar','Restaurant','Gym'],                                      rating: '4.5', reviews: 1780, roomType: 'Deluxe Room',  imageIndex: 3, distanceKm: 3.9 },
    { name: 'Arlo NoMad',                        stars: 3, baseRate: 230, amenities: ['Free WiFi','Bar','Restaurant'],                                            rating: '4.3', reviews: 3100, roomType: 'Standard Room', imageIndex: 4, distanceKm: 2.9 },
  ],
  'Los Angeles, USA': [
    { name: 'Shutters on the Beach',             stars: 5, baseRate: 780, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge'],                   rating: '4.8', reviews: 1640, roomType: 'Suite',         imageIndex: 0, distanceKm: 22.5 },
    { name: 'The LINE LA',                       stars: 4, baseRate: 310, amenities: ['Free WiFi','Pool','Bar','Restaurant','Gym'],                               rating: '4.5', reviews: 2900, roomType: 'Deluxe Room',  imageIndex: 1, distanceKm: 8.3 },
    { name: 'Freehand Los Angeles',              stars: 3, baseRate: 200, amenities: ['Free WiFi','Pool','Bar','Restaurant'],                                     rating: '4.3', reviews: 3300, roomType: 'Standard Room', imageIndex: 2, distanceKm: 7.1 },
    { name: 'Waldorf Astoria Beverly Hills',     stars: 5, baseRate: 920, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar','Room Service'],          rating: '4.9', reviews:  870, roomType: 'Suite',         imageIndex: 3, distanceKm: 14.8 },
    { name: 'Motel 6 Los Angeles',               stars: 3, baseRate:  95, amenities: ['Free WiFi','Parking'],                                                    rating: '3.8', reviews: 5800, roomType: 'Standard Room', imageIndex: 4, distanceKm: 11.6 },
  ],
  'Honolulu, USA': [
    { name: 'Royal Hawaiian Hotel',              stars: 5, baseRate: 680, amenities: ['Free WiFi','Pool','Beach Access','Spa','Restaurant','Bar'],                rating: '4.8', reviews: 2100, roomType: 'Deluxe Room',  imageIndex: 0, distanceKm: 2.0 },
    { name: 'Sheraton Waikiki',                  stars: 4, baseRate: 420, amenities: ['Free WiFi','Pool','Restaurant','Bar','Gym','Concierge'],                   rating: '4.5', reviews: 3800, roomType: 'Standard Room', imageIndex: 1, distanceKm: 2.3 },
    { name: 'Outrigger Reef Waikiki Beach',      stars: 4, baseRate: 370, amenities: ['Free WiFi','Pool','Beach Access','Restaurant','Bar'],                     rating: '4.4', reviews: 2950, roomType: 'Deluxe Room',  imageIndex: 2, distanceKm: 2.6 },
    { name: 'Hyatt Regency Waikiki',             stars: 5, baseRate: 540, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge'],                   rating: '4.7', reviews: 1700, roomType: 'Junior Suite',  imageIndex: 3, distanceKm: 2.1 },
    { name: 'Waikiki Beachcomber',               stars: 3, baseRate: 230, amenities: ['Free WiFi','Pool','Restaurant'],                                           rating: '4.1', reviews: 4200, roomType: 'Standard Room', imageIndex: 4, distanceKm: 1.8 },
  ],
  'Dubai, UAE': [
    { name: 'Burj Al Arab',                      stars: 5, baseRate: 1800, amenities: ['Free WiFi','Pool','Spa','Beach Access','Restaurant','Bar','Concierge','Airport Shuttle'], rating: '5.0', reviews: 4200, roomType: 'Suite',        imageIndex: 0, distanceKm: 19.8 },
    { name: 'Atlantis The Palm',                 stars: 5, baseRate: 680, amenities: ['Free WiFi','Pool','Spa','Waterpark','Restaurant','Bar'],                   rating: '4.7', reviews: 6100, roomType: 'Deluxe Room',  imageIndex: 1, distanceKm: 26.4 },
    { name: 'Rove Downtown Dubai',               stars: 3, baseRate: 150, amenities: ['Free WiFi','Pool','Gym','Restaurant'],                                     rating: '4.4', reviews: 5300, roomType: 'Standard Room', imageIndex: 2, distanceKm: 1.2 },
    { name: 'Address Downtown Dubai',            stars: 5, baseRate: 490, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar','Room Service'],          rating: '4.8', reviews: 2900, roomType: 'Junior Suite',  imageIndex: 3, distanceKm: 1.6 },
    { name: 'Premier Inn Dubai Airport',         stars: 3, baseRate: 120, amenities: ['Free WiFi','Restaurant','Airport Shuttle'],                                rating: '4.1', reviews: 3700, roomType: 'Standard Room', imageIndex: 4, distanceKm: 31.2 },
  ],
  'Singapore': [
    { name: 'Marina Bay Sands',                  stars: 5, baseRate: 620, amenities: ['Free WiFi','Pool','Spa','Gym','Casino','Restaurant','Bar','Concierge'],    rating: '4.8', reviews: 8200, roomType: 'Deluxe Room',  imageIndex: 0, distanceKm: 1.8 },
    { name: 'The Fullerton Hotel Singapore',     stars: 5, baseRate: 480, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge'],                   rating: '4.9', reviews: 3100, roomType: 'Junior Suite',  imageIndex: 1, distanceKm: 0.9 },
    { name: 'ibis Singapore on Bencoolen',       stars: 3, baseRate: 130, amenities: ['Free WiFi','Restaurant'],                                                  rating: '4.2', reviews: 6400, roomType: 'Standard Room', imageIndex: 2, distanceKm: 1.5 },
    { name: 'Capella Singapore',                 stars: 5, baseRate: 820, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar','Room Service'],          rating: '4.9', reviews: 1500, roomType: 'Suite',         imageIndex: 3, distanceKm: 9.7 },
    { name: 'Park Hotel Clarke Quay',            stars: 4, baseRate: 280, amenities: ['Free WiFi','Pool','Bar','Restaurant','Concierge'],                         rating: '4.5', reviews: 2800, roomType: 'Deluxe Room',  imageIndex: 4, distanceKm: 2.1 },
  ],
  'Bangkok, Thailand': [
    { name: 'Mandarin Oriental Bangkok',         stars: 5, baseRate: 550, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge','River View'],      rating: '4.9', reviews: 2600, roomType: 'Suite',         imageIndex: 0, distanceKm: 3.4 },
    { name: 'Centara Grand at CentralWorld',     stars: 5, baseRate: 310, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar'],                         rating: '4.6', reviews: 4100, roomType: 'Deluxe Room',  imageIndex: 1, distanceKm: 4.2 },
    { name: 'Ibis Bangkok Siam',                 stars: 3, baseRate:  70, amenities: ['Free WiFi','Restaurant','Gym'],                                            rating: '4.2', reviews: 7800, roomType: 'Standard Room', imageIndex: 2, distanceKm: 4.0 },
    { name: 'SO Bangkok',                        stars: 5, baseRate: 390, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge'],                   rating: '4.7', reviews: 1900, roomType: 'Junior Suite',  imageIndex: 3, distanceKm: 5.3 },
    { name: 'The Quarter Ladprao',               stars: 4, baseRate: 130, amenities: ['Free WiFi','Pool','Restaurant','Gym'],                                     rating: '4.4', reviews: 3200, roomType: 'Deluxe Room',  imageIndex: 4, distanceKm: 12.1 },
  ],
  'Sydney, Australia': [
    { name: 'Park Hyatt Sydney',                 stars: 5, baseRate: 720, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge','Harbour View'],    rating: '4.9', reviews: 1800, roomType: 'Suite',         imageIndex: 0, distanceKm: 1.6 },
    { name: 'Sofitel Sydney Darling Harbour',    stars: 5, baseRate: 450, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar'],                         rating: '4.7', reviews: 2400, roomType: 'Deluxe Room',  imageIndex: 1, distanceKm: 2.9 },
    { name: 'Ibis Sydney Airport',               stars: 3, baseRate: 145, amenities: ['Free WiFi','Restaurant','Airport Shuttle'],                                rating: '4.1', reviews: 5100, roomType: 'Standard Room', imageIndex: 2, distanceKm: 17.3 },
    { name: 'QT Sydney',                         stars: 5, baseRate: 520, amenities: ['Free WiFi','Spa','Restaurant','Bar','Gym'],                                rating: '4.8', reviews: 1300, roomType: 'Junior Suite',  imageIndex: 3, distanceKm: 0.8 },
    { name: 'The Old Clare Hotel',               stars: 4, baseRate: 290, amenities: ['Free WiFi','Pool','Bar','Restaurant'],                                     rating: '4.5', reviews: 2700, roomType: 'Deluxe Room',  imageIndex: 4, distanceKm: 2.4 },
  ],
  'Seoul, South Korea': [
    { name: 'Lotte Hotel Seoul',                 stars: 5, baseRate: 380, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar','Concierge'],              rating: '4.8', reviews: 2200, roomType: 'Deluxe Room',  imageIndex: 0, distanceKm: 1.9 },
    { name: 'Signiel Seoul',                     stars: 5, baseRate: 620, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge','Room Service'],    rating: '4.9', reviews: 1100, roomType: 'Suite',         imageIndex: 1, distanceKm: 14.6 },
    { name: 'Ibis Styles Ambassador Seoul',      stars: 3, baseRate: 110, amenities: ['Free WiFi','Restaurant','Gym'],                                            rating: '4.2', reviews: 5600, roomType: 'Standard Room', imageIndex: 2, distanceKm: 2.3 },
    { name: 'L7 Myeongdong by Lotte',            stars: 4, baseRate: 240, amenities: ['Free WiFi','Bar','Restaurant','Gym','Rooftop Bar'],                        rating: '4.5', reviews: 3800, roomType: 'Deluxe Room',  imageIndex: 3, distanceKm: 1.2 },
    { name: 'Novotel Suites Ambassador Yongsan', stars: 4, baseRate: 190, amenities: ['Free WiFi','Pool','Restaurant','Gym'],                                     rating: '4.3', reviews: 2900, roomType: 'Standard Room', imageIndex: 4, distanceKm: 5.4 },
  ],
  'Amsterdam, Netherlands': [
    { name: 'Waldorf Astoria Amsterdam',         stars: 5, baseRate: 680, amenities: ['Free WiFi','Spa','Restaurant','Bar','Concierge','Canal View'],             rating: '4.9', reviews: 1400, roomType: 'Suite',         imageIndex: 0, distanceKm: 1.0 },
    { name: 'Sofitel Legend The Grand',          stars: 5, baseRate: 490, amenities: ['Free WiFi','Spa','Pool','Restaurant','Bar'],                               rating: '4.8', reviews: 1800, roomType: 'Junior Suite',  imageIndex: 1, distanceKm: 0.7 },
    { name: 'ibis Amsterdam Centre',             stars: 3, baseRate: 150, amenities: ['Free WiFi','Bar','Restaurant'],                                            rating: '4.2', reviews: 4700, roomType: 'Standard Room', imageIndex: 2, distanceKm: 1.4 },
    { name: 'Andaz Amsterdam Prinsengracht',     stars: 5, baseRate: 420, amenities: ['Free WiFi','Spa','Restaurant','Bar','Gym'],                                rating: '4.7', reviews: 2100, roomType: 'Deluxe Room',  imageIndex: 3, distanceKm: 1.6 },
    { name: 'INK Hotel Amsterdam',               stars: 4, baseRate: 260, amenities: ['Free WiFi','Bar','Restaurant'],                                            rating: '4.4', reviews: 3200, roomType: 'Deluxe Room',  imageIndex: 4, distanceKm: 0.9 },
  ],
  'Rome, Italy': [
    { name: 'Hotel de Russie',                   stars: 5, baseRate: 720, amenities: ['Free WiFi','Pool','Spa','Restaurant','Bar','Concierge'],                   rating: '4.9', reviews: 1600, roomType: 'Suite',         imageIndex: 0, distanceKm: 1.7 },
    { name: 'Rome Cavalieri, a Waldorf Astoria', stars: 5, baseRate: 550, amenities: ['Free WiFi','Pool','Spa','Gym','Restaurant','Bar','Room Service'],          rating: '4.8', reviews: 1900, roomType: 'Deluxe Room',  imageIndex: 1, distanceKm: 7.8 },
    { name: 'Bettoja Mediterraneo Hotel',        stars: 4, baseRate: 200, amenities: ['Free WiFi','Restaurant','Bar','Concierge'],                                rating: '4.3', reviews: 3400, roomType: 'Standard Room', imageIndex: 2, distanceKm: 2.1 },
    { name: 'Hotel Artemide',                    stars: 4, baseRate: 260, amenities: ['Free WiFi','Spa','Restaurant','Bar'],                                      rating: '4.5', reviews: 2800, roomType: 'Deluxe Room',  imageIndex: 3, distanceKm: 2.4 },
    { name: 'Generator Rome',                    stars: 3, baseRate: 120, amenities: ['Free WiFi','Bar','Concierge'],                                             rating: '4.1', reviews: 5100, roomType: 'Standard Room', imageIndex: 4, distanceKm: 1.9 },
  ],
  'San Francisco, USA': [
    { name: 'The Marker San Francisco',          stars: 4, baseRate: 320, amenities: ['Free WiFi','Gym','Restaurant','Bar','Concierge'],                          rating: '4.5', reviews: 2100, roomType: 'Deluxe Room',  imageIndex: 0, distanceKm: 1.2 },
    { name: 'Hotel Zephyr',                      stars: 4, baseRate: 280, amenities: ['Free WiFi','Bar','Restaurant','Outdoor Space'],                            rating: '4.3', reviews: 3100, roomType: 'Standard Room', imageIndex: 1, distanceKm: 2.3 },
    { name: 'Fairmont San Francisco',            stars: 5, baseRate: 580, amenities: ['Free WiFi','Spa','Restaurant','Bar','Concierge','Room Service'],           rating: '4.7', reviews: 1800, roomType: 'Junior Suite',  imageIndex: 2, distanceKm: 0.9 },
    { name: 'Hilton San Francisco Union Square', stars: 4, baseRate: 240, amenities: ['Free WiFi','Pool','Gym','Restaurant','Bar'],                               rating: '4.2', reviews: 4500, roomType: 'Standard Room', imageIndex: 3, distanceKm: 1.0 },
    { name: 'Westin St. Francis',                stars: 5, baseRate: 460, amenities: ['Free WiFi','Spa','Restaurant','Bar','Concierge'],                          rating: '4.6', reviews: 2300, roomType: 'Deluxe Room',  imageIndex: 4, distanceKm: 1.1 },
  ],
}

// ── Pet-friendly data ──────────────────────────────────────────────────────
const PET_FRIENDLY_HOTELS = new Set([
  'Hôtel Plaza Athénée','Novotel Paris Centre',
  'The Savoy','Marriott London Grosvenor Square',
  'Park Hyatt Tokyo','The Prince Gallery Tokyo Kioicho',
  'The Plaza Hotel','The Standard High Line',
  'Shutters on the Beach','Freehand Los Angeles',
  'Royal Hawaiian Hotel','Outrigger Reef Waikiki Beach',
  'Address Downtown Dubai','Rove Downtown Dubai',
  'The Fullerton Hotel Singapore','Park Hotel Clarke Quay',
  'Mandarin Oriental Bangkok','The Quarter Ladprao',
  'Park Hyatt Sydney','The Old Clare Hotel',
  'Lotte Hotel Seoul','L7 Myeongdong by Lotte',
  'Andaz Amsterdam Prinsengracht','INK Hotel Amsterdam',
  'Hotel de Russie','Hotel Artemide',
  'The Marker San Francisco','Hotel Zephyr',
])

const PET_FEE_MAP = {
  'Hôtel Plaza Athénée': 75, 'The Savoy': 75, 'Park Hyatt Tokyo': 65,
  'The Plaza Hotel': 75, 'Shutters on the Beach': 65, 'Royal Hawaiian Hotel': 60,
  'Address Downtown Dubai': 50, 'The Fullerton Hotel Singapore': 55,
  'Mandarin Oriental Bangkok': 60, 'Park Hyatt Sydney': 65, 'Lotte Hotel Seoul': 45,
  'Marriott London Grosvenor Square': 50, 'The Prince Gallery Tokyo Kioicho': 65,
  'The Standard High Line': 40, 'Freehand Los Angeles': 30,
  'Outrigger Reef Waikiki Beach': 45, 'Rove Downtown Dubai': 25,
  'Park Hotel Clarke Quay': 30, 'The Quarter Ladprao': 20,
  'The Old Clare Hotel': 35, 'L7 Myeongdong by Lotte': 35,
  'Andaz Amsterdam Prinsengracht': 45, 'INK Hotel Amsterdam': 30,
  'Hotel Artemide': 35, 'Novotel Paris Centre': 25,
  'Hotel de Russie': 70, 'The Marker San Francisco': 40, 'Hotel Zephyr': 30,
}

function getPetAmenities(fee) {
  if (fee >= 60) return ['Pet-Friendly','Pet Spa','Pet Sitting','Dog Park','Pet Beds & Bowls','Vet on Call']
  if (fee >= 35) return ['Pet-Friendly','Dog Park','Pet Walking Service','Pet Beds & Bowls','Outdoor Space']
  return ['Pet-Friendly','Outdoor Space','Pet Beds & Bowls']
}

// ── Helpers ────────────────────────────────────────────────────────────────
function normalizeDestination(input) {
  const raw = String(input || '').trim().toUpperCase()
  const match = raw.match(/\(([A-Z]{3})\)/)
  const code = match ? match[1] : (/^[A-Z]{3}$/.test(raw) ? raw : null)
  if (code && DESTINATION_ALIASES[code]) return DESTINATION_ALIASES[code]
  if (DESTINATION_ALIASES[raw]) return DESTINATION_ALIASES[raw]
  return String(input || '').trim()
}

function normalizeCountry(value) {
  const c = String(value || '').trim()
  return COUNTRY_ALIASES[c.toUpperCase()] || c || 'United States'
}

function calcNights(from, to) {
  return Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000))
}

function augment(hotel, dest, nights) {
  const petFriendly = PET_FRIENDLY_HOTELS.has(hotel.name)
  const petFeePerNight = petFriendly ? (PET_FEE_MAP[hotel.name] ?? 35) : null
  return {
    id: `LOCAL-${hotel.name.replace(/\W/g, '')}-${hotel.imageIndex}`,
    name: hotel.name, location: dest, stars: hotel.stars,
    pricePerNight: hotel.baseRate, totalPrice: hotel.baseRate * nights, nights,
    amenities: hotel.amenities, rating: hotel.rating, reviews: hotel.reviews,
    roomType: hotel.roomType, imageIndex: hotel.imageIndex, imageUrl: null,
    distanceKm: hotel.distanceKm ?? null,
    petFriendly, petFeePerNight,
    petAmenities: petFriendly ? getPetAmenities(petFeePerNight) : [],
  }
}

function fromInventory(params) {
  const dest = normalizeDestination(params.destination)
  const nights = calcNights(params.fromDate, params.toDate || params.fromDate)
  const defs = HOTEL_INVENTORY[dest]
  if (!defs) throw new Error(`No hotels found for "${params.destination}". Try: Paris, London, Tokyo, New York, Los Angeles…`)
  return defs.map((h) => augment(h, dest, nights))
}

function mapApiHotel(h, idx, params) {
  const dest = normalizeDestination(params.destination)
  const nights = calcNights(params.fromDate, params.toDate || params.fromDate)
  const totalPrice = h.composite_price_breakdown?.gross_amount?.value ?? h.min_total_price ?? 0
  const nightlyPrice = Math.round(h.composite_price_breakdown?.gross_amount_per_night?.value ?? (totalPrice / nights) ?? 0)
  const amenities = []
  if (h.is_free_cancellable) amenities.push('Free cancellation')
  if (h.hotel_include_breakfast) amenities.push('Breakfast included')
  if (h.accommodation_type_name) amenities.push(h.accommodation_type_name)
  const raw = {
    id: String(h.hotel_id ?? h.id ?? `HT-${idx}`),
    name: h.hotel_name || h.hotel_name_trans || 'Hotel',
    location: dest, stars: Math.max(1, Math.min(5, Math.round(Number(h.class) || 3))),
    pricePerNight: nightlyPrice, totalPrice: Math.round(totalPrice), nights,
    amenities, rating: Number(h.review_score || 0).toFixed(1),
    reviews: Number(h.review_nr || 0), roomType: h.accommodation_type_name || 'Room',
    imageIndex: idx % 5, imageUrl: h.max_photo_url || null,
    petFriendly: false, petFeePerNight: null, petAmenities: [],
  }
  const petFriendly = PET_FRIENDLY_HOTELS.has(raw.name)
  const petFeePerNight = petFriendly ? (PET_FEE_MAP[raw.name] ?? 35) : null
  return { ...raw, petFriendly, petFeePerNight, petAmenities: petFriendly ? getPetAmenities(petFeePerNight) : [] }
}

export const hotelService = {
  async search(params) {
    const { destination, fromDate, toDate, adults = 1, children = 0,
            travelingWithPets = false, petCount = 1 } = params
    let hotels

    try {
      const dest = normalizeDestination(destination)
      const [destName, countryLabel] = dest.split(',').map((s) => s.trim())
      const data = await api.get('/hotels/search', {
        dest_name: destName || destination,
        country_name: normalizeCountry(countryLabel),
        checkin_date: fromDate,
        checkout_date: toDate || fromDate,
        adults_number: adults,
        children_number: children,
        dest_type: 'city',
        order_by: 'popularity',
        filter_by_currency: 'USD',
        locale: 'en-gb',
        room_number: 1,
      })
      const items = Array.isArray(data) ? data : (data.result || data.results || data.hotels || data.data || [])
      if (items.length > 0) {
        hotels = items.map((h, i) => mapApiHotel(h, i, params)).filter((h) => h.pricePerNight > 0)
      } else {
        hotels = fromInventory(params)
      }
    } catch {
      hotels = fromInventory(params)
    }

    if (travelingWithPets) {
      hotels = hotels.filter((h) => h.petFriendly)
      if (hotels.length === 0) throw new Error(`No pet-friendly hotels found for "${destination}".`)
    }

    return hotels.sort((a, b) => a.pricePerNight - b.pricePerNight)
  },
}
