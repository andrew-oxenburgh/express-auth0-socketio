'use strict';

var debug = require('debug')('cyrano:r:socketio');

var bluebird = require('bluebird');
var socketioJwt = require('socketio-jwt');
var jwtVerify = bluebird.promisifyAll(require('jsonwebtoken'));


var jwtOptions = {
   secret: process.env.JWT_TOKEN_SECRET,
   timeout: 15000,
   success: function (data, accept) {
      debug('socket success');
      if (data.request) {
         accept();
      } else {
         accept(null, true);
      }
   },
   fail: function (error, data, accept) {
      debug('socket fail');
      if (data.request) {
         accept(error);
      } else {
         accept(null, false);
      }
   }
};

var io;
module.exports = {
   init: function (app) {
      var server = require('http').Server(app);
      server.listen(5011);
      io = require('socket.io')(server);

      io.sockets.on('connection', socketioJwt.authorize(jwtOptions))
         .on('authenticated', function (socket) {
            //this socket is authenticated, we are good to handle more events from it.
            debug('hello! ' + socket.decoded_token);
            socket.on('something', function (data) {
               jwtVerify.verifyAsync(data.token, process.env.JWT_TOKEN_SECRET)
                  .then(function () {
                     debug('rcvd something from somewhere');
                  })
                  .catch(function(){
                     socket.emit('redirect', {url:'/timeout'})
                     debug('timed out...');
                  });
            });
         })
         .on('unauthenticated', function (socket) {
            socket.emit('logout')
         });

      return module.exports;
   }
};
