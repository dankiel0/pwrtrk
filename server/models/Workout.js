const mongoose = require("mongoose");

// Define a schema for the Workout model
const workoutSchema = new mongoose.Schema({
  username: { type: String, required: true },
  exercise: { type: String, required: true },
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
  date: { type: Date, required: true },
  rpe: { type: Number, required: true },
  notes: { type: String, default: "(no notes...yet)" },
});

module.exports = mongoose.model("Workout", workoutSchema);
