var User = require('../models').User;
var EventProxy = require('eventproxy');
var Forgetter = require('../models').Forgetter;
var Results = require('./commonResult');
var emailService = require('../common/email');
var APIHOST = "http://dev.hereseas.com/#";
var md5 = require('MD5');

exports.createForgetter = function (req, res, next) {
	var ep = new EventProxy();
	var username = {};
	User.findOne({email: req.body.email}, function(err, user) {
        if (user != null) {
        	username = user.username;
            ep.emit('findUser');
        } else {
        	res.json({
                result: false,
                err: 'ERR_NOTFOUND_ERR'
            });
        }
    });
    ep.all('findUser', function() {
        var forgetter = new Forgetter();
        forgetter.email = req.body.email;
        forgetter.username = username;
        forgetter.save(function(err, forgetter) {
            if (err) {
                console.log(err);
                return next();
            } else {
            	var url = APIHOST + '/reset' + '?token=' + forgetter.id;
                emailService.sendEmail(forgetter.email, url);
                res.json({
                    result: true,
                    id: forgetter.id
                });
            }
        });
    });
}

exports.checkForgetter = function (req, res, next) {
	var reqData = req.body.token;
	var time = new Date();
	time = Date.now();
	console.log(time);
	Forgetter.findById(reqData, function(err, forgetter) {
        if (forgetter != null) {
        	console.log(forgetter.createAt.valueOf());
        	var createTime = forgetter.createAt.valueOf();
        	var offset = (time - createTime) / 60000;
        	if (offset > 60) {res.json(Results.ERR_URL_ERR);}
            else {
            	res.json({
	                result: true,
	                id: forgetter.id
	            });
        	}
        } else {
        	res.json({
                result: false,
                err: 'ERR_NOTFOUND_ERR'
            });
        }
    });
}

exports.resetForgetter = function (req, res, next) {
	var reqData = {
		id: req.body.id,
		password: req.body.password
	}
	var fgemail = {}
	var ep = new EventProxy();
	Forgetter.findById(reqData.id, function(err, forgetter) {
        if (forgetter != null) {
        	fgemail = forgetter.email;
        	ep.emit('findForgetter');
        } else {
        	res.json({
                result: false,
                err: 'ERR_NOTFOUND_ERR'
            });
        }
    });
	ep.all('findForgetter', function() {
		User.findOne({email: fgemail}, function(err, user) {
	        if (user != null) {
	        	user.password = md5(reqData.password);
	        	user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                        return next();
                    } else{
                    	deleteForgetter(fgemail, function(result){
                    		if (result) {
                    			res.json({
		                            result: true,
		                            id: user.id
		                        });
                    		} else {
                    			res.json(Results.ERR_DB_ERR);
                    		}
                    	});
                    }
                });
	        } else {
	        	res.json({
	                result: false,
	                err: 'ERR_NOTFOUND_ERR'
	            });
	        }
	    });
	});
}

function deleteForgetter(fgemail, callback) {
	var result = {}
	Forgetter.remove({email: fgemail}, function(err){
		if (err) result = false;
		else result = true;
		callback(result);
	});
}