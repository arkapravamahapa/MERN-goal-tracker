const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getTeam } = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/', getTeam);

module.exports = router;