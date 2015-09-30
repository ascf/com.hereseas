var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');

var Results = require('./commonResult');

var User = require('../models').User;

var fs = require('fs');

var passport = require('passport');

var md5 = require('MD5');
var AWS = require('aws-sdk');

var APIHOST = "http://dev.hereseas.com/#";



exports.test = function(req, res, next) {
    res.json(Results.ERR_DB_ERR);
};

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({
        result: false,
        err: 'ERR_NOT_ALLOWED'
    });

};

exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.jsonp({
                result: false,
                err: info
            });
            //return res.redirect('/m_login_failure?callback='+req.body.callback);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }

            var user = {};
            user.id = req.user._id;
            user.username = req.user.username;
            user.gender = req.user.gender;
            user.avatar = req.user.avatar;

            return res.json({
                id: user.id,
                result: true
            });

        });
    })(req, res, next);
};


/**
 * check email & password
 * @param req
 * @param res
 * @param next
 */
exports.createUser = function(req, res, next) {


    var user = new User();
    user.email = req.body.email;

    var validator = require("email-validator");
    if (!validator.validate(user.email)) {
        return res.json(Results.ERR_DATAFORMAT_ERR);
    }

    user.username = req.body.username;
    user.password = req.body.password;

    var randomstring = require("randomstring");
    user.activecode = randomstring.generate();


    if (tools.isEmpty(user.email) || tools.isEmpty(user.password) || tools.isEmpty(user.username)) {
        return res.json(Results.ERR_PARAM_ERR);
    }

    user.password = md5(user.password);


    var ep = new EventProxy();
    ep.all('checkEmail', function() {

        user.save(function(err, user) {

            if (err) {
                console.log(err);
                return next();
            } else
                res.json({
                    result: true,
                    id: user.id
                });
        });
    });

    ep.fail(function(err) {
        res.json({
            result: false,
            err: err
        });
    });

    User.findOne({
        email: user.email
    }, function(err, item) {
        if (item != null) {
            ep.emit("error", 'ERR_EXISTED_EMAIL ');
        } else {
            ep.emit('checkEmail');
        }
    });
};

exports.getUserList = function(req, res, next) {


    var query = {};
    if (req.query.gender)
        query.gender = req.query.gender;


    User.find(
        query,
        'firstName lastName email schoolId avatar description tags last_login',
        function(err, users) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
            } else {
                res.json({
                    result: true,
                    data: users
                });
            }
        });
};

exports.getUser = function(req, res, next) {
    var userId = req.param('id');
    if (userId) {
        User.findById(userId,
            function(err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                } else {
                    res.json({
                        result: true,
                        data: {
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            schoolId: user.schoolId,
                            avatar: user.avatar,
                            description: user.description,
                            tags: user.tags,
                            favorite: user.favorite
                        }
                    });
                }
            });
    } else {
        res.json(Results.ERR_URL_ERR);
    }
};

exports.editUser = function(req, res, next) {

    var epUser = new EventProxy();

    User.findById(req.user.id,
        function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else {
                epUser.emit("findUser", user);
            }
        });

    epUser.all("findUser", function(user) {

        console.log("user", user);

        var reqData = {
            userName: req.body.userName,
            schoolId: req.body.schoolId
        };

        if (tools.hasNull(reqData)) {

            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        if (req.body.avatar) {
            reqData.avatar = req.body.avatar;
        }

        if (req.body.description) {
            reqData.description = req.body.description;
        }


        for (var key in reqData) {
            user[key] = reqData[key];
        }

        user['status'] = 1;

        user.save(function(err, user) {

            if (err) {
                console.log(err);
                return next();
            } else {

                res.json({
                    result: true,
                    data: user
                });


            }
        });
    });


};



