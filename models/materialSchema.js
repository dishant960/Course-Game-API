var mongoose = require('mongoose');

var materialSchema = new mongoose.Schema({
  name: {type: String, required: true},
  fileType: {type: String, required: false},
  startTime: {type: String, required: false},
  endTime: {type: String, required: false},
  desc: {type: String, required: false},
  link: {type:String, required: false},
  topicId: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}
});

var Material = mongoose.model('Material', materialSchema);
module.exports = Material;
