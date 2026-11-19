const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
    },
    color: {
      type: String,
      default: 'bg-blue-500',
    },
    hours: {
      type: [String], // Array of 7 strings representing hours for Mon-Sun
      default: ['', '', '', '', '', '', ''],
    }
  },
  {
    timestamps: true,
  }
);

const createOfflineFallbackModel = require('../config/mockModel');

const ProjectModel = mongoose.model('Project', projectSchema);

module.exports = createOfflineFallbackModel(ProjectModel, {
  defaults: {
    color: 'bg-blue-500',
    hours: ['', '', '', '', '', '', ''],
  },
  seed: [
    {
      name: 'FocusFlow Platform',
      color: 'bg-blue-500',
      hours: ['4:00', '3:30', '5:00', '4:00', '2:30', '', ''],
    },
    {
      name: 'Client Architecture Review',
      color: 'bg-purple-500',
      hours: ['2:00', '1:30', '', '2:00', '1:00', '', ''],
    },
  ],
});