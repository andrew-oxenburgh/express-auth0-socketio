'use strict';

var Auth0Strategy = require('passport-auth0');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var debug = require('debug')('cyrano:auth');

var timeout = function () {
   var to = process.env.JWT_TOKEN_TIMEOUT || '7days';
   return to;
};

var strategy = new Auth0Strategy({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
   },
   function (accessToken, refreshToken, extraParams, profile, done) {
      var token = jwt.sign(
         {jwt_token:extraParams.id_token}
         , process.env.JWT_TOKEN_SECRET
         , {expiresIn:timeout()}
      );
      profile.encrypted_jwt_token = token;
      profile.jwt_token = extraParams.id_token;
      console.log('logged on at ' + new Date().toTimeString());
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
   }
);

passport.serializeUser(function (user, done) {
   // debug('serializeUser', user);
   done(null, user);
});

passport.deserializeUser(function (user, done) {
   // debug('deserializeUser', user);
   done(null, user);
});

passport.use(strategy);
