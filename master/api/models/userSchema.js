var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  programme: {type: String, required: true},
  year: {type: Number, required: true},
  webmailId: {type: String, required: true, unique: true},
  institute: {type: String, required: true},
  username: {type: String, unique: true, lowercase: true, required: true},
  password: {type: String, required: true},
  contact: {type: Number, required: true}
});

var User = mongoose.model('User', userSchema);
module.exports = User;
