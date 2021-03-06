var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, {
    useMongoClient: true,
    /* other options */
  });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });
  
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));//signed cookies
app.use(session({
  name:'session-id',
  secret:'12345-67890-09876-54321',
  saveUnitialized:false,
  resave: false,
  store: new FileStore()
}));


function auth(req, res, next){
  console.log("session is ", req.session);

  if(!req.session.user){//user not authorized yet , first time
    var authHeader = req.headers.authorization;

    if(!authHeader){//it means client has not used login and password, now need to ask the client to use it
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401; //unauthorized access
      return next(err); //it will go to error handler and handle this error
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');//username and pass separated by :
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
      req.session.user = 'admin';
      console.log("session created")
      next(); // authorized and now will go to specific request 
    } 
    else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      next(err);
    }
  }
  else{
    if(req.session.user ==='admin'){
      next(); //pass through
    }
    else{//error
      var err = new Error('You are not authenticated');
      //res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401; //unauthorized access
      return next(err); //it will go to error handler and handle this error
    }
  }
  
}
app.use(auth);

//want to do authentication before client fetch the data from our server
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
