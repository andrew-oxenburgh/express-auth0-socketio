'use strict';

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

   app.get('/sign-on', function(req, resp){
      resp.send('sign-on');
   });
};