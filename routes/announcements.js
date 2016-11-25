var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var announcementSchema = require('../models/announcementSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;

// localhost:3000/announcements
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Announcement');
      collection.find().toArray(function(err, announcement) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":announcement});
        }
      });
    }
  });
});

// localhost:3000/announcements/getById/:id
router.get('/getById/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Announcement');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, announcement) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":announcement});
        }
      });
    }
  });
});

// localhost:3000/announcements/insert
router.post('/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Announcement');
      var announcement = req.body;

    	collection.insert({
        title: req.body.title,
        desc: req.body.desc,
        time: req.body.time,
        open: req.body.open,
        batch: req.body.batch,
        year: req.body.year,
        userId: ObjectId(req.body.userId),
        courseId: ObjectId(req.body.courseId)
    }, function(err, announcement) {
    		if (err) throw err;
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedUser": announcement.ops[0]});
        }
      });
    }
  });
});


// localhost:3000/announcements/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Announcement');
      var id = req.params.id;
      var updatedAnnouncement = req.body;

      collection.update(
        {_id: ObjectId(id)},
        {$set: updatedAnnouncement},
        function(err, object) {
            if (err) throw err;
            else {
                res.json({"Status":true, "Result":"Record updated successfully."});
            }
        });
    }
  });
});

// localhost:3000/announcements/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Announcement');
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
