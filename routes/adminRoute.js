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
var mongoose = require('mongoose');
var mongo_db = 'mongodb://localhost/hereseas_dev';
var AWS = require('aws-sdk');

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

        User.find({}, function(err, users) {

            for (var i = 0; i < users.length; i++) {

                User.update({
                    '_id': users[i].id
                }, {
                    'favorite': query
                }, {}, function(err, numAffected) {
                    if(err){
                        console.log("updateFavorite",err);

                    }

                });
            }
        })

    })

    res.json({
        result: true
    });



};

exports.showCollections = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
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
        mongoose.connection.db.collectionNames(function(err, names) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            }
            res.json({
                result: true,
                data: names
            })
        });
    });
};

exports.adminSendEmail = function(req, res, next) {
    console.log("test email");
    var ses = new AWS.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });
    var emailHereseas = "no-reply@hereseas.com";
    var params = {
      Destination: { /* required */
        BccAddresses: [
          'sunbojun@hotmail.com'
        ],
        CcAddresses: [
          'sunbojun@hotmail.com'
        ],
        ToAddresses: [
          'sunbojun@hotmail.com'
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
            Data: '<html><head></head><body><div><p>Hello world!</p></div></body></html>'
          }
        },
        Subject: { /* required */
          Data: 'Hello'
        }
      },
      Source: "'Hereseas account activation' <" + emailHereseas + ">'", /* required */
      ReplyToAddresses: [
        'sunbojun@hotmail.com'
      ]
    };
    ses.sendEmail(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    
    res.json({
        result: true
    });

}