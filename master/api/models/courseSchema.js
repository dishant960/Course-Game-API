var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  name: {type: String, required: true},
  tag: {type: String, required: true, unique: true, uppercase:true},
  semester: {type: Number, required: true},
  year: {type: Number, required: true},
  programme: {type: String, required: true},
  desc: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var Course = mongoose.model('Course', courseSchema);
module.exports = Course;
