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

var fs = require('fs');



exports.getThreeApartments = function(req, res, next) {

    var query = {
        'status': 1
    };

    Apartment.find(
            query,
            'id userId userName userAvatar schoolId title cover type createAt updateAt')
        .sort({
            create_at: 'desc'
        }).
    limit(3).
    exec(function(err, apartments) {
        if (err) {
            res.json(Results.ERR_NOTFOUND_ERR);

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
    })
};


exports.getApartmentList = function(req, res, next) {

    var query = {
        'status': 1
    };

    Apartment.find(
            query,
            'id userId userFirstName userLastName userAvatar schoolId title cover type longitude latitude createAt updateAt')
        .sort({
            createAt: 'desc'
        }).exec(function(err, apartments) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_NOTFOUND_ERR);
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
        })
};



exports.getApartmentById = function(req, res, next) {

    var apartmentId = req.param('id');

    console.log(apartmentId);

    var query = {
        '_id': apartmentId,
        'status': 1
    };

    Apartment.find(
            query,
            'userId userFirstName userLastName userAvatar schoolId title description cover images type rooms description favorite available fees facilities address longitude latitude create_at update_at')
        .sort({
            createAt: 'desc'
        }).exec(function(err, apartments) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_NOTFOUND_ERR);
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
        })


};


exports.searchApartment = function(req, res, next) {

    var query = {};
    var aptQuery = {};
    var pagination = {};

    console.log(req.query);
    var page = false;


    var schoolId = req.param('schoolId');

    if (!schoolId) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    aptQuery['schoolId'] = schoolId;


    if (req.query.page && req.query.pageSize) {
        pagination['skip'] = (req.query.page - 1) * req.query.pageSize;
        pagination['limit'] = req.query.pageSize;
    }

    if (req.query.car) {
        var subQuery = {};
        subQuery['car'] = req.query.car;
        aptQuery['facilities'] = subQuery;
    }

    if (req.query.utility) {
        var subQuery = {};
        subQuery['utility'] = req.query.utility;
        aptQuery['facilities'] = subQuery;
    }

    if (req.query.pet) {
        var subQuery = {};
        subQuery['pet'] = req.query.pet;
        aptQuery['facilities'] = subQuery;
    }

    if (req.query.share) {
        query['share'] = req.query.share;
    }

    if (req.query.startPrice && req.query.endPrice) {
        var subQuery = {};
        subQuery['$gte'] = req.query.startPrice;
        subQuery['$lt'] = req.query.endPrice;
        query['price'] = subQuery;
    } else if (req.query.startPrice) {
        var subQuery = {};
        subQuery['$gte'] = req.query.startPrice;
        query['price'] = subQuery;
    } else if (req.query.endPrice) {
        var subQuery = {};
        subQuery['$lt'] = req.query.endPrice;
        query['price'] = subQuery;
    }

    if (req.query.apartmentType) {
        aptQuery['type'] = req.query.apartmentType;
    }

    if (req.query.roomType) {
        query['type'] = req.query.roomType;
    }

    if (req.query.date) {
        var subQuery1 = {};
        subQuery1['$gte'] = req.query.date;
        query['endDate'] = subQuery1;

        var subQuery2 = {};
        subQuery2['$lt'] = req.query.date;
        query['beginDate'] = subQuery2;
    }

    if (req.query.share) {
        query['share'] = req.query.share;
    }

    query['status'] = 1;

    var prepareQuery = {};

    prepareQuery['$elemMatch'] = query;

    aptQuery['rooms'] = prepareQuery;   

    aptQuery['status'] = 1;

    console.log("aptQuery", aptQuery);


        Apartment.find(
            aptQuery,
            'userId userFirstName userLastName userAvatar schoolId title description cover images type rooms description favorite available fees facilities address longitude latitude create_at update_at', pagination)
        .sort({
            createAt: 'desc'
        }).exec(function(err, apartments) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_NOTFOUND_ERR);
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
        })









}





