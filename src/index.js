'use strict';

var express = require('express');
var session = require('express-session');
var debug = require('debug')('passport-tut:index');
var passport = require('passport');

var app = express();

app.use(session({
   secret: process.env.AUTH0_CLIENT_SECRET,
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

var authenticate = require('./authenticate');
require('./routes')(app);

var port = process.env.PORT || 5010;

app.set('port', port);


app.listen(app.get('port'), imListening);

debug('starting up');

function imListening() {
   debug('Node app is running on port', app.get('port'));
   debug(`http://localhost:${app.get('port')}/sign-on`);
   debug('versions:', process.versions);
   debug('im listening');
}

