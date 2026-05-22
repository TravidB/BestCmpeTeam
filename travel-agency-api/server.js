const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const db = require("./database/db");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const hotelRoutes = require("./routes/hotels");
const attractionRoutes = require("./routes/attractions");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/attractions", attractionRoutes);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pet-Friendly Travel API",
      version: "1.0.0",
      description: "APIs for hotel, attraction, booking, and user authentication in the pet-friendly travel app.",
    },
    servers: [{ url: "http://localhost:5001" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Pet Travel Backend Running");
});

const createPaymentsTable = `
CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
);
`;

db.run(createPaymentsTable, (err) => {
    if (err) {
        console.error("Error creating payments table", err.message);
    } else {
        console.log("Payments table created successfully");
    }
});

app.post('/api/payments', (req, res) => {
    const { booking_id, user_id, amount, payment_method } = req.body;

    if (!booking_id || !user_id || !amount) {
        return res.status(400).json({ error: "Missing required payment fields" });
    }

    const paymentStatus = "SUCCESS";

    const insertPayment = `
        INSERT INTO payments (booking_id, user_id, amount, status) 
        VALUES (?, ?, ?, ?)
    `;

    db.run(insertPayment, [booking_id, user_id, amount, paymentStatus], function(err) {
        if (err) {
            return res.status(500).json({ error: "Payment processing failed" });
        }
        
        res.status(201).json({ 
            message: "Payment successful",
            payment_id: this.lastID,
            status: paymentStatus 
        });
    });
});

app.get('/api/payments/user/:user_id', (req, res) => {
    const userId = req.params.user_id;

    const getPayments = `SELECT * FROM payments WHERE user_id = ? ORDER BY payment_date DESC`;

    db.all(getPayments, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve payments" });
        }
        res.status(200).json(rows);
    });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
