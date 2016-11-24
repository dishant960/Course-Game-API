var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var userSchema = require('../models/userSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

// localhost:3000/users
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('User');
      collection.find().toArray(function(err, users) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":users});
        }
      });
    }
  });
});

// localhost:3000/users/getById/:id
router.get('/getById/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('User');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, user) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":user});
        }
      });
    }
  });
});


// localhost:3000/users/login
router.post('/encrypt',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('User');
      var password = req.body.password;

      function encrypt(text){
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        console.log(crypted);
        return crypted;
      }

      function decrypt(text){
        var decipher = crypto.createDecipher(algorithm,password)
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
      }

      var encrypted_password = encrypt(password);
      // outputs hello world
      console.log(decrypt(encrypted_password));
    }
  });
});


// localhost:3000/users/login
router.post('/login',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('User');
      var username = req.body.username;
      var password = req.body.password;
      var userType = req.body.userType;
      var encrypted_password = encrypt(password);

      function encrypt(text){
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        console.log(crypted);
        return crypted;
      }

      collection.findOne({"username": username, "password": encrypted_password}, {password: 0}, function(err, user) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          if(!user) {
            res.send({"Status":false,"Result":"Wrong username or password supplied."});
          }
          else {
            if(userType == user.userType) {
              res.send({"Status":true,"Result":"Successfully logged in.","LoggedUser":user});
            }
            else {
              res.send({"Status":false,"Result":"User type is not valid."});
            }
          }
        }
      });
    }
  });
});


// localhost:3000/users/register
router.post('/register',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('User');
      var user = req.body;
      var username = req.body.username;
      var password = req.body.password;

      var encrypted_password = encrypt(password);

      function encrypt(text){
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        console.log(crypted);
        return crypted;
      }

      collection.findOne({"username": username}, function(err, user) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          if(user) {
            res.send({"Status":false,"Result":"Username already exists."});
          }
          else {
            collection.insert({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              userType: req.body.userType,
              username: req.body.username,
              password: encrypted_password,
              contact: req.body.contact,
              specialization: req.body.specialization,
              university: req.body.university,
              city: req.body.city,
              country: req.body.country,
              facultyType: req.body.facultyType,
              programme: req.body.programme,
              studentId: req.body.studentId,
              year: req.body.year,
              semester: req.body.semester
            }, function(err, user) {
          		if (err) {
          		  res.json({"Status":false,"Result":err});
              }
              else {
                res.send({"Status":true,"Result":"Record inserted successfully.", "insertedUser": user.ops[0]});
              }
            });
          }
        }
      });
    }
  });
});

// localhost:3000/users/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('User');
      var id = req.params.id;
      var updatedUser = req.body;

      collection.update(
        {_id: ObjectId(id)},
        {$set: updatedUser},
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

// localhost:3000/users/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('User');
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
