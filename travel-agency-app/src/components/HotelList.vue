<script setup>
const props = defineProps({
  hotels: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  selectedHotel: { type: Object, default: null },
  travelingWithPets: { type: Boolean, default: false },
  petCount: { type: Number, default: 1 },
  petType: { type: String, default: 'dog' },
  selectedFlight: { type: Object, default: null },
})

const emit = defineEmits(['select'])

function renderStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count)
}

function petEmoji(type) {
  if (type === 'cat') return '🐱'
  if (type === 'other') return '🐇'
  return '🐶'
}

function petTotalFee(hotel) {
  if (!hotel.petFriendly || !hotel.petFeePerNight) return 0
  return hotel.petFeePerNight * hotel.nights * props.petCount
}

function travelTotal(hotel) {
  const flightCost = props.selectedFlight ? props.selectedFlight.totalPrice : 0
  return hotel.totalPrice + petTotalFee(hotel) + flightCost
}

// Deterministic hotel color palettes
const palettes = [
  ['#1a365d', '#2c5282'],
  ['#276749', '#2f855a'],
  ['#744210', '#975a16'],
  ['#553c9a', '#6b46c1'],
  ['#2c7a7b', '#285e61'],
]
</script>

<template>
  <div class="panel-content">
    <template v-if="loading">
      <div v-for="n in 4" :key="n" class="card skeleton" />
    </template>

    <div v-else-if="error" class="state-message state-message--error">
      <span class="state-icon">⚠️</span>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="hotels.length === 0" class="state-message">
      <span class="state-icon">{{ travelingWithPets ? '🐾' : '🏨' }}</span>
      <p>{{ travelingWithPets ? 'No pet-friendly hotels found. Try a different destination.' : 'No hotels found. Try adjusting your dates.' }}</p>
    </div>

    <div
      v-else
      v-for="(hotel, idx) in hotels"
      :key="hotel.id"
      class="card hotel-card"
      :class="{ 'card--selected': selectedHotel?.id === hotel.id, 'card--pet-friendly': hotel.petFriendly }"
      @click="emit('select', hotel)"
    >
      <div
        class="hotel-card__image"
        :style="{ background: `linear-gradient(135deg, ${palettes[hotel.imageIndex][0]}, ${palettes[hotel.imageIndex][1]})` }"
      >
        <span class="hotel-icon">{{ hotel.petFriendly ? '🐾' : '🏨' }}</span>
      </div>

      <div class="hotel-card__body">
        <div class="hotel-card__top">
          <div class="hotel-card__info">
            <div class="hotel-name-row">
              <span class="hotel-name">{{ hotel.name }}</span>
              <span v-if="hotel.petFriendly" class="pet-badge">🐾 Pet-Friendly</span>
            </div>
            <div class="hotel-location">📍 {{ hotel.location }}</div>
            <div class="hotel-stars">
              <span class="stars">{{ renderStars(hotel.stars) }}</span>
              <span class="rating-badge">{{ hotel.rating }} · {{ hotel.reviews }} reviews</span>
            </div>
          </div>
          <div class="hotel-price-block">
            <span class="price">${{ hotel.pricePerNight }}</span>
            <span class="price-sub">/ night</span>
            <div class="price-total">${{ hotel.totalPrice.toLocaleString() }} hotel</div>
            <div v-if="travelingWithPets && hotel.petFriendly && hotel.petFeePerNight" class="pet-fee-line">
              +${{ hotel.petFeePerNight }}/night per {{ petEmoji(petType) }}
            </div>
            <div class="price-nights">{{ hotel.nights }} night{{ hotel.nights > 1 ? 's' : '' }}</div>
          </div>
        </div>

        <!-- Regular amenities -->
        <div class="hotel-card__amenities">
          <span v-for="amenity in hotel.amenities" :key="amenity" class="amenity-tag">
            {{ amenity }}
          </span>
        </div>

        <!-- Pet amenities (shown when traveling with pets) -->
        <div v-if="travelingWithPets && hotel.petAmenities && hotel.petAmenities.length" class="hotel-card__pet-amenities">
          <span v-for="amenity in hotel.petAmenities" :key="amenity" class="amenity-tag amenity-tag--pet">
            {{ amenity }}
          </span>
        </div>

        <!-- Travel cost breakdown -->
        <div v-if="travelingWithPets && hotel.petFriendly" class="travel-cost-bar">
          <div class="travel-cost-label">Total travel cost</div>
          <div class="travel-cost-items">
            <span class="cost-item">🏨 ${{ hotel.totalPrice.toLocaleString() }}</span>
            <span class="cost-sep">+</span>
            <span class="cost-item cost-item--pet">🐾 ${{ petTotalFee(hotel).toLocaleString() }} pet fees</span>
            <template v-if="selectedFlight">
              <span class="cost-sep">+</span>
              <span class="cost-item">✈️ ${{ selectedFlight.totalPrice.toLocaleString() }}</span>
            </template>
            <span class="cost-sep">=</span>
            <span class="cost-total">${{ travelTotal(hotel).toLocaleString() }}</span>
          </div>
        </div>
        <div v-else-if="selectedFlight" class="travel-cost-bar travel-cost-bar--plain">
          <div class="travel-cost-label">Total travel cost</div>
          <div class="travel-cost-items">
            <span class="cost-item">🏨 ${{ hotel.totalPrice.toLocaleString() }}</span>
            <span class="cost-sep">+</span>
            <span class="cost-item">✈️ ${{ selectedFlight.totalPrice.toLocaleString() }}</span>
            <span class="cost-sep">=</span>
            <span class="cost-total">${{ travelTotal(hotel).toLocaleString() }}</span>
          </div>
        </div>

        <div class="hotel-card__footer">
          <span class="tag">{{ hotel.roomType }}</span>
          <span v-if="travelingWithPets && !hotel.petFriendly" class="no-pets-tag">No pets allowed</span>
          <span v-if="selectedHotel?.id === hotel.id" class="selected-indicator">✓ Selected</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card {
  background: #fff;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.1s;
  overflow: hidden;
  display: flex;
}

