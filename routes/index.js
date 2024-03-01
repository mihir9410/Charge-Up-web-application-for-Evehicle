var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {User: 'User'});
});


router.get('/use', function(req, res, next) {
  res.render('index', {User: req.flash('name')});
});


router.get('/signin', function(req, res, next) {
  res.render('login');
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
});

router.get('/signup', function(req, res, next) {
  res.render('signUp');
});

router.get('/finder', function(req, res, next) {
  res.render('map');
});

router.get('/feedback', function(req, res, next) {
  res.render('feedback');
});


router.post('/register', function(req,res){
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret,
    email: req.body.email
  });

  userModel.register(userdata, req.body.password)
  .then(function (registeruser){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile');
    })
  })
});

router.post('/login', passport.authenticate('local',{
  successRedirect: '/use',
  failureRedirect: '/'
}), function(req,res){
  req.flash('name',req.body.username);
})

router.get('/logout',function(req, res, next){
  req.logout(function(err){
    if(err){ return next(err); }
    res.redirect('/signin')
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/signin');
}



module.exports = router;
