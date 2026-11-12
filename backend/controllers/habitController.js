const Habit = require('../models/habitModel');

// @desc    Get all habits
// @route   GET /api/habits
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a habit
// @route   POST /api/habits
const addHabit = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: 'Please add a habit name' });
    }
    const habit = await Habit.create({ name: req.body.name });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check-in / Update a habit
// @route   PUT /api/habits/:id
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    
    // We expect the frontend to pass the updated streak and completedDates array
    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    
    await habit.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getHabits, addHabit, updateHabit, deleteHabit };