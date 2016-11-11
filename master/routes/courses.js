var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var schema = require('../models/courseSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;

// localhost:3000/courses
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Course');
      collection.find().toArray(function(err, record) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":record});
        }
      });
    }
  });
});


// localhost:3000/courses/getById/:id
router.get('/getById/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Course');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, record) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":record});
        }
      });
    }
  });
});


// localhost:3000/courses/insert
router.post('/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Course');

    	collection.insert({
        name: req.body.name,
        tag: req.body.tag,
        semester: req.body.semester,
        year: req.body.year,
        programme: req.body.programme,
        desc: req.body.desc,
        userId: ObjectId(req.body.userId)
      }, function(err, user) {
    		if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedRecord": user.ops[0]});
        }
      });
    }
  });
});


// localhost:3000/courses/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Course');
      var id = req.params.id;
      var updatedUser = req.body;

      console.log(id);
      console.log(updatedRecord);
      collection.findAndModify(
        {_id: ObjectId(id)},
        {$set: updatedRecord},
        function(err, object) {
            if (err){
                res.json({"Status":false, "Result":err});
            }else{
                res.json({"Status":true, "Result":"Record updated successfully."});
            }
        });
    }
  });
});

// localhost:3000/courses/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Course');
      var id = req.params.id;

      console.log(id);
      collection.remove({_id: ObjectId(id)},
        function(err, object) {
            if (err){
                res.json({"Status":false, "Result":err});
            }else{
                res.json({"Status":true, "Result":"Record deleted successfully."});
            }
        });
    }
  });
});

module.exports = router;
