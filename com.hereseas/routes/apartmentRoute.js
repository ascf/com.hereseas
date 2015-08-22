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
            'userId userFirstName userLastName userAvatar schoolId title description cover images type rooms description favorite available fees facilities address longitude latitude create_at update_at ').limit(1)
        .populate('rooms', null, {
            'status': 1
        }).exec(function(err, apartment) {
            if (err) {
                console.log(err);
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else if (!apartment.length) {
                res.json(Results.ERR_NOTFOUND_ERR);
                return;
            } else {

                console.log(apartment);

                res.json({
                    result: true,
                    data: apartment
                });
                return;
            }
        })

};
//'type price bathroom closet walkInCloset beginDate endDate available create_at update_at'



//     if (!req.query) {
//   var val = parseUrl(req).query;
//  req.query = queryparse(val, options);
// }


exports.searchApartment = function(req, res, next) {

    var query = {};

    console.log(req.query);


    if (!req.query) {

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
        query['apartmentType'] = req.query.apartmentType;
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

    console.log("query",query);


    Room.find(query, 'apartmentId').sort({
        create_at: 'desc'
    }).exec(function(err, rooms) {
        if (err) {
            res.json(Results.ERR_NOTFOUND_ERR);
            console.log(err);
            return;
        } else if (!rooms.length) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else {

            var ep = new EventProxy();
            var apartments = [];
           
            var roomLength = rooms.length;

            for (var i = 0; i < rooms.length; i++) {
                Apartment.findById(rooms[i].apartmentId, function(err, apartment) {
                    if (err) {
                        console.log(err);
                         roomLength--;
                        
                    } else if (!apartment) {
                        console.log('notfound?');
                        roomLength--;
                   
                    } else {
                      
                        apartments.push[apartment];
                        ep.emit("findApartment",apartment);
                    }

                });
            }

            ep.after("findApartment", roomLength, function(apartments) {
                
                var checkSame = {};

                for (var i = 0; i < roomLength; i++) {

                     console.log("apartmentid",apartments[i].id);

                    if (checkSame[apartments[i].id]) {
                        apartments.splice(i, 1);
                        continue;
                    } else if (apartments[i].status != 1) {
                        apartments.splice(i, 1);
                        continue;
                    }
                     checkSame[apartments[i].id] = true;

                }

                res.json({
                    result: true,
                    data: apartments
                });
                return;
            });

        }

    });

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

        for (var key in reqData) {
            apartment[key] = reqData[key];
        }

        var rooms = [];

        for (var i = 0; i < req.body.rooms.length; i++) {

            var room = {
                schoolId: req.body.schoolId,
                type: req.body.rooms[i].type,
                apartmentType: req.body.type,
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

        if (tools.hasNull(reqData)) {

            res.json(Results.ERR_PARAM_ERR);
            return;
        }

        apartment.save(function(err, apartment) {

            if (err) {
                console.log(err);
                return next();
            } else {

                var ep = new EventProxy();
                for (var i = 0; i < reqData.rooms.length; i++) {

                    var room = new Room();

                    for (var key in reqData.rooms[i]) {
                        room[key] = reqData.rooms[i][key];
                    }

                    room.apartmentId = apartment.id;

                    room.save(function(err, room) {

                        if (err) {
                            console.log(err);
                            return next();
                        } else {
                            ep.emit("insertRoom", room);
                        }

                    });

                }

                ep.after("insertRoom", reqData.rooms.length, function(roomList) {

                    for (var i = 0; i < roomList.length; i++) {
                        apartment.rooms.push(roomList[i].id);
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

    for (var key in reqData) {
        apartment[key] = reqData[key];
    }

    var rooms = [];

    for (var i = 0; i < req.body.rooms.length; i++) {

        var room = {
            schoolId: req.body.schoolId,
            type: req.body.rooms[i].type,
            apartmentType: req.body.type,
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


    var ep = new EventProxy();


    var newRoomLength = rooms.length;
    var oldRoomLength = 0;

    Apartment.findById(apartmentId, function(err, apartment) {
        if (err) {
            console.log(err);
            res.json(Results.ERR_DB_ERR);
            return;
        } else if (!apartment) {
            res.json(Results.ERR_NOTFOUND_ERR);
            return;
        } else {
            oldRoomLength = apartment.rooms.length;
            ep.emit('findApartment', apartment);
        }

    });


    ep.after("findApartment", 1, function(apartment) {

        for (var i = 0; i < oldRoomLength; i++) {

            Room.findById(apartment[0].rooms[i], function(err, room) {
                if (err) {
                    console.log(err);
                    res.json(Results.ERR_DB_ERR);
                    return;
                } else if (!room) {
                    res.json(Results.ERR_NOTFOUND_ERR);
                    return;
                } else {
                    ep.emit('findOldRoom', room);
                }
            });
        }

        for (var i = 0; i < newRoomLength; i++) {
            var room = new Room();

            for (var key in rooms[i]) {
                room[key] = rooms[i][key];
            }
            room.apartmentId = apartment[0].id;

            room.save(function(err, room) {
                if (err) {
                    console.log(err);
                    return next();
                } else {
                    ep.emit("insertNewRoom", room);
                }

            });
        }

        ep.after("findOldRoom", oldRoomLength, function(oldRoomList) {
            ep.emit("findOldRoomsDone", oldRoomList);
        });

        ep.after("insertNewRoom", newRoomLength, function(newRoomList) {
            ep.emit("insertNewRoomsDone", newRoomList);
        });

    });



    ep.all("findApartment", "findOldRoomsDone", "insertNewRoomsDone", function(apartment, oldRoomList, newRoomList) {

        for (var i = 0; i < newRoomLength; i++) {
            apartment.rooms.push(newRoomList[i].id);
        }

        apartment.update_at = new Date();
        for (var key in reqData) {
            apartment[key] = reqData[key];
        }

        apartment.save(function(err, apartment) {
            if (err) {
                console.log(err);
                return next();
            } else {
                ep.emit("saveNewRoomToApartment");
            }
        });

        for (var i = 0; i < oldRoomLength; i++) {
            oldRoomList[i].status = -1;
            oldRoomList[i].save(function(err, oldRoom) {
                if (err) {
                    console.log(err);
                    return next();
                } else {
                    ep.emit("setStatus");
                }
            });
        }

        ep.after("setStatus", oldRoomLength, function() {
            ep.emit("oldRoomStatusDone");
        });
    });


    ep.all("oldRoomStatusDone", "saveNewRoomToApartment", function() {

        res.json({
            result: true,
            data: {}
        });

    });

    ep.fail(function(err) {
        res.json({
            result: false,
            err: err
        });
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