'use strict';

// ## Looks after the 2 way socket communications with the server

var debug = require('debug')('cyrano:r:socketio');

var bluebird = require('bluebird');
var socketioJwt = require('socketio-jwt');
var jwtVerify = bluebird.promisifyAll(require('jsonwebtoken'));

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
var verifiedOnEvent = function (socket, evtName, evtFn) {
   socket.on(evtName, function (data) {
      jwtVerify.verifyAsync(data.token, process.env.JWT_TOKEN_SECRET)
         .then(evtFn)
         .catch(function (err) {
            debug('timed out...', err);
            socket.emit('redirect', {url: '/timeout'});
         });
   });
};

// #### sample function for above. You'll need to bind this
var handleSomething = function (socket, data) {
   debug('rcvd something from somewhere - ', data.jwt_token);
   socket.emit('something:else');
};

var noop = function () {
};

module.exports = {
   init: function (app) {
      var server = require('http').Server(app);
      server.listen(5011);
      var io = require('socket.io')(server);

      // authenticate me, and wait for ```authenticated``` message. Then
      // register handlers
      io.sockets.on('connection', socketioJwt.authorize(jwtOptions))
         .on('authenticated', function (socket) {
            console.log('authenticated');
            // handle manual messages from web page
            verifiedOnEvent(socket, 'something', handleSomething.bind(null, socket));
            // handle auth checks from web page
            verifiedOnEvent(socket, 'auth-check', noop);
            verifiedOnEvent(socket, 'ping', noop);
         })
         .on('unauthenticated', function (socket) {
            console.log('unauthenticated');
            socket.emit('redirect', {url: '/timeout'});
         });

      return module.exports;
   }
};
