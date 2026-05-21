const mongoose = require('mongoose');

const DsaProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  completedProblems: [
    {
      topic: {
        type: String,
        required: true,
        enum: ['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs'],
      },
      problemId: {
        type: String,
        required: true,
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('DsaProgress', DsaProgressSchema);
