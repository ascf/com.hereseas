var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');


var User = require('../models').User;


var fs = require('fs');


exports.test = function (req, res, next) {
    res.json({
        result: 'this is result'
    });
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


exports.createUser = function (req, res, next) {

    var data = {
        email: req.body.email
    };

    console.log(data);

    var ep = new EventProxy();
    ep.all('checkEmail', function () {
        var user = new User();
        //user.username = data.username;
        user.email = data.email;
        user.username = data.email;

        console.log('email:' + user.email);
        user.save(function (err, user) {

            console.log('err:', err);
            if (err)
                return next();
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
        email: data.email
    }, function (err, item) {
        if (item != null) {
            ep.emit("error", 'ERR_EXISTED_EMAIL ');
        } else {
            ep.emit('checkEmail');
        }
    });
};