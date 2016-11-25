var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  year: {type: Number, required: false},
  programme: [{
    pr : {type: String,required: false},
    sem : [
      {type: String,required: false}
    ]
  }],
  desc: {type: String, required: false},
  isOpen: {type: Boolean, required: false, default: true},
  isActive: {type: Boolean, required: false, default: true},
  tagId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var Course = mongoose.model('Course', courseSchema);
module.exports = Course;
