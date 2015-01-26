var express = require('express');
var mustache = require('mustache');
var app = express();

app.set('view engine', 'mustache');

app.get('/', function (req, res) {
    var html = mustache.render('static/index.handlebars');
    res.send(html);
});

var server = app.listen(8888, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('server starting');
});
