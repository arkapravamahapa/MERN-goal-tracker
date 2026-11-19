const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      default: 'Team Member',
    }
  },
  {
    timestamps: true,
  }
);

const createOfflineFallbackModel = require('../config/mockModel');

const UserModel = mongoose.model('User', userSchema);

module.exports = createOfflineFallbackModel(UserModel, {
  defaults: {
    role: 'Team Member',
  },
  seed: [],
});