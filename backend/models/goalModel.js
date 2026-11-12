const mongoose = require('mongoose');

const subtaskSchema = mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  duration: { type: String, default: '1d' } // e.g., '7d', '1m'
});

const goalSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a text value for the goal'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      default: 'Personal Development'
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date']
    },
    completed: {
      type: Boolean,
      default: false,
    },
    subtasks: [subtaskSchema] // <-- This enables the nested hierarchy
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Goal', goalSchema);