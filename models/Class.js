const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  student: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  day: String,
  timeStart: String,
  timeEnd: String,
  room: String
});

module.exports = mongoose.model('Class', classSchema);
