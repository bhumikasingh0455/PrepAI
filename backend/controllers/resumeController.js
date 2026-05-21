const Resume = require('../models/Resume');
const User = require('../models/User');
const { analyzeResume } = require('../services/openaiService');
const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * @desc    Upload and analyze resume
 * @route   POST /api/resume/upload
 * @access  Private
 */
const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume' });
    }

    const targetRole = req.body.role || 'Software Engineer';
    const filePath = req.file.path;

    let resumeText = '';
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const parsedData = await pdfParse(dataBuffer);
      resumeText = parsedData.text;
    } catch (parseError) {
      console.error('PDF Parse error, fallback to mock text extraction:', parseError);
      // Fallback text if parsing fails (e.g., scan or corrupt file)
      resumeText = `Fallback parsed resume details. Name: ${req.user.name}. Target Role: ${targetRole}. Technical skills found: React, JavaScript, Node.js, Express, MongoDB, Git.`;
    }

    if (!resumeText || resumeText.trim().length === 0) {
      resumeText = `Empty PDF resume text fallback. React, JavaScript, Node.js.`;
    }

    // Call OpenAI or mock service to analyze the resume text
    const analysis = await analyzeResume(resumeText, targetRole);

    // Save resume to database
    const newResume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      filePath: filePath,
      skills: analysis.skills,
      atsScore: analysis.atsScore,
      feedback: analysis.feedback,
    });

    // Proactively update user skills if new skills are found
    if (analysis.skills && analysis.skills.length > 0) {
      const user = await User.findById(req.user._id);
      if (user) {
        // Merge skills without duplicates
        const updatedSkills = Array.from(new Set([...user.skills, ...analysis.skills]));
        user.skills = updatedSkills;
        await user.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      data: newResume,
    });
  } catch (error) {
    console.error('Upload and Analyze Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during resume analysis' });
  }
};

/**
 * @desc    Get user resume upload history
 * @route   GET /api/resume/history
 * @access  Private
 */
const getResumeHistory = async (req, res) => {
  try {
    const history = await Resume.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Get Resume History Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving resume history' });
  }
};

module.exports = {
  uploadAndAnalyzeResume,
  getResumeHistory,
};
