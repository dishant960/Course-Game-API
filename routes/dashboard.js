var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;

// localhost:3000/enrollments/getByCourse/:id
router.get('/enrolledStdGetByCourse/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Enrollment');

      collection.find({"courseId": new ObjectId(req.params.id)}, {_id: 0, courseId: 0}).toArray(function(err, record) {
        if (err) throw err;
        else {
          if(record) {
            collection = db.collection('User');
            var user_ids = [];
            for(var i = 0; i < record.length; i++) {
              user_ids[i]=record[i].userId;
            }
            collection.find({ "_id": { $in: user_ids } }).toArray(function(err, users) {
              if(err) throw err;
              else {
                res.send({"Status":true,"Result":users});
              }
            });
          }
          else {
            res.send({"Status":true,"Result":"No records found."});
          }
        }
      });
    }
  });
});

module.exports = router;
