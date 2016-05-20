'use strict';

var debug = require('debug')('cyrano:index');

var express = require('express');
var session = require('express-session');
var passport = require('passport');
var app = express();

require('./socket-comms').init(app);

app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');

app.use('/js', express.static(__dirname + '/../public/bower_components'));
app.use('/css', express.static(__dirname + '/../public/css'));

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
   debug(`http://localhost:${app.get('port')}/`);
   debug('versions:', process.versions);
   debug('im listening');
}

