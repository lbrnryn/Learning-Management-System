const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  isBasic: { type: Boolean, default: true },
  isStudent: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isTeacher: { type: Boolean, default: false },
  avatarUrl: String,
  quizzes: [{
    // chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    questionsLength: Number,
    chapter: String,
    score: Number,
    isQuizAnswered: Boolean
  }],
  pretests: [{
    // chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    questionsLength: Number,
    chapter: String,
    score: Number,
    isPretestAnswered: Boolean
  }],
  posttests: [{
    // chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    questionsLength: Number,
    chapter: String,
    score: Number,
    isPosttestAnswered: Boolean
  }]
});

module.exports = mongoose.model('User', userSchema);
