// models/EngineerProfile.js
const mongoose = require("mongoose");

const EngineerProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  expertise: { type: [String], required: true },
  projects: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      techStack: { type: String, required: true },
      github: { type: String },
      live: { type: String },
    },
  ],
});

const EngineerProfile = mongoose.model(
  "EngineerProfile",
  EngineerProfileSchema
);

module.exports = EngineerProfile;
