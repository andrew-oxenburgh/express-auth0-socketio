'use strict';

var express = require('express');
var app = express();
var debug = require('debug')('passport-tut:index');

var port = process.env.PORT || 5050;

app.set('port', port);

require('./routes')(app);

app.listen(app.get('port'), imListening);

debug('starting up');

function imListening() {
   debug('Node app is running on port', app.get('port'));
   debug(`http://localhost:${app.get('port')}`);
   debug('versions:', process.versions);
   debug('im listening');
}

