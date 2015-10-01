var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');

var Results = require('./commonResult');

var School = require('../models').School;

var fs = require('fs');



exports.getSchoolList = function(req, res, next) {

    var query = {
        'status': 1
    };

    console.log();

    School.find(
        query,
        'id name avatar',
        function(err, schools) {
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

};

exports.getSchoolListThree = function(req, res, next) {

    var query = {
        'status': 1
    };

    console.log();

    School.find(
        query,
        'id name avatar').
    limit(3).exec(
        function(err, schools) {
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

};



exports.getSchoolById = function(req, res, next) {


    var schoolId = req.param('id');
    var query = {};
    var resData = {};

    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_NOTFOUND_ERR);
            return;

        } else if (school) {
            if (school.status == 1) {
                resData.name = school.name;
                resData.description = school.description;
                resData.avatar = school.avatar;
                resData.image = school.image;
                resData.address = school.reqDate;
                resData.longitude = school.longitude;
                resData.latitude = school.latitude;

                res.json({
                    result: true,
                    data: resData
                });
                return;

            } else {
                res.json(Results.ERR_ACTIVATED_ERR);
                return;
            }
        } else {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        }

    });
};


exports.getSchoolInfoList = function(req, res, next) {

    School.findAll(function(err, schools) {
        if (err) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else if (schools.length) {
            res.json({
                result: true,
                data: schools
            });
        } else {
            res.json(Results.ERR_NOTFOUND_ERR);
        }
    });

};



exports.addSchool = function(req, res, next) {

    var reqData = {
        name: req.body.name,
        description: req.body.description,
        avatar: req.body.avatar,
        image: req.body.image,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    };


    if (tools.hasNull(reqData)) {

        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var school = new School();

    for (var key in reqData) {
        school[key] = reqData[key];
    }

    school.save(function(err, schoolSave) {

        if (err) {
            console.log(err);
            return next();
        } else {

            res.json({
                result: true,
                data: {
                    'id': schoolSave.id
                }
            });
        }
    });

};



exports.updateSchoolById = function(req, res, next) {

    var schoolId = req.param('id');

    var reqData = {
        name: req.body.name,
        description: req.body.description,
        avatar: req.body.avatar,
        image: req.body.image,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    };


    if (tools.isEmpty(schoolId)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var query = {
        id: schoolId
    };

    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            return next();

        } else if (!school) {
            res.json(Results.ERR_NOTFOUND_ERR);
        } else {

            for (var key in reqData) {
                school[key] = reqData[key];
            }

            school.save(function(err, schoolSave) {

                if (err) {
                    console.log(err);
                    return next();
                } else {

                    res.json({
                        result: true,
                        data: {
                            'id': schoolSave.id
                        }
                    });
                }
            });

        }

    });


};