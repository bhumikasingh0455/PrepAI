const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Question', QuestionSchema);
