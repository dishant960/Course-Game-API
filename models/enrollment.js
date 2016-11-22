var mongoose = require('mongoose');

var enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  }]

});

var Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
