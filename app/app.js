/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */

var config = require('../config.js');
var syng = require('../lib/syndicate-g.js').create(config);

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
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('hello world!');    
    // response.render('', {pretty: true});
});

app.get('/fetch/:id', function(request, response) {
    syng.fetch(request.params.id, function(error, data) {
        if (error)
            console.log(error);

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end(data); 
    });
});

server.listen(config.server.port, function() {
    console.log("It's on, borther.");
});

/**
 * Exports
 */
module.exports = app;