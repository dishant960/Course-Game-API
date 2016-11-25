var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var userSchema = require('../models/userSchema');
var tokenSchema = require('../models/tokenSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var nodemailer = require("nodemailer");
var jwt = require('jwt-simple');
var moment = require('moment');
var app = require('../app');

// localhost:3000/users
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('User');
      collection.find({},{password: 0}).toArray(function(err, users) {
        if (err) throw err;
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
    if(err) throw err;
    else {
      var collection = db.collection('User');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, {password: 0}, function(err, user) {
        if (err) throw err;
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
    if(err) throw err;
    else {
      var collection = db.collection('User');
      var password = req.body.password;

      function encrypt(text){
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
      }

      function decrypt(text){
        var decipher = crypto.createDecipher(algorithm,password)
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
      }

      var encrypted_password = encrypt(password);
      decrypt(encrypted_password);
      res.send({"Actual Password": password , "Cypher Text" : encrypted_password});
    }
  });
});


function token_generator(username) {
  var expires = new Date().getTime() + (24 * 3600 * 1000);
  var accessToken = jwt.encode({
      iss: username,
      exp: expires
    }, 'secretcode'
  );
  var token = {
    username : username,
    tokenString : accessToken,
    expires : expires
  };
  return token;
}


// localhost:3000/users/login
router.post('/login',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('User');
      var username = req.body.username;
      var password = req.body.password;
      var userType = req.body.userType;
      var encrypted_password = encrypt(password);

      function encrypt(text){
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
      }

      collection.findOne({"username": username, "password": encrypted_password}, {password: 0}, function(err, user) {
        if (err) throw err;
        else {
          if(!user) {
            res.send({"Status":false,"Result":"Wrong username or password supplied."});
          }
          else {
            if(userType == user.userType) {
              var token = token_generator(user.username);

              collection = db.collection('Token');
              collection.remove({username: user.username},
                function(err, object) {
                    if (err) throw err;
                    else {
                      collection.insert(token, function(err, obj) {
                        if (err) throw err;
                        else {
                          res.json({"status" : true , "Result": "Successfully logged in.", "token" : token.tokenString, "LoggedUser" : user});
                        }
                      });
                    }
                });
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
    if(err) throw err;
    else {
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
        if (err) throw err;
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
          		if (err) throw err;
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


// function to validate a token
function tokenValidate(token, user) {
	if (token) {
		try {
			var decoded = jwt.decode(token, 'secretcode');
      var str = "";
      if(user == decoded.iss){
				console.log("Username : " + decoded.iss);
				var date = new Date().getTime() + 0;
				if(decoded.exp >= date){
          console.log("Expiry Date : " + decoded.exp);
          str = "Authorized token";
          return str;
				}
				else {
          str = "Token expired.";
          return str;
				}
			}
			else {
        str = "Invalid Token.";
        return str;
			}
		}
		catch (err) {
      console.log(err);
      return err;
		}
	}
	else {
    str = "No token provided.";
    return str;
	}
}

//localhost:3000/users/forgotPass
router.post('/forgotPass',function(req,res){
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "daiictse2@gmail.com",
          pass: "saurabhtiwari1"
      }
  });

  var token = "";
  var username = req.body.username;

  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Token');
      collection.findOne({"username": username}, function(err, token) {
        if (err) throw err;
        else {
          var msg = tokenValidate(token.tokenString, username);
          if(msg == "Authorized token") {
            var mailOptions={
              to : username,
              subject : "Password Recovery",
              text : "This mail is from Course-Game. You have requested for password change. So to change the password click to the below link." +
                     "http://herokuapp.com/" + token.tokenString
            }

            smtpTransport.sendMail(mailOptions, function(err, response){
              if(err) throw err;
              else {
                console.log("Mail sent");
                res.json({"Status":true, "Result":"Message successfully sent.", "Token Object": token});
              }
            });
          }
          else {
            res.json({"Status":true, "Result":"Token is not authorized."});
          }
        }
      });
    }
  });
});

// localhost:3000/users/changePassword/:id
router.put('/changePassword/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('User');
      var id = req.params.id;
      var password = req.body.password;

      var encrypted_password = encrypt(password);

      function encrypt(text){
        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        console.log(crypted);
        return crypted;
      }

      collection.update(
        {_id: ObjectId(id)},
        {$set: {password: encrypted_password}},
        function(err, object) {
            if (err) throw err;
            else{
                res.json({"Status":true, "Result":"Password updated successfully."});
            }
        });
      }
  });
});

// localhost:3000/users/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('User');
      var id = req.params.id;
      var updatedUser = req.body;

      collection.update(
        {_id: ObjectId(id)},
        {$set: updatedUser},
        function(err, object) {
            if (err) throw err;
            else{
                res.json({"Status":true, "Result":"Record updated successfully."});
            }
        });
      }
  });
});

// localhost:3000/users/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('User');
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
