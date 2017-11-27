var express = require('express');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var app = express();


app.use(session({
    name: 'cookie-id',
    secret: 'thisisfuckingawesome',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        url: 'mongodb://192.168.99.100:32777/session_node'
    })
}));

app.use(function printSession(req, res, next) {
    console.log('req.session', req.session);
    return next();
});

app.get('/', function(req, res) {
    if(req.session.key){
        res.send('Hell');
    } else{
        res.redirect('/not_auth');
    }
});

app.get('/not_auth', function(req, res) {
    res.send('not authorized');
})

app.get('/login', function(req, res) {
    req.session.key = 'from login session';
    res.redirect('/');
});

app.listen(3000);