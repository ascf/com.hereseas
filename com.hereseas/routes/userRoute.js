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

        user.save(function (err, user) {

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

exports.getUserList = function (req, res, next) {


    var query = {};
    if (req.query.gender)
        query.gender = req.query.gender;


    User.find(
        query,
        'first_name last_name username email gender school avatar description tags last_login',
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
    var userId = req.query.id;
    if (userId) {
        User.findById(userId,
            'username email',
            function (err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                }
            });
    } else {
        res.json(Results.ERR_URL_ERR);
    }
};