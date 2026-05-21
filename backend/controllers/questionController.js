const Question = require('../models/Question');
const { generateQuestions } = require('../services/openaiService');

/**
 * @desc    Generate questions using OpenAI or mock service
 * @route   POST /api/questions/generate
 * @access  Private
 */
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, difficulty, experienceLevel, count } = req.body;

    if (!role || !difficulty || !experienceLevel) {
      return res.status(400).json({ success: false, message: 'Please provide role, difficulty, and experience level' });
    }

    const numQuestions = count ? parseInt(count) : 5;
    const questions = await generateQuestions(role, difficulty, experienceLevel, numQuestions);

    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Generate Questions Error:', error);
    return res.status(500).json({ success: false, message: 'Server error generating questions' });
  }
};

/**
 * @desc    Save a bookmarked question
 * @route   POST /api/questions/save
 * @access  Private
 */
const saveQuestion = async (req, res) => {
  try {
    const { role, difficulty, experienceLevel, questionText } = req.body;

    if (!role || !difficulty || !experienceLevel || !questionText) {
      return res.status(400).json({ success: false, message: 'Please provide all details to save the question' });
    }

    // Check if already saved
    const exists = await Question.findOne({
      userId: req.user._id,
      questionText: questionText,
    });

    if (exists) {
      return res.status(400).json({ success: false, message: 'Question already saved' });
    }

    const saved = await Question.create({
      userId: req.user._id,
      role,
      difficulty,
      experienceLevel,
      questionText,
    });

    return res.status(201).json({
      success: true,
      message: 'Question saved successfully',
      data: saved,
    });
  } catch (error) {
    console.error('Save Question Error:', error);
    return res.status(500).json({ success: false, message: 'Server error saving question' });
  }
};

/**
 * @desc    Get user's saved questions
 * @route   GET /api/questions/saved
 * @access  Private
 */
const getSavedQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.user._id }).sort({ savedAt: -1 });
    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Get Saved Questions Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching saved questions' });
  }
};

/**
 * @desc    Delete a saved question
 * @route   DELETE /api/questions/saved/:id
 * @access  Private
 */
const deleteSavedQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Verify ownership
    if (question.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Question removed from bookmarks',
    });
  } catch (error) {
    console.error('Delete Saved Question Error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting question' });
  }
};

module.exports = {
  generateInterviewQuestions,
  saveQuestion,
  getSavedQuestions,
  deleteSavedQuestion,
};
