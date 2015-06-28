var userRoute = require('./routes/userRoute');

var passport = require('passport');

module.exports = function (app) {


    app.get('/test', function (req, res, next) {
        res.json({
            test: 'this is testing'
        });
    });

    app.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({
                    result: false,
                    err: info
                });
                //return res.redirect('/m_login_failure?callback='+req.body.callback); 
            } else {

            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                var user = {};
                user.id = req.user._id;
                user.username = req.user.username;
                user.firstname = req.user.firstname;
                user.lastname = req.user.lastname;
                user.gender = req.user.gender;
                user.avatar = req.user.avatar;

                user.email = req.user.email;
                user.birthday = req.user.birthday;

                //user.

                return res.json({
                    id: user.id,
                    result: true
                });

            });
        })(req, res, next);
    });

    app.post('/user', userRoute.createUser);
    app.get('/user', userRoute.getUserList);
    app.get('/user/:id', userRoute.getUser);

    app.get('/', function (req, res) {
        res.render('index');
    });

};