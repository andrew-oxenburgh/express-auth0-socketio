'use strict';

var debug = require('debug')('passport-tut:routes');

var passport = require('passport');

module.exports = function (app) {
   app.get('/', function (req, resp) {
      var authed = req.isAuthenticated();
      debug('/', authed);
      var choice = '';
      if (authed) {
         choice = '<a href="/private">go to my account page</a>'
      } else {
         choice = '<a href="/login">log in</a>';
      }
      resp.send(`<h1>welcome page</h1><h2> ${choice}</h2>`);
   });

   app.get('/private',
      function(req, resp, next){
        if(req.isAuthenticated()){
           next();
        }else{
           resp.redirect('/');
        }
      },
      function (req, resp) {
         debug('/private', req.isAuthenticated());
         resp.send('private <a href="/logout">logout</a>');
      });

   app.get('/login',
      passport.authenticate('auth0', {}), function (req, res) {
         debug('/login', req.isAuthenticated());
         res.redirect("/");
      });

   app.get('/logout',
      function (req, res) {
         req.logout();
         debug('/logout', req.isAuthenticated());
         res.redirect("/");
      });

   app.get('/callback',
      passport.authenticate('auth0', {
         successRedirect: '/private',
         failureRedirect: '/login'
      }),
      function (req, res) {
         debug('/callback', req.isAuthenticated());
         if (!req.user) {
            throw new Error('user null');
         }
         res.redirect("/private");
      }
   );

};