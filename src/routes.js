'use strict';

var debug = require('debug')('cyrano:routes');
var passport = require('passport');
var bluebird = require('bluebird');
var jwt = bluebird.promisifyAll(require('jsonwebtoken'));

var redirectIfUnauthed = function(req, resp, next) {
   if (req.isAuthenticated()) {
      next();
   } else {
      resp.redirect('/');
   }
};

var privatePage = function(req, res) {
   var encrypted_token = req.user.encrypted_jwt_token;
   jwt.verifyAsync(encrypted_token, process.env.JWT_TOKEN_SECRET)
      .then(function() {
         res.render('private.ejs',
            {
               jwt_token: encrypted_token,
               auth_interval: process.env.JWT_AUTH_INTERVAL || '2hours',
               jwt_timeout: process.env.JWT_TOKEN_TIMEOUT || '7days',
               user_picture: req.user.picture,
               user_displayName: req.user.displayName,
               user_nickname: req.user.nickname,
               user_provider: req.user.provider
            });
      })
      .catch(function(err) {
         // timed out, or something
         req.logout();
         res.locals.timeout = true;
         res.redirect('/');
      });
};

var publicPage = function(req, res) {
   res.render('public.ejs',
      {
         authed: req.isAuthenticated(),
         timeout: res.locals.timeout || req.query.timeout || false
      });
};

var logout = function(req, res, next) {
   req.logout();
   next();
};

var timeout = function(req, res, next) {
   req.logout();
   res.locals.timeout = true;
   next();
};

module.exports = function(app) {
   app.get('/', publicPage);

   app.get('/private',
      redirectIfUnauthed,
      privatePage
   );

   app.get('/login',
      passport.authenticate('auth0', {
         successRedirect: '/',
         failureRedirect: '/',
         failureFlash: true
      }));

   app.get('/logout', logout, publicPage);
   app.get('/timeout', timeout, publicPage);

   app.get('/callback',
      passport.authenticate('auth0', {
         failureRedirect: '/'
      }),
      function(req, res, next) {
         debug('/callback', req.isAuthenticated());
         if (!req.user) {
            throw new Error('user null');
         }
         res.redirect('/private');
      }
   );

};
