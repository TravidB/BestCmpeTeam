import { useMemo, useState, useEffect } from "react";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const AGENCIES = {
  A: { name: "SkyLux Travel", logo: "🛫", primary: "#0f766e", accent: "#1f2937", tagline: "Travel pet-friendly, everywhere." },
  B: { name: "Horizon Adventures", logo: "🌍", primary: "#2563eb", accent: "#1f2937", tagline: "Discover journeys made for pets." },
};

const FLIGHTS = [
  { id: 1, departure: "San Jose", destination: "New York", date: "2026-06-01", available: true },
  { id: 2, departure: "San Francisco", destination: "Los Angeles", date: "2026-06-05", available: false },
  { id: 3, departure: "Seattle", destination: "Chicago", date: "2026-06-08", available: true },
  { id: 4, departure: "Austin", destination: "Miami", date: "2026-06-09", available: true },
  { id: 5, departure: "Boston", destination: "Denver", date: "2026-06-10", available: true },
  { id: 6, departure: "Las Vegas", destination: "San Diego", date: "2026-06-11", available: false },
  { id: 7, departure: "Portland", destination: "Phoenix", date: "2026-06-12", available: true },
  { id: 8, departure: "Dallas", destination: "Atlanta", date: "2026-06-13", available: true },
  { id: 9, departure: "Houston", destination: "Orlando", date: "2026-06-14", available: true },
  { id: 10, departure: "San Jose", destination: "Chicago", date: "2026-06-15", available: true },
  { id: 11, departure: "San Francisco", destination: "Seattle", date: "2026-06-16", available: true },
  { id: 12, departure: "New York", destination: "Boston", date: "2026-06-17", available: false },
  { id: 13, departure: "Miami", destination: "Dallas", date: "2026-06-18", available: true },
  { id: 14, departure: "Chicago", destination: "Austin", date: "2026-06-19", available: true },
  { id: 15, departure: "Denver", destination: "San Jose", date: "2026-06-20", available: true },
  { id: 16, departure: "Phoenix", destination: "Las Vegas", date: "2026-06-21", available: false },
  { id: 17, departure: "Atlanta", destination: "Portland", date: "2026-06-22", available: true },
  { id: 18, departure: "San Diego", destination: "Houston", date: "2026-06-23", available: true },
  { id: 19, departure: "Orlando", destination: "Seattle", date: "2026-06-24", available: true },
  { id: 20, departure: "Boston", destination: "Miami", date: "2026-06-25", available: true },
];

