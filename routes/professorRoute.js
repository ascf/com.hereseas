var User = require('../models').User;
var EventProxy = require('eventproxy');
var Results = require('./commonResult');
var tools = require('../common/tools');
var Professor = require('../models').Professor;
var Rate = require('../models').Rate;

//need to check if the professor has alreay been created
exports.createProfessor = function (req, res, next) {
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

    if (tools.isEmpty(req.body.professorId)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    ep.all("findUser", "findProfessor", function(user, professor) {
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
}