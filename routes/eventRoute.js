var EventProxy = require('eventproxy');
var Results = require('./commonResult');
var tools = require('../common/tools');
var EventValentine = require('../models').EventValentine;
var adminRoute = require('./adminRoute');
var emailService = require('../common/email');
var User = require('../models').User;


exports.saveParticipantInfo = function(req, res, next) {

    var reqData = {
        name: req.body.name,
        sex: req.body.sex,
        organization: req.body.organization,
        email: req.body.email
    }

    if (tools.hasNull(reqData) || tools.isEmpty(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }
    reqData.phone = req.body.phone;

    var eventValentine = new EventValentine();
    for (var key in reqData) {
        eventValentine[key] = reqData[key];
    }
    eventValentine.save(function(err, eventValentine) {
        if (err) {
            consolo.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else {

            User.findOne({
                email: eventValentine.email
            }, function(err, item) {
                if (item != null) {
                    emailService.sendEventEmail(eventValentine.email, eventValentine.name);
                }

            });

            res.json({
                result: true,
                data: eventValentine
            });
        }
    });
}

exports.getAllParticipantsInfo = function(req, res, next) {

    var ep = new EventProxy();
    //check admin
    ep.all('checkAdmin', function() {
        var query = {};
        EventValentine.find(query, function(err, eventValentines) {
            if (err) {
                consolo.log(err);
                res.json(Results.ERR_DB_ERR);
                return;
            } else {
                res.json({
                    result: true,
                    data: eventValentines
                });
            }
        });
    });

    adminRoute.isAdmin(req.user.email, function(result) {
        if (result) {
            ep.emit('checkAdmin');
        } else {
            res.json(Results.ERR_PERMISSION_ERR);
            return;
        }
    });

}