import { useState } from "react";

const AGENCIES = {
  A: { name: "SkyLux Travel",       logo: "🛫", primary: "#1a3270", tagline: "Travel in Style" },
  B: { name: "Horizon Adventures",  logo: "🌍", primary: "#0f766e", tagline: "Go Further, Explore More" },
};

function App() {
  const [agency, setAgency] = useState("A");
  const ag = AGENCIES[agency];

  const Header = () => (
    <div style={{
      background: ag.primary, color: "#fff",
      padding: "0 24px", height: "52px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 8px rgba(0,0,0,.2)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "1.4rem" }}>{ag.logo}</span>
        <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>{ag.name}</span>
        <div style={{ display: "flex", gap: "5px", marginLeft: "14px" }}>
          {["A","B"].map(k => (
            <button key={k} onClick={() => setAgency(k)} style={{
              padding: "2px 11px", borderRadius: "999px",
              border: "1.5px solid rgba(255,255,255,.5)",
              background: agency === k ? "rgba(255,255,255,.25)" : "transparent",
              color: "#fff", fontWeight: 700, fontSize: "0.73rem", cursor: "pointer",
            }}>Agency {k}</button>
          ))}
        </div>
      </div>
      <span style={{ fontSize: "0.75rem", opacity: 0.65, fontStyle: "italic" }}>
        {ag.tagline}
      </span>
    </div>
  );

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");

  const [message, setMessage] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");

  const [userId, setUserId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [numTickets, setNumTickets] = useState(1);
  const [numPets, setNumPets] = useState(0);
  const [flightSearch, setFlightSearch] = useState({
    departure: "",
    destination: "",
    date: "",
  });

  const [hotelSearch, setHotelSearch] = useState({
    city: "",
    attraction: "",
    date: "",
  });

  // MOCK FLIGHTS
  const flights = [
    {
      id: 1,
      departure: "San Jose",
      destination: "New York",
      date: "2026-06-01",
      available: true,
    },
    {
      id: 2,
      departure: "San Francisco",
      destination: "Los Angeles",
      date: "2026-06-05",
      available: false,
    },
    {
      id: 3,
      departure: "Seattle",
      destination: "Chicago",
      date: "2026-06-08",
      available: true,
    },
    {
      id: 4,
      departure: "Austin",
      destination: "Miami",
      date: "2026-06-09",
      available: true,
    },
    {
      id: 5,
      departure: "Boston",
      destination: "Denver",
      date: "2026-06-10",
      available: true,
    },
    {
      id: 6,
      departure: "Las Vegas",
      destination: "San Diego",
      date: "2026-06-11",
      available: false,
    },
    {
      id: 7,
      departure: "Portland",
      destination: "Phoenix",
      date: "2026-06-12",
      available: true,
    },
    {
      id: 8,
      departure: "Dallas",
      destination: "Atlanta",
      date: "2026-06-13",
      available: true,
    },
    {
      id: 9,
      departure: "Houston",
      destination: "Orlando",
      date: "2026-06-14",
      available: true,
    },
    {
      id: 10,
      departure: "San Jose",
      destination: "Chicago",
      date: "2026-06-15",
      available: true,
    },
    {
      id: 11,
      departure: "San Francisco",
      destination: "Seattle",
      date: "2026-06-16",
      available: true,
    },
    {
      id: 12,
      departure: "New York",
      destination: "Boston",
      date: "2026-06-17",
      available: false,
    },
    {
      id: 13,
      departure: "Miami",
      destination: "Dallas",
      date: "2026-06-18",
      available: true,
    },
    {
      id: 14,
      departure: "Chicago",
      destination: "Austin",
      date: "2026-06-19",
      available: true,
    },
    {
      id: 15,
      departure: "Denver",
      destination: "San Jose",
      date: "2026-06-20",
      available: true,
    },
    {
      id: 16,
      departure: "Phoenix",
      destination: "Las Vegas",
      date: "2026-06-21",
      available: false,
    },
    {
      id: 17,
      departure: "Atlanta",
      destination: "Portland",
      date: "2026-06-22",
      available: true,
    },
    {
      id: 18,
      departure: "San Diego",
      destination: "Houston",
      date: "2026-06-23",
      available: true,
    },
    {
      id: 19,
      departure: "Orlando",
      destination: "Seattle",
      date: "2026-06-24",
      available: true,
    },
    {
      id: 20,
      departure: "Boston",
      destination: "Miami",
      date: "2026-06-25",
      available: true,
    },
  ];

  // MOCK HOTELS
  const hotels = [
    {
      id: 1,
      city: "New York",
      attraction: "Central Park",
      hotelName: "Pet Paradise Hotel",
      petDetails: "Organic dog meals and pet spa",
      available: true,
    },
    {
      id: 2,
      city: "Los Angeles",
      attraction: "West Hollywood",
      hotelName: "Happy Paws Resort",
      petDetails: "Large dog friendly with pet walking service",
      available: true,
    },
    {
      id: 3,
      city: "Seattle",
      attraction: "Space Needle",
      hotelName: "Cloud Nine Pets Hotel",
      petDetails: "Nearby veterinary clinic included",
      available: true,
    },
    {
      id: 4,
      city: "Chicago",
      attraction: "Millennium Park",
      hotelName: "Urban Tail Suites",
      petDetails: "Indoor pet playground",
      available: true,
    },
    {
      id: 5,
      city: "Miami",
      attraction: "South Beach",
      hotelName: "Ocean Paw Resort",
      petDetails: "Pet beach access and grooming",
      available: true,
    },
    {
      id: 6,
      city: "Boston",
      attraction: "Fenway Park",
      hotelName: "Green Bark Inn",
      petDetails: "Pet daycare included",
      available: false,
    },
    {
      id: 7,
      city: "Austin",
      attraction: "Zilker Park",
      hotelName: "Lone Star Pet Lodge",
      petDetails: "Pet-friendly outdoor park access",
      available: true,
    },
    {
      id: 8,
      city: "Denver",
      attraction: "Red Rocks",
      hotelName: "Mountain Paws Retreat",
      petDetails: "Hiking trails for pets",
      available: true,
    },
    {
      id: 9,
      city: "San Diego",
      attraction: "Balboa Park",
      hotelName: "Sunny Tail Hotel",
      petDetails: "Pet swimming pool available",
      available: true,
    },
    {
      id: 10,
      city: "Orlando",
      attraction: "Disney Springs",
      hotelName: "Magic Pet Resort",
      petDetails: "Pet sitting service included",
      available: true,
    },
    {
      id: 11,
      city: "Dallas",
      attraction: "Klyde Warren Park",
      hotelName: "Texas Wag Hotel",
      petDetails: "Pet training classes",
      available: true,
    },
    {
      id: 12,
      city: "Phoenix",
      attraction: "Camelback Mountain",
      hotelName: "Desert Paw Inn",
      petDetails: "Cooling pet rooms",
      available: true,
    },
    {
      id: 13,
      city: "Las Vegas",
      attraction: "The Strip",
      hotelName: "Lucky Paw Suites",
      petDetails: "24-hour pet room service",
      available: false,
    },
    {
      id: 14,
      city: "Syracuse",
      attraction: "Forest Park",
      hotelName: "Golden Pet Lodge",
      petDetails: "Eco-friendly pet accommodations",
      available: true,
    },
    {
      id: 15,
      city: "Atlanta",
      attraction: "Piedmont Park",
      hotelName: "Shaky Pet Hotel",
      petDetails: "Dog walking and pet spa",
      available: true,
    },
    {
      id: 16,
      city: "Houston",
      attraction: "Discovery Green",
      hotelName: "Yve's Bark Hotel",
      petDetails: "Pet gourmet meals",
      available: true,
    },
    {
      id: 17,
      city: "San Francisco",
      attraction: "Golden Gate Park",
      hotelName: "Vincent's Paw Palace",
      petDetails: "Nearby pet-friendly cafes",
      available: true,
    },
    {
      id: 18,
      city: "New York",
      attraction: "Times Square",
      hotelName: "Lucia's Pet Suites",
      petDetails: "Luxury pet spa services",
      available: true,
    },
    {
      id: 19,
      city: "Seattle",
      attraction: "Seahawks Stadium",
      hotelName: "Yk's Fantasyland",
      petDetails: "Indoor pet recreation area",
      available: true,
    },
    {
      id: 20,
      city: "Miami",
      attraction: "Bayside Marketplace",
      hotelName: "Bui's Resort",
      petDetails: "Pet tropical menu available",
      available: true,
    },
  ];

  // MOCK HOTELS
  if (currentPage === "hotels") {

    const filteredHotels = hotels.filter((hotel) => {
      return (
        hotel.city
          .toLowerCase()
          .includes(hotelSearch.city.toLowerCase()) &&

        hotel.attraction
          .toLowerCase()
          .includes(hotelSearch.attraction.toLowerCase())
      );
    });

    return (
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>Pet-Friendly Hotel Search</h1>

        <input
          placeholder="City"
          value={hotelSearch.city}
          onChange={(e) =>
            setHotelSearch({
              ...hotelSearch,
              city: e.target.value,
            })
          }
        />

        <br /><br />

        <input
          placeholder="Nearby Attraction"
          value={hotelSearch.attraction}
          onChange={(e) =>
            setHotelSearch({
              ...hotelSearch,
              attraction: e.target.value,
            })
          }
        />

        <br /><br />

        <input
          placeholder="Travel Date"
          value={hotelSearch.date}
          onChange={(e) =>
            setHotelSearch({
              ...hotelSearch,
              date: e.target.value,
            })
          }
        />

        <hr />

        {filteredHotels.map((hotel) => (
          <div key={hotel.id}>
            <p>{hotel.hotelName}</p>

            <p>
              Nearby Attraction: {hotel.attraction}
            </p>
            <p>
              Pet Services: {hotel.petDetails}
            </p>

            <button
              disabled={!hotel.available}
              onClick={() =>
                createBooking(
                  "Hotel",
                  hotel.hotelName
                )
              }
            >
              {hotel.available ? "Book" : "Sold Out"}
            </button>

            <hr />
          </div>
        ))}

        <button onClick={() => setCurrentPage("dashboard")}>
          Back
        </button>
      </div>
    );
  }

  // CREATE BOOKING
  async function createBooking(type, itemName, tickets, pets) {
    const response = await fetch(
      "http://localhost:5001/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          type,
          itemName,
          num_tickets: tickets ?? 1,
          num_pets: pets ?? 0,
        }),
      }
    );

    const data = await response.json();

    setMessage(data.message);
  }

  // REGISTER
  const handleRegister = async () => {
    const response = await fetch(
      "http://localhost:5001/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword,
          phone_number: registerPhone || undefined,
        }),
      }
    );

    const data = await response.json();

    setMessage(data.message || data.error);
  };

  // LOGIN
  const handleLogin = async () => {
    const response = await fetch(
      "http://localhost:5001/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      }
    );

    const data = await response.json();

    if (data.message === "Login successful") {
      setLoggedIn(true);

      setUserId(data.userId);

      setCurrentPage("dashboard");
    }

    setMessage(data.message || data.error);
  };

  // LOGOUT
  const handleLogout = () => {
    setLoggedIn(false);

    setMessage("");

    setLoginUsername("");
    setLoginPassword("");
  };

  // LOAD BOOKINGS
  const loadBookings = async () => {
    const response = await fetch(
      `http://localhost:5001/bookings/${userId}`
    );

    const data = await response.json();

    setBookings(data);

    setCurrentPage("myBookings");
  };

  //EDIT BOOKING
  const editBooking = (id) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === id) {
        return {
          ...booking,
          itemId: booking.itemId + " (Updated)"
        };
      }

      return booking;
    });

    setBookings(updatedBookings);

    setMessage("Booking updated successfully");
  };

  // DELETE BOOKING
  const deleteBooking = async (id) => {
    await fetch(
      `http://localhost:5001/bookings/${id}`,
      {
        method: "DELETE",
      }
    );

    loadBookings();
  };

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div style={{ fontFamily: "Arial" }}>
        <Header />
        <div style={{ padding: "40px" }}>
        <h1>Pet-Friendly Travel Booking</h1>

        <p>{message}</p>

        <h2>Login</h2>

        <input
          placeholder="Email"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Password"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={handleLogin}>Login</button>

        <hr />

        <h2>Create New Account</h2>

        <input
          placeholder="Email"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="New Password"
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Phone Number (optional)"
          value={registerPhone}
          onChange={(e) => setRegisterPhone(e.target.value)}
        />

        <br /><br />

        <button onClick={handleRegister}>Register</button>
        </div>
      </div>
    );
  }

  // DASHBOARD
  if (currentPage === "dashboard") {
    return (
      <div style={{ fontFamily: "Arial" }}>
        <Header />
        <div style={{ padding: "40px" }}>
        <h1>Pet-Friendly Travel Dashboard</h1>

        <p>{message}</p>

        <button onClick={() => setCurrentPage("flights")}>
          Book Flight
        </button>

        <br /><br />

        <button onClick={() => setCurrentPage("hotels")}>
          Book Hotel
        </button>

        <br /><br />

        <button onClick={loadBookings}>
          My Bookings
        </button>

        <br /><br />

        <button onClick={handleLogout}>
          Logout
        </button>
        </div>
      </div>
    );
  }

  // FLIGHTS PAGE
  if (currentPage === "flights") {
    return (
      <div style={{ fontFamily: "Arial" }}>
        <Header />
        <div style={{ padding: "40px" }}>
          <h1>Available Flights</h1>

          <div style={{ display: "flex", gap: "24px", marginBottom: "20px", alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontWeight: 600, fontSize: "0.9rem" }}>
              Tickets
              <input
                type="number"
                min="1"
                max="10"
                value={numTickets}
                onChange={(e) => setNumTickets(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: "70px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontWeight: 600, fontSize: "0.9rem" }}>
              Pets 🐾
              <input
                type="number"
                min="0"
                max="5"
                value={numPets}
                onChange={(e) => setNumPets(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: "70px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              />
            </label>
            <span style={{ fontSize: "0.82rem", color: "#666", alignSelf: "flex-end", paddingBottom: "8px" }}>
              These apply to whichever flight you book
            </span>
          </div>

          {flights.map((flight) => (
            <div key={flight.id}>
              <p>{flight.departure} → {flight.destination}</p>
              <p>{flight.date}</p>
              <button
                disabled={!flight.available}
                onClick={() => createBooking("Flight", `${flight.departure} to ${flight.destination}`, numTickets, numPets)}
              >
                {flight.available ? "Book" : "Sold Out"}
              </button>
              <hr />
            </div>
          ))}
          <button onClick={() => setCurrentPage("dashboard")}>Back</button>
        </div>
      </div>
    );
  }

  // HOTELS PAGE
  if (currentPage === "hotels") {
    return (
      <div style={{ fontFamily: "Arial" }}>
        <Header />
        <div style={{ padding: "40px" }}>
          <h1>Pet-Friendly Hotels</h1>
          {hotels.map((hotel) => (
            <div key={hotel.id}>
              <p>{hotel.hotelName}</p>
              <p>Near: {hotel.attraction}</p>
              <button
                disabled={!hotel.available}
                onClick={() => createBooking("Hotel", hotel.hotelName)}
              >
                {hotel.available ? "Book" : "Sold Out"}
              </button>
              <hr />
            </div>
          ))}
          <button onClick={() => setCurrentPage("dashboard")}>Back</button>
        </div>
      </div>
    );
  }

  // MY BOOKINGS PAGE
  if (currentPage === "myBookings") {
    return (
      <div style={{ fontFamily: "Arial" }}>
        <Header />
        <div style={{ padding: "40px" }}>
          <h1>My Bookings</h1>
          {bookings.length === 0 && <p style={{ color: "#888" }}>No bookings yet.</p>}
          {bookings.map((booking) => (
            <div key={booking.id} style={{ marginBottom: "12px" }}>
              <p style={{ margin: "4px 0", fontWeight: 600 }}>
                {booking.type}: {booking.itemId}
              </p>
              <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#444" }}>
                🎟 {booking.num_tickets ?? 1} ticket{(booking.num_tickets ?? 1) !== 1 ? "s" : ""}
                {(booking.num_pets ?? 0) > 0 && ` · 🐾 ${booking.num_pets} pet${booking.num_pets !== 1 ? "s" : ""}`}
              </p>
              <button onClick={() => editBooking(booking.id)}>Edit</button>
              {" "}
              <button onClick={() => deleteBooking(booking.id)}>Cancel</button>
              <hr />
            </div>
          ))}
          <button onClick={() => setCurrentPage("dashboard")}>Back</button>
        </div>
      </div>
    );
  }
}

export default App;