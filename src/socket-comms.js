'use strict';

var debug = require('debug')('cyrano:r:socketio');

var bluebird = require('bluebird');
var socketioJwt = require('socketio-jwt');
var jwtVerify = bluebird.promisifyAll(require('jsonwebtoken'));


var jwtOptions = {
   secret: process.env.JWT_TOKEN_SECRET,
   timeout: 15000
};

var io;
var verifiedOnEvent = function (socket, evtName, evtFn) {
   socket.on(evtName, function (data) {
      jwtVerify.verifyAsync(data.token, process.env.JWT_TOKEN_SECRET)
         .then(evtFn)
         .catch(function () {
            socket.emit('redirect', {url: '/timeout'});
            debug('timed out...');
         });
   });
};

var handleSomething = function (data) {
   debug('rcvd something from somewhere - ', data.jwt_token);
};

var noop = function (data) {
};

module.exports = {
   init: function (app) {
      var server = require('http').Server(app);
      server.listen(5011);
      io = require('socket.io')(server);

      io.sockets.on('connection', socketioJwt.authorize(jwtOptions))
         .on('authenticated', function (socket) {
            debug('hello! ' + socket.decoded_token);
            verifiedOnEvent(socket, 'something', handleSomething);
            verifiedOnEvent(socket, 'auth-check', noop);
         })
         .on('unauthenticated', function (socket) {
            socket.emit('logout')
         });

      return module.exports;
   }
};
