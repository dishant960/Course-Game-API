var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
  name: {type: String, required: true},
  difLevel: {type: String, required: true, unique: false, uppercase:true},
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: true},
  desc: {type: String, required: true},
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
});

var Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
