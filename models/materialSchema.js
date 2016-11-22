var mongoose = require('mongoose');

var materialSchema = new mongoose.Schema({
  name: {type: String, required: true},
  fileType: {type: String, required: true},
  startTime: {type: String, required: true},
  endTime: {type: String, required: true},
  desc: {type: String, required: false},
  topicId: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}
});

var Material = mongoose.model('Material', materialSchema);
module.exports = Material;
