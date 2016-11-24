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
var enrollments = require('./routes/enrollments');

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


    // code to download the materials from server
    app.get('/download/:file(*)', function(req, res)
    {
      var file = req.params.file;
      console.log(__dirname);
      var path =__dirname+'/public/'+file;
      res.download(path);
    });




    var nodemailer = require("nodemailer");

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "daiictse2@gmail.com",
            pass: "saurabhtiwari1"
        }
    });

    app.get('/send',function(req,res){
      var mailOptions={
        to : "hardisk.uvs1994@gmail.com",
        subject : "Password Recovery",
        text : "This mail is from Course-Game. You have requested for password change. So to change the password click to the below link."
      }
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
          res.end("error");
        }
        else{
          console.log("Message sent: " + response.message);
          res.end("sent");
        }
      });
    });






    app.use(express.static('../client'));
    app.use(bodyParser.json());

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
