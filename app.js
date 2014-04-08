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
    app.set('views', __dirname + '/public');
    app.engine('html', require('ejs').renderFile);
});

app.get('/', function(request, response) {
    response.render('index.html', {pretty: true});
});

app.get('/fetch', function(request, response) {
    fetch(request, response);
});

app.get('/fetch/:id', function(request, response) {
    fetch(request, response);
});

function fetch(request, response) {
    var maxResults = request.query.maxResults;
    if (!/^\-?([0-9]+|Infinity)$/.test(maxResults))
        maxResults = config.gplus.maxResults;

    // console.log(request.query);
    var gid = request.query.gid || request.params.id;

    syng.fetch(gid, {'maxResults': maxResults}, function(err, data) {
        if (err) {
            console.log(err);
            response.send(err.code, err);
            return;
        }
        response.writeHead(200, {'Content-Type': 'text/xml'});
        response.end(data); 
    });    
}

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

app.get('*', function(request ,response) {
    response.status(404).render('404.html', {pretty: true});
});

server.listen(config.server.port, config.server.host, function() {
    console.log("[Srv] It's on, brother.");
});

/**
 * Exports
 */
module.exports = app;