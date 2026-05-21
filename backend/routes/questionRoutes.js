const express = require('express');
const router = express.Router();
const {
  generateInterviewQuestions,
  saveQuestion,
  getSavedQuestions,
  deleteSavedQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateInterviewQuestions);
router.post('/save', protect, saveQuestion);
router.get('/saved', protect, getSavedQuestions);
router.delete('/saved/:id', protect, deleteSavedQuestion);

module.exports = router;
