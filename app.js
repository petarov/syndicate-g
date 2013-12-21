/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */
"use strict";

var config = require('./config.js');
var syng = require('./lib/syndicate-g.js')(config).create();

var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.configure(function() {
    // app.locals.pretty = true;
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger());
    app.engine('html', require('ejs').renderFile);
});

app.get('/', function(request, response) {
    // response.writeHead(200, {'Content-Type': 'text/plain'});
    // response.end('hello world!');    
    response.render('index.html', {pretty: true});
});

app.get('/fetch/:id', function(request, response) {
    syng.fetch(request.params.id, function(err, data) {
        if (err) {
            console.log(err);
            response.send(err.code, err);
            return;
        }
        response.writeHead(200, {'Content-Type': 'text/xml'});
        response.end(data); 
    });
});

app.get('/clear/:id', function(request, response) {
    syng.deleteCache(request.params.id, function(err) {
        if (err) {
            console.log(err);
            response.send(err.code, err);
            return;
        }
        response.send(200);
    });
});

server.listen(config.server.port, function() {
    console.log("It's on, borther.");
});

/**
 * Exports
 */
module.exports = app;