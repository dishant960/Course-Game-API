var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var materialSchema = require('../models/materialSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');

// localhost:3000/materials
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Material');
      collection.find().toArray(function(err, materials) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":materials});
        }
      });
    }
  });
});

// localhost:3000/materials/upload
router.post('/upload', function(req, res) {
  var path=require('path'); // add path module

  fs.readFile(req.files.image.path, function (err, data){ // readfilr from the given path
    var dirname = __dirname + '/public/'; // path.resolve(“.”) get application directory path
    var newPath = dirname +   req.files.image.originalFilename; // add the file name

    fs.writeFile(newPath, data, function (err) { // write file in uploads folder
      if(err) {
        res.json("Failed to upload your file");
      }
      else {
        MongoClient.connect(connectionString, function(err, db) {
          var collection = db.collection('Material');
          var material = req.body;

          collection.insert({
            link: req.files.image.originalFilename
          }, function(err, material) {
            if (err) throw err;

            res.json("Successfully uploaded your file");
          });
        });
      }
    });
  });
});


// localhost:3000/materials/uploaded/:file
router.get('/uploaded/:file(*)', function (req, res){
  var path=require('path');
  file = req.params.file;
  var dirname = __dirname + '/public/';
  var img = fs.readFileSync(dirname + file);
  res.writeHead(200, {'Content-Type': '*' });
  res.end(img, 'binary');
  console.log("OK");
});

// localhost:3000/materials/getById/:id
router.get('/getById/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Material');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, material) {
        if (err) throw err;
        else {
          res.send({"Status":true,"Result":material});
        }
      });
    }
  });
});

// localhost:3000/materials/insert
router.post('/insert',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Material');
      var material = req.body;

    	collection.insert({
        name: req.body.name,
        fileType: req.body.fileType,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        desc: req.body.desc,
        link: req.body.link,
        topicId: ObjectId(req.body.topicId)
    }, function(err, material) {
    		if (err) throw err;
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedUser": material.ops[0]});
        }
      });
    }
  });
});


// localhost:3000/materials/update/:id
router.post('/update', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Material');
      var id = req.body._id;
      var updatedMaterial = {
        name: req.body.name,
        fileType: req.body.fileType,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        desc: req.body.desc,
        link: req.body.link,
        topicId: ObjectId(req.body.topicId)
      };

      collection.update(
        {_id: ObjectId(id)},
        {$set: updatedMaterial},
        function(err, object) {
            if (err) throw err;
            else {
                res.json({"Status":true, "Result":"Record updated successfully."});
            }
        });
    }
  });
});

// localhost:3000/materials/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(err) throw err;
    else {
      var collection = db.collection('Material');
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
