const express = require('express');
const router = express.Router();
const {
  getProjects,
  addProject,
  updateProject,
} = require('../controllers/projectController');

router.route('/').get(getProjects).post(addProject);
router.route('/:id').put(updateProject);

module.exports = router;