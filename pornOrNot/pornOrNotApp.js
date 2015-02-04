var config = require('./config.js');
var settings = {'redis': config.dev.redis
    };

var express = require('express'),
    querystring = require('querystring'),
    redis = require('redis'),
    fs = require('fs'),
    path = require('path'),
    client = redis.createClient(settings.redis.port,
                                settings.redis.host,
                                {no_ready_check: true}),
    app = express();

// Redis keys
var PORNDETECT_PREFIX = 'porn:or:not:',
    F_BOOBS_SSET = PORNDETECT_PREFIX + 'f:tits',
    S_BOOBS_SSET = PORNDETECT_PREFIX + 's:boobs',
    P_SSET = PORNDETECT_PREFIX + 'pussy',
    D_SSET = PORNDETECT_PREFIX + 'dick',
    A_SSET = PORNDETECT_PREFIX + 'butts',
    NP_SSET = PORNDETECT_PREFIX + 'not';

app.set('view engine', 'jade');
if (settings.redis.password) {
    client.auth(settings.redis.password, function(err, res) {
        if(!err) {
            console.log('Redis client conected');
        }
    });
}

var processImgData = function(imgArgs) {
    var urlParts = imgArgs.imgUrl.split('/');
    var imgId = urlParts[urlParts.length - 1];
    var errFunc = function (err, resp) {
            if (err) throw err;
            console.log('added ' + resp + ' items');
        };

    switch (imgArgs.pornCategory) {
        case 'pussy':
            client.zincrby([P_SSET, 1.0, imgId] , errFunc);
            break;
        case 'ass':
            client.zincrby([A_SSET, 1.0, imgId], errFunc);
            break;
        case 'dick':
            client.zincrby([D_SSET, 1.0, imgId], errFunc);
            break;
        case 'sideTits':
            client.zincrby([S_BOOBS_SSET, 1.0, imgId], errFunc);
            break;
        case 'frontalTits':
            client.zincrby([F_BOOBS_SSET, 1.0, imgId], errFunc);
            break;
        case 'None':
            client.zincrby([NP_SSET, 1.0, imgId], errFunc);
        }
}

var imgurLinks = function () {
    return fs.readFileSync('../imagelist.txt', 'utf8').split('\n').slice(0, -1);
}

var nextImgurLink = function() {
    allLinks = imgurLinks();
    return allLinks[Math.floor(Math.random() * allLinks.length)];
}

app.get('/', function (req, res) {
    res.render('pornornot', {});
});

app.get('/next', function (req, res) {
    res.send(nextImgurLink());
});

app.post('/pollpost', function (req, res) {
    var fullBody = '';
    req.on('data', function(chunk) {
        console.log("Received body data");
        fullBody += chunk.toString();
        });
    req.on('end', function() {

        urlDecodedBody = querystring.parse(fullBody);
        processImgData(urlDecodedBody);
        res.setHeader('status', 200);
        res.end();
    });
});

var server = app.listen(9900, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('server starting');
});
