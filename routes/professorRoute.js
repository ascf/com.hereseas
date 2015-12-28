var User = require('../models').User;
var EventProxy = require('eventproxy');
var Results = require('./commonResult');
var tools = require('../common/tools');
var Professor = require('../models').Professor;
var Rate = require('../models').Rate;
var School = require('../models').School;


//need to check if the professor has alreay been created
exports.createProfessor = function(req, res, next) {
    var reqData = {
        name: req.body.name,
        schoolId: req.body.schoolId,
        department: req.body.department
    }
    if (tools.hasNull(reqData) || tools.isEmpty(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
    reqData.biography = req.body.biography;
    reqData.website = req.body.website;
    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
    reqData.star = 0;
    var professor = new Professor();
    for (var key in reqData) {
        professor[key] = reqData[key];
    }
    professor.save(function(err, professor) {
        if (err) {
            consolo.log(err);
            return next();
        } else {
            res.json({
                result: true,
                data: professor
            });
        }
    });
}

exports.createRate = function(req, res, next) {
    var ep = new EventProxy();

    var starAve = 0;
    var rateCount = 0;

    if (tools.isEmpty(req.body.professorId) || isNaN(req.body.star)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    ep.all("findUser", "findProfessor", "findRate", function(user, professor) {

        var reqData = {
            userId: user.id,
            username: user.username,
            userAvatar: user.avatar,
            schoolId: req.body.schoolId,
            professorId: professor.id,
            content: req.body.content,
            star: req.body.star,
            className: req.body.className
        };

        if (tools.hasNull(reqData)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        var rate = new Rate();
        for (var key in reqData) {
            rate[key] = reqData[key];
        }

        professor["star"] = starAve;
        professor["rateCount"] = rateCount;
        professor.save(function() {});

        rate.save(function(err, rate) {
            if (err) {
                console.log(err);
                return next();
            } else {
                res.json({
                    result: true,
                    data: {
                        id: rate.id
                    }
                });
                return;
            }
        });

    });

    User.findById(req.user.id, function(err, user) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (user == null) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else if (user.status != 1 || user.verified != true) {
            res.json(Results.ERR_PERMISSION_ERR);
            return;
        } else {
            ep.emit("findUser", user);
        }
    });

    Professor.findById(req.body.professorId, function(err, professor) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (professor == null) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else if (professor.status != 1) {
            res.json(Results.ERR_PERMISSION_ERR);
            return;
        } else {
            ep.emit("findProfessor", professor);
        }
    });

    var query = {};
    query['status'] = 1;
    query['professorId'] = req.body.professorId;

    Rate.find(query, function(err, rates) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else {
            if (!rates) {
                starAve = req.body.star;
            } else {
                var starSum = 0;
                for (var i = 0; i < rates.length; i++) {
                    starSum = starSum + rates[i].star;
                }
                starSum = starSum + req.body.star;
                starAve = starSum / (rates.length + 1);
                rateCount = rates.length + 1;
                console.log(starAve);
            }
            ep.emit("findRate");
        }

    });


}


exports.getProfessorList = function(req, res, next) {

    var query = {};
    var schoolId = req.query.schoolId;

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var connection;
    var ep = new EventProxy();

    ep.all('findSchoolConnection', function(school) {

        query['schoolId'] = schoolId;
        query['status'] = 1;

        if (req.query.department) {
            query['department'] = req.query.department;
        }

        Professor.find(query, 'id name department star rateCount').exec(function(err, professors) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else if (!professors.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {

                res.json({
                    result: true,
                    data: professors
                });
            }

        });
    });

    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;

        } else if (school) {
            if (school.status == 1) {
                connection = school.connection;
                ep.emit('findSchoolConnection', school);
            } else {
                res.json(Results.ERR_ACTIVATED_ERR);
                return;
            }
        } else {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        }
    });

}

exports.getProfessor = function(req, res, next) {

    var professorId = req.param('id');

    if (!professorId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    Professor.findById(professorId, function(err, professor) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (!professor) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else if (professor.status != 1) {
            res.json(Results.ERR_ACTIVATED_ERR);
            return;
        } else {

            res.json({
                result: true,
                data: professor
            });

            return;
        }
    });


}

exports.getDepartmentList = function(req, res, next) {

    var schoolId = req.param('id');

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (!school) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else if (school.status != 1) {
            res.json(Results.ERR_ACTIVATED_ERR);
            return;
        } else {

            res.json({
                result: true,
                data: school.department
            });
            return;
        }
    });

}


exports.getProfessorRates = function(req, res, next) {

    var query = {};
    var professorId = req.param('id');

    if (!professorId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    query['status'] = 1;
    query['professorId'] = professorId;

    Rate.find(query, function(err, rates) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (!rates) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else {
            res.json({
                result: true,
                data: rates
            });
            return;
        }
    });

}