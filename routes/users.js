var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.cors, (req, res) => { res.sendStatus(200); });
router.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
    .then(users => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch(err => next(err));
});

router.post('/signup', cors.cors, (req, res, next) => {
  const { password, ...rest } = req.body
  User.register(new User(rest), password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    } else {
      // if (req.body.firstname) {
      //   user.firstname = req.body.firstname;
      // }
      // if (req.body.lastname) {
      //   user.lastname = req.body.lastname;
      // }
      // if (req.body.phoneNumber) {
      //   user.phoneNumber = req.body.phoneNumber;
      // }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.address) {
        user.address = req.body.address;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: "Bạn đã đăng ký thành công", user: user });
        })
      })
    }
  }
  )
})

router.post('/login', cors.cors, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: false, status: 'Đăng nhập không thành công', err: info });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, status: 'Đăng nhập không thành công', err: 'Không thể đăng nhập người dùng!' });
      }
      var token = authenticate.getToken({ _id: req.user._id });
      var admin = req.user.admin
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, admin: admin, token: token, status: 'Bạn đã đăng nhập thành công!', userId: req.user._id, user: user });
    })
  })(req, res, next);
})

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    req.clearCookies('session-id');
    res.redirect('/');
  } else {
    var err = new Error('Bạn chưa đăng nhập');
    err.status = 403;
    next(err);
  }
})

module.exports = router;
