var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var routes = require('./routes/index');
var users = require('./routes/users');
var courses = require('./routes/courses');
var topics = require('./routes/topics');
var materials = require('./routes/materials');
var games = require('./routes/games');
var performances = require('./routes/performances');
var announcements = require('./routes/announcements');
var enrollments = require('./routes/enrollments');

var material = require('./models/materialSchema.js');

var app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    var header = function(request,response, next){
      response.header("Access-Control-Allow-Origin",'*');
      response.header("Access-Control-Allow-Methods",'GET,POST,PUT,DELETE');
      response.header("Access-Control-Allow-Headers",'Content-Type, x-access-token');
      next();
    }

    app.use(header);

    app.get('/download/:file(*)', function(req, res)
    {
      var file = req.params.file;
      console.log(__dirname);
      var path =__dirname+'/public/'+file;
      res.download(path);
    });

    app.post('/upload', function(req, res) {
      var path=require('path'); // add path module
        fs.readFile(req.files.image.path, function (err, data){ // readfilr from the given path
        var dirname = __dirname + '/public/'; // path.resolve(“.”) get application directory path
        var newPath = dirname +   req.files.image.originalFilename; // add the file name
        fs.writeFile(newPath, data, function (err) { // write file in uploads folder
          if(err){
            res.json("Failed to upload your file");
          }
          else {
            res.json("Successfully uploaded your file");
          }
        });
      });
    });

    app.get('/uploads/:file', function (req, res){
      var path=require('path');
      file = req.params.file;
      var dirname = __dirname + '/public/';
      var img = fs.readFileSync(dirname + file);
      res.writeHead(200, {'Content-Type': 'image/png' });
      res.end(img, 'binary');
      console.log("OK");
    });

    app.use(express.static('../client'));
    app.use(bodyParser.json());

/*
    var storage =   multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './uploads');
      },
      filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
      }
    });
    var upload = multer({ storage : storage},{limits : {fieldNameSize : 10}}).single('file');

    app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
    });

    app.post('/api/fileUpload',function(req,res){
      upload(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          var upl = new material({
            name: req.file.originalname
          });
          console.log(req.file);
          upl.save(function(err,docs) {
                  if (err) {
                      console.log(err);
                  }
                  res.json(docs);
              });
          res.end("File is uploaded " + req.body.path);
      });
    });*/

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', routes);
    app.use('/users', users);
    app.use('/courses', courses);
    app.use('/topics', topics);
    app.use('/materials', materials);
    app.use('/games', games);
    app.use('/announcements', announcements);
    app.use('/performances', performances);
    app.use('/enrollments', enrollments);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
      console.log('running on 3000...');
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
