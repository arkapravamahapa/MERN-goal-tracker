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

const createOfflineFallbackModel = require('../config/mockModel');

const HabitModel = mongoose.model('Habit', habitSchema);

module.exports = createOfflineFallbackModel(HabitModel, {
  defaults: {
    streak: 0,
    completedDates: [],
  },
  seed: [
    {
      name: 'Deep Work (90 mins)',
      streak: 5,
      completedDates: [],
    },
    {
      name: 'Drink 2L of Water',
      streak: 3,
      completedDates: [],
    },
  ],
});