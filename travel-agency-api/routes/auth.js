const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password, first_name, last_name, phone_number } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password required"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, password, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?)`,
      [username, hashedPassword, first_name || null, last_name || null, phone_number || null],
      function (err) {
        if (err) {
          return res.status(500).json({
            error: "User already exists or database error"
          });
        }

        res.json({
          message: "User registered successfully",
          userId: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error: "Server error"
    });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({
          error: "Database error"
        });
      }

      if (!user) {
        return res.status(401).json({
          error: "Invalid username or password"
        });
      }

      const validPassword = await bcrypt.compare(
        password,
        user.password
      );

      if (!validPassword) {
        return res.status(401).json({
          error: "Invalid username or password"
        });
      }

      res.json({
        message: "Login successful",
        userId: user.id
      });
    }
  );
});

module.exports = router;