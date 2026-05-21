const express = require("express");
const router = express.Router();

const ATTRACTIONS = [
  {
    id: 1,
    city: "San Jose",
    parkName: "Willow Glen Park",
    distanceMiles: 0.8,
    distanceKm: 1.3,
    walkable: true,
    petFriendly: true,
    details: "Tree-lined walking paths, pet waste stations, and open grass areas.",
  },
  {
    id: 2,
    city: "San Jose",
    parkName: "Almaden Lake Park",
    distanceMiles: 1.5,
    distanceKm: 2.4,
    walkable: true,
    petFriendly: true,
    details: "Lakeside trails perfect for morning dog walks and quiet corners.",
  },
  {
    id: 3,
    city: "San Francisco",
    parkName: "Golden Gate Park",
    distanceMiles: 0.9,
    distanceKm: 1.45,
    walkable: true,
    petFriendly: true,
    details: "Wide paths, dog-friendly picnic areas, and a short route to the park entrance.",
  },
  {
    id: 4,
    city: "Seattle",
    parkName: "Discovery Park",
    distanceMiles: 1.2,
    distanceKm: 1.9,
    walkable: true,
    petFriendly: true,
    details: "Large open trails, beach view, and plenty of green space for pets.",
  },
  {
    id: 5,
    city: "Austin",
    parkName: "Zilker Park",
    distanceMiles: 0.6,
    distanceKm: 1.0,
    walkable: true,
    petFriendly: true,
    details: "Famous walking trails and dog-friendly river access close to the hotel.",
  },
  {
    id: 6,
    city: "Miami",
    parkName: "Bayside Park",
    distanceMiles: 0.7,
    distanceKm: 1.1,
    walkable: true,
    petFriendly: true,
    details: "Waterfront paths and plenty of shaded walking routes.",
  },
];

/**
 * @openapi
 * /api/attractions:
 *   get:
 *     summary: Retrieve nearby pet-friendly attractions and parks
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter attractions by city
 *       - in: query
 *         name: parkName
 *         schema:
 *           type: string
 *         description: Filter attractions by park name
 *     responses:
 *       200:
 *         description: A list of nearby attractions
 */
router.get("/", (req, res) => {
  const city = (req.query.city || "").toLowerCase();
  const parkName = (req.query.parkName || "").toLowerCase();

  const filtered = ATTRACTIONS.filter((item) => {
    return (
      item.city.toLowerCase().includes(city) &&
      item.parkName.toLowerCase().includes(parkName)
    );
  });

  if (!filtered.length) {
    return res.json({ message: "No locations found based on your selection", data: [] });
  }

  res.json(filtered);
});

module.exports = router;
