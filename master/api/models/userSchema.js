var mongoose = require('mongoose');
//mongoose.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame");

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, unique: true, lowercase: true, required: true},
  password: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);
module.exports = User;
