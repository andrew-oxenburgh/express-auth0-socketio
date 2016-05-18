'use strict';

var debug = require('debug')('passport-tut:r:socketio');

var io;
module.exports = {
   init: function(app) {
      var server = require('http').Server(app);
      server.listen(5011);
      io = require('socket.io')(server);
      debug('hello, socket req');
      io.on('connection', function(socket) {
         debug('connection made here', socket.id);
         socket.emit('auth-req');
         socket.on('authResp', function(data) {
            socket.emit('refresh', {});
            debug('authResp', data);
         });
         socket.on('something', function() {
            debug('something');
         });
      });
      debug('init\'d socketio');
      return module.exports;
   },
   refresh: function() {
      io.emit('refresh');
   }
};
