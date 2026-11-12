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

module.exports = mongoose.model('Project', projectSchema);