var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var materialSchema = require('../models/materialSchema');
var connectionString = "mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame";
var ObjectId = require('mongodb').ObjectID;
var multer = require('multer');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage},{limits : {fieldNameSize : 10}}).single('file');

router.post('/fileUpload',function(req,res){
  res.upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file.");
      }
      MongoClient.connect(connectionString, function(err, db) {
        var collection = db.collection('Material');
        var material = req.body;

      	collection.insert({
          name: req.body.name
        }, function(err, material) {
      		if (err) {
      		  res.json({"Status":false,"Result":err});
          }
          res.end("File is uploaded.");
        });
      });
  });
});

// localhost:3000/materials
router.get('/', function(req, res, next) {
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Material');
      collection.find().toArray(function(err, materials) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":materials});
        }
      });
    }
  });
});

// localhost:3000/materials/getById/:id
router.get('/getById/:id',function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Material');
      var id = req.params.id;

      collection.findOne({"_id": new ObjectId(id)}, function(err, material) {
        if (err) {
    		  res.json({"Status":false,"Result":err});
        }
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
    if(!err) {
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
    		if (err) {
    		  res.json({"Status":false,"Result":err});
        }
        else {
          res.send({"Status":true,"Result":"Record inserted successfully.", "insertedUser": material.ops[0]});
        }
      });
    }
  });
});


// localhost:3000/materials/update/:id
router.put('/update/:id', function(req, res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Material');
      var id = req.params.id;
      var updatedMaterial = req.body;

      collection.update(
        {_id: ObjectId(id)},
        {$set: updatedMaterial},
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

// localhost:3000/materials/delete/:id
router.delete('/delete/:id', function(req,res, next){
  MongoClient.connect(connectionString, function(err, db) {
    if(!err) {
      var collection = db.collection('Material');
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
