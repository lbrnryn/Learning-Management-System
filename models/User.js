const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  isBasic: { type: Boolean, default: true },
  isStudent: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isTeacher: { type: Boolean, default: false },
  avatarUrl: String
});

module.exports = mongoose.model('User', userSchema);
