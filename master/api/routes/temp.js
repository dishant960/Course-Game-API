var express = require('express');
var router = express.Router();
var Connection = require('./connection.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  //db.connection();
  var db=Connection.db();
  var col=db.collection("User");
  console.log(col);

  //

  //   var doc1 = {'hello':'doc1'};
  //   var doc2 = {'hello':'doc2'};
  //   collection.insert(doc1);
  //   collection.find().toArray(function(err, items) {
  //     res.send(items);
  //   });
  });

module.exports = router;
