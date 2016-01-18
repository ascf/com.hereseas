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
    var ep = new EventProxy();
    var ses = new AWS.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1'
    });
    var emailHereseas = "no-reply@hereseas.com";

    ep.all('findUser', function(users) {
        var emailList = [];

        for (var i = 0; i < users.length; i++) {
            emailList.push(users[i].email);
        }

        var k, j, tmp;
        for (k = 0, j = emailList.length; k < j; k += 1) {
            tmp = emailList.slice(k, k + 1);

            var params = {
              Destination: { /* required */
                /*
                BccAddresses: [
                  '@'
                ],
                CcAddresses: [
                  '@'
                ],*/
                ToAddresses: tmp
              },
              Message: { /* required */
                Body: { /* required */
                  Html: {
                    //Data: '<html><head></head><body><div><p>Hello world!</p></div></body></html>'
                    Data: '<html><head><title>hereseas-event</title><style type="text/css">body {width: 860px;margin:0 auto;padding:0;background: white;}</style></head><body><p><strong>Welcome to Hereseas!</strong></p><p>Hereseas致力于打造北美校园生活线上社区，立足于留学生并服务于留学生。我们希望每一位用户可以在这里找到归属感，丰富留学生活。在这里，您可以寻找租房，匹配室友，还可以淘货，寻车，关注校内外活动，甚至评价教授！现在就开始吧！<br><a href="http://www.hereseas.com">www.hereseas.com</a></p><p><strong>最新活动</strong></p><p><strong>Right Here Night<br>“不一样的社交平台，不寻常的联谊方式，hereseas在2月13号之夜，集结华府各路精英，给你一个不一样的情人节联谊PA。”</strong></p><p><strong>活动详情<br>http://www.hereseas.com/#/event<br>购票链接<br><a href="https://hereseas.eventbrite.com">https://hereseas.eventbrite.com</a></strong></p><p><strong>活动优惠券<br>使用方法：在手机上展示此邮件，获得免费special drink一杯，每位会员只可领取一次</strong></p><p><img src="https://s3.amazonaws.com/hereseas-public-images/email/drink pic.jpg"/></p><p>hereseas.com<br>此处即海外, 他乡即故乡</p><p>关注我们的微信公号</p><p><img src="https://s3.amazonaws.com/hereseas-public-images/email/wechat pic.jpg"/></p><p>&nbsp;</p></body></html>'
                  }
                },
                Subject: { /* required */
                  Data: 'Hereseas Notification'
                }
              },
              Source: "'Hereseas Community' <" + emailHereseas + ">'", /* required */
              ReplyToAddresses: [
                'hereseas@gmail.com'
              ]
            };
        
            //console.log(params);
            ses.sendEmail(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                }
                else {
                    
                    //console.log(data);           // successful response
                }
            });
        }
        res.json({
            result: true
         });

    });


    ep.all('checkAdmin', function() {
        //console.log("ok");
        // execute admin function
        User.find({}, 'email', function(err, users) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
            } else {
                ep.emit('findUser', users);
            }
        });

    });


    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            //console.log("success");
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
}