var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
  name: {type: String, required: true, uppercase: true, unique:true, dropDups: true}
});

var Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
