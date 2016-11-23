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

      collection.findOne({"_id": new ObjectId(id)}, function(err, course) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          collection = db.collection('Topic');
          collection.find({"courseId": new ObjectId(course._id)}).toArray(function(err, topic) {
            if (err) {
        		  res.json({"Status":false,"Result":err});
            }
            else {
              collection = db.collection('Game');
              var topic_ids = [];
              for(var i = 0; i < topic.length; i++) {
                topic_ids[i]=topic[i]._id;
              }
              collection.find({ topicId: { $in: topic_ids } }).toArray(function(err, games) {
                if (err) {
            		  res.json({"Status":false,"Result":err});
                }
                else {
                  collection = db.collection('Material');
                  collection.find({ topicId: { $in: topic_ids } }).toArray(function(err, materials) {
                    if (err) {
                		  res.json({"Status":false,"Result":err});
                    }
                    else {
                      res.send({"Status":true, "course":course, "topics": topic, "games": games, "materials": materials});
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
    if(!err) {
      var collection = db.collection('Course');
      var user_id = req.params.id;

      collection.find({userId: user_id}).toArray(function(err, record) {
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

// localhost:3000/courses/getByStd/:id
router.get('/getByStd/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('User');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, user) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          var sem = user.semester;
          var prog = user.programme;

          collection = db.collection('Course');

          collection.find({semester: sem, programme: prog}).toArray(function(err, record) {
            if (err) {
        		  res.json({"Status":false,"Result":err});
            }
            else {
              res.send({"Status":true,"Result":record});
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
    if(!err) {
      var collection = db.collection('User');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, user) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          var sem = user.semester;
          var prog = user.programme;
          console.log(sem, prog);
          collection = db.collection('Enrollment');
          collection.find({"userId": new ObjectId(req.params.id)}).toArray(function(err, enrolled) {
            if (err) {
        		  res.json({"Status":false,"Result":err});
            }
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
                  if (err) {
              		  res.json({"Status":false,"Result":err});
                  }
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

/*router.get('/insert12',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Course');
      collection.insert({
        name: "Abcd",
        year: 2015,
        programme: [{
          pr : "Msc",
          sem : [
            2,
            4
          ]}
        ],
        desc: "sddsd",
        isActive: true,
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
});*/

// localhost:3000/courses/insert
router.post('/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Course');
      var user = req.body.userId;
      var tag = req.body.tag;

      collection.findOne({"userId": new ObjectId(user), "tag": tag}, function(err, user) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          if(user) {
            console.log(user);
            res.send({"Status":false,"Result":"Course already exists."});
          }
          else {
            collection.insert(req.body, function(err, user) {
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
      var updatedRecord = req.body;

      collection.update(
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