function App() {
  const [agency] = useState("A");
  const [page, setPage] = useState("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flightSearch, setFlightSearch] = useState({ departure: "", destination: "", date: "" });
  const [hotelSearch, setHotelSearch] = useState({ city: "", attraction: "", date: "" });
  const [numTickets, setNumTickets] = useState(1);
  const [numPets, setNumPets] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editTickets, setEditTickets] = useState(1);
  const [editPets, setEditPets] = useState(0);

  const handlePayment = async (bookingId, amount) => {
    try {
      const response = await fetch(`${API_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          user_id: userId,
          amount: amount,
          payment_method: "Credit Card"
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Payment Successful! ID: " + data.payment_id);
      } else {
        alert("Payment Failed: " + data.error);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment Error! Check server.");
    }
  };

  const agencyData = AGENCIES[agency];

  useEffect(() => {
    if (page !== "hotels") return;

    const controller = new AbortController();
    const params = new URLSearchParams();

    if (hotelSearch.city) params.append("city", hotelSearch.city);
    if (hotelSearch.attraction) params.append("attraction", hotelSearch.attraction);
    if (hotelSearch.date) params.append("date", hotelSearch.date);

    fetch(`${API_BASE}/hotels?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setHotels(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setHotels([]);
      });

    return () => controller.abort();
  }, [hotelSearch, page]);

  const filteredFlights = useMemo(
    () => FLIGHTS.filter((flight) => {
      return (
        flight.departure.toLowerCase().includes(flightSearch.departure.toLowerCase()) &&
        flight.destination.toLowerCase().includes(flightSearch.destination.toLowerCase()) &&
        flight.date.includes(flightSearch.date)
      );
    }),
    [flightSearch]
  );

  const setAlert = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 5000);
  };

  const handleRegister = async () => {
    if (!registerUsername.trim() || !registerPassword.trim()) {
      setAlert("Please provide a username and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: registerUsername, password: registerPassword, phone_number: registerPhone || undefined }),
      });

      const data = await response.json();
      if (!response.ok) {
        setAlert(data.error || data.message || "Registration failed.");
        return;
      }

      setAlert(data.message || "Registered successfully.");
    } catch (error) {
      setAlert("Unable to reach the backend. Please make sure the server is running.");
    }
  };

  const handleLogin = async () => {
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setAlert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setAlert(data.error || data.message || "Login failed.");
        return;
      }

      setLoggedIn(true);
      setUserId(data.userId);
      setPage("dashboard");
      setMessage("Welcome back!");
    } catch (error) {
      setAlert("Unable to reach the backend. Please make sure the server is running.");
    }
  };

  const loadBookings = async () => {
    if (!userId) {
      setAlert("You must be logged in to see bookings.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/bookings/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        setAlert(data.error || data.message || "Unable to load bookings.");
        return;
      }

      setBookings(Array.isArray(data) ? data : []);
      setPage("myBookings");
    } catch (error) {
      setAlert("Unable to reach the backend. Please make sure the server is running.");
    }
  };

  const createBooking = async (type, itemName, tickets, pets) => {
    if (!userId) {
      setAlert("Please login before booking.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type, itemName, num_tickets: tickets ?? 1, num_pets: pets ?? 0 }),
      });

      const data = await response.json();
      if (!response.ok) {
        setAlert(data.error || data.message || "Booking request failed.");
        return;
      }

      setAlert(data.message || "Booking created successfully.");
    } catch (error) {
      setAlert("Unable to reach the backend. Please make sure the server is running.");
    }
  };

  const deleteBooking = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/bookings/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        setAlert(data.error || data.message || "Unable to delete booking.");
        return;
      }
      loadBookings();
    } catch (error) {
      setAlert("Unable to reach the backend. Please make sure the server is running.");
    }
  };

  const editBooking = (booking) => {
    setEditingId(booking.id);
    setEditTickets(booking.num_tickets ?? 1);
    setEditPets(booking.num_pets ?? 0);
  };

  const saveBookingEdit = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_tickets: editTickets, num_pets: editPets }),
      });
      const data = await response.json();
      setAlert(data.message || data.error || "");
    } catch {
      setAlert("Failed to save — check that the backend server is running.");
    } finally {
      setEditingId(null);
      await loadBookings();
    }
  };

  const Header = () => (
    <header className="app-header" style={{ backgroundColor: agencyData.primary }}>
      <div className="app-brand">
        <span className="app-logo">{agencyData.logo}</span>
        <div>
          <h1>{agencyData.name}</h1>
          <p>{agencyData.tagline}</p>
        </div>
      </div>
      <nav>
        <button className={page === "dashboard" ? "nav-active" : ""} onClick={() => setPage("dashboard")}>Dashboard</button>
        <button className={page === "flights" ? "nav-active" : ""} onClick={() => setPage("flights")}>Flights</button>
        <button className={page === "hotels" ? "nav-active" : ""} onClick={() => setPage("hotels")}>Hotels</button>
        <button className={page === "myBookings" ? "nav-active" : ""} onClick={loadBookings}>Bookings</button>
      </nav>
    </header>
  );

  if (!loggedIn) {
    return (
      <div className="App">
        <Header />
        <main className="app-main">
          <section className="form-card">
            <div className="form-header">
              <h2>Pet-Friendly Travel Login</h2>
              <p>Sign in or create a new account to manage your pet-friendly travel bookings.</p>
            </div>
            <div className="form-grid">
              <div>
                <h3>Login</h3>
                <label>
                  Username
                  <input value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Username" />
                </label>
                <label>
                  Password
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" />
                </label>
                <button className="button primary" onClick={handleLogin}>Login</button>
              </div>
              <div>
                <h3>Create Account</h3>
                <label>
                  Username
                  <input value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} placeholder="Username" />
                </label>
                <label>
                  Password
                  <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" />
                </label>
                <label>
                  Phone Number
                  <input value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} placeholder="Optional" />
                </label>
                <button className="button secondary" onClick={handleRegister}>Register</button>
              </div>
            </div>
            {message && <div className="alert">{message}</div>}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="app-main">
        <section className="dashboard-card">
          {message && <div className="alert">{message}</div>}
          {page === "dashboard" && (
            <>
              <h2>Welcome to your travel dashboard</h2>
              <p>Choose a booking path to search flights, hotels, or manage existing reservations.</p>
              <div className="button-row">
                <button className="button primary" onClick={() => setPage("flights")}>Book Flights</button>
                <button className="button primary" onClick={() => setPage("hotels")}>Search Hotels</button>
                <button className="button secondary" onClick={loadBookings}>My Bookings</button>
                <button className="button ghost" onClick={() => { setLoggedIn(false); setPage("login"); setMessage(""); }}>Logout</button>
              </div>
            </>
          )}

          {page === "flights" && (
            <>
              <div className="page-header">
                <h2>Search Pet-Friendly Flights</h2>
                <button className="button ghost" onClick={() => setPage("dashboard")}>Back to Dashboard</button>
              </div>
              <div className="search-grid">
                <label>
                  Departure
                  <input value={flightSearch.departure} onChange={(e) => setFlightSearch({ ...flightSearch, departure: e.target.value })} placeholder="San Jose" />
                </label>
                <label>
                  Destination
                  <input value={flightSearch.destination} onChange={(e) => setFlightSearch({ ...flightSearch, destination: e.target.value })} placeholder="New York" />
                </label>
                <label>
                  Travel Date
                  <input type="date" value={flightSearch.date} onChange={(e) => setFlightSearch({ ...flightSearch, date: e.target.value })} />
                </label>
                <label>
                  Tickets
                  <input type="number" min="1" max="10" value={numTickets} onChange={(e) => setNumTickets(Math.max(1, parseInt(e.target.value) || 1))} />
                </label>
                <label>
                  Pets 🐾
                  <input type="number" min="0" max="5" value={numPets} onChange={(e) => setNumPets(Math.max(0, parseInt(e.target.value) || 0))} />
                </label>
              </div>
              <div className="listing-grid">
                {filteredFlights.map((flight) => (
                  <article key={flight.id} className="listing-card">
                    <div className="listing-title">{flight.departure} → {flight.destination}</div>
                    <div className="listing-meta">{flight.date}</div>
                    <button className="button primary" disabled={!flight.available} onClick={() => createBooking("Flight", `${flight.departure} to ${flight.destination}`, numTickets, numPets)}>
                      {flight.available ? "Book Flight" : "Sold Out"}
                    </button>
                  </article>
                ))}
                {!filteredFlights.length && <p className="empty-state">No flights match your search.</p>}
              </div>
            </>
          )}

          {page === "hotels" && (
            <>
              <div className="page-header">
                <h2>Search Pet-Friendly Hotels</h2>
                <button className="button ghost" onClick={() => setPage("dashboard")}>Back to Dashboard</button>
              </div>
              <div className="search-grid">
                <label>
                  City
                  <input value={hotelSearch.city} onChange={(e) => setHotelSearch({ ...hotelSearch, city: e.target.value })} placeholder="New York" />
                </label>
                <label>
                  Attraction
                  <input value={hotelSearch.attraction} onChange={(e) => setHotelSearch({ ...hotelSearch, attraction: e.target.value })} placeholder="Central Park" />
                </label>
                <label>
                  Travel Date
                  <input type="date" value={hotelSearch.date} onChange={(e) => setHotelSearch({ ...hotelSearch, date: e.target.value })} />
                </label>
              </div>
              <div className="listing-grid">
                {hotels.map((hotel) => (
                  <article key={hotel.id} className="listing-card">
                    <div className="listing-title">{hotel.hotelName}</div>
                    <div className="listing-meta">{hotel.city} · Near {hotel.attraction}</div>
                    <p>{hotel.petDetails}</p>
                    <button className="button primary" disabled={!hotel.available} onClick={() => createBooking("Hotel", hotel.hotelName)}>
                      {hotel.available ? "Book Hotel" : "Sold Out"}
                    </button>
                  </article>
                ))}
                {!hotels.length && <p className="empty-state">No hotels match your search.</p>}
              </div>
            </>
          )}

          {page === "myBookings" && (
            <>
              <div className="page-header">
                <h2>My Bookings</h2>
                <button className="button ghost" onClick={() => setPage("dashboard")}>Back to Dashboard</button>
              </div>
              {bookings.length === 0 ? (
                <div className="empty-state">No bookings found. Book a flight or hotel to get started.</div>
              ) : (
                <div className="listing-grid">
                  {bookings.map((booking) => (
                    <article key={booking.id} className="listing-card">
                      <div className="listing-title">{booking.type}</div>
                      <div className="listing-meta">{booking.itemId}</div>

                      {editingId === booking.id ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "8px 0" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            Tickets
                            <input type="number" min="1" max="10" value={editTickets}
                              onChange={(e) => setEditTickets(Math.max(1, parseInt(e.target.value) || 1))}
                              style={{ display: "block", width: "70px", marginTop: "3px", padding: "4px 6px", borderRadius: "6px", border: "1px solid #ccc" }} />
                          </label>
                          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            Pets 🐾
                            <input type="number" min="0" max="5" value={editPets}
                              onChange={(e) => setEditPets(Math.max(0, parseInt(e.target.value) || 0))}
                              style={{ display: "block", width: "70px", marginTop: "3px", padding: "4px 6px", borderRadius: "6px", border: "1px solid #ccc" }} />
                          </label>
                          <div className="card-actions">
                            <button className="button primary" onClick={() => saveBookingEdit(booking.id)}>Save</button>
                            <button className="button ghost" onClick={() => setEditingId(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="listing-meta">
                            🎟 {booking.num_tickets ?? 1} ticket{(booking.num_tickets ?? 1) !== 1 ? "s" : ""}
                            {(booking.num_pets ?? 0) > 0 && ` · 🐾 ${booking.num_pets} pet${booking.num_pets !== 1 ? "s" : ""}`}
                          </div>
                          <div className="card-actions">
                            <button className="button secondary" onClick={() => editBooking(booking)}>Edit</button>
                            <button className="button ghost" onClick={() => deleteBooking(booking.id)}>Cancel</button> 
			    <button className="button primary" onClick={() => handlePayment(booking.id, 50.00)} style={{marginLeft: "10px", backgroundColor: "#0f766e", color: "white"}}>Pay Now</button>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
