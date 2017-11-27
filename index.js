var express = require('express');
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
var client = redis.createClient('32775', '192.168.99.100');
var app = express();

client.on('connect', function () {
    console.log("connected to redis");
});

client.set('fromnode', 'TRUE');

app.use(session({
    name: 'cookie-id',
    secret: 'thisisfuckingawesome',
    saveUninitialized: true,
    resave: true,
    store: new redisStore({
        host: '192.168.99.100',
        port: 32775,
        client: client,
        ttl: 5
    })
}));

app.use(function printSession(req, res, next) {
    console.log('req.session', req.session);
    return next();
});

app.get('/', function (req, res) {
    if (req.session.isLogin == true) {
        res.send('Hell');
    } else {
        res.redirect('/not_auth');
    }
});

app.get('/not_auth', function (req, res) {
    res.send('not authorized');
})

app.get('/login', function (req, res) {
    req.session.key = 'from login session';
    req.session.isLogin = true;
    res.redirect('/');
});

app.get('/logout', function (req, res) {
    req.session.isLogin = false;
    res.redirect('/');
});

app.listen(3000);