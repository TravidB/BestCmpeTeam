import { useState } from "react";

function App() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [message, setMessage] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");

  const [userId, setUserId] = useState(null);

  const [bookings, setBookings] = useState([]);
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
  async function createBooking(type, itemName) {
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
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>Pet-Friendly Travel Booking</h1>

        <p>{message}</p>

        <h2>Login</h2>

        <input
          placeholder="Username"
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
          placeholder="New Username"
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

        <button onClick={handleRegister}>Register</button>
      </div>
    );
  }

  // DASHBOARD
  if (currentPage === "dashboard") {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
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
    );
  }

  // FLIGHTS PAGE
  if (currentPage === "flights") {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>Available Flights</h1>

        {flights.map((flight) => (
          <div key={flight.id}>
            <p>
              {flight.departure} → {flight.destination}
            </p>

            <p>{flight.date}</p>

            <button
              disabled={!flight.available}
              onClick={() =>
                createBooking(
                  "Flight",
                  `${flight.departure} to ${flight.destination}`
                )
              }
            >
              {flight.available ? "Book" : "Sold Out"}
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

  // HOTELS PAGE
  if (currentPage === "hotels") {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>Pet-Friendly Hotels</h1>

        {hotels.map((hotel) => (
          <div key={hotel.id}>
            <p>{hotel.hotelName}</p>

            <p>
              Near: {hotel.attraction}
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

  // MY BOOKINGS PAGE
  if (currentPage === "myBookings") {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>My Bookings</h1>

        {bookings.map((booking) => (
          <div key={booking.id}>
            <p>
              {booking.type}: {booking.itemId}
            </p>
            <button
              onClick={() => editBooking(booking.id)}
            >
              Edit Booking
            </button>
            <button
              onClick={() => deleteBooking(booking.id)}
            >
              Cancel Booking
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
}

export default App;