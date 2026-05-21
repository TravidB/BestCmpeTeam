const express = require("express");
const db = require("../database/db");

const router = express.Router();

// GET BOOKINGS
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  db.all(
    `SELECT * FROM bookings WHERE userId = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Database error"
        });
      }

      res.json(rows);
    }
  );
});

// CREATE BOOKING
router.post("/", (req, res) => {
  const { userId, type, itemName, num_tickets, num_pets } = req.body;

  db.run(
    `INSERT INTO bookings (userId, type, itemId, num_tickets, num_pets)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, type, itemName, num_tickets || 1, num_pets || 0],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Database error"
        });
      }

      res.json({
        message: "Booking created successfully"
      });
    }
  );
});

// DELETE BOOKING
router.delete("/:id", (req, res) => {
  const bookingId = req.params.id;

  db.run(
    `DELETE FROM bookings WHERE id = ?`,
    [bookingId],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Database error"
        });
      }

      res.json({
        message: "Booking deleted successfully"
      });
    }
  );
});

module.exports = router;