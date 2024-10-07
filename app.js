var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const flash = require('express-flash');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nodemailer = require('nodemailer');
const WebSocket = require('ws');

var indexRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(session({
  secret: "thisismysecretkey",  
  saveUninitialized: true,
  cookie: { maxAge: 6000000 },
  resave: false,
}))
app.use(express.urlencoded({ extended: true }));
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});



const server =app.listen(2000,()=>
  console.log('Server listening to 2000 ')) 
  
  // WebSocket server setup
  const wss = new WebSocket.Server({ server });   
//chatbox

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
  
      const botResponse = processMessage(message);
      console.log(botResponse);
      // console.log(typeof(messageinput));
      ws.send(JSON.stringify({ message: botResponse }));
  });
});

function processMessage(message) {
  
  if (message.includes('hai')) {
      return "Welcome to LARAZONE ! How can I assist you today?";
  } else if (message.includes('sneakers')) {
      return "Here are some sneakers:nike,Adidas";
  } else if (message.includes('order')) {
    return "Sure, please provide your order ID.";
  } else if (message.includes('gift')) {
      return "yes you can also send as gift by using gift card facility";
  } else if (message.includes('payment')) {
    return "we provide COD,gpay,UPI";
  } else if (message.includes('return policy')) {
    return "7 days easy returns available";
  } else {
      return "Sorry, I didn't understand that. How can I assist you?"; 
  }
}




module.exports = app;

