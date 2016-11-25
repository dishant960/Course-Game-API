var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var schema = require('../models/courseSchema');
var tagSchema = require('../models/tagSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;

// localhost:3000/enrollments
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Enrollment');
      collection.find().toArray(function(err, record) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":record});
        }
      });
    }
  });
});

// localhost:3000/enrollments/getByStd/:id
router.get('/getByStd/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Enrollment');

      collection.find({"userId": new ObjectId(req.params.id)}).toArray(function(err, record) {
        if (err) throw err;
        else {
          if(record) {
            collection = db.collection('Course');
            var course_ids = [];
            for(var i = 0; i < record.length; i++) {
              course_ids[i]=record[i].courseId;
            }
            collection.find({ "_id": { $in: course_ids } }).toArray(function(err, course) {
              if(err) throw err;
              else {
                res.send({"Status":true,"Result":course});
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

// localhost:3000/enrollments/getByCourse/:id
router.get('/getByCourse/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Enrollment');

      collection.find({"courseId": new ObjectId(req.params.id)}).toArray(function(err, record) {
        if (err) throw err;
        else {
          if(record) {
            res.send({"Status":true,"Result":record});
          }
          else {
            res.send({"Status":true,"Result":"No records found."});
          }
        }
      });
    }
  });
});



// localhost:3000/enrollments/insert
router.post('/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Enrollment');

    	collection.insert({
        userId: ObjectId(req.body.userId),
        courseId: ObjectId(req.body.courseId)
      }, function(err, record) {
    		if (err) throw err;
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedRecord": record.ops[0]});
        }
      });
    }
  });
});


// localhost:3000/enrollments/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Enrollment');
      var id = req.params.id;
      var updatedRecord = req.body;

      collection.update(
        {_id: ObjectId(id)},
        {$set: updatedRecord},
        function(err, object) {
            if (err) throw err;
            else {
                res.json({"Status":true, "Result":"Record updated successfully."});
            }
        });
    }
  });
});


// localhost:3000/enrollments/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Enrollment');
      var id = req.params.id;

      console.log(id);
      collection.remove({_id: ObjectId(id)},
        function(err, object) {
            if (err) throw err;
            else {
                res.json({"Status":true, "Result":"Record deleted successfully."});
            }
        });
    }
  });
});

module.exports = router;
