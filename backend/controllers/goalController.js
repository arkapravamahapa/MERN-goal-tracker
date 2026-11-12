const Goal = require('../models/goalModel');

// @desc    Get all goals
// @route   GET /api/goals
const getGoals = async (req, res) => {
  try {
    // Sort by start date so the timeline flows chronologically
    const goals = await Goal.find().sort({ startDate: 1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Set a new goal
// @route   POST /api/goals
const setGoal = async (req, res) => {
  try {
    const { text, category, startDate, endDate } = req.body;

    if (!text || !category || !startDate || !endDate) {
      res.status(400).json({ message: 'Please add all required fields (text, category, startDate, endDate)' });
      return;
    }

    const goal = await Goal.create({
      text,
      category,
      startDate,
      endDate
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    await goal.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};