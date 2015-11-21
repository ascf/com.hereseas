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
var User = require('../models').User;

var fs = require('fs');
var adminRoute = require('./adminRoute');


exports.getSchoolList = function(req, res, next) {

    var query = {
        'status': 1
    };

    console.log();

    School.find(
        query,
        'id name avatar shortName cnName',
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
        'id name image shortName cnName').
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
                resData.shortName = school.shortName;
                resData.cnName = school.cnName;
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


exports.getSchoolNewStudents = function(req, res, next) {

    var schoolId = req.param('id');
    var query = {};
    var resData = {};
    var NUMOFUSERS = 8;

    var ep = new EventProxy();

    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;

        } else if (school) {
            if (school.status == 1) {

                var count = 0;
                for (var i = school.users.length - 1; i >= school.users.length - NUMOFUSERS; i--) {
                    if (i < 0)
                        break;
                    count++;
                }

                ep.after("findUser", count, function(users) {
                    res.json({
                        result: true,
                        data: users
                    });
                    return;
                });


                for (var i = school.users.length - 1; i >= school.users.length - NUMOFUSERS; i--) {
                    if (i < 0)
                        break;

                    User.findById(school.users[i], "id username avatar enrollYear status", function(err, user) {
                        if (err) {
                            console.log(err);
                        }

                        ep.emit('findUser', user);
                    });
                }

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



exports.getSchoolStudents = function(req, res, next) {

    var schoolId = req.param('id');
    var query = {};
    var resData = {};

    var ep = new EventProxy();

    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;

        } else if (school) {
            if (school.status == 1) {

                ep.after("findUser", school.users.length, function(users) {
                    res.json({
                        result: true,
                        data: users
                    });
                    return;
                });

                for (var i = school.users.length - 1; i >= 0; i--) {
                    if (i < 0)
                        break;

                    User.findById(school.users[i], "id username avatar enrollYear status", function(err, user) {
                        if (err) {
                            console.log(err);
                        }
                        ep.emit('findUser', user);
                    });
                }

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



exports.adminGetSchoolInfoList = function(req, res, next) {

    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });

    var query = {};
    ep.all('checkAdmin', function() {
        School.find(query, function(err, schools) {
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
    });
};



exports.adminGetSchoolId = function(req, res, next) {

    //console.log(req.user);

    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function
        var query = {};
        School.find(query, 'id', function(err, schoolIds) {
            if (err) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: schoolIds
                });
                return;
            }
        });
    });
};



//admin functions
exports.adminAddSchool = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function
        var reqData = {
            name: req.body.name,
            shortName: req.body.shortName,
            cnName: req.body.cnName,
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
    });
};

exports.adminUpdateSchoolById = function(req, res, next) {

    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {

        var schoolId = req.param('id');

        var reqData = {
            name: req.body.name,
            shortName: req.body.shortName,
            cnName: req.body.cnName,
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

        // if (tools.hasNull(reqData)) {
        //     res.json(Results.ERR_PARAM_ERR);
        //     return;
        // }
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
                    if (reqData[key] != undefined && reqData[key] != null)
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
    });
}


exports.adminGetSchoolAllInfo = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function
        var schoolId = req.param('id');
        if (schoolId) {
            School.findById(schoolId,
                function(err, school) {
                    if (err) {
                        res.json(Results.ERR_DB_ERR);
                    } else {
                        res.json({
                            result: true,
                            data: school
                        });
                    }
                });
        } else {
            res.json(Results.ERR_URL_ERR);
        }
    });
};

exports.adminEditSchoolStatus = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function
        var schoolId = req.param('id');
        var reqData = {
            status: req.body.status
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
                                'id': schoolSave.id,
                                'name': schoolSave.name,
                                'status': schoolSave.status
                            }
                        });
                    }
                });

            }

        });
    });
};


exports.adminSetSchoolConnectionById = function(req, res, next) {
    var ep = new EventProxy();
    //check admin
    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
        }
    });
    ep.all('checkAdmin', function() {
        // execute admin function

        var schoolId = req.param('id');
        var reqData = {
            connection: req.body.connection
        };
        if (tools.isEmpty(schoolId)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        if (tools.hasNull(reqData)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        if (Array.isArray(reqData.connection) != true) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        School.findById(schoolId,
            function(err, school) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else if (!school) {
                    res.json(Results.ERR_NOTFOUND_ERR);
                    return;
                } else {
                    school.connection = reqData.connection;

                    school.save(function(err, schoolSave) {
                        if (err) {
                            console.log(err);
                            return next();
                        } else {
                            res.json({
                                result: true,
                                data: {
                                    'id': schoolSave.id,
                                    'name': schoolSave.name,
                                    'connection': schoolSave.connection,
                                    'status': schoolSave.status
                                }
                            });
                        }
                    });


                }
            });

    });
};