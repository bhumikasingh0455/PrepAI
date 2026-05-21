const express = require('express');
const router = express.Router();
const { getDsaProgress, toggleProblemStatus, getLeaderboard } = require('../controllers/dsaController');
const { protect } = require('../middleware/authMiddleware');

router.get('/progress', protect, getDsaProgress);
router.post('/toggle', protect, toggleProblemStatus);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
