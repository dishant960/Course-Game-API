var mongoose = require('mongoose');

var gameListSchema = new mongoose.Schema({
  title: {type: String, required: true},
  link: {type: String, required: false}
});

var GameList = mongoose.model('GameList', gameListSchema);
module.exports = GameList;
