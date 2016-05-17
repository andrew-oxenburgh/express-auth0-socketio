'use strict';

var express = require('express');
var app = express();
var debug = require('debug')('passport-tut:index');

var port = process.env.PORT || 5050;

app.set('port', port);

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

app.listen(app.get('port'), imListening);
exports.port = port;
exports.app = app;

debug('starting up');

function imListening() {
   debug('Node app is running on port', app.get('port'));
   debug(`http://localhost:${app.get('port')}`);
   debug('versions:', process.versions);
   debug('im listening');
}

