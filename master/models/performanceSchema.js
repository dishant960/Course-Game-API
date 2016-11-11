var mongoose = require('mongoose');

var performanceSchema = new mongoose.Schema({
  attempts: {type: Number, required: true},
  score: {type: Number, required: true, unique: false, uppercase:true},
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: true},
  hintsUsed: {type: Number, required: true},
  accuracy: {type: Number, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  gameId: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'}
});

var Performance = mongoose.model('Performance', performanceSchema);
module.exports = Performance;
