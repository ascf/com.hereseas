var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

//var routes = require('./routes/index');
//var users = require('./routes/users');

var config = require('./config');
var _ = require('lodash');




var app = express();

var routes = require('./routes');
//var authUser = require('./common/auth.js');
var crypto = require('crypto');

var multer = require('multer');


require('./common/dataformat.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/app', express.static(path.join(__dirname, 'app')));


app.use(session({
    secret: config.session_secret,
    store: new MongoStore({
        url: config.db
    }),
    resave: true,
    saveUninitialized: true,
}));




// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//app.use(authUser.authUser);


app.use(multer({
    dest: './public/upload'
}));

// routes
routes(app);


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        return;
        res.json({
            result: false,
            err: 'ERR_SERVICE_ERROR',
            message: err.message
        });
    });

}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.json({
        result: false,
        err: 'ERR_SERVICE_ERROR',
        message: err
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.json({
        result: false,
        err: 'ERR_SERVICE_NOT_FOUND'
    });
});


// set static, dynamic helpers
_.extend(app.locals, {
    config: config
});



_.extend(app.locals, require('./common/render_helpers'));


function encrypt(str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

function decrypt(str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}


module.exports = app;