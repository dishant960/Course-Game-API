var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
  username: {type: String, required: true},
  tokenString: {type: String, required: true},
  expires: {type: Date, required: true}
});

var Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
