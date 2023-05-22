const mongoose = require('mongoose');

// const quizQuestionSchema = new mongoose.Schema({
const questionSchema = new mongoose.Schema({
  chapter:{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  title: String,
  question: String,
  choices: [{ title: String, order: String, value: String }],
  answer: String,
  dueDate: String,
  type: { type: String, enum: ["quiz", "pretest", "posttest", "exam"] }
}, { timestamps: true })

// module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
module.exports = mongoose.model('Question', questionSchema);
