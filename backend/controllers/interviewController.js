const InterviewSession = require('../models/InterviewSession');
const Score = require('../models/Score');
const { evaluateAnswer } = require('../services/openaiService');

/**
 * @desc    Submit mock interview responses and trigger AI evaluation
 * @route   POST /api/interviews/submit
 * @access  Private
 */
const submitInterviewSession = async (req, res) => {
  try {
    const { role, difficulty, experienceLevel, questions } = req.body;

    if (!role || !difficulty || !experienceLevel || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: 'Please provide all interview session details' });
    }

    console.log(`Evaluating ${questions.length} questions for ${role}...`);

    // Perform individual answer evaluations in parallel
    const evaluatedQuestions = await Promise.all(
      questions.map(async (q) => {
        const evaluation = await evaluateAnswer(q.questionText, q.userAnswer, role, difficulty);
        return {
          questionText: q.questionText,
          userAnswer: q.userAnswer || '',
          score: evaluation.score,
          feedback: `${evaluation.commFeedback} | ${evaluation.technicalFeedback}`,
        };
      })
    );

    // Calculate overall average score
    const totalScore = evaluatedQuestions.reduce((acc, curr) => acc + curr.score, 0);
    const overallScore = Math.round(totalScore / evaluatedQuestions.length);

    // Generate aggregated technical/communication summaries based on question scores
    let commFeedback = 'Communication shows professional attempt.';
    let techFeedback = 'Technical concepts generally covered.';
    let suggestions = 'Focus on detailing specific syntax, complexity analyses (Time/Space), and architectural tradeoffs.';

    if (overallScore >= 80) {
      commFeedback = 'Excellent fluency and confidence. Explanations are clear, concise, and structured logically.';
      techFeedback = 'Strong depth of technical knowledge. Demonstrates a clear understanding of runtime complexities and core frameworks.';
      suggestions = 'Keep up the good work! Enhance your edge by practicing system design topics and design patterns.';
    } else if (overallScore >= 50) {
      commFeedback = 'Good explanation style. However, you can use the STAR method to structure your responses more effectively.';
      techFeedback = 'Understands core definitions, but some technical answers lack detail. Make sure to cover operational trade-offs and edge cases.';
      suggestions = 'Review intermediate topics for this role. Practice coding problems on paper before speaking them out loud.';
    } else {
      commFeedback = 'Communication was too short. Try speaking for at least 60-90 seconds per question.';
      techFeedback = 'Demonstrated basic terminology, but lacks practical execution depth. Review core concepts.';
      suggestions = 'Focus on solidifying fundamentals. Try practicing with easier questions and write down key bullets before answering.';
    }

    // Save session in DB
    const session = await InterviewSession.create({
      userId: req.user._id,
      role,
      difficulty,
      experienceLevel,
      questions: evaluatedQuestions,
      overallScore,
      commFeedback,
      techFeedback,
      suggestions,
    });

    // Save score history for dashboard chart usage
    await Score.create({
      userId: req.user._id,
      sessionId: session._id,
      role,
      score: overallScore,
    });

    return res.status(201).json({
      success: true,
      message: 'Interview evaluation completed successfully',
      data: session,
    });
  } catch (error) {
    console.error('Submit Interview Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during interview evaluation' });
  }
};

/**
 * @desc    Get all interview sessions for logged user
 * @route   GET /api/interviews/history
 * @access  Private
 */
const getInterviewHistory = async (req, res) => {
  try {
    const history = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Get Interview History Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving history' });
  }
};

/**
 * @desc    Get single interview session details
 * @route   GET /api/interviews/session/:id
 * @access  Private
 */
const getInterviewSessionById = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    // Verify ownership
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Get Session Detail Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving session details' });
  }
};

/**
 * @desc    Get aggregated user score history for charts
 * @route   GET /api/interviews/scores
 * @access  Private
 */
const getScoreHistory = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id }).sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (error) {
    console.error('Get Score History Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving scores' });
  }
};

module.exports = {
  submitInterviewSession,
  getInterviewHistory,
  getInterviewSessionById,
  getScoreHistory,
};