exports.activeUserSendEmail = function(req, res, next) {

    eduEmail = req.body.eduEmail;

    console.log(eduEmail)

    if (!eduChecker(eduEmail)) {
        res.json({
            result: false,
            err: 'ERR_NOT_EDUEMAIL_ERR'
        });
        return;
    }

    console.log(eduEmail)

    User.findOne({
        eduEmail: eduEmail
    }, function(err, user) {
        if (user != null) {
            res.json({
                result: false,
                err: 'ERR_EXISTED_EMAIL'
            });
        } else {
            User.findById(req.user.id,
                function(err, user) {
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                        return;
                    } else {

                        if (user.verified) {
                            res.json(Results.ERR_ALREADYVERIFIED_ERR);
                            return;
                        }

                        user.eduEmailTemp = eduEmail;
                        user.save(function(err, user) {

                            if (err) {
                                console.log(err);
                                return next();
                            } else {
                                var url = APIHOST + '/verify' + '?uid=' + user.id + '&action=activate&code=' + user.activecode;
                                sendEmail(eduEmail, url)

                                res.json({
                                    result: true,
                                });



                            }
                        });

                    }
                });



        }
    });


};


exports.activeUserVerifyLink = function(req, res, next) {


    var reqData = {
        uid: req.body.uid, 
        code: req.body.code
    };

    console.log(reqData);


    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    User.findById(reqData.uid, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (user.verified == true) {
            res.json(Results.ERR_ALREADYVERIFIED_ERR);
            return;
        } else if (user.activecode != reqData.code) {
            res.json(Results.ERR_ACTIVATED_ERR);
            return;
        } else {
            User.findOne({
                eduEmail: user.eduEmailTemp
            }, function(err, userCheck) {
                if (userCheck != null) {
                    res.json({
                        result: false,
                        err: 'ERR_EXISTED_EMAIL'
                    });
                } else {

                    user.activecode = "";
                    user.verified = true;
                    user.eduEmail = user.eduEmailTemp
                    user.eduEmailTemp = "";

                    user.save(function(err, user) {

                        if (err) {
                            console.log(err);
                            return next();
                        } else
                            res.json({
                                result: true,
                                id: user.id
                            });
                    });
                }
            });
        }
    });



};



function sendEmail(email, url) {

    var ses = new AWS.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });

    var emailHereseas = "no-reply@hereseas.com";

    var emailTO = email;

    var ses_mail = "From: 'Hereseas.com' <" + emailHereseas + ">\n";
    ses_mail = ses_mail + "To: " + emailTO + "\n";
    ses_mail = ses_mail + "Subject: Hereseas account activation\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "Thank you for joining Hereseas community ! Please click the link below to verify that this is your edu email address：" + url + '\n\n';
    // ses_mail = url + "\n\n";


    var params = {
        RawMessage: {
            Data: new Buffer(ses_mail)
        },
        Destinations: [emailTO],
        Source: "'Hereseas account activation' <" + emailHereseas + ">'"
    };


    ses.sendRawEmail(params, function(err, data) {
        if (err) {
            throw (err);
            console.log(err)
            return false;
        } else {
            return true;
        }
    });


}

function eduChecker(email) {

    var str = email.substring(email.indexOf('@') + 1);

    console.log(str);

    return str.indexOf(".edu") > -1


}



exports.tempUser = function(req, res, next) {


    var userId = req.param('id');

    if (userId) {
        User.findById(userId,
            function(err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                } else {
                    user.verified = true;

                    user['status'] = 1;

                    user.save(function(err, user) {

                        if (err) {
                            console.log(err);
                            return next();
                        } else {

                            res.json({
                                result: true,
                                data: user
                            });


                        }
                    });



                }
            });
    } else {
        res.json(Results.ERR_URL_ERR);
    }



};





exports.getUserAllInfo = function(req, res, next) {
    var userId = req.param('id');
    if (userId) {
        User.findById(userId,
            function(err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                } else {
                    res.json({
                        result: true,
                        data: user
                    });
                }
            });
    } else {
        res.json(Results.ERR_URL_ERR);
    }
};