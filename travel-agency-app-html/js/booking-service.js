import { api } from './api.js'

function normalizeDate(v, fallback = '') {
  if (!v) return fallback
  const d = new Date(v)
  return isNaN(d) ? String(v) : d.toISOString().split('T')[0]
}

function normalizeTime(v, fallback = '00:00:00') {
  const raw = String(v || '').trim()
  if (!raw) return fallback
  const m = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (m) return `${m[1].padStart(2,'0')}:${m[2]}:${m[3] || '00'}`
  return fallback
}

function splitFlightNumber(v) {
  const raw = String(v || '').trim().toUpperCase()
  const m = raw.match(/^([A-Z]{2,3})\s*-?(\d{1,4}[A-Z]?)$/)
  return m ? { airlineCode: m[1], flightNumber: m[2] } : { airlineCode: '', flightNumber: raw }
}

function airportCode(v) {
  return String(v || '').trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
}

function buildHotelReservation(hotel, searchParams, petInfo) {
  const nights = hotel.nights || 1
  const pet = petInfo
  return {
    Hotel_Code: Number.parseInt(String(hotel.id ?? ''), 10) || 0,
    Check_In_Date: normalizeDate(hotel.checkIn || searchParams.fromDate),
    Check_In_Time: normalizeTime(hotel.checkInTime),
    Check_Out_Date: normalizeDate(hotel.checkOut || searchParams.toDate || searchParams.fromDate),
    Check_Out_Time: normalizeTime(hotel.checkOutTime),
    Rate: Number(hotel.totalPrice ?? 0),
    Pet_Count: pet ? Number(pet.petCount) : 0,
    Pet_Type: pet ? String(pet.petType) : null,
    Pet_Fee: pet ? Number(pet.petFeePerNight ?? 0) * Number(pet.petCount) * nights : 0,
  }
}

function buildFlightReservation(flight, searchParams) {
  const split = splitFlightNumber(flight.flightNumber)
  const code = split.airlineCode || airportCode(flight.airline).slice(0, 2)
  return {
    Airline_Code: code,
    Flight_Number: split.flightNumber,
    Departure_Date: normalizeDate(flight.date || searchParams.fromDate),
    Departure_Time: normalizeTime(flight.departureTime),
    Arrive_Date: normalizeDate(flight.date || searchParams.fromDate),
    Arrive_Time: normalizeTime(flight.arrivalTime),
    Rate: Number(flight.totalPrice ?? 0),
    Origin_Airport_Code: airportCode(flight.origin || searchParams.origin),
    Destination_Airport_Code: airportCode(flight.destination || searchParams.destination),
  }
}

export const bookingService = {
  async createBooking({ userId, agentId, searchParams, flight, returnFlight, hotel, petInfo }) {
    if (!flight && !hotel) throw new Error('Select at least a flight or hotel before booking.')

    const flights = []
    if (flight) flights.push(buildFlightReservation(flight, searchParams))
    if (returnFlight) flights.push(buildFlightReservation(returnFlight, { ...searchParams, fromDate: searchParams.toDate, origin: searchParams.destination, destination: searchParams.origin }))

    const body = {
      User_Id: Number(userId),
      Agent_Id: Number(agentId) || null,
      Start_Date: normalizeDate(searchParams.fromDate),
      End_Date: normalizeDate(searchParams.toDate || searchParams.fromDate),
      hotel_reservations: hotel ? [buildHotelReservation(hotel, searchParams, petInfo)] : [],
      flight_reservations: flights,
    }

    const result = await api.post('/bookings/', body)
    return {
      success: true,
      bookingReference: String(result?.Booking_Id || result?.booking_id || result?.id || ''),
      message: 'Your booking has been confirmed!',
    }
  },

  async listBookings(userId, agentId) {
    if (!userId) throw new Error('Please sign in to view saved trips.')
    const params = { user_id: userId }
    if (agentId != null) params.agent_id = agentId
    const bookings = await api.get('/bookings/by-agent-user', params)
    return (Array.isArray(bookings) ? bookings : []).map((b) => ({
      bookingId: b.Booking_Id ?? b.booking_id ?? b.id,
      startDate: b.Start_Date ?? b.start_date,
      endDate: b.End_Date ?? b.end_date,
      user: b.user,
      hotelReservations: b.hotel_reservations || [],
      flightReservations: b.flight_reservations || [],
    })).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  },

  async updateBooking(bookingId, { startDate, endDate }) {
    return api.patch(`/bookings/${bookingId}`, {
      ...(startDate ? { Start_Date: startDate } : {}),
      ...(endDate ? { End_Date: endDate } : {}),
    })
  },

  async deleteBooking(bookingId) {
    return api.delete(`/bookings/${bookingId}`)
  },
}
