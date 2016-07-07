var xml2js = require('xml2js');
var express = require('express');
var request = require('request');
var session = require('express-session');
var _ = require('underscore');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var expressValidator = require('express-validator');
var api = require('./api');

var app = express();
app.use(cookieParser());

app.use(bodyParser.json());
app.use(expressValidator({
    customValidators: {
        isDate: function (value) {
            var date = new Date(value);
            console.log('is date', _.isNaN(date.getTime()), value, date.getTime());
            return !_.isNaN(date.getTime());
        },
        isInArray: function (value, array) {
            console.log('is in array', value, array, _.indexOf(array, value) !== -1);
            return _.indexOf(array, value) !== -1;
        }
    }
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('static/ng-app'));
app.use(express.static('static'));
app.set('views', __dirname + '/templates');
app.engine('html', require('ejs').renderFile);
app.set('trust proxy', 1);

app.use(session({
    resave: true,
    saveUninitialized: true,
    name: 'session',
    signed: true,
    maxAge: 2592000000, // = 1000 * 60 * 60 * 24 * 30
    secret: 'my secret key',
    keys: ['test', 'key2']
}));
app.use('/', function (req, resp, next) {
    console.log('req', req.url);
    if (req.url.indexOf('login') !== -1 || req.url === '/') {
        next();
    }
    else if (!req.session.token) {
        resp.status(401).json();
    }
    else {
        next();
    }
});
app.use('/api', api());
app.get('/', function (req, res) {
    console.log('get /');
    res.render('../static/ng-app/index.html');
});

var server = app.listen(process.env.PORT || 9000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});