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

exports.createAdmin = function(req, res, next) {
	var admin = new Admin();
	admin.email = req.body.email;
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

exports.getApartmentList = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    isAdmin(req.user.email, function(result) {
        if (result) {
             ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function
        var schoolId = req.query.schoolId;
        if (!schoolId) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        var query = {
            'status': 1,
            'schoolId': schoolId
        };
        Apartment.find(
            query,
            'id userId username userAvatar schoolId title cover type longitude latitude createAt updateAt')
        .sort({
            createAt: 'desc'
        }).exec(function(err, apartments) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else if (!apartments.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: apartments
                });
                return;
            }
        })
    });
};

exports.getSchoolList = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    isAdmin(req.user.email, function(result) {
        if (result) {
             ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function
        var query = {
            'status': 1
        };
        School.find(query, 'id name avatar', function(err, schools) {
            if (err) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: schools
                });
                return;
            }
        });
    });
};

function isAdmin(userEmail, callback) {
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