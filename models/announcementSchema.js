var mongoose = require('mongoose');

var announcementSchema = new mongoose.Schema({
  title: {type: String, required: true},
  desc: {type: String, required: false},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
});

var Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
