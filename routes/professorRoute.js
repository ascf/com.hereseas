var User = require('../models').User;
var EventProxy = require('eventproxy');
var Results = require('./commonResult');
var tools = require('../common/tools');
var Professor = require('../models').Professor;

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