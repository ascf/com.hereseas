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



exports.test = function (req, res, next) {
    res.json(Results.ERR_DB_ERR);
};

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({
        result: false,
        err: 'ERR_NOT_ALLOWED'
    });

};

exports.login = function (req, res, next){
    passport.authenticate('local', function (err, user, info) {
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
exports.createUser = function (req, res, next) {


    var user = new User();
    user.email =  req.body.email;
    user.password = req.body.password;

    if(tools.isEmpty(user.email)||tools.isEmpty(user.password)){
        return res.json(Results.ERR_PARAM_ERR);
    }

    user.password = md5(user.password);


    var ep = new EventProxy();
    ep.all('checkEmail', function () {


        user.save(function (err, user) {

            if (err)
            {
                console.log(err);
                return next();
            }
            else
                res.json({
                    result: true,
                    id: user.id
                });
        });
    });

    ep.fail(function (err) {
        res.json({
            result: false,
            err: err
        });
    });

    User.findOne({
        email: user.email
    }, function (err, item) {
        if (item != null) {
            ep.emit("error", 'ERR_EXISTED_EMAIL ');
        } else {
            ep.emit('checkEmail');
        }
    });
};

exports.getUserList = function (req, res, next) {


    var query = {};
    if (req.query.gender)
        query.gender = req.query.gender;


    User.find(
        query,
        'firstName lastName email schoolId avatar description tags last_login',
        function (err, users) {
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

exports.getUser = function (req, res, next) {
    var userId = req.param('id');
    if (userId) {
        User.findById(userId,
            function (err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                }else{
                    res.json({result:true,data:{
                        id:user.id,
                        email:user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        schoolId: user.schoolId,
                        avatar: user.avatar_url,
                        description: user.description,
                        tags: user.tags,
                        favorite: user.favorite
                    }});
                }
            });
    } else {
        res.json(Results.ERR_URL_ERR);
    }
};
