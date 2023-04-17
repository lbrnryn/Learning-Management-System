const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  role: { type: String, default: "basic" },
  avatarUrl: String,
  // quizzes: [{
  //   // chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  //   questionsLength: Number,
  //   chapter: String,
  //   score: Number,
  //   isQuizAnswered: Boolean
  // }],
  // pretests: [{
  //   // chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  //   questionsLength: Number,
  //   chapter: String,
  //   score: Number,
  //   isPretestAnswered: Boolean
  // }],
  // posttests: [{
  //   // chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  //   questionsLength: Number,
  //   chapter: String,
  //   score: Number,
  //   isPosttestAnswered: Boolean
  // }]
});

module.exports = mongoose.model('User', userSchema);
