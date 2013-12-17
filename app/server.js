/**
 * server.js
 */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var _ = require('underscore')._;

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

server.listen(8080, function() {
    console.log("It's on, borther.");
});

/**
 * Return
 */
module.exports = app;