.card:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 4px 16px rgba(26, 54, 93, 0.1);
  transform: translateY(-1px);
}

.card--selected {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.15) !important;
  background: var(--color-primary-bg);
}

.card--pet-friendly {
  border-color: #b7e4c7;
}

.card--pet-friendly:hover {
  border-color: #52b788;
  box-shadow: 0 4px 16px rgba(82, 183, 136, 0.15);
}

.skeleton {
  height: 110px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  cursor: default;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.state-message {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
}

.state-message--error { color: #c0392b; }

.state-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.hotel-card__image {
  width: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hotel-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.hotel-card__body {
  flex: 1;
  padding: 0.9rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.hotel-card__top {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.hotel-card__info {
  flex: 1;
  min-width: 0;
}

.hotel-name-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.hotel-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
}

.pet-badge {
  font-size: 0.68rem;
  font-weight: 700;
  background: #d8f3dc;
  color: #1b4332;
  padding: 2px 7px;
  border-radius: 20px;
  white-space: nowrap;
}

.hotel-location {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin: 2px 0;
}

.hotel-stars {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.stars {
  color: #f6ad55;
  font-size: 0.78rem;
  letter-spacing: 1px;
}

.rating-badge {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.hotel-price-block {
  text-align: right;
  flex-shrink: 0;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.price-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.price-total {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text);
  margin-top: 2px;
}

.pet-fee-line {
  font-size: 0.7rem;
  color: #2d6a4f;
  font-weight: 600;
  margin-top: 1px;
}

.price-nights {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.hotel-card__amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.hotel-card__pet-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.amenity-tag {
  font-size: 0.68rem;
  background: #e8f4fd;
  color: #1a5276;
  padding: 2px 7px;
  border-radius: 20px;
}

.amenity-tag--pet {
  background: #d8f3dc;
  color: #1b4332;
  font-weight: 600;
}

/* Travel cost breakdown bar */
.travel-cost-bar {
  background: #f0fdf4;
  border: 1px solid #b7e4c7;
  border-radius: 8px;
  padding: 0.45rem 0.7rem;
  margin-top: 0.2rem;
}

.travel-cost-bar--plain {
  background: #f0f4ff;
  border-color: #c3d0f5;
}

.travel-cost-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #2d6a4f;
  margin-bottom: 0.25rem;
}

.travel-cost-bar--plain .travel-cost-label {
  color: var(--color-primary);
}

.travel-cost-items {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.cost-item {
  font-size: 0.75rem;
  color: var(--color-text);
}

.cost-item--pet {
  color: #2d6a4f;
  font-weight: 600;
}

.cost-sep {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.cost-total {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--color-primary);
}

.hotel-card__footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tag {
  font-size: 0.72rem;
  background: var(--color-bg-subtle);
  color: var(--color-text-muted);
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 500;
}

.no-pets-tag {
  font-size: 0.68rem;
  background: #fff3cd;
  color: #856404;
  padding: 2px 7px;
  border-radius: 20px;
}

.selected-indicator {
  margin-left: auto;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
}
</style>
