'use strict';

// ## Looks after the 2 way socket communications with the server

var debug = require('debug')('cyrano:r:socketio');

var bluebird = require('bluebird');
var socketioJwt = require('socketio-jwt');
var jwtVerify = bluebird.promisifyAll(require('jsonwebtoken'));

var crypto = require('crypto');

var jwtOptions = {
   secret: process.env.JWT_TOKEN_SECRET,
   timeout: 15000    // this is the time within which to expect a response
   // from the authenticated app
};

// #### For a given socket and event, if the token is authorised, run the
// function
// * @param socket - to listen on
// * @evtName - name of the event
// * @evtFn - function to be called - function([[socket], data])
var verifiedOnEvent = function(socket, evtName, evtFn) {
   socket.on(evtName, function(data) {
      jwtVerify.verifyAsync(data.token, process.env.JWT_TOKEN_SECRET)
         .then(function() {
            return data;
         })
         .then(evtFn)
         .catch(function(err) {
            debug('timed out...', err);
            socket.emit('redirect', {url: '/timeout'});
         })
         .done(function() {
            debug('done');
         });
   });
};

// #### sample function for above. You'll need to bind this
var handleSomething = function(socket, data) {
   debug('rcvd something from somewhere - ', data.jwt_token);
   socket.emit('something:else');
};

var noop = function() {
};

module.exports = {
   init: function(app) {
      var server = require('http').Server(app);
      server.listen(5011);
      var io = require('socket.io')(server);

      var broadcastFn = function(socket, room, data) {
         io.sockets.to(room).emit('broadcast-cyrano:clients', {message: data.message});
      };

      // authenticate me, and wait for ```authenticated``` message. Then
      // register handlers
      io.sockets.on('connection', socketioJwt.authorize(jwtOptions))
         .on('authenticated', function(socket) {
            var userId = jwtVerify.decode(socket.decoded_token.jwt_token, process.env.JWT_TOKEN_SECRET).sub;
            var cipher = crypto.createCipher('aes256', process.env.USER_ID_SECRET);
            var userHash = cipher.update(userId, 'utf8', 'base64');
            userHash += cipher.final('base64');

            var roomName = '/' + userHash;
            var room = socket.join(roomName);
            socket.emit('room', {roomName: roomName});

            // handle manual messages from web page
            verifiedOnEvent(socket, 'something', handleSomething.bind(null, socket));
            // handle auth checks from web page
            verifiedOnEvent(socket, 'auth-check', noop);
            verifiedOnEvent(socket, 'broadcast-cyrano:server', broadcastFn.bind(null, socket, roomName));
            debug('finished authentication');
         })
         .on('unauthenticated', function(socket) {
            console.log('unauthenticated');
            socket.emit('redirect', {url: '/timeout'});
         });

      return module.exports;
   }
};
