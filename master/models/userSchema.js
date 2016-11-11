var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  programme: {type: String, required: false},
  year: {type: Number, required: false},
  webmailId: {type: String, required: false, unique: true},
  institute: {type: String, required: false},
  username: {type: String, unique: true, lowercase: true, required: true},
  password: {type: String, required: true},
  specialization: {type: String, required: false},
  university: {type: String, required: true},
  contact: {type: Number, required: true}
});

var User = mongoose.model('User', userSchema);
module.exports = User;
