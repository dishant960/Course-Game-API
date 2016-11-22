var mongoose = require('mongoose');

var announcementSchema = new mongoose.Schema({
  title: {type: String, required: true},
  desc: {type: String, required: true, unique: false, uppercase:true},
  time: {type: String, required: true},
  open: {type: String, required: true},
  batch: {type: String, required: true},
  year: {type: Number, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
});

var Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
