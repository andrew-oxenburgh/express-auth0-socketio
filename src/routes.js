'use strict';

var debug = require('debug')('cyrano:routes');
var passport = require('passport');

var redirectIfUnauthed = function (req, resp, next) {
   if (req.isAuthenticated()) {
      next();
   } else {
      resp.redirect('/');
   }
};

var privatePage = function (req, resp) {
   resp.render('private.ejs',
      {
         jwt_token: req.user.encrypted_jwt_token
      });
};

var publicPage = function (req, resp) {
   var authed = req.isAuthenticated();
   debug('/', authed);
   resp.render('public.ejs',
      {
         authed: authed
      });
};

var logout = function (req, res) {
   req.logout();
   debug('/logout', req.isAuthenticated());
   res.redirect('/');
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
