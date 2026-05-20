const express = require("express");
const cors = require("cors");

const db = require("./database/db");

const authRoutes = require("./routes/auth");

const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Pet Travel Backend Running");
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});