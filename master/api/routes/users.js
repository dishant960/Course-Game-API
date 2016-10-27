var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var userSchema = require('../models/userSchema');
var ObjectId = require('mongodb').ObjectID;

// localhost:3000/users
// router.get('/', function(req, res, next) {
//   MongoClient.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame", function(err, db) {
//     if(!err) {
//       var collection = db.collection('userSchema');
//       collection.find().toArray(function(err, users) {
//         if (err) {
//           res.status(500);
//     		  res.json({"Status":false,"Result":err});
//         }
//         else {
//           res.status(200);
//           res.send({"Status":true,"Result":users});
//         }
//       });
//     }
//   });
// });


// localhost:3000/users/getById/:id
router.post('/abc',function(req,res)
{

  res.send({"abc":"Hekllo"});
});


router.post('/login',function(req, res){
  MongoClient.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame", function(err, db) {
    if(!err) {
      var collection = db.collection('userSchema');
      var email = req.body.username;
      var password = req.body.password;

      collection.findOne({"email": email, "password": password}, function(err, user) {
        if (err) {
          res.status(500);
          res.json({"Status":false,"Result":err});
        }/*
        else {
          if(!user) {
            res.status(404);
            res.send({"Status":false,"Result":"Authentication failed. User not found."});
          }
          else {
            if(user.password === password) {
              res.status(200);
              res.send({"Status":true,"Result":user});
            }
            else {
              res.status(404);
              res.send({"Status":true,"Result":"Authentication failed. Wrong password."});
            }
          }
        }*/
        else {
          if(!user) {
            res.send({"Status":false,"Result":"Authentication failed. User not found."});
          }
          else {
            res.send({"Status":true,"Result":user});
          }
        }
      });
    }
  });
});

router.get('/getById/:id',function(req, res){
  MongoClient.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame", function(err, db) {
    if(!err) {
      var collection = db.collection('userSchema');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, user) {
        if (err) {
          res.status(500);
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.status(200);
          res.send({"Status":true,"Result":user});
        }
      });
      //console.log(id);
    }
  });
});


// localhost:3000/users/authenticate


// localhost:3000/users/insert
router.post('/register',function(req, res, next){
  MongoClient.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame", function(err, db) {
    if(!err) {
      var collection = db.collection('userSchema');
      var user = req.body;

    	collection.insert(user, function(err, user) {
    		if (err) {
          res.status(500);
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.status(200);
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedUser": user.ops[0]});
        }
      });
    }
  });
});


// localhost:3000/users/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame", function(err, db) {
    if(!err) {
      var collection = db.collection('userSchema');
      var id = req.params.id;
      var updatedUser = req.body;

      console.log(id);
      console.log(updatedUser);
      collection.findAndModify(
        {_id: ObjectId(id)},
        {$set: updatedUser},
        function(err, object) {
            if (err){
                res.status(500);
                res.json({"Status":false, "Result":err});
            }else{
                res.status(200);
                res.json({"Status":true, "Result":"Record updated successfully."});
            }
        });
    }
  });
});

// localhost:3000/users/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame", function(err, db) {
    if(!err) {
      var collection = db.collection('userSchema');
      var id = req.params.id;

      console.log(id);
      collection.remove({_id: ObjectId(id)},
        function(err, object) {
            if (err){
                res.status(500);
                res.json({"Status":false, "Result":err});
            }else{
                res.status(200);
                res.json({"Status":true, "Result":"Record deleted successfully."});
            }
        });
    }
  });
});

module.exports = router;
