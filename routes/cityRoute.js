// edited at 3/6/2016 by Chengyu Huang
var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');

var Results = require('./commonResult');

var City = require('../models').City;
var User = require('../models').User;

var fs = require('fs');
var adminRoute = require('./adminRoute');


exports.getCityList = function(req, res, next) {
    var query = {};
    console.log();
    // put limit as 20
    City.find(
        query,
        'id city state zipcode latitude longitude').limit(20).exec(
        function(err, cities) {
            if (err) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: cities
                });
                return;
            }
        });
};

exports.getCityByZip = function(req, res, next) {
    var zip = req.param('zip');
    
    if (!zip) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    };
    
    var query = {'zipcode': zip};
    console.log();
    // put limit as 10
    City.findOne(
        query,
        'id city state zipcode latitude longitude').exec(
        function(err, cities) {
            if (err) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: cities
                });
                return;
            }
        });
};