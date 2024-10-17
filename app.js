require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PastTrip = require("./models/PastTrip");
const FutureTrip = require("./models/FutureTrip");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
console.log("Mongo URI:", process.env.MONGO_URI);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Hardcoded admin user with hashed password
const adminUser = {
  username: "admin",
  password: "hb@0524", // Replace with the actual hashed password
};

// Admin authentication
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === adminUser.username && password == "hb@0524") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

// Initial Data Setup (for demonstration)
const initializeData = async () => {
  const pastTripCount = await PastTrip.countDocuments();
  if (pastTripCount === 0) {
    const initialPastTrips = [
      {
        title: "Trip to Paris",
        date: new Date("2023-06-15"),
        description: "Visited the Eiffel Tower and other attractions.",
        photo: "link_to_photo.jpg",
        driveLink: "link_to_drive",
        events: [
          {
            date: new Date("2023-06-16"),
            activity: "Visit Louvre Museum",
            description: "Explored the art collections.",
          },
          {
            date: new Date("2023-06-17"),
            activity: "Enjoyed a Seine River Cruise",
            description: "Relaxed and enjoyed the views.",
          },
        ],
      },
      // Add more initial past trips as needed
    ];
    await PastTrip.insertMany(initialPastTrips);
    console.log("Initial past trips data inserted.");
  }

  const futureTripCount = await FutureTrip.countDocuments();
  if (futureTripCount === 0) {
    const initialFutureTrips = [
      {
        title: "Trip to Japan",
        date: new Date("2024-05-01"),
        description: "Exploring Tokyo and Kyoto.",
        photo: "link_to_future_photo.jpg",
        driveLink: "link_to_future_drive",
      },
      // Add more initial future trips as needed
    ];
    await FutureTrip.insertMany(initialFutureTrips);
    console.log("Initial future trips data inserted.");
  }
};

// API endpoints for past trips
app.post("/api/past-trips", authenticate, async (req, res) => {
  try {
    const pastTrip = new PastTrip(req.body);
    const savedTrip = await pastTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/past-trips", async (req, res) => {
  try {
    const trips = await PastTrip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoints for future trips
app.post("/api/future-trips", authenticate, async (req, res) => {
  try {
    const futureTrip = new FutureTrip(req.body);
    const savedTrip = await futureTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/future-trips", async (req, res) => {
  try {
    const trips = await FutureTrip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize data on server start
// initializeData();

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
