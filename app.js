var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;
var routes = require('./routes/index');
var users = require('./routes/users');
var courses = require('./routes/courses');
var topics = require('./routes/topics');
var materials = require('./routes/materials');
var games = require('./routes/games');
var performances = require('./routes/performances');
var announcements = require('./routes/announcements');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var header = function(request,response, next){
response.header("Access-Control-Allow-Origin",'*');
response.header("Access-Control-Allow-Methods",'GET,POST,PUT,DELETE');
response.header("Access-Control-Allow-Headers",'Content-Type, x-access-token');
next();
}

// code for file upload...

app.use(function(req, res, next) { //allow cross origin requests
       res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
       res.header("Access-Control-Allow-Origin", "http://localhost");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       next();
   });
   /** Serving from the same express Server
   No cors required */
app.use(express.static('../client'));
app.use(bodyParser.json());

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

var upload = multer({ //multer settings
                storage: storage
            }).single('file');

/** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            console.log("Successfull upload.");
             res.json({error_code:0,err_desc:null});
        })
    });
    app.listen('3030', function(){
        console.log('running on 3000...');
    });





app.use(header);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
