var flash = require('connect-flash'),
	express = require('express'),
	passport = require('passport'),
	util = require('util'),
	LocalStrategy = require('passport-local').Strategy;


var Results = require('./commonResult');



exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log("session");

	res.json(Results.ERR_REQUIRELOGIN_ERR);

	return;
	// res.redirect('/login');

};

exports.logout = function(req, res) {
	req.logout();

	res.json({
		result: true,
	});

	// res.redirect('/');
};


exports.initialize = function(req, res) {

	if (req.isAuthenticated()) {
		
		res.json({
			result: true,
			userId: req.user.id
		});	


	}else{

		res.json({
			result: false
		});


	}


	// res.redirect('/');
};