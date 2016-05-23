'use strict';

var debug = require('debug')('cyrano:routes');
var passport = require('passport');
var bluebird = require('bluebird');
var jwt = bluebird.promisifyAll(require('jsonwebtoken'));

var redirectIfUnauthed = function (req, resp, next) {
   if (req.isAuthenticated()) {
      next();
   } else {
      resp.redirect('/');
   }
};

var privatePage = function (req, resp) {
   var encrypted_token = req.user.encrypted_jwt_token;
   jwt.verifyAsync(encrypted_token, process.env.JWT_TOKEN_SECRET)
      .then(function () {
         resp.render('private.ejs',
            {
               jwt_token: encrypted_token
            })
      })
      .catch(function(err){
         // timed out, or something
         req.logout();
         resp.redirect('/?timeout=true');
      });
};

var publicPage = function (req, resp) {
   resp.render('public.ejs',
      {
         authed: req.isAuthenticated(),
         timeout: req.query.timeout
      });
};

var logout = function (req, res) {
   req.logout();
   debug('/logout', req.isAuthenticated());
   res.redirect('/');
};

var timeout = function (req, res) {
   req.logout();
   res.redirect('/?timeout=true');
};

module.exports = function (app) {
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

   app.get('/logout', logout);
   app.get('/timeout', timeout);

   app.get('/callback',
      passport.authenticate('auth0', {
         failureRedirect: '/'
      }),
      function (req, res) {
         debug('/callback', req.isAuthenticated());
         if (!req.user) {
            throw new Error('user null');
         }
         res.redirect('/private');
      }
   );

};
