var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var routes = require('./routes/index');
var users = require('./routes/users');
var temp = require('./routes/temp');

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
app.use('/temp', temp);
/*
// connection with mongo database....
MongoClient.connect("mongodb://dishant:123456@ds053196.mlab.com:53196/coursegame", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});
*/
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
