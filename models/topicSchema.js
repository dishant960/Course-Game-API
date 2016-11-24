var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
  name: {type: String, required: true},
  difLevel: {type: String, required: false},
  startTime: {type: String, required: false},
  endTime: {type: String, required: false},
  desc: {type: String, required: false},
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
});

var Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
