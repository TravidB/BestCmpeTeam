const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/pet_travel.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      first_name TEXT,
      last_name TEXT,
      phone_number TEXT
    )
  `);
  db.run(`ALTER TABLE users ADD COLUMN first_name TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN last_name TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN phone_number TEXT`, () => {});

  // Flights table
  db.run(`
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      departure TEXT,
      destination TEXT,
      date TEXT,
      available INTEGER
    )
  `);

  // Hotels table
  db.run(`
    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT,
      attraction TEXT,
      hotelName TEXT,
      available INTEGER
    )
  `);

  // Bookings table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      type TEXT,
      itemId INTEGER
    )
  `);
});

module.exports = db;