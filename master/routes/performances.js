var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var performanceSchema = require('../models/performanceSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;

// localhost:3000/performances
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Performance');
      collection.find().toArray(function(err, performances) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":performances});
        }
      });
    }
  });
});

// localhost:3000/performances/getById/:id
router.get('/getById/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Performance');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, performance) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":performance});
        }
      });
    }
  });
});

// localhost:3000/performances/insert
router.post('/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Performance');
      var performance = req.body;

    	collection.insert({
        attempts: req.body.attempts,
        score: req.body.score,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        hintsUsed: req.body.hintsUsed,
        accuracy: req.body.accuracy,
        userId: ObjectId(req.body.userId),
        gameId: ObjectId(req.body.gameId)
    }, function(err, performance) {
    		if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedUser": performance.ops[0]});
        }
      });
    }
  });
});


// localhost:3000/performances/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('performance');
      var id = req.params.id;
      var updatedPerformance = req.body;

      console.log(id);
      console.log(updatedPerformance);
      collection.findAndModify(
        {_id: ObjectId(id)},
        {$set: updatedPerformance},
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

// localhost:3000/performances/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Performance');
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
