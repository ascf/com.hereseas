var Admin = require('../models').Admin;
var validator = require('validator');
var Results = require('./commonResult');
var tools = require('../common/tools');
var md5 = require('MD5');
var EventProxy = require('eventproxy');
var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var Apartment = require('../models').Apartment;
var School = require('../models').School;
var adminRoute = require('./adminRoute');

var User = require('../models').User;

exports.createAdmin = function(req, res, next) {
    var admin = new Admin();
    admin.email = req.body.email;

    if (req.body.hhz != "hereseasHhz") {
        res.json(Results.ERR_PERMISSION_ERR);
        return;
    }

    var validator = require("email-validator");
    if (!validator.validate(admin.email)) {
        return res.json(Results.ERR_DATAFORMAT_ERR);
    }
    admin.password = req.body.password;
    var randomstring = require("randomstring");
    if (tools.isEmpty(admin.email) || tools.isEmpty(admin.password)) {
        return res.json(Results.ERR_PARAM_ERR);
    }
    admin.password = md5(admin.password);
    var ep = new EventProxy();
    ep.all('checkEmail', function() {
        admin.save(function(err, admin) {
            if (err) {
                console.log(err);
                return next();
            } else
                res.json({
                    result: true,
                    id: admin.id
                });
        });
    });
    ep.fail(function(err) {
        res.json({
            result: false,
            err: err
        });
    });
    Admin.findOne({
        email: admin.email
    }, function(err, item) {
        if (item != null) {
            ep.emit("error", 'ERR_EXISTED_EMAIL ');
        } else {
            ep.emit('checkEmail');
        }
    });
};

exports.test = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    isAdmin(req.user.email, function(result) {
        if (result) {
            console.log("success");
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        console.log("ok");
        // execute admin function

    });
};



exports.isAdmin = function(userEmail, callback) {
    //check if admins collections contains userEmail
    var result = null;
    Admin.findOne({
        email: userEmail
    }, function(err, item) {
        if (item != null) {
            result = true;
        } else {
            result = false;
        }
        callback(result);
    });
};


exports.updateFavorite = function(req, res, next) {

    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });

    var query = {
        apartments: [],
        cars: [],
        items: [],
        activities: []
    }


    ep.all('checkAdmin', function() {
        User.update({
            'status': 1
        }, {
            'favorite': query
        }, {}, function(err, numAffected) {

            console.log("numAffected", numAffected);

            if (err) {

                res.json({
                    result: false,
                    err: err
                });
                return;

            }


            res.json({
                result: true,
                numAffected: numAffected
            });

        });
    });


};