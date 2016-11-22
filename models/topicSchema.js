var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
  name: {type: String, required: true},
  difLevel: {type: String, required: false},
  startTime: {type: String, required: true},
  endTime: {type: String, required: true},
  desc: {type: String, required: true},
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
});

var Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
