const mongoose = require('mongoose');

const QuestionSessionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: '',
  },
});

const InterviewSessionSchema = new mongoose.Schema({
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
  questions: [QuestionSessionSchema],
  overallScore: {
    type: Number,
    default: 0,
  },
  commFeedback: {
    type: String,
    default: '',
  },
  techFeedback: {
    type: String,
    default: '',
  },
  suggestions: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
