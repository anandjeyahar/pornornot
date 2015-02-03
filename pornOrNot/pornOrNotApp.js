var config = require('./config.js');
var settings = {'redis': config.dev.redis
    };

var express = require('express'),
    querystring = require('querystring'),
    redis = require('redis'),
    fs = require('fs'),
    client = redis.createClient(settings.redis.port,
                                settings.redis.host,
                                {no_ready_check: true}),
    app = express();



var PORNDETECT_PREFIX = 'porn:or:not:',
    F_BOOBS_SET = 'porn:f:tits',
    S_BOOBS_SET = 'porn:s:boobs',
    P_SET = 'porn:pussy',
    D_SET = 'porn:dick',
    A_SET = 'porn:butts',
    NP_SET = 'porn:not';

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
            console.log('added ' + resp + 'items');
        };

    switch (imgArgs.pornCategory) {
        case 'pussy':
            client.sadd(P_SET, imgId, errFunc);
            client.zadd(P_SET, imgId, 1, errFunc);
            break;
        case 'ass':
            client.sadd(A_SET, imgId, errFunc);
            client.zadd(A_SET, imgId, 1, errFunc);
            break;
        case 'dick':
            client.sadd(D_SET, imgId, errFunc);
            client.zadd(D_SET, imgId, 1, errFunc);
            break;
        case 'sideTits':
            client.sadd(S_BOOBS_SET, imgId, errFunc);
            client.zadd(S_BOOBS_SET, imgId, 1, errFunc);
            break;
        case 'frontalTits':
            client.sadd(F_BOOBS_SET, imgId, errFunc);
            client.zadd(F_BOOBS_SET, imgId, 1, errFunc);
            break;
        case 'None':
            client.sadd(NP_SET, imgId, errFunc);
            client.zadd(NP_SET, imgId, 1, errFunc);
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
        //res.redirect('/');
        res.end();
    });
});

var server = app.listen(9900, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('server starting');
});
