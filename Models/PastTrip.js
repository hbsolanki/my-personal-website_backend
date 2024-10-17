const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  activity: { type: String, required: true },
  description: { type: String, required: true },
});

const pastTripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  driveLink: { type: String },
  events: [eventSchema], // Include the events array
});

const PastTrip = mongoose.model("PastTrip", pastTripSchema);
module.exports = PastTrip;
