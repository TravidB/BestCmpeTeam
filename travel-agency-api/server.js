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

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
