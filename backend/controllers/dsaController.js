const DsaProgress = require('../models/DsaProgress');
const Score = require('../models/Score');
const User = require('../models/User');

/**
 * @desc    Get user's completed DSA problems
 * @route   GET /api/dsa/progress
 * @access  Private
 */
const getDsaProgress = async (req, res) => {
  try {
    let progress = await DsaProgress.findOne({ userId: req.user._id });

    if (!progress) {
      // Create empty progress if not existing
      progress = await DsaProgress.create({
        userId: req.user._id,
        completedProblems: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: progress.completedProblems,
    });
  } catch (error) {
    console.error('Get DSA Progress Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving DSA progress' });
  }
};

/**
 * @desc    Toggle a DSA problem's completion status
 * @route   POST /api/dsa/toggle
 * @access  Private
 */
const toggleProblemStatus = async (req, res) => {
  try {
    const { topic, problemId } = req.body;

    if (!topic || !problemId) {
      return res.status(400).json({ success: false, message: 'Please provide topic and problemId' });
    }

    let progress = await DsaProgress.findOne({ userId: req.user._id });

    if (!progress) {
      progress = new DsaProgress({
        userId: req.user._id,
        completedProblems: [],
      });
    }

    // Check if the problem is already marked as completed
    const problemIndex = progress.completedProblems.findIndex(
      (p) => p.problemId === problemId && p.topic === topic
    );

    if (problemIndex > -1) {
      // Problem exists, so remove it (toggle off)
      progress.completedProblems.splice(problemIndex, 1);
    } else {
      // Add problem (toggle on)
      progress.completedProblems.push({
        topic,
        problemId,
        completedAt: new Date(),
      });
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: 'DSA progress updated successfully',
      data: progress.completedProblems,
    });
  } catch (error) {
    console.error('Toggle DSA Problem Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating DSA progress' });
  }
};

/**
 * @desc    Get leaderboard combining DSA progress and interview stats
 * @route   GET /api/dsa/leaderboard
 * @access  Private
 */
const getLeaderboard = async (req, res) => {
  try {
    // Get all users
    const users = await User.find({}).select('name email skills');

    // Compile statistics for each user
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        // DSA count
        const dsa = await DsaProgress.findOne({ userId: user._id });
        const dsaCount = dsa ? dsa.completedProblems.length : 0;

        // Interview average score
        const scores = await Score.find({ userId: user._id });
        const avgScore =
          scores.length > 0
            ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
            : 0;

        return {
          userId: user._id,
          name: user.name,
          skills: user.skills,
          dsaCount,
          avgInterviewScore: avgScore,
          totalPoints: dsaCount * 10 + avgScore * 5, // Custom score formula
        };
      })
    );

    // Sort by total points descending
    leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);

    return res.status(200).json({
      success: true,
      data: leaderboardData.slice(0, 10), // Return top 10
    });
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching leaderboard' });
  }
};

module.exports = {
  getDsaProgress,
  toggleProblemStatus,
  getLeaderboard,
};
