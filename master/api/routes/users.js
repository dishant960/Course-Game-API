var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    
    
    
  MongoClient.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame", function(err, db) {
  if(!err) {
    console.log("We are connected");
      
        var collection = db.collection('User');
        var doc1 = {'hello':'doc1'};
        var doc2 = {'hello':'doc2'};
        collection.insert(doc1);
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
      
      
  }
});
    
    
    
    
});

router.get('/name',function(req,res)
          {
    res.send("Hello");
})

module.exports = router;
