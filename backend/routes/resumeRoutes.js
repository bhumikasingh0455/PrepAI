const express = require('express');
const router = express.Router();
const { uploadAndAnalyzeResume, getResumeHistory } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('resume'), uploadAndAnalyzeResume);
router.get('/history', protect, getResumeHistory);

module.exports = router;
