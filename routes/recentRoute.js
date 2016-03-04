var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');

var Results = require('./commonResult');

var Apartment = require('../models').Apartment;
var Room = require('../models').Room;
var User = require('../models').User;
var School = require('../models').School;
var Recent = require('../models').Recent;

var fs = require('fs');
var adminRoute = require('./adminRoute');

/*  
    author: yzhou
    update the recent data base shown on the user home
    for the category 1 stand for 'new apartment', 2 for
    'new used cars', 3 for 'new used items', 4 for 'new 
    thread'
*/
exports.updateRecentList = function(object, cg) {
    var reqData = {
            userId: object.userId,
            username: object.username,
            userAvatar: object.userAvatar,
            schoolId: object.schoolId,
            objectId: object.id,
            title: object.title,
            preview: object.preview?object.preview:tools.generatePreview(object.description),
            category: cg,    
            status: object.status,
            priority: 1,
            createAt: object.createAt,
            updateAt: object.updateAt
        }
        
        var recent = new Recent();

        for (var key in reqData) {
            recent[key] = reqData[key];
        };
        
        Recent.find({schoolId: reqData.schoolId})
        .exec(function(err, recentList) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {
                var delete_id = tools.updateRecent(recentList, recent);
                if(delete_id != null){
                    Recent.findById(delete_id).remove().exec();
                }
                recent.save(function(err, data) {
                    if (err) {
                        console.log(err);
                        return next();
                    }
                });
                return;
            }

        });
};

/*  
    author: yzhou
    get recentlist showing the latest news order by 
    create time
*/
exports.getRecentList = function(req, res, next) {
    schoolId = req.query.schoolId

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var ep = new EventProxy();
    
    School.findById(schoolId, function(err, school) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;

        } else if (school) {
            if (school.status == 1)  {
                ep.emit('findSchool');
            } else {
                res.json(Results.ERR_ACTIVATED_ERR);
                return;
            }
        } else {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        }
    });
    
    ep.all('findSchool', function() {
        var query = {
            'schoolId': schoolId
        };
        
        Recent
            .find(query, 'userId username userAvatar schoolId objectId title preview cover category priority createAt')
            .sort({
                createAt: 'desc'
            })
            .exec(function(err, apartments) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                    console.log(err);
                    return;
                } else if (!apartments.length) {
                    res.json(Results.ERR_NOTFOUND_ERR);
                    return;
                } else {
                    res.json({
                        result: true,
                        data: apartments
                    });
                    return;
                }
            });
        
    });
}