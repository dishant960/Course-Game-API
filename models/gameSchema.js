var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  title: {type: String, required: true},
  difLevel: {type: String, required: false, unique: false, uppercase:true},
  points: {type: Number, required: false},
  startTime: {type: String, required: false},
  endTime: {type: String, required: false},
  maxAttempt: {type: Number, required: false},
  minScore: {type: Number, required: false},
  desc: {type: String, required: false},
  hintUrl: {type: String, required: false},
  isActive: {type: Boolean, required: true, default: false},
  topicId: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'},
  gameId: {type: mongoose.Schema.Types.ObjectId, ref: 'GameList'}
});

var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
