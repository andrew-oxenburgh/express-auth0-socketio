'use strict';

var debug = require('debug')('passport-tut:routes');

var passport = require('passport');

module.exports = function(app){
   app.get('/', function(req, resp){
      resp.send('hello, world');
   });

   app.get('/public', function(req, resp){
      resp.send('public');
   });

   app.get('/private', function(req, resp){
      resp.send('private');
   });

   app.get('/callback',
      passport.authenticate('auth0', { failureRedirect: '/sign-on' }),
      function(req, res) {
         if (!req.user) {
            throw new Error('user null');
         }
         res.redirect("/");
      }
   );

   app.get('/sign-on',
      passport.authenticate('auth0', {}), function (req, res) {
         debug('authenticating');
         res.redirect("/");
      });

};