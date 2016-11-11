var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  title: {type: String, required: true},
  difLevel: {type: String, required: true, unique: false, uppercase:true},
  points: {type: Number, required: true},
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: true},
  maxAttempt: {type: Number, required: true},
  minScore: {type: Number, required: true},
  desc: {type: String, required: false},
  hintUrl: {type: String, required: false},
  topicId: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}
});

var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
