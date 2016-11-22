var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var gameSchema = require('../models/gameSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;

// localhost:3000/games
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Game');

      collection.find().toArray(function(err, games) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":games});
        }
      });
    }
  });
});

// localhost:3000/games/getById/:id
router.get('/getById/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Game');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, game) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":game});
        }
      });
    }
  });
});

// localhost:3000/games/getByTopic/:id
router.get('/getByTopic/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Game');

      collection.find({"topicId": new ObjectId(req.params.id)}).toArray(function(err, record) {
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

// localhost:3000/games/insert
router.post('/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Game');
      var game = req.body;

    	collection.insert({
        title: req.body.title,
        difLevel: req.body.difLevel,
        points: req.body.points,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        maxAttempt: req.body.maxAttempt,
        minScore: req.body.minScore,
        desc: req.body.desc,
        hintUrl: req.body.hintUrl,
        gameLink: req.body.gameLink,
        isActive: req.body.isActive,
        topicId: ObjectId(req.body.topicId)
    }, function(err, game) {
    		if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedUser": game.ops[0]});
        }
      });
    }
  });
});

// localhost:3000/games/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Game');
      var id = req.params.id;
      var updatedGame = req.body;

      collection.update(
        {_id: ObjectId(id)},
        {$set: updatedGame},
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

// localhost:3000/games/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Game');
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
