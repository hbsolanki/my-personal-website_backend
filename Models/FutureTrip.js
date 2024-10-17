// models/FutureTrip.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  activity: { type: String, required: true },
  description: { type: String, required: true },
});

const futureTripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  events: [eventSchema], // Include the events array
});

const FutureTrip = mongoose.model("FutureTrip", futureTripSchema);
module.exports = FutureTrip;
