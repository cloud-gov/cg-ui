var qs = require('querystring');
var express = require('express');
var passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');


passport.use(new OpenIDConnectStrategy({
  issuer: 'http://localhost:8080/uaa/oauth/token',
  authorizationURL: 'http://localhost:9000/oauth/authorize',
  tokenURL: 'http://localhost:9000/oauth/token',
  userInfoURL: 'http://localhost:9000/userinfo',
  clientID: process.env['CLIENT_ID'],
  clientSecret: process.env['CLIENT_SECRET'],
  callbackURL: '/auth/callback/uaa',
  // passReqToCallback: true,
  scope: [ 'openid' ]
}, function verify(issuer, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.displayName });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


var router = express.Router();

router.get('/login', passport.authenticate('openidconnect'));

// comment out the below callback and enable this for debugging
// router.get('/auth/callback/uaa', passport.authenticate('openidconnect', function(err, user, info, status) {
//   console.log("USER: " + JSON.stringify(user));
//   console.log("ERROR: " + JSON.stringify(err));
//   console.log("INFO: " + JSON.stringify(info));
//   console.log("STATUS: " + JSON.stringify(status));
// }))

router.get('/auth/callback/uaa', passport.authenticate('openidconnect', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/failure'
}));

router.get('/failure', function(req, res, next) {
  res.send("something didn't work here");
})

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    var params = {
      client_id: process.env['AUTH0_CLIENT_ID'],
      returnTo: 'http://localhost:3000/'
    };
    res.redirect('http://localhost:9000/logout.do' + qs.stringify(params));
  });
});

module.exports = router;
