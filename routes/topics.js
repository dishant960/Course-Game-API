var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var topicSchema = require('../models/topicSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;

// localhost:3000/topics
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Topic');
      collection.find().toArray(function(err, topics) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":topics});
        }
      });
    }
  });
});


// localhost:3000/topics/getById/:id
router.get('/getById/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Topic');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, topic) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":topic});
        }
      });
    }
  });
});

// localhost:3000/topics/getByCourse/:id
router.get('/getByCourse/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Topic');

      collection.find({"courseId": new ObjectId(req.params.id)}).toArray(function(err, record) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":record});
        }
      });
    }
  });
});

// localhost:3000/topics/insert
router.post('/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Topic');
      var topic = req.body;

    	collection.insert({
        name: req.body.name,
        difLevel: req.body.difLevel,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        desc: req.body.desc,
        courseId: ObjectId(req.body.courseId)
    }, function(err, topic) {
    		if (err) throw err;
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedUser": topic.ops[0]});
        }
      });
    }
  });
});


// localhost:3000/topics/update/:id
router.post('/update', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Topic');
      var id = req.body._id;
      var updatedTopic = {
        name: req.body.name,
        difLevel: req.body.difLevel,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        desc: req.body.desc,
        courseId: ObjectId(req.body.courseId)
    };

      collection.update(
        {_id: ObjectId(id)},
        {$set: updatedTopic},
        function(err, object) {
            if (err) throw err;
            else {
                res.json({"Status":true, "Result":"Record updated successfully."});
            }
        });
    }
  });
});

// localhost:3000/topics/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Topic');
      var id = req.params.id;

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
