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

const createOfflineFallbackModel = require('../config/mockModel');

const GoalModel = mongoose.model('Goal', goalSchema);

const now = new Date();
const addDays = (days) => new Date(now.getTime() + days * 86400000).toISOString();

module.exports = createOfflineFallbackModel(GoalModel, {
  defaults: {
    category: 'Personal Development',
    completed: false,
    subtasks: [],
  },
  seed: [
    {
      text: 'Ship Q4 Product Roadmap',
      category: 'Work & Career',
      startDate: addDays(-5),
      endDate: addDays(14),
      completed: false,
      subtasks: [
        { title: 'Finalize API specifications', completed: true, duration: '3d' },
        { title: 'Complete frontend integration', completed: false, duration: '5d' },
      ],
    },
    {
      text: 'Run 10K Marathon Prep',
      category: 'Sport & Health',
      startDate: addDays(-2),
      endDate: addDays(21),
      completed: false,
      subtasks: [
        { title: '5K tempo run', completed: true, duration: '1d' },
      ],
    },
    {
      text: 'Complete System Design Course',
      category: 'Personal Development',
      startDate: addDays(-15),
      endDate: addDays(-1),
      completed: true,
      subtasks: [],
    },
  ],
});