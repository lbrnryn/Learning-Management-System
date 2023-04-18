const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  section: String,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  day: String,
  timeStart: String,
  timeEnd: String,
  room: String
});

module.exports = mongoose.model('Class', classSchema);
