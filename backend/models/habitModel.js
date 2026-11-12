const mongoose = require('mongoose');

const habitSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a habit name'],
    },
    streak: {
      type: Number,
      default: 0,
    },
    completedDates: {
      type: [String], // Array of date strings (e.g., "2026-11-10")
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Habit', habitSchema);