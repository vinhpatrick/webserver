var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var config = require('./config')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/productRouter');
var commentRouter = require('./routes/commentRouter');
var favoriteRouter = require('./routes/favoriteRouter');
var cartRouter = require('./routes/cartRouter');
var orderRouter = require('./routes/orderRouter');
var uploadRouter = require('./routes/uploadRouter');
var orderAdminRouter = require('./routes/orderRouterAdmin');
var feedbackRouter = require('./routes/feedbackRouter')



const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url)
  .then((db) => {
    console.log('Kết nối tới database thành công...' + app.get('port'));
  }, (err) => { console.log("err", err) })

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', productRouter);
app.use('/comments', commentRouter);
app.use('/favorites', favoriteRouter);
app.use('/carts', cartRouter);
app.use('/orders', orderRouter);
app.use('/admin/orders', orderAdminRouter);
app.use('/imageUpload', uploadRouter);
app.use('/feedback', feedbackRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