exports.addApartment = function(req, res, next) {


    var epUser = new EventProxy();

    User.findById(req.user.id,
        function(err, user) {
            if (err) {
                res.json(Results.ERR_DB_ERR);
                return;
            } else {
                epUser.emit("findUser", user);
            }
        });

    epUser.all("findUser", function(user) {

        console.log("user", user);

        var reqData = {
            userId: user.id,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            userAvatar: user.avatar,
            schoolId: req.body.schoolId,
            title: req.body.title,
            description: req.body.description,
            cover: req.body.cover,
            images: req.body.images,
            type: req.body.type,
            fees: req.body.fees,
            facilities: req.body.facilities,
            address: req.body.address,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        };

        if (tools.isEmpty(req.body.rooms)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        var apartment = new Apartment();

        var rooms = [];

        for (var i = 0; i < req.body.rooms.length; i++) {

            var room = {
                share: req.body.rooms[i].share,
                type: req.body.rooms[i].type,
                priceType: req.body.rooms[i].priceType,
                price: req.body.rooms[i].price,
                bathroom: req.body.rooms[i].bathroom,
                closet: req.body.rooms[i].closet,
                walkInCloset: req.body.rooms[i].walkInCloset,
                beginDate: req.body.rooms[i].beginDate,
                endDate: req.body.rooms[i].endDate
            }

            if (tools.hasNull(room)) {
                res.json(Results.ERR_PARAM_ERR);
                return;
            }
            rooms.push(room);
        }

        reqData.rooms = rooms;

        for (var key in reqData) {
            apartment[key] = reqData[key];
        }

        if (tools.hasNull(reqData)) {

            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        apartment.save(function(err, apartment) {

            if (err) {
                console.log(err);
                return next();
            } else {

                res.json({
                    result: true,
                    data: apartment
                });


            }
        });
    });

}



exports.updateApartmentById = function(req, res, next) {

    var apartmentId = req.param('id');

    var reqData = {
        schoolId: req.body.schoolId,
        title: req.body.title,
        description: req.body.description,
        cover: req.body.cover,
        images: req.body.images,
        type: req.body.type,
        fees: req.body.fees,
        facilities: req.body.facilities,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    };

    if (tools.isEmpty(req.body.rooms)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    var apartment = new Apartment();

    var rooms = [];

    for (var i = 0; i < req.body.rooms.length; i++) {

        var room = {
            share: req.body.rooms[i].share,
            type: req.body.rooms[i].type,
            price: req.body.rooms[i].price,
            priceType: req.body.rooms[i].priceType,
            bathroom: req.body.rooms[i].bathroom,
            closet: req.body.rooms[i].closet,
            walkInCloset: req.body.rooms[i].walkInCloset,
            beginDate: req.body.rooms[i].beginDate,
            endDate: req.body.rooms[i].endDate
        }

        if (tools.hasNull(room)) {
            res.json(Results.ERR_PARAM_ERR);
            return;
        }
        rooms.push(room);
    }

    if (tools.hasNull(reqData)) {
        res.json(Results.ERR_PARAM_ERR);
        return;
    }

    reqData.rooms = rooms;


    Apartment.findById(apartmentId, function(err, apartment) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (!apartment) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else {

            for (var key in reqData) {
                apartment[key] = reqData[key];
            }

            apartment.update_at = new Date();

            apartment.save(function(err, apartment) {
                if (err) {
                    console.log(err);
                    return next();
                } else {
                    res.json({
                        result: true,
                        data: {}
                    });


                }
            });
          
        }

    });



};

exports.image_upload = function(req, res, next) {
    //res.json({result:'hell'});
    //return;

    console.log(JSON.stringify(req.files));

    var result = {};
    result.result = 'true';
    var image = "apartment_" + req.files.file.name;


    // 获得文件的临时路径
    var tmp_path = req.files.file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    // var target_path = './public/images/' + 'apartment' +'/'+ image;

    var target_path = './public/images/apartment/' + image;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        // 删除临时文件夹文件, 
        //fs.unlink(tmp_path, function(err){
        if (err) {
            console.log(err);
            res.json({
                result: 'false'
            });
        } else {
            res.json({
                result: 'true',
                image: image
            });

        };
        //});
    });



    //console.log("message");

    //res.json({result:'hell'});
};

function saveImage(file, path, newName, callback) {
    // 获得文件的临时路径
    var tmp_path = file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './public/images/' + path + '/' + newName;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        // 删除临时文件夹文件, 
        fs.unlink(tmp_path, callback(err));
    });
};