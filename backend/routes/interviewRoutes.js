const express = require('express');
const router = express.Router();
const {
  submitInterviewSession,
  getInterviewHistory,
  getInterviewSessionById,
  getScoreHistory,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitInterviewSession);
router.get('/history', protect, getInterviewHistory);
router.get('/session/:id', protect, getInterviewSessionById);
router.get('/scores', protect, getScoreHistory);

module.exports = router;
