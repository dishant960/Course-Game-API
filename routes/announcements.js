var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var announcementSchema = require('../models/announcementSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;
var FCM = require('fcm-node');

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

// localhost:3000/announcements/getById/:id
router.get('/getByCourse/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Announcement');

      collection.find({courseId: new ObjectId(req.params.id)}).toArray(function(err, record) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":record});
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
        userId: ObjectId(req.body.userId),
        courseId: ObjectId(req.body.courseId)
    }, function(err, announcement) {
    		if (err) throw err;
        else {
          var serverKey = 'AIzaSyChuVPWbGqTI01FrgD-7S5sV-3OODtb6rw';
          var fcm = new FCM(serverKey);

          var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
              to:'/topics/' + req.body.courseId,
              //to:'/topics/temp1',
              notification: {
                  title: req.body.title,
                  body: req.body.desc,
                  sound : 'default'
              },
          };

          fcm.send(message, function(err, response){
              if (err) {
                  console.log("Something has gone wrong!");
              } else {
                  console.log("Successfully sent with response: ", response);
              }
          });

          res.send({"Status":true,"Result":"Record inserted successfully.", "Notification": message});
        }
      });
    }
  });
});


// localhost:3000/announcements/update/:id
router.post('/update', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Announcement');
      var id = req.body._id;
      var updatedAnnouncement = {
        title: req.body.title,
        desc: req.body.desc,
        userId: ObjectId(req.body.userId),
        courseId: ObjectId(req.body.courseId)
      };

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
