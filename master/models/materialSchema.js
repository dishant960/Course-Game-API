var mongoose = require('mongoose');

var materialSchema = new mongoose.Schema({
  name: {type: String, required: true},
  fileType: {type: String, required: true},
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: true},
  desc: {type: String, required: false},
  topicId: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}
});

var Material = mongoose.model('Material', materialSchema);
module.exports = Material;
