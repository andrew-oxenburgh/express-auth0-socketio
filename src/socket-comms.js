'use strict';

var debug = require('debug')('cyrano:r:socketio');

var socketioJwt = require('socketio-jwt');

var io;
module.exports = {
   init: function (app) {
      var server = require('http').Server(app);
      server.listen(5011);
      io = require('socket.io')(server);

      // authorize all socket requests
      io.set('authorization', socketioJwt.authorize(
         {
            secret: process.env.JWT_TOKEN_SECRET,
            handshake: true
         }));


      // log connection made
      io.on('connection', function (socket) {
         debug('made connection');
      });
      
      return module.exports;
   }
};
