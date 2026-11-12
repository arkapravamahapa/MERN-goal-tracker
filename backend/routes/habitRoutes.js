const express = require('express');
const router = express.Router();
const { getHabits, addHabit, updateHabit, deleteHabit } = require('../controllers/habitController');

router.route('/').get(getHabits).post(addHabit);
router.route('/:id').put(updateHabit).delete(deleteHabit);

module.exports = router;