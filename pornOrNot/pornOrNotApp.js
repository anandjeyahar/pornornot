var settings = {'redis': {'port':9383,
                          'host':'dab.redistogo.com',
                          'password': 'a213c4dc060e5584796848891a806b44',
                          'username':  'redistogo'
                    },
    };

var express = require('express'),
    mustache = require('mustache'),
    redis = require('redis'),
    fs = require('fs'),
    client = redis.createClient(settings.redis.port,
                                settings.redis.host,
                                {no_ready_check: true}),
    app = express();


var tmpl = {
    compile: function (source, options) {
        if (typeof source == 'string') {
            return function(options) {
                options.locals = options.locals || {};
                options.partials = options.partials || {};
                if (options.body) // for express.js > v1.0
                    locals.body = options.body;
                return mustache.to_html(
                    source, options.locals, options.partials);
            };
        } else {
            return source;
        }
    },
    render: function (template, options) {
        template = this.compile(template, options);
        return template(options);
    }
};

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
    console.log(imgArgs);
    var imgId = imgData['imgUrl'][0].split('/')[-1];
    switch (imgArgs['pornCategory']) {
        case 'pussy':
            client.sadd(P_SET, imgId);
            break;
        case 'ass':
            client.sadd(A_SET, imgId);
            break;
        case 'dick':
            client.sadd(D_SET, imgId);
            break;
        case 'sideTits':
            client.sadd(S_BOOBS_SET, imgId);
            break;
        case 'frontalTits':
            client.sadd(F_BOOBS_SET, imgId);
            break;
        case null:
            client.sadd(NP_SET, imgId);
        }
}

var imgurLinks = function () {
    return fs.readFileSync('./imagelist.txt', 'utf8').split('\n').slice(0, -1);
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
    processImgData(res);
});

var server = app.listen(8888, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('server starting');
});
