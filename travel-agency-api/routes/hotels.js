const express = require("express");
const router = express.Router();

const HOTELS = [
  {
    id: 1,
    city: "San Jose",
    attraction: "Willow Glen Park",
    hotelName: "Golden Paws Inn",
    available: true,
    petFriendly: true,
    date: "2027-01-24",
    foodOptions: ["Organic dog meals", "Hydration station", "Pet treat menu"],
    description: "A cozy pet-friendly hotel that welcomes large dogs with open paws.",
    roomTypes: ["Standard Suite", "Pet Family Suite"],
    nearbyPark: "Willow Glen Park",
    price: 150,
    rate: 4.5,
  },
  {
    id: 2,
    city: "San Francisco",
    attraction: "Golden Gate Park",
    hotelName: "Bay Bark Boutique",
    available: true,
    petFriendly: true,
    date: "2027-01-24",
    foodOptions: ["Pet-friendly breakfast bowl", "Dog-safe biscuits"],
    description: "Located near the park, this hotel makes walking and dining with your dog easy.",
    roomTypes: ["City View Room", "Pet Premium Room"],
    nearbyPark: "Golden Gate Park",
    price: 200,
    rate: 4.0, 
  },
  {
    id: 3,
    city: "Seattle",
    attraction: "Discovery Park",
    hotelName: "Seattle Pet Haven",
    available: true,
    petFriendly: true,
    date: "2027-03-05",
    foodOptions: ["Grain-free kibble", "Pet smoothie station"],
    description: "A calm urban hotel with dedicated pet care amenities and nearby walking paths.",
    roomTypes: ["Standard", "Deluxe Pet Suite"],
    nearbyPark: "Discovery Park",
    price: 120,
    rate: 3.8,
  },
  {
    id: 4,
    city: "Austin",
    attraction: "Zilker Park",
    hotelName: "Austin Wag Retreat",
    available: false,
    petFriendly: true,
    date: "2027-03-12",
    foodOptions: ["Pet picnic box", "Healthy chew treats"],
    description: "A popular choice among active pet owners with access to nearby trails.",
    roomTypes: ["Trail View Room", "Pet Playroom Suite"],
    nearbyPark: "Zilker Park",
    price: 180,
    rate: 4.2,
  },
  {
    id: 5,
    city: "Miami",
    attraction: "Bayside Park",
    hotelName: "Tropical Tail Suites",
    available: true,
    petFriendly: true,
    date: "2027-04-22",
    foodOptions: ["Seafood-inspired dog meal", "Cooling treats"],
    description: "Beachside hotel with pet-friendly food offerings and a walkable park nearby.",
    roomTypes: ["Ocean View", "Pet Luxury Suite"],
    nearbyPark: "Bayside Park",
    price: 250,
    rate: 4.7,
  },
];

/**
 * @openapi
 * /api/hotels:
 *   get:
 *     summary: Retrieve a list of pet-friendly hotels
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter hotels by city
 *       - in: query
 *         name: attraction
 *         schema:
 *           type: string
 *         description: Filter hotels by nearby attraction name
 *     responses:
 *       200:
 *         description: A list of pet-friendly hotels
 */
router.get("/", (req, res) => {
  const city = (req.query.city || "").toLowerCase();
  const attraction = (req.query.attraction || "").toLowerCase();
  const date = (req.query.date || "").toLowerCase();
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
  const minRating = req.query.minRating ? Number(req.query.minRating) : null;

  const sortBy = (req.query.sortBy || "").toLowerCase();

  const filtered = HOTELS.filter((hotel) => {
    const matchesDate = !date || hotel.date.toLowerCase() === date;

    return (
      hotel.petFriendly &&
      hotel.city.toLowerCase().includes(city) &&
      hotel.attraction.toLowerCase().includes(attraction) &&
      matchesDate &&
      (!minPrice || hotel.price >= minPrice) &&
      (!maxPrice || hotel.price <= maxPrice) &&
      (!minRating || hotel.rating >= minRating)

    );
  });
  if (sortBy === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating_desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json(filtered);
});

/**
 * @openapi
 * /api/hotels/{id}:
 *   get:
 *     summary: Retrieve details for a single hotel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel detail object
 *       404:
 *         description: Hotel not found
 */
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const hotel = HOTELS.find((item) => item.id === id);

  if (!hotel) {
    return res.status(404).json({ error: "Hotel not found" });
  }

  res.json(hotel);
});

module.exports = router;
