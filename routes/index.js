var express = require('express');
var multer = require('multer');
var router = express.Router();

var materialId = "";

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + materialId + '.'+ file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/** API path that will upload the files */
router.post('/upload', function(req, res)
 {
    upload(req,res,function(err){
        if(err){
            console.log(err);
             res.json({error_code:1,err_desc:err});
             return;
        }

        MongoClient.connect(connectionString, function(err, db) {
          var collection = db.collection('Material');
          var material = req.body;

          collection.insert({
            name: req.body.name,
            desc: req.body.desc,
            topicId: ObjectId(req.body.topicId)
          }, function(err, material) {
            if (err) throw err;
            materialId = material.ops[0]._id;
            res.json("Successfully uploaded your file." + material.ops[0]);
          });
        });
         //res.json({error_code:0,err_desc:null});
    });
  });


module.exports = router;
