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
    if(err) throw err;
    else {
      var collection = db.collection('Course');
      collection.find().toArray(function(err, record) {
        if (err) throw err;
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
    if(err) throw err;
    else {
      var collection = db.collection('Tag');
      collection.find().toArray(function(err, record) {
        if (err) throw err;
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
    if(err) throw err;
    else {
      var collection = db.collection('Course');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, course) {
        if (err) throw err;
        else {
          collection = db.collection('Topic');
          collection.find({"courseId": new ObjectId(course._id)}).toArray(function(err, topic) {
            if (err) throw err;
            else {
              collection = db.collection('Game');
              var topic_ids = [];
              for(var i = 0; i < topic.length; i++) {
                topic_ids[i]=topic[i]._id;
              }
              collection.find({ topicId: { $in: topic_ids } }).toArray(function(err, games) {
                if (err) throw err;
                else {

                  collection = db.collection('GameList');
                  var gameList_ids = [];
                  for(var i = 0; i < games.length; i++) {
                    gameList_ids[i]=games[i].gameId;
                  }
                  collection.find({ _id: { $in: gameList_ids } }).toArray(function(err, gameLists) {
                    if(err) throw err;
                    else {
                      collection = db.collection('Material');
                      collection.find({ topicId: { $in: topic_ids } }).toArray(function(err, materials) {
                        if (err) throw err;
                        else {
                          res.send({"Status":true, "course":course, "topics": topic, "games": games, "gameList": gameLists, "materials": materials});
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

// localhost:3000/courses/getByFaculty/:id
router.get('/getByFaculty/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Course');
      var user_id = req.params.id;

      collection.find({userId: user_id}).toArray(function(err, record) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":record});
        }
      });
    }
  });
});

// localhost:3000/courses/getByStd/:id
router.get('/getByStd/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('User');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, user) {
        if (err) throw err;
        else {
          var prog = user.programme;
          var sem_array = [user.semester];

          collection = db.collection('Enrollment');
          collection.find({"userId": new ObjectId(req.params.id)}).toArray(function(err, enrolled) {
            if(err) throw err;
            else {
              if(enrolled) {
                var enrolledCourse_ids = [];
                for(var i = 0; i < enrolled.length; i++) {
                  enrolledCourse_ids[i]=enrolled[i].courseId;
                }

                collection = db.collection('Course');
                //collection.find({semester: sem, programme: prog}).toArray(function(err, record) {
                collection.aggregate([
                  {$match: {'programme.pr': prog}},
                  {$match: {'programme.sem': {$in: sem_array}}},
                  {$match: {'_id': {$nin: enrolledCourse_ids}}}
                ]).toArray(function(err, record) {
                  if (err) throw err;
                  else {
                    res.send({"Status":true,"Result":record});
                  }
                });
              }
            }
          });
        }
      });
    }
  });
});


// localhost:3000/courses/getByStd/:id
router.get('/getByStd1/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('User');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, user) {
        if (err) throw err;
        else {
          var sem = user.semester;
          var prog = user.programme;

          collection = db.collection('Enrollment');
          collection.find({"userId": new ObjectId(req.params.id)}).toArray(function(err, enrolled) {
            if (err) throw err;
            else {
              if(enrolled) {
                var enrolledCourse_ids = [];
                for(var i = 0; i < enrolled.length; i++) {
                  enrolledCourse_ids[i]=enrolled[i].courseId;
                }
                collection = db.collection('Course');

                collection.find({
                  $and: [{
                    semester: sem
                  },
                  {
                    $and: [{
                      programme: prog
                    },
                    {
                      "_id": {
                        $nin: enrolledCourse_ids
                      }
                    }]
                  }]
                }).toArray(function(err, courses) {
                  if (err) throw err;
                  else {
                    res.send({"Status":true,"Result":courses});
                  }
                });
              }
            }
          });
        }
      });
    }
  });
});



// localhost:3000/courses/tags/insert
router.post('/tags/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Tag');

    	collection.insert({
        name: req.body.name
      }, function(err, tag) {
    		if (err) throw err;
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedRecord": tag.ops[0]});
        }
      });
    }
  });
});

router.post('/insert',function(req, res, next){
  var programs = [];
  var MSCIT_sem = [];
  var BTECH_sem = [];
  programs = Object.keys(req.body.pr);
  for(var i =0; i < programs.length; i++) {
    if(programs[i] == "MSCIT")
      MSCIT_sem = Object.keys(req.body.pr.MSCIT);
    else if(programs[i] == "BTECH")
      BTECH_sem = Object.keys(req.body.pr.BTECH);
  }
  //console.log(programs, MSCIT_sem, BTECH_sem, ARD_sem);
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Course');
      collection.insert({
        name: req.body.name,
        year: req.body.year,
        programme: [{
          pr: "MSCIT",
          sem: MSCIT_sem
        },
        {
          pr: "BTECH",
          sem: BTECH_sem
        }],
        desc: req.body.desc,
        isOpen: req.body.isOpen,
        isActive: req.body.isActive,
        userId: req.body.userId
      }, function(err, user) {
    		if (err) throw err;
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedRecord": user.ops[0]});
        }
      });
    }
  });
});

// localhost:3000/courses/insert
router.post('/insert12',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Course');
      var user = req.body.userId;
      var tag = req.body.tag;

      collection.findOne({"userId": new ObjectId(user), "tag": tag}, function(err, user) {
        if (err) throw err;
        else {
          if(user) {
            console.log(user);
            res.send({"Status":false,"Result":"Course already exists."});
          }
          else {
            collection.insert(req.body, function(err, user) {
          		if (err) throw err;
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


// localhost:3000/courses/active
router.post('/active', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Course');
      var id = req.body._id;
      var activate = req.body.isActive;

      collection.update(
        {_id: ObjectId(id)},
        {$set: {isActive:activate}},
        function(err, object) {
            if (err) throw err;
            else {
                res.json({"Status":true, "Result":"Active status changed successfully."});
            }
        });
    }
  });
});


// localhost:3000/courses/update
router.post('/update', function(req, res, next){
  var programs = [];
  var MSCIT_sem = [];
  var BTECH_sem = [];
  programs = Object.keys(req.body.pr);
  for(var i =0; i < programs.length; i++) {
    if(programs[i] == "MSCIT")
      MSCIT_sem = Object.keys(req.body.pr.MSCIT);
    else if(programs[i] == "BTECH")
      BTECH_sem = Object.keys(req.body.pr.BTECH);
  }
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Course');
      var id = req.body._id;
      var updatedRecord = {
        name: req.body.name,
        year: req.body.year,
        programme: [{
          pr: "MSCIT",
          sem: MSCIT_sem
        },
        {
          pr: "BTECH",
          sem: BTECH_sem
        }],
        desc: req.body.desc,
        isOpen: req.body.isOpen,
        isActive: req.body.isActive,
        userId: req.body.userId
      };

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


// localhost:3000/courses/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Course');
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
