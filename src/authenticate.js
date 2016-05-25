'use strict';

var Auth0Strategy = require('passport-auth0');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var debug = require('debug')('cyrano:auth');

var timeout = function() {
   var to = process.env.JWT_TOKEN_TIMEOUT || '7days';
   return to;
};

var strategy = new Auth0Strategy({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
   },
   function(accessToken, refreshToken, extraParams, profile, done) {
      var token = extraParams.id_token;
      var encrypted_token = jwt.sign(
         {jwt_token: extraParams.id_token}
         , process.env.JWT_TOKEN_SECRET
         , {expiresIn: timeout()}
      );

      // persist token in user profile
      profile.encrypted_jwt_token = encrypted_token;
      profile.jwt_token = token;
      console.log('logged on at ' + new Date().toTimeString());
      return done(null, profile);
   }
);

passport.serializeUser(function(user, done) {
   // debug('serializeUser', user);
   done(null, user);
});

passport.deserializeUser(function(user, done) {
   // debug('deserializeUser', user);
   done(null, user);
});

passport.use(strategy);
