var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  title: {type: String, required: true},
  difLevel: {type: String, required: true, unique: false, uppercase:true},
  points: {type: Number, required: true},
  startTime: {type: String, required: true},
  endTime: {type: String, required: true},
  maxAttempt: {type: Number, required: true},
  minScore: {type: Number, required: true},
  desc: {type: String, required: false},
  hintUrl: {type: String, required: false},
  isActive: {type: Boolean, required: true, default: true},
  topicId: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'},
  gameId: {type: mongoose.Schema.Types.ObjectId, ref: 'GameList'}
});

var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
