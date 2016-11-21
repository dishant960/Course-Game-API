var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var schema = require('../models/courseSchema');
var tagSchema = require('../models/tagSchema');
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

// localhost:3000/courses/tags
router.get('/tags', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Tag');
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


// localhost:3000/courses/tags/insert
router.post('/tags/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Tag');

    	collection.insert({
        name: req.body.name
      }, function(err, tag) {
    		if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedRecord": tag.ops[0]});
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
      var user = req.body.userId;
      var tag = req.body.tag;

      collection.findOne({"username": username, "tag": tag}, function(err, user) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          if(user) {
            res.send({"Status":false,"Result":"Course already exists."});
          }
          else {
            collection.insert({
              name: req.body.name,
              tag: req.body.tag,
              semester: req.body.semester,
              year: req.body.year,
              programme: req.body.programme,
              desc: req.body.desc,
              isActive: req.body.isActive,
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
        }
      });
    }
  });
});


// localhost:3000/courses/active/:id
router.put('/active/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Course');
      var id = req.params.id;
      var activate = req.body.isActive;

      collection.update(
        {_id: ObjectId(id)},
        {$set: {isActive:activate}},
        function(err, object) {
            if (err){
                res.json({"Status":false, "Result":err});
            }else{
                res.json({"Status":true, "Result":"Active status changed successfully."});
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
